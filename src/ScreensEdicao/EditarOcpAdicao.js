import React, {useContext, useState } from 'react'
import { Form, Container, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  useHistory, withRouter } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';

import { withMenuBar } from '../Hocs/withMenuBar';

import { responseHandler } from '../Services/responseHandler';
import { withToastManager } from 'react-toast-notifications';
import AdicaoFreeEdit from '../Components/AdicaoFreeEdit';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import { connect } from 'react-redux';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';
import { toastInfo, toastWarn } from '../Services/toastType';







const EditarOcpAdicao = (props) => {
    

    const context = useContext(WebSocketContext)
    const history = useHistory()
    const [responsavel, setResponsavel] = useState(props.location.state.responsavel)
    const [observacao, setObservacao] = useState(props.location.state.observacao)


    const salvarEdicaoOcp = () => {
       
        let mpQtds = props.ocp.ocpToEdit.adicoesDto.map((adicao) => {
            return `${adicao.id}:${adicao.quantidade}`
        }) 

        let newOcp = {id: props.ocp.ocpToEdit.id, responsavel,observacao,mpQtds : mpQtds}
        ScqApi.EditarOcpAdicao(newOcp).then(res => responseHandler(res,props,"OrdemDeCorrecao",toastInfo,context,[dispatchers().loadOcps]))
            history.push("/OrdensDeCorrecao")
       
    }

    const deletarOcp = () => {
        ScqApi.DeleteOcp(props.ocp.ocpToEdit.id).then(res => { 
            responseHandler(res,props,"OrdemDeCorrecao",toastWarn,context,[dispatchers().loadOcps,dispatchers().loadParametros])
            history.push("/OrdensDeCorrecao")
        })
      
        
        
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
                               <Form.Label>{props.ocp.ocpToEdit.processoNome}</Form.Label>
                            </Col>
                        </Form.Group>
                        </Col>
                        <Col>
                        <Form.Group>
                            <Col>
                               <Form.Label style={{fontWeight : "bold"}}>Etapa: </Form.Label>
                            </Col>
                            <Col>
                                <Form.Label>{props.ocp.ocpToEdit.etapaNome}</Form.Label>
                            </Col>
                        </Form.Group>
                        </Col>
                        <Col>
                   
                        <Form.Group>
                            <Col>
                               <Form.Label style={{fontWeight : "bold"}}>Parametro: </Form.Label>
                            </Col>
                            <Col>
                             <Form.Label>{props.ocp.ocpToEdit.parametroNome}</Form.Label>
                            </Col>
                        </Form.Group>
                        </Col>
                            
                        </Form.Row>
                        <AdicaoFreeEdit></AdicaoFreeEdit>
                            
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
                                <Button style={{ margin: 2 }} onClick={()=> props.history.push("/OrdensDeCorrecao") }>
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



export default withRouter(withMenuBar(withToastManager(connect(mapToStateProps.toProps,dispatchers)(EditarOcpAdicao))))