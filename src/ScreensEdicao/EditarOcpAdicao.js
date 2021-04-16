import React, {useState } from 'react'
import { Form, Container, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  withRouter } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';

import { withMenuBar } from '../Hocs/withMenuBar';

import { responseHandler } from '../Services/responseHandler';
import { withToastManager } from 'react-toast-notifications';
import AdicaoFreeEdit from '../Components/AdicaoFreeEdit';







const EditarOcpAdicao = (props) => {
    const [ocp,setOcp] = useState(props.location.state)
    const [responsavel, setResponsavel] = useState(props.location.state.responsavel)
    const [observacao, setObservacao] = useState(props.location.state.observacao)


    const updadteQuantidadeAdicao = (quantidade,index) => {
        ocp.adicoesDto[index].quantidade = quantidade
        setOcp(ocp)
    }

    const salvarEdicaoOcp = () => {
        let mpQtds = ocp.adicoesDto.map((adicao) => {
            return `${adicao.id}:${adicao.quantidade}`
        }) 

        let newOcp = {id: ocp.id, responsavel,observacao,mpQtds : mpQtds}
        ScqApi.EditarOcpAdicao(newOcp).then(res => responseHandler(res,props,"OrdemDeCorrecao"))
    }

    const deletarOcp = () => {
       
        ScqApi.DeleteOcp(ocp.id).then(res => props.history.push("/OrdensDeCorrecao"))
    }
 


    return (
        <>
                    <Container style={{ marginTop: 20 }}>
                    <h1>Editar Ordem de Correcao</h1>
                    <Form style={{ marginTop: 20 }}>
                    
                    <Form.Row>
                        <Col>
                        <Form.Group>
                             <Col>
                               <Form.Label style={{fontWeight : "bold"}}>Processo: </Form.Label>
                            </Col>
                            <Col>
                               <Form.Label>{ocp.processoNome}</Form.Label>
                            </Col>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group>
                            <Col>
                               <Form.Label style={{fontWeight : "bold"}}>Etapa: </Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>{ocp.etapaNome}</Form.Label>
                            </Col>
                        </Form.Group>
                        </Col>
                        <Col>
                   
                        <Form.Group>
                            <Col>
                               <Form.Label style={{fontWeight : "bold"}}>Parametro: </Form.Label>
                            </Col>
                            <Col>
                             <Form.Label>{ocp.parametroNome}</Form.Label>
                            </Col>
                        </Form.Group>
                        </Col>
                            
                        </Form.Row>
                        <AdicaoFreeEdit  ocp={ocp} mpQtds={ocp.adicoesDto} updateAdicao={(quantidade,index) => updadteQuantidadeAdicao(quantidade,index)}></AdicaoFreeEdit>
                            
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Responsavel: </Form.Label>
                                <Form.Control type="text" value={responsavel} onChange={(event) => setResponsavel(event.target.value)}></Form.Control>
                            </Form.Group>
                    
                        <Form.Group as={Col}>
                            <Form.Label>Observação: </Form.Label>
                            <Form.Control type="text" value={observacao} placeholder={"Ex: Add. Cx. Misutra"} onChange={(event) => setObservacao(event.target.value)}></Form.Control>
                        </Form.Group>
                        </Form.Row>
                      
                        <Form.Row>
                            <Form.Group >
                                <Button style={{ margin: 2 }}>
                                    Cancelar
                                </Button>
                                <Button style={{ margin: 2 ,backgroundColor : 'RED' , borderColor : 'RED'}} type="reset"  onClick={() =>  deletarOcp()} >
                                    Excluir Ocp
                                </Button>
                                <Button style={{ margin: 2 }} type="reset"  onClick={() =>  salvarEdicaoOcp()} >
                                    Salvar
                                </Button>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Container>
            
           

        </>
    )


}



export default withRouter(withMenuBar(withToastManager(EditarOcpAdicao)))