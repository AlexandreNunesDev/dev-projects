import React, { useState, useEffect, Fragment, useContext } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import ScqApi from '../Http/ScqApi'
import { withToastManager } from 'react-toast-notifications'
import { withMenuBar } from '../Hocs/withMenuBar'
import { responseHandler } from '../Services/responseHandler'
import mapToStateProps from '../mapStateProps/mapStateToProps'
import { connect } from 'react-redux'
import dispatchers from '../mapDispatch/mapDispathToProps'
import { WebSocketContext } from '../websocket/wsProvider'
import { toastOk } from '../Services/toastType'
import { useToasts } from 'react-toast-notifications/dist/ToastProvider'

const TableHeadTarefas = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Nome</th>
                <th>Código Instrução</th>
                <th>Status</th>
                <th>Confirmar</th>
            </tr>
        </thead>

    )
}

const TableBodyTarefas = props => {
    const tarefaTd = props.tarefas?.map((tarefa, index) => {
        return (

            <tr style={{ textAlign: "center" }} key={tarefa.id}>
                <td className="align-middle">{tarefa.id}</td>
                <td className="align-middle">{tarefa.nome}</td>
                <td className="align-middle">{tarefa.codigo}</td>
                <td className="align-middle"><Form.Label style={{ color: tarefa.pendente ? 'red' : 'green', fontWeight: 'bolder' }} >
                    {tarefa.pendente ? "Pendente" : 'Em dia'}</Form.Label></td>
                <td className="align-middle" >
                    <div className="form-check">
                        <input type="checkbox" checked={props.checkedTarefas.includes(tarefa.id)} onChange={(event) => props.checkedElement(event.target.checked, tarefa.id, "tarefa")} className="form-check-input" />
                        <label className="form-check-label" >Executado</label>
                    </div>

                </td>
            </tr>
        )
    })

    return tarefaTd

}


const TableHeadTrocas = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Etapa</th>
                <th>Tanque</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Confirmar</th>
            </tr>
        </thead>

    )
}

const TableBodyTrocas = props => {
    const trocaTd = props.trocas?.map((troca, index) => {
        return (

            <tr style={{ textAlign: "center" }} key={troca.id}>
                <td className="align-middle">{troca.etapaNome}</td>
                <td className="align-middle">{troca.posicao}</td>
                <td>
                    {troca.listaMontagens.map((pair, indexy) => {
                        return <div key={indexy}>{`${pair[0]}`} </div>
                    })}
                </td>
                <td>
                    {troca.listaMontagens.map((pair, indexz) => {
                        return <div key={indexz}>{`${pair[1]} ${pair[2]}`} </div>
                    })}
                </td>
                <td className="align-middle" >
                <div className="form-check">
                        <input type="checkbox" checked={props.checkedTrocas.includes(troca.id)} onChange={(event) => props.checkedElement(event.target.checked, troca.id, "troca")} className="form-check-input" />
                        <label className="form-check-label" >Executado</label>
                    </div>
                </td>
            </tr>
        )
    })

    return trocaTd

}


