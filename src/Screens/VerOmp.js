import React, { useState, useEffect, Fragment } from 'react'
import { Col, Container, Form, Row, Table } from 'react-bootstrap'
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
                <td className="align-middle" >
                        <Form.Label>{tarefa.pendente ? "Não Realizado" : "Realizado"}</Form.Label>
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
                <th>Status</th>
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
                    <Form.Label>{troca.pendente ? "Não Realizado" : "Realizado"}</Form.Label>
                </td>
            </tr>
        )
    })

    return trocaTd

}


const VerOmp = (props) => {

  
    const [trocas, setTrocas] = useState([])
    const [tarefas, setTarefas] = useState([])


    const [dataRealizada, setDataRealizada] = useState(props.location.state.data)

    useEffect(() => {
        ScqApi.LoadOmpHistorico(props.location.state).then(res => {
            setTrocas(res.trocas)
            setTarefas(res.tarefas)
            setDataRealizada(res.data)
        })
    },[props.location.state])



    return (
        <>



            <Container style={{ marginTop: 20 }}>
                <Row>
                    <h2>Ordem de Manutencao Finalizada</h2>

                </Row>
                
                <Form.Row style={{ marginTop: 10 }}>
                    
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Realizado em: {dataRealizada} </Form.Label>
                            
                        </Form.Group>
                    </Col>
                 
                </Form.Row>
                <h4>Trocas</h4>
                {trocas && 
                 <div className="table-responsive">
                <Table className="table table-hover">
                    <TableHeadTrocas></TableHeadTrocas>
                    <tbody>
                        <TableBodyTrocas trocas={trocas} ></TableBodyTrocas>
                    </tbody>
                </Table>
                </div>}
                <Fragment>
                    <h4>Tarefas</h4>
                    
                    {tarefas && 
                     <div className="table-responsive">
                    <Table>
                        
                        <TableHeadTarefas></TableHeadTarefas>
                        <tbody>
                            <TableBodyTarefas tarefas={tarefas}></TableBodyTarefas>
                        </tbody>
                       
                    </Table>
                    </div>}
                </Fragment>
           </Container>
        </>
    )
}

export default withToastManager(withMenuBar(VerOmp))