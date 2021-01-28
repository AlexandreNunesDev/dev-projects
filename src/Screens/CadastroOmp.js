import React, {Fragment, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import ScqApi from '../Http/ScqApi'

import { withMenuBar } from '../Hocs/withMenuBar'





const TableHeadTarefas = (props) => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Nome</th>
                <th>Código Instrução</th>
                <th>Data Planejada</th>
                <th>Status</th>
                {!props.tarefasChecked &&<th>Ação</th>}
            </tr>
        </thead>

    )
}

const FormatDate = (data) => {
    const dataTokens = String(data).split("-");
    return dataTokens[2] + "-" + dataTokens[1] + "-" + dataTokens[0]

}

const TableBodyTarefas = props => {
    
    const tarefaTd = props.tarefas?.map((tarefa, index) => {
        let data = String(tarefa.dataPlanejada).substr(0, 10)

                return (
                    <tr style={{ textAlign: "center" }} key={tarefa.id}>
                        <td className="align-middle">{tarefa.id}</td>
                        <td className="align-middle">{tarefa.nome}</td>
                        <td className="align-middle">{tarefa.codigo}</td>
                        <td className="align-middle">{`${FormatDate(data)}`}</td>
                        <td className="align-middle"><Form.Label style={{color : tarefa.pendente ? 'red' : 'green', fontWeight : 'bolder'}} >
                            {tarefa.pendente ? "Pendente": 'Em dia'}</Form.Label></td>
                        {!props.tarefasChecked && <td className="align-middle" >
                            <Form.Check.Input  onChange={(event) => props.choosedTarefaClick(event.target.checked,tarefa.id)} type="checkbox" />
                            <Form.Check.Label>Executar ?</Form.Check.Label>
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
    const [trocas] = useState(location.state.trocas || [])
    const [emitidoPor , setEmitidoPor] = useState()
    const [tarefas, setTarefas] = useState(location.state.tarefas || [])
    const [tarefasChoosedId , setTarefasChoosedId] = useState(location.state.markedIds || [])
    const history = useHistory()
    


   const setTarefaToList = (checked,id) => {
       
        if(checked){
            
            setTarefasChoosedId(tarefasChoosedId.concat(id))
            
        } else {
            
            const removedArray = tarefasChoosedId.filter((value) => {
                return Number(value) !== Number(id)
            })
           setTarefasChoosedId(removedArray)
        }
       
    }


    useEffect(()=>{
        ScqApi.ListaTarefasByProcesso(trocas[0]?.processoId || tarefas[0].processoId).then(res => setTarefas(res))
    },[trocas])

    


    return (
        <>
        
            
            
                <Container style={{ marginTop: 20 }}>

                <Row>
                {trocas.length !== 0 ?<h2>{`Ordem de Manutençao de Processo - ${trocas[0]?.processoNome}`}</h2> :
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
                                onChange={event => { setDataPlanejada(event.target.value); console.log(dataPlanejada) }}>

                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Form.Row>
                {trocas.length !== 0 &&
                <>
                <h4>Trocas Selecionadas</h4>
                <Table className="table table-hover">
                    <TableHead></TableHead>
                    <tbody>
                        <TableBody trocas={trocas} ></TableBody>
                    </tbody>
                </Table> </>}

                 {  tarefas && 
                 <Fragment>
                 <h4>{`${location.state.tarefasChecked ? '' : 'Escolha as '}Tarefas de Manutencao`}</h4>
                 <Table>

                 
                <TableHeadTarefas tarefasChecked={location.state.tarefasChecked} ></TableHeadTarefas>
                <TableBodyTarefas tarefasChecked={location.state.tarefasChecked} choosedTarefaClick={setTarefaToList} tarefas={tarefas}></TableBodyTarefas>
                </Table>
                </Fragment>
                }

                <Button style={{ marginLeft: 20 }} onClick={
                    () => {
                        const trocasId = trocas.map((troca,index) => {
                           return troca.id
                        })



                       
                        
                        if(trocas.length ===0){
                            const omp = {processoId : tarefas[0].processoId,programadoPara: dataPlanejada ,emitidoPor : emitidoPor,trocasId, tarefasId : tarefasChoosedId}
                            ScqApi.GerarOmpTarefas(omp)
                        } else {
                            const omp = {processoId : trocas[0]?.processoId,programadoPara: dataPlanejada ,emitidoPor : emitidoPor,trocasId, tarefasId : tarefasChoosedId}
                            ScqApi.GerarOmp(omp).then(history.push("/OrdensDeManutencao"))
                        }
                        
                        
                    }
                }>Gerar Documento</Button>

            </Container>

            

            
        </>
    )


}

export default withMenuBar(CadastroOmp)