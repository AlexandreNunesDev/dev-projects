import React, { useEffect, useState } from 'react'
import { Form, Container, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from './MenuBar';
import { useHistory, withRouter } from 'react-router-dom';

import ScqApi from '../Http/ScqApi';




const redirectOcps = (history) => {
    history.push("/OrdensDeCorrecao")
}

const redirectAnalise = (history, analise) => {
    history.push("/RegistroAnalise", analise)
}



const saveOcp = (analise, acao, prazo, responsavel, observacao, history) => {
    ScqApi.CriarAnalise(analise).then(res => {
        const newOcp = { id: null, responsavel: responsavel, observacao: observacao, statusCorrecao: false, statusocp: false, analiseId: res.id }
        ScqApi.CriarOcp(newOcp).then(ocp => {
            const newAcao = { id: null, acao, prazo, ocpId: ocp.id }
            ScqApi.CriarAcao(newAcao).then(res => redirectOcps(history))
        })
    })


}

const CadastroDeOcp = (props) => {
    let history = useHistory();
    const [analise, setAnalise] = useState()
    const [parametro, setParametro] = useState()
    const [acao, setAcao] = useState()
    const [observacao, setObservacao] = useState()
    const [prazo, setPrazo] = useState(new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0])
    const [responsavel, setResponsavel] = useState('')

    const [etapa, setEtapa] = useState()




    useEffect(() => {
        const analise = props.location.state
        setAnalise(analise)
        ScqApi.FindParametro(analise.parametroId).then(res => setParametro(res))


    }, [props.location.state])


    useEffect(() => {
        parametro && ScqApi.FindEtapa(parametro.etapaId).then(res => setEtapa(res))
    }, [parametro])


    return (
        <>
            <header>
                <MenuBar></MenuBar>
            </header>

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
                            <Form.Control type="text" placeholder={"Porque o problema ocorreu"} onChange={(event) => setAcao(event.target.value)}></Form.Control>

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
                            <Form.Control type="text" placeholder={"Código da Ordem de serviço"} onChange={event => setResponsavel(event.target.value)}></Form.Control>
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
                                saveOcp(analise, acao, prazo, responsavel,observacao, history)
                            }}>
                                Salvar
                                        </Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Container>
        </>

    )


}



export default withRouter(CadastroDeOcp)