import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { withToastManager } from "react-toast-notifications";
import { useToasts } from "react-toast-notifications/dist/ToastProvider";
import GenericDropDown from "../Components/GenericDropDown";
import GenericSelect from "../Components/GenericSelect";
import { withMenuBar } from "../Hocs/withMenuBar";
import { setBuildingOmp, setProcessoId, setTrocasFilterType, UpdateTarefasFiltered, UpdateTrocasChoosed, UpdateTrocasFiltered } from "../Reducers/ompReducer";


const TableHead = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Processo</th>
                <th>Etapa</th>
                <th><div>Data Realizada</div><div>Area Realizada</div></th>
                <th><div>Data Planejada</div><div>Area Planejada</div></th>
                <th>Frenquencia</th>
                <th>Produtos</th>
                <th>Status</th>
                <th>Selecionar</th>
            </tr>
        </thead>

    )
}

const FormatDate = (data) => {
    const dataTokens = String(data).split("-");
    return dataTokens[2] + "-" + dataTokens[1] + "-" + dataTokens[0]

}

const TableBody = props => {

    const trocasToBuilder = props.trocasFiltered.length == 0 ? props.trocas : props.trocasFiltered
    const trocaTd = trocasToBuilder.map((troca, index) => {
        let check = props.trocasChoosed.find(trocaChoosed => trocaChoosed.id === troca.id)
        let dataPlanejada = String(troca.dataPlanejada).substr(0, 10)
        let dataRealizada = String(troca.ultimaTroca).substr(0, 10)

        return (

            <tr style={{ textAlign: "center" }} key={troca.id}>
                <td className="align-middle">{troca.id}</td>
                <td className="align-middle">{troca.processoNome}</td>
                <td className="align-middle">{troca.etapaNome}</td>
                <td className="align-middle"><div>{`${FormatDate(dataRealizada)}`}</div><div>{troca.areaRealizada}</div></td>
                <td className="align-middle"><div>{`${FormatDate(dataPlanejada)}`}</div><div>{troca.areaPlanejada}</div></td>
                <td className="align-middle"><div>{`A cada ${troca.frequencia} ${troca.frequencia > 1 ? troca.escalaFrequencia + "s" : troca.escalaFrequencia} `}</div></td>
                <td className="align-middle" key={troca.id} >
                    {troca.listaMontagens.map((pair, index) => {
                        return <div key={index}>{`${pair[0]} : ${pair[1]} ${pair[2]}`} </div>
                    })}
                </td>
                <td className="align-middle">
                    <Form.Label style={{ color: troca.pendente ? 'red' : 'green', fontWeight: 'bolder' }} >{troca.pendente ? "Pendente" : 'Em dia'}</Form.Label>
                </td>
                <td className="align-middle" >
                    <Form.Check checked={check || false} onChange={(event) => props.setTrocaToList(event.target.checked, troca)} type="checkbox" />
                    <Form.Label>Trocar ?</Form.Label>
                </td>
            </tr>
        )
    })

    return <tbody>{trocaTd}</tbody>

}



