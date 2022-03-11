import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import ScqApi from '../Http/ScqApi'
import { useHistory } from "react-router"
import { withMenuBar } from '../Hocs/withMenuBar'
import { responseHandler } from '../Services/responseHandler'
import { useToasts, withToastManager } from 'react-toast-notifications/dist/ToastProvider'
import { toastOk } from '../Services/toastType'
import { WebSocketContext } from '../websocket/wsProvider'
import { connect, useDispatch, useSelector } from 'react-redux'
import mapToStateProps from '../mapStateProps/mapStateToProps'
import dispatchers from '../mapDispatch/mapDispathToProps'
import { UpdateTarefasChoosed } from '../Reducers/ompReducer'





const TableHeadTarefas = (props) => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Nome</th>
                <th>Código Instrução</th>
                <th>Data Planejada</th>
                <th>Status</th>
                <th>Ação</th>
            </tr>
        </thead>

    )
}

const FormatDate = (data) => {
    const dataTokens = String(data).split("-");
    return dataTokens[2] + "-" + dataTokens[1] + "-" + dataTokens[0]

}

const TableBodyTarefas = props => {

    const dispatch = useDispatch()
    const tarefasChoosed = useSelector(state => state.cadastroOmpReducer.tarefas)

    const choosedTarefaClick = (tarefa) => {
        const tarefasUpdadated = tarefasChoosed.filter(terefaChoosed => {
            return terefaChoosed.id !== tarefa.id
        })

        dispatch(UpdateTarefasChoosed(tarefasUpdadated))


    }

    const tarefaTd = props.tarefasChecked?.map((tarefa, index) => {
        let data = String(tarefa.dataPlanejada).substr(0, 10)

        return (
            <tr style={{ textAlign: "center" }} key={tarefa.id}>
                <td className="align-middle">{tarefa.id}</td>
                <td className="align-middle">{tarefa.nome}</td>
                <td className="align-middle">{tarefa.codigo}</td>
                <td className="align-middle">{`${FormatDate(data)}`}</td>
                <td className="align-middle"><Form.Label style={{ color: tarefa.pendente ? 'red' : 'green', fontWeight: 'bolder' }} >
                    {tarefa.pendente ? "Pendente" : 'Em dia'}</Form.Label></td>
                {<td className="align-middle" >
                    <Button onClick={(event) => choosedTarefaClick(tarefa)} type="checkbox" >
                        Remover
                    </Button>

                </td>}
            </tr>
        )

    })

    return tarefaTd

}


const TableHead = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Etapa</th>
                <th>Tanque</th>
                <th>Produto</th>
                <th>Quantidade</th>
            </tr>
        </thead>

    )
}

const TableBody = props => {
    const trocaTd = props.trocas?.map((troca, index) => {
        return (

            <tr style={{ textAlign: "center" }} key={troca.id}>
                <td className="align-middle">{troca.etapaNome}</td>
                <td className="align-middle">{troca.posicao}</td>
                <td key={troca.id}  >
                    {troca.listaMontagens.map((pair, index) => {
                        return <div key={index}>{`${pair[0]}`} </div>
                    })}
                </td>
                <td key={index} >
                    {troca.listaMontagens.map((pair, index) => {
                        return <div key={index}>{`${pair[1]} ${pair[2]}`} </div>
                    })}
                </td>
            </tr>
        )
    })

    return trocaTd

}



const CadastroOmp = (props) => {

    const [dataPlanejada, setDataPlanejada] = useState(new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0])
    const location = useLocation()
    const [emitidoPor, setEmitidoPor] = useState()
    const tarefasChoosed = useSelector(state => state.cadastroOmpReducer.tarefas)
    const trocasChoosed = useSelector(state => state.cadastroOmpReducer.trocas)
    const tarefas = useSelector(state => state.options.trocas)
    const trocas = useSelector(state => state.options.trocas)
    const [tarefasChoosedId, setTarefasChoosedId] = useState([])
    const history = useHistory()
    const context = useContext(WebSocketContext)
    const toastManager = useToasts()



    useEffect(() => generateTarefasChoosedIdarray(), [])

    const generateTarefasChoosedIdarray = () => {
        let markedTarefas = tarefas.map((value) => {
            return value.id
        })
        setTarefasChoosedId(markedTarefas)
    }

    const setTarefaToList = (checked, id) => {

        if (checked) {

            setTarefasChoosedId(tarefasChoosedId.concat(id))

        } else {

            const removedArray = tarefasChoosedId.filter((value) => {
                return Number(value) !== Number(id)
            })
            setTarefasChoosedId(removedArray)
        }

    }



    return (
        <>
            <Container style={{ marginTop: 20 }}>

                <Row>
                    {trocas.length !== 0 ? <h2>{`Ordem de Manutençao de Processo - ${trocas[0]?.processoNome}`}</h2> :
                        <h2>Ordem de Manutençao de Processo</h2>}

                </Row>
                <Form.Row style={{ marginTop: 10 }}>
                    <Col>
                        <Form.Group>
                            <Form.Label>Emitido por: </Form.Label>
                            <Form.Control onChange={(event) => setEmitidoPor(event.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Programado para: </Form.Label>
                            <Form.Control
                                type="datetime-local"
                                defaultValue={dataPlanejada}
                                onChange={event => { setDataPlanejada(event.target.value) }}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Form.Row>
                {trocasChoosed.length !== 0 &&
                    <>
                        <h4>Trocas Selecionadas</h4>
                        <Table className="table table-hover">
                            <TableHead></TableHead>
                            <tbody>
                                <TableBody trocas={trocasChoosed} ></TableBody>
                            </tbody>
                        </Table> </>}

                {tarefas &&
                    <Fragment>
                        <Row className="d-flex align-items-center">
                        <h4>Tarefas de Manutencao</h4>
                        <Button style={{margin : 12}} onClick={(event) => history.push("/TarefasDeManutencao")} type="checkbox" >
                            Adicionar Tarefas
                        </Button>
                        </Row>
                       
                        <Table>
                            <TableHeadTarefas tarefasChecked={tarefasChoosed} ></TableHeadTarefas>
                            <tbody>
                                <TableBodyTarefas tarefasChecked={tarefasChoosed} tarefas={tarefas}></TableBodyTarefas>
                            </tbody>

                        </Table>
                    </Fragment>
                }

                <Button style={{ marginLeft: 20 }} onClick={
                    () => {
                        const trocasId = trocasChoosed.map((troca, index) => {
                            return troca.id
                        })

                        const tarefasId = tarefasChoosed.map((tarefa, index) => {
                            return tarefa.id
                        })

                        if (trocasChoosed.length === 0) {
                            const omp = { processoId: tarefasChoosed[0].processoId, programadoPara: dataPlanejada, emitidoPor: emitidoPor, trocasId, tarefasId: tarefasId }
                            ScqApi.GerarOmp(omp,[props.loadOrdensDeManutencao]).then(res => responseHandler(res, toastManager, "OrdemDeManutencao", toastOk))
                        } else {
                            const omp = { processoId: trocasChoosed[0]?.processoId, programadoPara: dataPlanejada, emitidoPor: emitidoPor, trocasId, tarefasId: tarefasId }
                            ScqApi.GerarOmp(omp,[props.loadOrdensDeManutencao]).then(res => responseHandler(res, toastManager, "OrdemDeManutencao", toastOk))
                        }

                        history.push("OrdensDeManutencao")
                    }
                }>Gerar Documento</Button>

            </Container>




        </>
    )


}

export default withMenuBar(withToastManager(connect(mapToStateProps.toProps, dispatchers)(CadastroOmp)))