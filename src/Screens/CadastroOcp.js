import React, { useContext, useEffect, useState } from 'react'
import { Form, Container, Col, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory, withRouter } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';
import AdicaoComposition from '../Components/AdicaoComposition';
import AdicaopH from '../Components/AdicaopH';
import { withMenuBar } from '../Hocs/withMenuBar';
import { responseHandler } from '../Services/responseHandler';
import { withToastManager } from 'react-toast-notifications';
import { connect, useDispatch, useSelector } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { loadOcps } from '../Services/storeService'
import { WebSocketContext } from '../websocket/wsProvider';
import AdicaoForm from '../Components/AdicaoForm';
import { clear, updateAdicoes } from '../Reducers/adicaoReducer';
import { toastOk } from '../Services/toastType';




const redirectAnalise = (history, analise) => {
    history.push("/RegistroAnalise", analise)
}



const CadastroDeOcpAdicao = (props) => {
    let history = useHistory();
    const [parametro, setParametro] = useState()
    const context = useContext(WebSocketContext)
    const [mpQtds, setMpQtd] = useState([])
    const [responsavel, setResponsavel] = useState('')
    const [observacao, setObservacao] = useState('')
    const [etapa, setEtapa] = useState()
    const dispatcher = useDispatch()
    const [loading] = useState(false)
    const analiseToSave = useSelector(state => state.singleAnalise.analiseToSave)
    const parametros = useSelector(state => state.options.parametros)
    const etapas = useSelector(state => state.options.etapas)
    const materiasPrim = useSelector(state => state.options.materiasPrima)
    const adicoes = useSelector(state => state.adicaoForm.adicoes)
    const { toastManager } = props
    let unidade = ""



    useEffect(() => {
        const param = parametros.filter(param => String(param.id) === String(analiseToSave.parametroId))[0]
        const etapa = etapas.filter(etap => etap.parametrosId.includes(param.id))[0]
        param.unidade === "pH" ? unidade = "" : unidade = param.unidade
        setEtapa(etapa)
        setParametro(param)
        dispatcher(updateAdicoes([]))
    }, [])



    const deleteAdicao = (adicaoId) => {
        ScqApi.deleteAdicao(adicaoId).then(res => {
            let adicoesDtoCopy = [...adicoes]
            dispatcher(updateAdicoes(adicoesDtoCopy.filter(addDto => Number(addDto.id) !== Number(adicaoId))))
            toastManager.add(`Adicao ${adicaoId || ""} deletada com sucesso`, { type: "info", autoDismiss: true })
        })
        dispatcher(clear())
    }



    const saveOcp = () => {
        let analiseCopy = { ...analiseToSave }
        if (analiseCopy.resultado < parametro?.pMin || analiseCopy.resultado > parametro?.pMax) {
            analiseCopy.status = 'fofe'
        } else if ((analiseCopy.resultado > parametro?.pMinT && analiseCopy.resultado < parametro?.pMaxT)) {
            analiseCopy.status = 'deft'
        } else {
            analiseCopy.status = 'foft'
        }
        
        const fullAnaliseForm = { ...analiseCopy, responsavel: responsavel, observacao: observacao, adicoes: adicoes }
        ScqApi.CriarAnaliseComOcpAdicao(fullAnaliseForm).then((res) => {
            responseHandler(res, toastManager, "OrdemDeCorrecao", toastOk)
        }
        );

        dispatcher(updateAdicoes([]))
        history.push("/OrdensDeCorrecao")

    }



    return (
        <>

            {

                loading ? <Container><Spinner animation="grow" />
                    <Form.Label>Aguarde , gerando OCP</Form.Label></Container>
                    :
                    <Container style={{ marginTop: 20 }}>
                        <h1>Cadastro de Ordem de Correção</h1>
                        <Form style={{ marginTop: 20 }}>
                            {parametro &&
                                <Form.Row>
                                    {etapa &&
                                        <Form.Group xs={3} as={Col}>
                                            <Form.Label>Etapa : {etapa.nome}</Form.Label>
                                        </Form.Group>
                                    }
                                    <Form.Group xs={3} as={Col} >
                                        <Form.Label>Parametro : {`${parametro.nome}`}</Form.Label>
                                    </Form.Group>

                                    <Form.Group xs={2} as={Col}>
                                        <Form.Label>Faixa Mininima : {`${parametro.pMin} ${unidade}`}</Form.Label>
                                    </Form.Group>
                                    <Form.Group xs={2} as={Col} >
                                        <Form.Label>Faixa Máxima : {`${parametro.pMax} ${unidade}`}</Form.Label>
                                    </Form.Group>
                                    <Form.Group xs={2} as={Col} >
                                        <Form.Label style={{ color: analiseToSave.status === "fofe" ? 'red' : 'black' }}>Resultado: {`${analiseToSave.resultado} ${unidade}`}</Form.Label>
                                    </Form.Group>

                                </Form.Row>
                            }
                            <AdicaoForm deleteAdicao={deleteAdicao}></AdicaoForm>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Responsavel: </Form.Label>
                                    <Form.Control type="text" onChange={(event) => setResponsavel(event.target.value)}></Form.Control>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Observação: </Form.Label>
                                    <Form.Control type="text" placeholder={"Ex: Add. Cx. Misutra"} onChange={(event) => setObservacao(event.target.value)}></Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group >
                                    <Button style={{ margin: 2 }} onClick={() => {
                                        redirectAnalise(history, analiseToSave)
                                        redirectAnalise(history)
                                    }}>
                                        Cancelar
                                    </Button>
                                    <Button style={{ margin: 2 }} type="reset" onClick={() => {
                                        saveOcp(analiseToSave, mpQtds, responsavel, observacao, history, props, context)
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



export default withToastManager(withRouter(withMenuBar(connect(mapToStateProps.toProps, dispatchers)(CadastroDeOcpAdicao))))