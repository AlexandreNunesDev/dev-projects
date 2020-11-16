import React, {Fragment, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import ScqApi from '../Http/ScqApi'
import MenuBar from './MenuBar'

import fileSaver from "file-saver"





const TableHeadTarefas = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Nome</th>
                <th>Código Instrução</th>
                <th>Status</th>
                <th>Ação</th>
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
                <td className="align-middle"><Form.Label style={{color : tarefa.pendente ? 'red' : 'green', fontWeight : 'bolder'}} >
                    {tarefa.pendente ? "Pendente": 'Em dia'}</Form.Label></td>
                <td className="align-middle" >
                    <Form.Check.Input onChange={(event) => props.choosedTarefaClick(event.target.checked,tarefa.id)} type="checkbox" />
                    <Form.Check.Label>Executar ?</Form.Check.Label>
            </td>
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
    const [tarefas , setTarefas] = useState(location.state.tarefas || [])
    const [tarefasChoosedId , setTarefasChoosedId] = useState([])
    

    const downloadOmp = (fileName) => {
     ScqApi.DownloadOmp(fileName).then(file => fileSaver.saveAs(file, fileName)).then(() => props.history.push("/OrdensDeManutencao"));
      }

   const setTrocaToList = (checked,id) => {
       
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
        console.log(tarefasChoosedId)
    },[tarefasChoosedId])


    useEffect(() => {
        ScqApi.ListaTarefasDeManutencao().then(res => setTarefas(res))
    },[])


    return (
        <>
            <MenuBar></MenuBar>
          

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
                 <h4>Escolha as Tarefas de Manutencao</h4>
                 <Table>

                 
                <TableHeadTarefas></TableHeadTarefas>
                <TableBodyTarefas choosedTarefaClick={setTrocaToList} tarefas={tarefas}></TableBodyTarefas>
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
                            ScqApi.GerarOmpTarefas(omp).then(fileName => downloadOmp(fileName))
                        } else {
                            const omp = {processoId : trocas[0]?.processoId,programadoPara: dataPlanejada ,emitidoPor : emitidoPor,trocasId, tarefasId : tarefasChoosedId}
                            ScqApi.GerarOmp(omp).then(fileName => downloadOmp(fileName) )
                        }
                        
                        
                    }
                }>Gerar Documento</Button>

            </Container>
        </>
    )


}

export default CadastroOmp