const Trocas = () => {

    const [markAllHide, setMarkAllHide] = useState()
    const dispatch = useDispatch()
    const buildingOmp = useSelector(state => state.omp.buildingOmp)
    const processoId = useSelector(state => state.omp.processoId)
    const trocasChoosed = useSelector(state => state.omp.trocas)
    const trocasFiltered = useSelector(state => state.omp.trocasFiltered)
    const filterType = useSelector(state => state.omp.trocasFilterType)
    const processos = useSelector(state => state.options.processos)
    const trocas = useSelector(state => state.options.trocas)
    const toastManager = useToasts()
    const history = useHistory()



    useEffect(() => {
        const trocasFiltered = trocas.filter(troca => {
            return Number(troca.processoId) === Number(processoId)
        })
        dispatch(UpdateTrocasFiltered(trocasFiltered))

    }, [processoId, trocas])



    const addTrocaIdToChoosedIdList = (checked, clickedTroca) => {

        if (!clickedTroca.programada) {
            if (checked) {
                dispatch(UpdateTrocasChoosed([...trocasChoosed, clickedTroca]))

            } else {

                const removedArray = trocasChoosed.filter((value) => {
                    return Number(value.id) !== Number(clickedTroca.id)
                })
                dispatch(UpdateTrocasChoosed([...removedArray]))
            }
        } else {
            toastManager.addToast("Esta troca ja foi programada", {
                appearance: 'warning', autoDismiss: true
            })
        }



    }

    const startEditing = () => {
        if (validateTrocasByProcesso(trocasChoosed)) {
            dispatch(setBuildingOmp(true))
            history.push("/CadastroOmp")
        } else {
            toastManager.addToast("Voce não pode gerar uma OMP de diferentes processos", {
                appearance: 'error', autoDismiss: true
            })
        }
    }

    const validateTrocasByProcesso = (trocasChoosedArray) => {
        let isEquals = true;
        let beforeId = 0;

        trocasChoosedArray.forEach(element => {
            if (beforeId === 0) {
                beforeId = Number(element.processoId)
            } else {
                Number(element.processoId) === beforeId ? isEquals = true : isEquals = false
            }
        });
        if (isEquals) {
            return true;
        } else {
            return false;
        }
    }




    const markAll = () => {
        dispatch(UpdateTrocasChoosed(trocasFiltered))

    }

    const unmarkAll = () => {
        dispatch(UpdateTrocasChoosed([]))
    }

    const filterAction = (filterText) => {
        let tofilterTrocas = processoId ? filterByGlobalProcesso(processoId) : trocas
        if (filterText !== "") {
            dispatch(UpdateTrocasFiltered(
                tofilterTrocas.filter((troca) => {
                    if (filterType === "Etapa") {
                        return String(troca.etapaNome).toLowerCase().includes(filterText.toLowerCase())
                    }
                    if (filterType === "Status") {
                        if (String("Pendente").toLowerCase().trim().startsWith(filterText.toLowerCase().trim())) {
                            return troca.pendente === true
                        }
                        if (String("Em dia").toLowerCase().trim().startsWith(filterText.toLowerCase().trim())) {
                            return troca.pendente === false
                        }


                    }

                    return ""

                })
            ))



        } else {
            processoId ? filterByGlobalProcesso(processoId) : dispatch(UpdateTrocasFiltered(trocas))

        }

    }


    const filterByGlobalProcesso = (processoId) => {
        let filteredTrocas = trocas.filter(troca => Number(troca.processoId) === Number(processoId))
        dispatch(UpdateTrocasFiltered(filteredTrocas))

        return filteredTrocas
    }

    return (
        <>


            <Row className="align-items-center">

                <Col md="auto">
                    <Button disabled={trocasChoosed.length !== 0 ? false : true} style={{ margin: 10 , backgroundColor : buildingOmp && "ORANGE" , borderColor :  buildingOmp && "ORANGE" }} onClick={() => {
                        startEditing()
                    }}>{buildingOmp ? "Editar OMP" : "Gerar OMP"}</Button>
                </Col>

                <Col hidden={buildingOmp} style={{ paddingTop: 20 }} md="auto">
                    <GenericSelect noLabel={true} default={"--Selecione um Processo--"}  selection={processoId} onChange={(processoId) => dispatch(setProcessoId(processoId.id))} title={"Processo"} displayType={"nome"} ></GenericSelect>
                </Col>

                <Col md="auto">
                    <Button style={{ margin: 10 }} onClick={() => { markAll(); setMarkAllHide(true) }}>Selecionar Todos</Button>
                    <Button style={{ marginLeft: 12 }} onClick={() => { unmarkAll(); setMarkAllHide(false) }}>Desmarcar Todos</Button>
                </Col>

                <Col>
                    <Form.Control placeholder="filtrar por..." style={{ margin: 10 }} onChange={(event) => filterAction(event.target.value)}></Form.Control>
                </Col>
                <Col md="auto">
                    <GenericDropDown display={"Tipo"} margin={10} itens={["Etapa", "Status"]} onChoose={(item) => dispatch(setTrocasFilterType(item))} style={{ margin: 10 }}>Filtrar </GenericDropDown>
                </Col>
                <Col md="auto">
                    <Button style={{ margin: 10 }} onClick={() => history.push("/OrdensDeManutencao")}>Ver Ordens</Button>
                </Col>
            </Row>
            <div className="table-responsive">
                <Table className="table table-hover" >
                    <TableHead></TableHead>
                    <TableBody setTrocaToList={addTrocaIdToChoosedIdList} trocas={trocas} trocasChoosed={trocasChoosed} trocasFiltered={trocasFiltered}></TableBody>
                </Table>
            </div>




        </>

    )

}

export default withToastManager(withMenuBar(Trocas))
