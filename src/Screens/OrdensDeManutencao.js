import React, { useContext, useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Col, Row, Form } from "react-bootstrap";
import ScqApi from "../Http/ScqApi";
import { withToastManager } from "react-toast-notifications";
import DeleteOmpConfirm from "../Components/DeleteOMPConfirm"
import { withMenuBar } from "../Hocs/withMenuBar";
import { downloadOmp } from "../Services/documentsDownload";
import GenericDropDown from "../Components/GenericDropDown";
import GenericSelect from "../Components/GenericSelect";
import { isMobile } from "react-device-detect";
import { connect, useDispatch, useSelector } from "react-redux";
import mapStateToProps from "../mapStateProps/mapStateToProps"
import dispatchers from "../mapDispatch/mapDispathToProps";
import { useHistory } from "react-router";
import { responseHandler } from "../Services/responseHandler";
import { toastWarn } from "../Services/toastType";
import { WebSocketContext } from "../websocket/wsProvider";
import { setOmpToView, setProcessoId, UpdateFilteredOmps } from "../Reducers/ompReducer";
import useIsAdmin from "../hooks/useIsAdmin";


const TableHead = () => {

    const isAdmin = useIsAdmin()
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Download</th>
                <th>Processo</th>
                <th>Data Realizada</th>
                <th>Data Planejada</th>
                <th>Emitido por</th>
                <th>Status</th>
                {isAdmin && <th>Encerrar</th>}
            </tr>
        </thead>

    )
}

const FormatDate = (data) => {
    const dataTokens = String(data).split("-");
    return dataTokens[2] + "-" + dataTokens[1] + "-" + dataTokens[0]

}

const buttonLayout = (props, omp, statusToken) => {

    if (isMobile) {
        return (
            <>
                <Col>
                    <Button style={{ backgroundColor: "RED", borderColor: "RED", width: "100%" }} onClick={() => props.confirmDeleteDiolog(omp.id)}>Deletar Omp</Button>
                </Col>
                <Col>
                    {statusToken[0] === "concluido"
                        ? <Button style={{ width: "100%" }} onClick={() => {
                            props.verOmp(omp.id)
                        }}>Ver OMP</Button>
                        : <Button style={{ width: "100%" }} onClick={() => {
                            props.encerrarOmp(omp.id)
                        }}>Encerrar OMP</Button>}
                </Col>
            </>
        )
    } else {
        return (
            <Row>
                <Col>
                    <Button style={{ backgroundColor: "RED", borderColor: "RED", width: "100%" }} onClick={() => props.confirmDeleteDiolog(omp.id)}>Deletar Omp</Button>
                </Col>
                <Col>
                    {statusToken[0] === "concluido"
                        ? <Button style={{ width: "100%" }} onClick={() => {
                            props.verOmp(omp.id)
                        }}>Ver OMP</Button>
                        : <Button style={{ width: "100%" }} onClick={() => {
                            props.encerrarOmp(omp.id)
                        }}>Encerrar OMP</Button>}
                </Col>
            </Row>

        )
    }



}



const TableBody = props => {


    const isAdmin = useIsAdmin()

    const ompTd = props.omps.map((omp, index) => {

        let dataPlanejada = String(omp.dataPlanejada).substr(0, 10)
        let dataRealizada = String(omp.dataRealizada).substr(0, 10)
        let statusToken = omp.status.split(":")
        return (

            <tr style={{ textAlign: "center" }} key={omp.id}>
                <td className="align-middle">{omp.id}</td>
                <td className="align-middle"><Button size={20} onClick={() => downloadOmp(omp)}>Download</Button></td>
                <td className="align-middle" >{omp.nomeProcesso}</td>

                <td className="align-middle">{`${FormatDate(dataRealizada)}`}</td>
                <td className="align-middle">{`${FormatDate(dataPlanejada)}`}</td>

                <td className="align-middle">{omp.emitidoPor}</td>
                <td className="align-middle">
                    <Form.Label style={{ color: statusToken[1], fontWeight: 'bolder' }} >{statusToken[0]}</Form.Label>
                </td>
                {isAdmin && <td className="align-middle" >
                    {buttonLayout(props, omp, statusToken)}
                </td>}
            </tr>
        )
    })

    return <tbody>{ompTd}</tbody>

}



