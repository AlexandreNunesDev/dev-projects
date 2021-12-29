import React, { useContext, useEffect, useState } from 'react'
import { Form, Container, Col, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory, withRouter } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';
import { withMenuBar } from '../Hocs/withMenuBar';
import { connect, useSelector } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';
import {responseHandler} from '../Services/responseHandler'
import {toastOk} from '../Services/toastType'
import { useToasts } from 'react-toast-notifications/dist/ToastProvider';




const redirectAnalise = (history, analise) => {
    history.push("/RegistroAnalise", analise)
}





const CadastroDeOcp = (props) => {
    let context = useContext(WebSocketContext)
    let history = useHistory();
    const [analise, setAnalise] = useState()
    const [parametro, setParametro] = useState()
    const [acao, setAcao] = useState()
    const [observacao, setObservacao] = useState()
    const [prazo, setPrazo] = useState(new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0])
    const [responsavel, setResponsavel] = useState('')
    const [loading] = useState(false)
    const [etapa, setEtapa] = useState()
    const etapas = useSelector(state => state.options.etapas)
    const toastManager = useToasts()

    const saveOcp = () => {
    
        const fullAnaliseForm = {...analise,responsavel: responsavel, observacao: observacao,acao,prazo}
        ScqApi.CriarAnaliseComOcpAcao(fullAnaliseForm,[props.loadOcps]).then((res) => responseHandler(res,toastManager,"Ocp", toastOk))
        history.push("/OrdensDeCorrecao")
    }


    useEffect(() => {
        const analise = props.location.state
        setAnalise(analise)
        ScqApi.FindParametro(analise.parametroId).then(res => setParametro(res))


    }, [props.location.state])


    useEffect(() => {
        parametro && setEtapa(etapas.filter(etapa => etapa.parametrosId.includes(parametro.id))[0])
    }, [parametro])


    return (
        <>
             {
             loading ? <Container><Spinner animation="grow" /> 
             <Form.Label>Aguarde , gerando OCP</Form.Label></Container>
             :
             <Container style={{ marginTop: 20 }}>
             <h1>Cadastro de Ordem de Correção</h1>
             <Form style={{ marginTop: 20 }}>

                 {etapa && parametro && analise && <Form.Row>
                     <Form.Group xs={3} as={Col}>
                         <Form.Label>Etapa : {etapa.nome}</Form.Label>
                     </Form.Group>

                     <Form.Group xs={3} as={Col} >
                         <Form.Label>Parametro : {parametro.nome}</Form.Label>
                     </Form.Group>

                     <Form.Group xs={2} as={Col}>
                         <Form.Label>Faixa Mininima : {`${parametro.pMin} ${parametro.unidade}`}</Form.Label>
                     </Form.Group>
                     <Form.Group xs={2} as={Col} >
                         <Form.Label>Faixa Máxima : {`${parametro.pMax} ${parametro.unidade}`}</Form.Label>
                     </Form.Group>
                     <Form.Group xs={2} as={Col} >
                         <Form.Label style={{ color: analise.status ? 'red' : 'black' }}>Resultado: {`${analise.resultado} ${parametro.unidade}`}</Form.Label>
                     </Form.Group>
                 </Form.Row>}


                 <Form.Row>
                     <Col >
                         <Form.Label>Observacao: </Form.Label>
                         <Form.Control type="text" placeholder={"Porque o problema ocorreu"} onChange={(event) => setObservacao(event.target.value)}></Form.Control>

                     </Col>
                     <Col >
                         <Form.Label>Acao: </Form.Label>
                         <Form.Control type="text" placeholder={"O que sera feito para resolver"} onChange={(event) => setAcao(event.target.value)}></Form.Control>

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
                         <Form.Control type="text" placeholder={"Responsavel pela ação"} onChange={event => setResponsavel(event.target.value)}></Form.Control>
                     </Col>

                 </Form.Row>
                 <Form.Row style={{ margin: 10 }}>
                     <Form.Group >
                         <Button style={{ margin: 2 }} onClick={() => {
                             redirectAnalise(history, analise)
                             redirectAnalise(history)
                         }}>
                             Cancelar
                                         </Button>
                         <Button style={{ margin: 2 }} type="reset" onClick={() => {
                             saveOcp(analise, acao, prazo, responsavel,observacao, props,context,history)
                 
                         }}>
                             Salvar
                                     </Button>
                     </Form.Group>
                 </Form.Row>
             </Form>
         </Container>
             }
           
        </>

    )


}



export default withRouter(withMenuBar(connect(mapToStateProps.toProps,dispatchers)(CadastroDeOcp)))