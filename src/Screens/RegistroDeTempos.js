import { useDispatch, useSelector } from "react-redux"
import GenericSelect from "../Components/GenericSelect"
import React, { useContext, useEffect, useRef, useState } from "react"
import { actions } from "../actions/actions"
import { withMenuBar } from "../Hocs/withMenuBar"
import { timefieldFactory } from "../models/fieldModels"
import CheckoutAnalise from "../Components/CheckoutAnalise"
import ScqApi from "../Http/ScqApi"
import { responseHandler } from "../Services/responseHandler"
import { formatIsoDate } from "../Services/stringUtils"
import { WebSocketContext } from "../websocket/wsProvider"
import dispatchers from "../mapDispatch/mapDispathToProps"
import { withToastManager } from "react-toast-notifications/dist/ToastProvider"

const { Form, Row, Button, Container, Col, Table } = require("react-bootstrap")

const RegistroDetempos = (props) => {

    const timeForm = useSelector(state => state.timeReducer)
    const processos = useSelector(state => state.options.processos)
    const parametros = useSelector(state => state.options.parametros)
    const userName = useSelector(state => state.global.userName)
    const dispatcher = useDispatch()
    const [intervaloProcesso, setIntervaloProcesso] = useState()
    const [timeTick, setTimeTick] = useState(new Date())
    const [parametro, setParametro] = useState()
    const [analista, setAnalista] = useState()
    const [showData, setShowData] = useState()
    const [showCheckOut, setShowCheckOut] = useState()
    const [resultado, setResultado] = useState()
    const [status, setStatus] = useState()
    const [data, setData] = useState()
    let dataFieldRef = useRef(null)
    const context = useContext(WebSocketContext)
    const dispatch = useDispatch()
    const reducerFunctions = dispatchers()



    useEffect(() => {
        setIntervaloProcesso(setInterval(() => setTimeTick(new Date()), 1000))
        return clearInterval(intervaloProcesso);
    }, [])

    const setInitialTime = (timeField) => {
        let tField = { ...timeField }
        if (timeField.initialTime === null) {
            tField.initialTime = timeTick
        }
        if (timeField.finalTime !== null) {
            let difference = timeTick.getTime() - new Date(timeField.finalTime).getTime()
            let newInitialDate = new Date(new Date(timeField.initialTime).getTime() + difference)
            tField.initialTime = newInitialDate
        }
        tField.isMeasuring = true

        dispatcher(actions.updateTimeField(tField))
    }

    const setFinalTime = (timeField) => {
        let tField = { ...timeField }
        tField.isMeasuring = false
        tField.finalTime = timeTick
        dispatcher(actions.updateTimeField(tField))
    }



    const startStopMeasureProcess = (timeField, isMeasure) => {
        if (isMeasure) {
            setInitialTime(timeField)
        } else {
            setFinalTime(timeField)
        }
    }




    const onProcessoIdChoose = (processoId) => {
        let cicloTimefield = timefieldFactory(0, "Ciclo", null, null, null, false)
        let sortedParametros =  [...parametros]
        sortedParametros = sortedParametros.sort((a,b) => Number(a.posicao) - Number(b.posicao))
        let timeFields = sortedParametros.filter(parametro => {
            if ((Number(parametro.processoId) === Number(processoId)) && (parametro.unidade === "s")) {
                return true
            }
        }).map((parametro, index) => timefieldFactory(index + 1, parametro.etapaNome, null, null, parametro.id, false, false))
        dispatcher(actions.loadFieldTime([cicloTimefield, ...timeFields]))
        dispatcher(actions.setTimeProcessId(processoId))

    }


    const onTimeSaveClick = (timeField) => {
        const resultadoAtual = calculateResultado(timeField)
        const parametroAtual = parametros.filter(parametro => String(parametro.id) === String(timeField.parametroId))[0]
        setResultado(calculateResultado(timeField))
        setStatus(getAnaliseStatus(resultadoAtual, parametroAtual))
        setParametro(parametroAtual)
        setShowCheckOut(true)

    }


    const calculateResultado = (timeField) => {
        return (new Date(timeField.finalTime) / 1000).toFixed(0) - (new Date(timeField.initialTime).getTime() / 1000).toFixed(0)
    }


    const isFinished = (timeField) => {
        if ((timeField.initialTime) && (timeField.finalTime) && (timeField.isMeasuring === false)) {
            return true
        } else {
            return false
        }
    }


    const salvarAnalise = () => {
        let nomeAnalista
        if (analista) {
            nomeAnalista = analista;
        } else {

            nomeAnalista = userName
        }

        const analise = { id: null, parametroId: parametro.id, analista: nomeAnalista, resultado: resultado, status: status, data: data }

        ScqApi.CriarAnalise(analise).then(res => {
            responseHandler(res, props, "Analise", 'success', context, [reducerFunctions.loadParametros, reducerFunctions.loadOcps])
        })

    }

    const getAnaliseStatus = (resultado, parametro) => {
        if (resultado < parametro?.pMin || resultado > parametro?.pMax) {
            return 'fofe'
        } else if ((resultado > parametro?.pMinT && resultado < parametro?.pMaxT)) {
            return 'deft'
        } else {
            return 'foft'
        }
    }


    const gerarOcpReanalise = (history) => {
        const analise = { id: null, analista: analista, resultado: resultado, status: status, parametroId: parametro.id, ocpId: null }
        history.push('/CadastroOcp' + parametro.menuType, analise)

    }


    const gerarOcp = (history) => {
        let nomeAnalista
        if (analista) {
            nomeAnalista = analista;

        } else {
            nomeAnalista = userName
        }
        const analise = { id: null, parametroId: parametro.id, analista: nomeAnalista, resultado: resultado, status: status, data: data }
        history.push('/CadastroOcp' + parametro.menuType, analise)
    }



    return (
        <>



            {parametro && <CheckoutAnalise hide={true} showCheckOut={showCheckOut} valid={true} resultado={resultado} parametro={parametro} status={status} salvarAnalise={salvarAnalise} gerarOcpReanalise={gerarOcpReanalise} gerarOcp={gerarOcp} closeCheckOut={() => setShowCheckOut(false)}></CheckoutAnalise>}
            <Container style={{ marginTop: 20 }}>

                <Row>
                    <GenericSelect title={"Escolha um processo"} ops={processos} returnType={"id"} displayType={"nome"} onChange={(processoId) => onProcessoIdChoose(processoId)} ></GenericSelect>
                </Row>
                <Row>
                    <Form.Group>
                        <Form.Control value={analista} placeholder={userName} onChange={(event) => setAnalista(event.target.value)}></Form.Control>
                    </Form.Group>
                </Row>
                <Row>
                    <Col style={{ marginBottom: 10 }}>
                        <Form.Check type="checkbox" label="Selecionar Data?" onChange={(event) => setShowData(event.target.checked)} />
                        <Form.Group hidden={!showData}>
                            <Form.Label>Data: </Form.Label>
                            <Form.Control
                                ref={dataFieldRef}
                                type="datetime-local"
                                defaultValue={data}
                                onChange={event => setData(formatIsoDate(event.target.value))}>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Container style={{ padding: 30 }}>
                    <h3>Registro de Tempos</h3>

                    <div className="table-responsive">
                        <Table >
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "center" }}>Etapa</th>
                                    <th style={{ textAlign: "center" }}>Tempo</th>
                                    <th style={{ textAlign: "center" }} colSpan={3}>Ação</th>
                                </tr>
                            </thead>

                            <tbody>
                                {timeForm.processoId && timeForm.timeFields.map((timeField, index) => {

                                    if (timeField.index === 0) {
                                        return (
                                            <tr key={timeField.index} >
                                                <td className="align-middle"><Form.Label>{timeField.label}</Form.Label></td>
                                                <td className="align-middle"><Form.Control value={timeField.isMeasuring ? `${(timeTick.getTime() / 1000).toFixed(0) - (new Date(timeField.initialTime).getTime() / 1000).toFixed(0)} segundos` : `${(new Date(timeField.finalTime) / 1000).toFixed(0) - (new Date(timeField.initialTime).getTime() / 1000).toFixed(0)} segundos`}></Form.Control></td>
                                                <td className="align-middle">{timeField.isMeasuring ? <Button style={{ backgroundColor: "ORANGE", borderColor: "ORANGE", alignmentBaseline: "center" }} onClick={() => startStopMeasureProcess(timeField, false)}>Parar</Button> : <Button style={{ borderColor: intervaloProcesso ? "BLUE" : "BLUE" }} onClick={() => startStopMeasureProcess(timeField, true)}>Iniciar</Button>}</td>
                                                <td className="align-middle"><Button style={{ backgroundColor: "RED", borderColor: "RED", alignmentBaseline: "center" }} onClick={() => dispatcher(actions.updateTimeField(timefieldFactory(index, timeField.label, null, null, timeField.parametroId, false)))}>Resetar</Button></td>
                                                <td className="align-middle"><Button disabled={true} style={{ backgroundColor: "GREEN", borderColor: "GREEN", alignmentBaseline: "center" }} onClick={() => console.log("Abrir Checkout analise")}>Salvar</Button></td>
                                            </tr>
                                        )
                                    } else {
                                        return (
                                            <tr key={timeField.index} >
                                                <td className="align-middle"><Form.Label>{timeField.label}</Form.Label></td>
                                                <td className="align-middle"><Form.Control value={timeField.isMeasuring ? `${(timeTick.getTime() / 1000).toFixed(0) - (new Date(timeField.initialTime).getTime() / 1000).toFixed(0)} segundos` : `${(new Date(timeField.finalTime) / 1000).toFixed(0) - (new Date(timeField.initialTime).getTime() / 1000).toFixed(0)} segundos`}></Form.Control></td>
                                                <td className="align-middle">{timeField.isMeasuring ? <Button style={{ backgroundColor: "ORANGE", borderColor: "ORANGE", alignmentBaseline: "center" }} onClick={() => startStopMeasureProcess(timeField, false)}>Parar</Button> : <Button style={{ borderColor: intervaloProcesso ? "BLUE" : "BLUE" }} onClick={() => startStopMeasureProcess(timeField, true)}>Iniciar</Button>}</td>
                                                <td className="align-middle"><Button style={{ backgroundColor: "RED", borderColor: "RED", alignmentBaseline: "center" }} onClick={() => dispatcher(actions.updateTimeField(timefieldFactory(index, timeField.label, null, null, timeField.parametroId, false)))}>Resetar</Button></td>
                                                <td className="align-middle"><Button disabled={isFinished(timeField) ? false : true} style={{ backgroundColor: "GREEN", borderColor: "GREEN", alignmentBaseline: "center" }} onClick={() => onTimeSaveClick(timeField)}>Salvar</Button></td>
                                            </tr>
                                        )
                                    }

                                })}
                            </tbody>


                        </Table>
                    </div>
                </Container>
            </Container>
        </>
    )

}


export default withMenuBar(withToastManager(RegistroDetempos))