import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { withToastManager } from "react-toast-notifications";
import GenericDropDown from "../Components/GenericDropDown";
import GenericSelect from "../Components/GenericSelect";
import { withMenuBar } from "../Hocs/withMenuBar";
import { setProcessoTarefaRef } from "../Reducers/globalConfigReducer";
import { setTarefasFilterType, UpdateTarefasChoosed, UpdateTarefasFiltered } from "../Reducers/ompReducer";


const TableHead = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Nome</th>
                <th>Instrução</th>
                <th>Data Planejada</th>
                <th>Data Realizada</th>
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
    const toBuilTarefasList = props.filteredTarefas.length == 0 ? props.tarefas : props.filteredTarefas

    const trocaTd = toBuilTarefasList.map((tarefa, index) => {

        const check = props.tarefasChoosed.find(tarefaChoosed => tarefa.id === tarefaChoosed.id)
        let dataPlanejada = String(tarefa.dataPlanejada).substr(0, 10)
        let dataRealizada = String(tarefa.dataRealizada).substr(0, 10)

        return (
            <tr style={{ textAlign: "center" }} key={tarefa.id}>
                <td className="align-middle">{tarefa.id}</td>
                <td className="align-middle">{tarefa.nome}</td>
                <td className="align-middle">{tarefa.codigo}</td>
                <td className="align-middle">{`${FormatDate(dataPlanejada)}`}</td>
                <td className="align-middle">{`${FormatDate(dataRealizada)}`}</td>
                <td className="align-middle">
                    <Form.Label style={{ color: tarefa.pendente ? 'red' : 'green', fontWeight: 'bolder' }} >{tarefa.pendente ? "Pendente" : 'Em dia'}</Form.Label>
                </td>
                <td className="align-middle" >

                    <Form.Check.Input checked={check} onChange={(event) => props.setTarefaToList(event.target.checked, tarefa)} type="checkbox" />
                    <Form.Check.Label>Executar ?</Form.Check.Label>



                </td>
            </tr>
        )
    })

    return trocaTd

}



const TarefasDeManutencao = (props) => {

    const dispatch = useDispatch()
    const tarefasChoosed = useSelector(state => state.cadastroOmpReducer.tarefas)
    const processoIdTarefaRef = useSelector(state => state.global.processoIdTarefaRef)
    const tarefas = useSelector(state => state.options.tarefasDeManutencao)
    const processos = useSelector(state => state.options.processos)
    const filteredTarefas = useSelector(state => state.cadastroOmpReducer.tarefasFiltered)
    const filterType = useSelector(state => state.cadastroOmpReducer.tarefasFilterType)
    const history = useHistory()





    const addTarefa = (checked, tarefa) => {

        if (checked) {
            dispatch(UpdateTarefasChoosed([...tarefasChoosed, tarefa]))
        } else {

            const newTarefasChoosed = tarefasChoosed.filter((tarefasChoos) => {
                return Number(tarefasChoos.id) !== Number(tarefa.id)
            })

            dispatch(UpdateTarefasChoosed(newTarefasChoosed))
        }

    }

    useEffect(() => {
        const tarefasFiltered = tarefas.filter(tarefa => {
            return Number(tarefa.processoId) === Number(processoIdTarefaRef)
        })
        dispatch(UpdateTarefasFiltered(tarefasFiltered))
    }, [processoIdTarefaRef])




    const markAll = () => {
        dispatch(UpdateTarefasChoosed(filteredTarefas))

    }

    const unmarkAll = () => {
        dispatch(UpdateTarefasChoosed([]))
    }

    const filterByGlobalProcesso = () => {
        let filteredTrocas = tarefas.filter(tarefa => Number(tarefa.processoId) === Number(processoIdTarefaRef))
        dispatch(UpdateTarefasFiltered(filteredTrocas))
        return filteredTrocas
    }



    const filterAction = (filterText) => {
        let toFilterTarefas = processoIdTarefaRef ? filterByGlobalProcesso() : tarefas
        if (filterText !== "" && filterType !== "") {

            dispatch(UpdateTarefasFiltered(toFilterTarefas.filter((tarefa) => {
                if (filterType === "Nome") {
                    return String(tarefa.nome).includes(filterText)
                }
                if (filterType === "Status") {
                    if (String("Pendente").toLowerCase().trim().startsWith(filterText.toLowerCase().trim())) {
                        let returnType = tarefa.pendente === true
                        return returnType
                    }

                    if (String("Em dia").toLowerCase().trim().startsWith(filterText.toLowerCase().trim())) {
                        let returnType =  tarefa.pendente === false
                        return returnType
                    }
                }
                if (filterType === "Data") {
                    return String(tarefa.dataPlanejada).includes(filterText)
                }
                return true

            })))

        } else {

            dispatch(UpdateTarefasFiltered([]))


        }

    }




    return (
        <>

            <Container>
                <Form.Row style={{ padding: 10 }}>
                    <Col >
                        <GenericSelect selection={processoIdTarefaRef} noLabel={true} title={"Processo"} returnType={"id"} default={"Escolha um Processo"} onChange={(processoId) => dispatch(setProcessoTarefaRef(processoId))} ops={processos}  ></GenericSelect>
                    </Col>
                    <Col>

                        <Form.Control placeholder="buscar por nome..." onChange={(event) => filterAction(event.target.value)}></Form.Control>
                    </Col>

                    <Col md="auto" >
                        <GenericDropDown display={"Tipo"} itens={["Nome", "Status", "Data"]} onChoose={(item) => dispatch(setTarefasFilterType(item))} style={{ margin: 10 }}>Filtrar </GenericDropDown>
                    </Col>
                    <Col>
                        <Button onClick={() => {
                            history.push("CadastroOmp")
                        }} >Gerar OMP</Button>
                    </Col>
                    <Col md="auto">
                        <Button onClick={() => markAll()}>Selecionar Todos</Button>
                        <Button style={{marginLeft : 12}} onClick={() => unmarkAll()}>Desmarcar Todos</Button>
                    </Col>
                    <Col md="auto">
                        <Button onClick={() => history.push("/OrdensDeManutencao")}>Ver Ordens</Button>
                    </Col>
                </Form.Row>

            </Container>
            <div className="table-responsive">
                <Table className="table table-hover">
                    <TableHead></TableHead>
                    <tbody>
                        <TableBody tarefas={tarefas} tarefasChoosed={tarefasChoosed} setTarefaToList={addTarefa} filteredTarefas={filteredTarefas} processoIdTarefaRef={processoIdTarefaRef}  ></TableBody>
                    </tbody>


                </Table>
            </div>


        </>

    )
}



export default withToastManager(withMenuBar(TarefasDeManutencao))
