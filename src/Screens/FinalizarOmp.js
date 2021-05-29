import React, { useState, useEffect, Fragment } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { useHistory} from 'react-router-dom'
import ScqApi from '../Http/ScqApi'
import { withToastManager } from 'react-toast-notifications'
import { withMenuBar } from '../Hocs/withMenuBar'

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
                    <Form.Check.Input onChange={(event) => props.checkedElement(event.target.checked, tarefa.id, "tarefa")} type="checkbox" />
                    <Form.Check.Label>Executado ?</Form.Check.Label>
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
                <td className="align-middle" >
                    <Form.Check.Input onChange={(event) => props.checkedElement(event.target.checked, troca.id, "troca")} type="checkbox" />
                    <Form.Check.Label>Executado ?</Form.Check.Label>
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
    const [tarefasIdChecked,setTarefasChecked] = useState([])
    const [trocasIdChecked, setTrocasIdChecked] = useState([])
    const histoy = useHistory()
    const [dataRealizada, setDataRealizada] = useState(new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0])

    useEffect(() => {
        ScqApi.LoadFullOmpDetails(omp).then(res => {
            setTrocas(res.trocas)
            setTarefas(res.tarefas)
        })
    },[omp])

    useEffect(() => {
        console.log(tarefasIdChecked)
    },[tarefasIdChecked])

    useEffect(() => {
        console.log(trocasIdChecked)
    },[trocasIdChecked])

    const checkedElement = (checked,id,type) => {
       
        if(checked){
            if(type==="tarefa"){
                const newTarefaArray = tarefasIdChecked.concat(id)
                setTarefasChecked(newTarefaArray)

            } else {
                const newTrocasArray = trocasIdChecked.concat(id)
                setTrocasIdChecked(newTrocasArray)
            }
      
        } else {

            if(type==="tarefa"){
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
                                onChange={event => { setDataRealizada(event.target.value)}}>

                            </Form.Control>
                        </Form.Group>
                    </Col>
                 
                </Form.Row>
                <h4>Trocas</h4>
                {trocas && <Table className="table table-hover">
                    <TableHeadTrocas></TableHeadTrocas>
                    <tbody>
                        <TableBodyTrocas trocas={trocas} checkedElement={(checked,id,type) => checkedElement(checked,id,type)}></TableBodyTrocas>
                    </tbody>
                </Table>}
                <Fragment>
                    <h4>Tarefas</h4>
                    {tarefas && <Table>
                        <TableHeadTarefas></TableHeadTarefas>
                        <TableBodyTarefas tarefas={tarefas} checkedElement={(checked,id,type) => checkedElement(checked,id,type)}></TableBodyTarefas>
                    </Table>}
                </Fragment>


                
                        <Button onClick={() => {
                            const OmpFinalizarForm = {id : omp.id, tarefasId : tarefasIdChecked , trocasId : trocasIdChecked, data : dataRealizada }
                            ScqApi.FinalizarOmp(OmpFinalizarForm).then(() => histoy.push("/Omp"))
                        }}>Confirmar</Button>


            </Container>
        </>
    )
}

export default withToastManager(withMenuBar(FinalizarOmp))