const FinalizarOmp = (props) => {

    const [omp] = useState(props.location.state)
    const [trocas, setTrocas] = useState([])
    const [tarefas, setTarefas] = useState([])
    const [tarefasIdChecked, setTarefasChecked] = useState([])
    const [trocasIdChecked, setTrocasIdChecked] = useState([])
    const histoy = useHistory()
    const toastManager = useToasts()
    const context = useContext(WebSocketContext)
    const [markedTarefas, setmarkedTarefas] = useState(false)
    const [markedTrocas, setmarkedTrocas] = useState(false)
    const [dataRealizada, setDataRealizada] = useState(new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0])

    useEffect(() => {
        ScqApi.LoadFullOmpDetails(omp).then(res => {
            setTrocas(res.trocas)
            setTarefas(res.tarefas)
        })
    }, [omp])

    useEffect(() => {
        console.log(tarefasIdChecked)
    }, [tarefasIdChecked])

    useEffect(() => {
        console.log(trocasIdChecked)
    }, [trocasIdChecked])

    const checkedElement = (checked, id, type) => {

        if (checked) {
            if (type === "tarefa") {
                const newTarefaArray = tarefasIdChecked.concat(id)
                if (!tarefasIdChecked.includes(id)) {

                    setTarefasChecked(newTarefaArray)
                }

            } else {
                const newTrocasArray = trocasIdChecked.concat(id)
                if (!trocasIdChecked.includes(id)) {
                    setTrocasIdChecked(newTrocasArray)
                }

            }

        } else {

            if (type === "tarefa") {
                const removedArray = tarefasIdChecked.filter((value) => {
                    return Number(value) !== Number(id)
                })
                setTarefasChecked(removedArray)
            } else {
                const removedTrocaArray = trocasIdChecked.filter((value) => {
                    return Number(value) !== Number(id)
                })
                setTrocasIdChecked(removedTrocaArray)
            }

        }
    }

    const markAllTrocas = () => {
        if (markedTrocas) {
            setTrocasIdChecked([])
        } else {
            setTrocasIdChecked(trocas.map(troca => troca.id))
        }
        setmarkedTrocas(!markedTrocas)

    }

    const markAllTarefas = () => {
        if (markedTarefas) {
            setTarefasChecked([])
        } else {
            setTarefasChecked(tarefas.map(tarefa => tarefa.id))
        }
        setmarkedTarefas(!markedTarefas)
    }

    return (
        <>



            <Container style={{ marginTop: 20 }}>
                <Row>
                    <h2>{'Finalizar Omp'}</h2>

                </Row>
                <Form.Row style={{ marginTop: 10 }}>

                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Realizado em: </Form.Label>
                            <Form.Control
                                type="datetime-local"
                                defaultValue={dataRealizada}
                                onChange={event => { setDataRealizada(event.target.value) }}>

                            </Form.Control>
                        </Form.Group>
                    </Col>

                </Form.Row>
                <h4>Trocas</h4>

                {trocas &&
                    <>
                        <Button style={{ marginBottom: 15 }} onClick={() => markAllTrocas()}>{`${markedTrocas ? "Desmarcar" : "Marcar"} todos`}</Button>
                        <Table className="table table-hover">
                            <TableHeadTrocas></TableHeadTrocas>
                            <tbody>
                                <TableBodyTrocas trocas={trocas} checkedTrocas={trocasIdChecked} checkedElement={(checked, id, type) => checkedElement(checked, id, type)}></TableBodyTrocas>
                            </tbody>
                        </Table>
                    </>}
                <Fragment>
                    <h4>Tarefas</h4>
                    {tarefas &&
                        <>
                            <Button style={{ marginBottom: 15 }} onClick={() => markAllTarefas()}>{`${markedTarefas ? "Desmarcar" : "Marcar"} todos`}</Button>
                            <Table>
                                <TableHeadTarefas></TableHeadTarefas>
                                <tbody>
                                    <TableBodyTarefas tarefas={tarefas} checkedTarefas={tarefasIdChecked} checkedElement={(checked, id, type) => checkedElement(checked, id, type)}></TableBodyTarefas>
                                </tbody>

                            </Table>
                        </>}
                </Fragment>



                <Button onClick={() => {
                    const OmpFinalizarForm = { id: omp.id, tarefasId: tarefasIdChecked, trocasId: trocasIdChecked, data: dataRealizada }
                    ScqApi.FinalizarOmp(OmpFinalizarForm,[props.loadOrdensDeManutencao]).then((response) => { responseHandler(response, toastManager, "OrdemDeManutencao", toastOk);  }).then(() => histoy.push("/omp"))
                }}>Confirmar</Button>


            </Container>
        </>
    )
}

export default withToastManager(withMenuBar(connect(mapToStateProps.toProps, dispatchers)(FinalizarOmp)))