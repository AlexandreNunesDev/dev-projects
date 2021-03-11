import React, { useState } from 'react'
import { Col, Button,Container, Form } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router';
import { withToastManager } from 'react-toast-notifications';
import { withMenuBar } from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import { responseHandler } from '../Services/responseHandler';

const EditarOcpAcao = (props) => {
    const [ocp,setOcp] = useState(props.location.state)
    const [responsavel, setResponsavel] = useState(props.location.state.responsavel)
    const [observacao, setObservacao] = useState(props.location.state.observacao)
    const [prazo, setPrazo] = useState(props.location.state.prazo)
    const [acao,setAcao] = useState(props.location.state.acao)

    const saveOcp = () => {
     
        
      
        
        let newOcp = {id: ocp.id,acaoId: ocp.acaoId, responsavel,prazo,observacao,acao}
        ScqApi.EditarOcpAcao(newOcp).then(res => responseHandler(res,props,"OrdemDeCorrecao"))
    }
    

    return (
        <>
        <Container style={{ marginTop: 20 }}>
        <h1>Editar Ordem de Correção</h1>
        <Form style={{ marginTop: 20 }}>

            {ocp && <Form.Row>
                <Form.Group xs={3} as={Col}>
                    <Form.Label>Etapa : {ocp.etapaNome}</Form.Label>
                </Form.Group>

                <Form.Group xs={3} as={Col} >
                    <Form.Label>Parametro : {ocp.parametroNome}</Form.Label>
                </Form.Group>

                <Form.Group xs={2} as={Col}>
                    <Form.Label>Faixa Mininima : {`${ocp.pMin} ${ocp.unidade}`}</Form.Label>
                </Form.Group>
                <Form.Group xs={2} as={Col} >
                    <Form.Label>Faixa Máxima : {`${ocp.pMax} ${ocp.unidade}`}</Form.Label>
                </Form.Group>
                <Form.Group xs={2} as={Col} >
                    <Form.Label style={{ color: ocp.analiseStatus ? 'red' : 'black' }}>Resultado: {`${ocp.resultado} ${ocp.unidade}`}</Form.Label>
                </Form.Group>
            </Form.Row>}


            <Form.Row>
                <Col >
                    <Form.Label>Observacao: </Form.Label>
                    <Form.Control type="text" value={observacao} placeholder={"Porque o problema ocorreu"} onChange={(event) => setObservacao(event.target.value)}></Form.Control>

                </Col>
                <Col >
                    <Form.Label>Acao: </Form.Label>
                    <Form.Control type="text" value={acao} placeholder={"O que sera feito para resolver"} onChange={(event) => setAcao(event.target.value)}></Form.Control>

                </Col>

            </Form.Row>

            <Form.Row>
                <Col>
                <Form.Label>Prazo: </Form.Label>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={prazo}
                        onChange={event => { setPrazo(event.target.value)}}>

                    </Form.Control>
                </Col>
                <Col >
                    <Form.Label>Responsavel: </Form.Label>
                    <Form.Control type="text" value={responsavel} placeholder={"Responsavel pela ação"} onChange={event => setResponsavel(event.target.value)}></Form.Control>
                </Col>

            </Form.Row>
            <Form.Row style={{ margin: 10 }}>
                <Form.Group >
                    <Button style={{ margin: 2 }} >
                        Cancelar
                    </Button>
                    <Button style={{ margin: 2 }} type="reset" 
                   onClick={() => saveOcp()} >
                        Salvar
                    </Button>
                </Form.Group>
            </Form.Row>
        </Form>
    </Container>
        
      
   </>
    )

}

export default withToastManager(withMenuBar(EditarOcpAcao))