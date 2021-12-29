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
import { updateOrdem } from "../Reducers/ordensDeManutencaoReducer";
import { responseHandler } from "../Services/responseHandler";
import { toastWarn } from "../Services/toastType";
import { WebSocketContext } from "../websocket/wsProvider";


const TableHead = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Download</th>
                <th>Processo</th>
                <th>Data Planejada</th>
                <th>Data Realizada</th>
                <th>Emitido por</th>
                <th>Status</th>
                <th>Encerrar</th>
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

    const ompTd = props.omps.map((omp, index) => {

        let dataPlanejada = String(omp.dataPlanejada).substr(0, 10)
        let dataRealizada = String(omp.dataRealizada).substr(0, 10)
        let statusToken = omp.status.split(":")
        return (

            <tr style={{ textAlign: "center" }} key={omp.id}>
                <td className="align-middle">{omp.id}</td>
                <td className="align-middle"><Button size={20} onClick={() => downloadOmp(omp)}>Download</Button></td>
                <td className="align-middle" >{omp.nomeProcesso}</td>

                <td className="align-middle">{`${FormatDate(dataPlanejada)}`}</td>
                <td className="align-middle">{`${FormatDate(dataRealizada)}`}</td>
             
                <td className="align-middle">{omp.emitidoPor}</td>
                <td className="align-middle">
                    <Form.Label style={{ color: statusToken[1], fontWeight: 'bolder' }} >{statusToken[0]}</Form.Label>
                </td>
                <td className="align-middle" >
                    {buttonLayout(props, omp, statusToken)}
                </td>
            </tr>
        )
    })

    return ompTd

}



const OrdensDeManutencao = (props)  =>  {

    const {ordens,toEditDeleteOrdem,toViewOrdem} = useSelector(state => state.ordensDeManutencao)
    const [filteredOmps,setFiltered] = useState([])
    const [ompToDelete,setOmpToDelete] = useState([])
    const [showDeleteConfirm, setSowDeleteConfirm] = useState(false)
    const [selection,setSelection] = useState('')
    const [filterType, setFilterType] = useState('')
    const context = useContext(WebSocketContext)
    const dispatch = useDispatch()
    const history = useHistory()



    const encerrarOmp = (ompId) => {
        const omp = ordens.filter(ordem => {
            return ordem.id === ompId
        })
        history.push("/FinalizarOmp", omp[0])

    }

    const verOmp = (ompId) => {
        const omp = ordens.filter(ordem => {
            return ordem.id === ompId
        })
        history.push("/VerOmp", omp[0])
    }

    useEffect(() => {
        setFiltered(ordens.filter(omp => Number(omp.processoId) === Number(props.global.processoIdTarefaRef)))
    },ordens)


    const confirmDeleteDiolog = (ompId) => {
        const omp = ordens.filter(ordem => {
            return ordem.id === ompId
        })
        setOmpToDelete(omp[0])
        setSowDeleteConfirm(true)
    }

    const deletarOmp = () => {
        ScqApi.DeleteOmp(ompToDelete.id).then(res => responseHandler(res, props,"OrdemDeManutencao",toastWarn,context,[props.loadOrdensDeManutencao]))
    }


    const filterAction = (filterText) => {
        if (filterText !== "") {
            setFiltered(ordens.filter((omp) => {
                if (filterType === "Data") {
                    let data = FormatDate(String(omp.dataPlanejada).substr(0, 10))
                    return data.startsWith(filterText)
                }
                if (filterType === "Status") {
                    return String(omp.status).toLowerCase().includes(filterText.toLowerCase())
                }
                return ""
            }).filter(omp => Number(omp.processoId === Number(props.global.processoIdTarefaRef))))
            setSelection(filterText)
        } else {
            setFiltered(ordens.filter(omp => Number(omp.processoId === Number(props.global.processoIdTarefaRef))))
        }

    }

    const filterByGlobalProcesso = (processoId) => {
        props.setProcessoIdTarefaRef(processoId)
        let newFilteredOmps = ordens.filter(omp => Number(omp.processoId === Number(processoId)))
        setFiltered(newFilteredOmps)

    }


        return (
            <>

                <Container >
                    <DeleteOmpConfirm show={showDeleteConfirm} deletarOmp={deletarOmp} omp={ompToDelete} handleClose={() => setSowDeleteConfirm(false)}></DeleteOmpConfirm>
                    <Row className="justify-content-md-center">
                        <Col style={{paddingTop : 10}} >
                            <GenericSelect selection={props.global.processoIdTarefaRef} noLabel={true} title={"Processo"} returnType={"id"} default={"Escolha um Processo"} onChange={(processoId) => filterByGlobalProcesso(processoId) } ops={props.processos}  ></GenericSelect>
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
                        <tbody>
                            <TableBody filterType={filterType} selection={selection} omps={filteredOmps} encerrarOmp={encerrarOmp} verOmp={verOmp} confirmDeleteDiolog={confirmDeleteDiolog}  ></TableBody>
                        </tbody>


                    </Table>
                </div>


            </>

        )

}

export default withToastManager(withMenuBar(connect(mapStateToProps.toProps, dispatchers)(OrdensDeManutencao)))
