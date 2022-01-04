import React, { useContext, useEffect, useRef, useState } from 'react'
import { Form, Container, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GenericSelect from '../Components/GenericSelect';
import ScqApi from '../Http/ScqApi';
import CheckOutAnalise from '../Components/CheckoutAnalise';
import { withToastManager } from 'react-toast-notifications';
import TitulaForm from './TitulaForm';
import { withMenuBar } from '../Hocs/withMenuBar';
import { responseHandler } from '../Services/responseHandler';
import { connect, useDispatch, useSelector } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps'
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';
import { formatIsoDate } from '../Services/stringUtils';
import { clear, setAnaliseToSave } from '../Reducers/singleAnaliseReducer';








const RegistroDeAnalise = (props) => {

    const context = useContext(WebSocketContext)
    const processos = useSelector(state => state.options.processos)
    const etapas = useSelector(state => state.options.etapas)
    const parametros = useSelector(state => state.options.parametros)
    const userName = useSelector(state => state.global.userName)
    const analiseToSave = useSelector(state => state.singleAnalise.analiseToSave)
    const [processo, setprocesso] = useState('')
    const [etapa, setetapa] = useState('')
    const [parametro, setparametro] = useState('')
    const [etapas_, setetapas] = useState('')
    const [parametros_, setparametros] = useState('')
    const [data, setdata] = useState('')
    const [menuType, setMenuTypeName] = useState(null)
    const [showData, setShowData] = useState(false)
    const [showCheckOut, setShowCheckOut] = useState(false)
    const [calcDisabled, setCalcDisabled] = useState(true)
    const dispatch = useDispatch()
    const dataFieldRef = useRef(null)




    useEffect(() => {
        let analise = { ...analiseToSave }
        analise.analista = userName
        if (props.location.state?.reanalise) {
            onLinhaSelect(analiseToSave.processoId)
            onEtapaSelect(analiseToSave.etapaId)
            onParametroSelect(analiseToSave.parametroId)
            dispatch(setAnaliseToSave(analise))
        } else {
            dispatch(setAnaliseToSave({ id:'', analista: analise.analista, resultado: '', status: '', parametroId: '', ocpId: '', observacaoAnalise: ''}))
        }

    }, [])



    const onLinhaSelect = (linhaId) => {
        setprocesso(processos.filter(processo => Number(processo.id) === Number(linhaId))[0])
        setetapas(etapas.filter(etapa => {
            if ((etapa.processoId === Number(linhaId)) && (!etapa.hasNoParam)) {
                return true
            } else {
                return false
            }
        }))
    }

    const onEtapaSelect = (etapaId) => {
        setetapa(etapas.filter(etapa => Number(etapa.id) === Number(etapaId))[0])
        setparametros(parametros.filter(parametro => parametro.etapaId === Number(etapaId)))
    }



    const valueForm = () => {
        return (
            <>
                <Form.Label>
                    Valor
                </Form.Label>
                <Form.Control type="number" placeholder={"0.00"} onChange={(event) => setAnaliseStatus(event.target.value)} />
            </>
        )
    }

    const titulaForm = () => {
        return (
            <>
                <TitulaForm onCalculaResultado={setAnaliseStatus} formula={parametro.formula}></TitulaForm>
            </>
        )
    }





    const onParametroSelect = (parametroId) => {
        const parametroRef = parametros.filter(parametro => String(parametro.id) === String(parametroId))[0]
        let analise = { ...analiseToSave }
        analise.parametroId = parametroId
        setparametro(parametroRef)
        dispatch(setAnaliseToSave(analise))

    }



    const setAnaliseStatus = (resultado) => {
        resultado = +resultado
        let analise = { ...analiseToSave }
        analise.resultado = resultado
        const parametroRef = parametros.filter(parametro => +parametro.id === +analiseToSave.parametroId)[0]
        if (resultado == 0) {
            setCalcDisabled(true)
            analise.status = ''
        } else {
            setCalcDisabled(false)
            if (resultado < parametroRef?.pMin || resultado > parametroRef?.pMax) {
                analise.status = 'fofe'
            } else if ((resultado > parametroRef?.pMinT && resultado < parametroRef?.pMaxT)) {
                analise.status = 'deft'
            } else {
                analise.status = 'foft'
            }
        }

        dispatch(setAnaliseToSave(analise))
    }


    useEffect(() => {
        if (parametro) {
            if (parametro.menuType === "Acao") {
                setMenuTypeName(valueForm)

            } else {
                if (parametro.unidade === "pH") {
                    setMenuTypeName(valueForm)

                } else {
                    setMenuTypeName(titulaForm)
                }
            }
        }

    }, [parametro])




    const salvarAnalise = () => {
        const { toastManager } = props
        ScqApi.CriarAnalise(analiseToSave, [dispatchers().loadParametros, dispatchers().loadOcps]).then(res => {
            responseHandler(res, toastManager, "Analise", 'success')
        })
    }



    const salvarReanalise = () => {
        const { toastManager } = props
        ScqApi.EditarAnalise(analiseToSave, [dispatchers().loadParametros, dispatchers().loadOcps]).then((res) => responseHandler(res, toastManager, "Analise", 'info'))

    }

    const setObservacao = (observacao) => {
        let analise = { ...analiseToSave }
        analise.observacao = observacao
        dispatch(setAnaliseToSave(analise))

    }

    const setanalista = (analista) => {
        let analise = { ...analiseToSave }
        analise.analista = analista
        dispatch(setAnaliseToSave(analise))

    }


    const gerarOcpReanalise = (history) => {
        history.push('/CadastroOcp' + parametro.menuType)

    }


    const gerarOcp = (history) => {
        history.push('/CadastroOcp' + parametro.menuType)
    }


    const setDataSelect = (checked) => {
        if (checked === true) {
            setShowData(checked)
        } else {
            dataFieldRef.current.value = null
            setShowData(false)
            setdata(null)
        }

    }


    const setDataDaAnalise = (data) => {
        let analise = { ...analiseToSave }
        analise.data = data
        dispatch(setAnaliseToSave(analise))
    }

    return (
        <>


            <Container style={{ marginTop: 20 }}>
                <h1>{analiseToSave.id ? `Registro de Reanalise Id: ${analiseToSave.id}` : "Registro de Analise"} </h1>
                <Form>
                    <Form.Row>
                        <Col style={{ marginBottom: 10 }}>

                            <Form.Check type="checkbox" label="Selecionar Data?" onChange={(event) => setDataSelect(event.target.checked)} />
                            <Form.Group hidden={!showData}>
                                <Form.Label>Data: </Form.Label>
                                <Form.Control
                                    ref={dataFieldRef}
                                    type="datetime-local"
                                    defaultValue={data}
                                    onChange={event => setDataDaAnalise(formatIsoDate(event.target.value))}>

                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col>
                            <GenericSelect displayType={"nome"} returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={processos} onChange={(value) => onLinhaSelect(value)} selection={processo.id}></GenericSelect>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <GenericSelect displayType={"nome"} returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} ops={etapas_} onChange={(value) => onEtapaSelect(value)} selection={etapa.id} ></GenericSelect>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <GenericSelect displayType={"nome"} returnType={"id"} title={"Parametro"} default={"Escolha um Parametro"} ops={parametros_} onChange={(value) => onParametroSelect(value)} selection={analiseToSave.parametroId} ></GenericSelect>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <Form.Label>
                                Nome do Analista:
                            </Form.Label>
                            <Form.Control type="text" placeholder={userName} value={analiseToSave.analista} onChange={(event) => setanalista(event.target.value)} />
                        </Col>

                    </Form.Row>
                    <Form.Row>

                        <Col>
                            {menuType && menuType}
                        </Col>
                    </Form.Row>


                    <Form.Group style={{ marginTop: 20 }}>
                        <CheckOutAnalise showCheckOut={showCheckOut} onValueChange={(valor) => setObservacao(valor)} valid={calcDisabled} resultado={analiseToSave.resultado} parametro={parametro} status={analiseToSave.status} salvarAnalise={salvarAnalise} salvarReanalise={salvarReanalise} gerarOcpReanalise={gerarOcpReanalise} gerarOcp={gerarOcp} analiseId={analiseToSave?.id}></CheckOutAnalise>
                    </Form.Group>

                </Form>

            </Container>


        </>
    )

}

export default withToastManager(withMenuBar(RegistroDeAnalise))