const OrdensDeManutencao = (props) => {

    const ordens = useSelector(state => state.options.omps)
    const processoId = useSelector(state => state.omp.processoId)
    const ompsFiltered = useSelector(state => state.omp.ompsFiltered)
    const [ompToDelete, setOmpToDelete] = useState([])
    const [showDeleteConfirm, setSowDeleteConfirm] = useState(false)
    const [selection, setSelection] = useState('')
    const [filterType, setFilterType] = useState('')
    const context = useContext(WebSocketContext)
    const dispatch = useDispatch()
    const history = useHistory()


    useEffect(() => {
        if(processoId) {
            dispatch(UpdateFilteredOmps(ordens.filter(omp => Number(omp.processoId === Number(processoId)))))
        } else {
            dispatch(UpdateFilteredOmps(ordens))
        }


    },[processoId,ordens])


    const encerrarOmp = (ompId) => {
        const omp = ordens.filter(ordem => {
            return ordem.id === ompId
        })[0]
        dispatch(setOmpToView(omp.id))
        history.push("/FinalizarOmp")

    }

    const verOmp = (ompId) => {
        const omp = ordens.filter(ordem => {
            return ordem.id === ompId
        })[0]
        dispatch(setOmpToView(omp.id))
        history.push("/VerOmp")
    }


    const confirmDeleteDiolog = (ompId) => {
        const omp = ordens.filter(ordem => {
            return ordem.id === ompId
        })
        setOmpToDelete(omp[0])
        setSowDeleteConfirm(true)
    }

    const deletarOmp = () => {
        ScqApi.DeleteOmp(ompToDelete.id).then(res => responseHandler(res, props, "OrdemDeManutencao", toastWarn, context, [props.loadOrdensDeManutencao]))
    }


    const filterAction = (filterText) => {
        if (filterText !== "") {
            dispatch(UpdateFilteredOmps(ordens.filter((omp) => {
                if (filterType === "Data") {
                    let data = FormatDate(String(omp.dataPlanejada).substr(0, 10))
                    return data.startsWith(filterText)
                }
                if (filterType === "Status") {
                    return String(omp.status).toLowerCase().includes(filterText.toLowerCase())
                }
                return ""
            }).filter(omp => Number(omp.processoId === Number(processoId)))))
            setSelection(filterText)
        } else {
            dispatch(UpdateFilteredOmps(ordens.filter(omp => Number(omp.processoId === Number(processoId)))))
        }

    }




    return (
        <>

            <Container >
                <DeleteOmpConfirm show={showDeleteConfirm} deletarOmp={deletarOmp} omp={ompToDelete} handleClose={() => setSowDeleteConfirm(false)}></DeleteOmpConfirm>
                <Row className="justify-content-md-center">
                    <Col style={{ paddingTop: 10 }} >
                        <GenericSelect selection={processoId} noLabel={true} title={"Processo"} returnType={"id"} default={"Escolha um Processo"} onChange={(processoId) => dispatch(setProcessoId(processoId))} ops={props.processos}  ></GenericSelect>
                    </Col>
                    <Col>
                        <Form.Control placeholder="filtrar por..." style={{ margin: 10 }} onChange={(event) => filterAction(event.target.value)}></Form.Control>
                    </Col>
                    <Col md="auto">
                        <GenericDropDown display={"Tipo"} margin={10} itens={["Data", "Status"]} onChoose={(item) => setFilterType(item)} style={{ margin: 10 }}>Filtrar </GenericDropDown>
                    </Col>

                </Row>
            </Container>
            <div className="table-responsive">
                <Table >
                    <TableHead></TableHead>
                    <TableBody filterType={filterType} selection={selection} omps={ompsFiltered} encerrarOmp={encerrarOmp} verOmp={verOmp} confirmDeleteDiolog={confirmDeleteDiolog}  ></TableBody>
                </Table>
            </div>


        </>

    )

}

export default withToastManager(withMenuBar(connect(mapStateToProps.toProps, dispatchers)(OrdensDeManutencao)))
