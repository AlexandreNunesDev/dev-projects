import { useContext, useEffect, useRef, useState } from "react"
import { isMobile } from "react-device-detect"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"
import { withToastManager } from "react-toast-notifications/dist/ToastProvider"
import { actions } from "../actions/actions"
import CheckoutAnalise from "../Components/CheckoutAnalise"
import GenericSelect from "../Components/GenericSelect"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import dispatchers from "../mapDispatch/mapDispathToProps"
import { analiseFieldFactory } from "../models/fieldModels"
import { clear, setAnaliseToSave } from "../Reducers/singleAnaliseReducer"
import { buildAnaliseInputMenu, getAnaliseStatus } from "../Services/analiseMenuBuilder"
import { responseHandler } from "../Services/responseHandler"
import { formatIsoDate, OnlyDate } from "../Services/stringUtils"
import { WebSocketContext } from "../websocket/wsProvider"

const { Form, Row, Button, Container, Col, Table } = require("react-bootstrap")

const MultiRegistroAnalise = (props) => {


    const processos = useSelector(state => state.options.processos)
    const parametros = useSelector(state => state.options.parametros)
    const userName = useSelector(state => state.global.userName)
    const analiseToSave = useSelector(state => state.singleAnalise.analiseToSave)
    const dispatcher = useDispatch()
    const [analista, setAnalista] = useState()
    const [showData, setShowData] = useState()
    const [mostrarEmDia, setMostrarEmDia] = useState()
    const [showCheckOut, setShowCheckOut] = useState()
    const [data, setData] = useState()
    const [filteredAnaliseFields, setFiltedAnaliseFields] = useState([])
    const analiseFields = useSelector(state => state.analiseReducer.analiseFields)
    const parametroNome = useSelector(state => state.analiseReducer.parametroNome)
    const etapa = useSelector(state => state.analiseReducer.etapa)
    const turno = useSelector(state => state.analiseReducer.turno)
    const processoId = useSelector(state => state.analiseReducer.processoId)
    let dataFieldRef = useRef(null)
    const context = useContext(WebSocketContext)
    const reducerFunctions = dispatchers()
    const history = useHistory()





    const filterFields = (parametros, fieldToFilter, valueToFilter, isString) => {
        if (isString) {
            return parametros.filter(parametro => {
                if (String(parametro[fieldToFilter]).toLocaleLowerCase().startsWith(valueToFilter.toLocaleLowerCase())) {
                    return true
                } else {
                    return false
                }
            })
        } else {
            return parametros.filter(parametro => {
                if (parametro[fieldToFilter] == (valueToFilter.toLocaleLowerCase())) {
                    return true
                } else {
                    return false
                }
            })
        }


    }

    useEffect(() => {
        let analiFields
        if (parametros) {
            if (analiseFields.length == 0) {
                analiFields = parametros.map((parametro, index) => analiseFieldFactory(index, parametro, '', null, false))
                dispatcher(actions.loadFieldAnalise(analiFields))
                setFiltedAnaliseFields(analiFields)
            } else {
                let filteredParametro
                if (processoId) filteredParametro = filterFields(parametros, "processoId", processoId)
                if (parametroNome) filteredParametro = filterFields(filteredParametro, "nome", parametroNome, true)
                if (etapa) filteredParametro = filterFields(filteredParametro, "etapaNome", etapa, true)
                if (turno) filteredParametro = filterFields(filteredParametro, "turno", turno, true)
                analiFields = filteredParametro.map((parametro) => {
                    let analiseField = analiseFields.filter(analiseField => Number(analiseField.parametro.id) === Number(parametro.id))[0]
                    let analiseFieldUpdate = { ...analiseField }
                    analiseFieldUpdate.parametro = parametro;
                    return analiseFieldUpdate
                })

                setFiltedAnaliseFields(analiFields)
            }

        }

    }, [parametros, processoId, parametroNome, etapa, turno])


    const salvarAnalise = () => {
        const { toastManager } = props
        ScqApi.CriarAnalise(analiseToSave, [dispatchers().loadParametros, dispatchers().loadOcps]).then(res => {
            responseHandler(res, toastManager, "Analise", 'success')
        })
        setShowCheckOut(false)
    }

    const gerarOcp = () => {
        history.push({ pathname: '/CadastroOcp' })

    }

    const onchangeAnaliseField = (analiseField) => {
        const index = filteredAnaliseFields.findIndex(fieldAnalise => Number(fieldAnalise.parametro.id) === Number(analiseField.parametro.id))
        const stateCpy = [...filteredAnaliseFields].map(fi => ({...fi}))
        if (index !== -1) stateCpy[index] = analiseField
        setFiltedAnaliseFields(stateCpy)
    }

    const checkoutAnalise = (analiseField) => {
        let nomeAnalista
        if (analista) {
            nomeAnalista = analista;
        } else {
            nomeAnalista = userName
        }
        let analiseFieldCheckOut = { ...analiseField }
        analiseFieldCheckOut.analiseStatus = getAnaliseStatus(analiseFieldCheckOut.valor, analiseFieldCheckOut.parametro)

        setShowCheckOut(true)
        let analiseCheckout = { id: null, parametroId: analiseFieldCheckOut.parametro.id, analista: nomeAnalista, resultado: analiseFieldCheckOut.valor, status: analiseFieldCheckOut.analiseStatus, data: data, ocpId: null, observacaoAnalise: '', parametro: analiseFieldCheckOut.parametro }
        dispatcher(setAnaliseToSave(analiseCheckout))
    }

    const closeCheckOut = () => {
        setShowCheckOut(false)
        dispatcher(clear())
    }


    const observacaoUpdate = (valor) => {
        let analiseCheckOutWithObservacao = { ...analiseToSave }
        analiseCheckOutWithObservacao.observacaoAnalise = valor
        dispatcher(setAnaliseToSave(analiseCheckOutWithObservacao))
    }






    return (
        <>


            <Container>
                <Container>
                    <h2>Registro de Analise</h2>
                    {analiseToSave && <CheckoutAnalise onValueChange={(valor) => observacaoUpdate(valor)} hide={true} showCheckOut={showCheckOut} valid={true} resultado={analiseToSave.resultado} parametro={analiseToSave.parametro} status={analiseToSave.status} salvarAnalise={() => salvarAnalise()} gerarOcp={gerarOcp} closeCheckOut={() => closeCheckOut()}></CheckoutAnalise>}
                    <Row>
                        <GenericSelect selection={processoId} title={"Escolha um processo"} ops={processos} returnType={"id"} displayType={"nome"} onChange={(processoId) => dispatcher(actions.setProcessoIdAnaliseForm(processoId))} ></GenericSelect>
                    </Row>
                    <Row>
                        <Form.Group>
                            <Form.Label>Nome Analista:</Form.Label>
                            <Form.Control value={analista} placeholder={userName} onChange={(event) => dispatcher(actions.loadFieldAnalise(event.target.value))}></Form.Control>
                        </Form.Group>
                    </Row>
                </Container>
                <h3>Filtros</h3>
                {!isMobile ? <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por nome de Etapa:</Form.Label>
                            <Form.Control value={etapa} placeholder={"filtra por nome de etapa"} onChange={(event) => dispatcher(actions.setEtapaNomeForm(event.target.value))}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por nome de parametro:</Form.Label>
                            <Form.Control value={parametroNome} placeholder={"filtra por nome de parametro"} onChange={(event) => dispatcher(actions.setParametroNome(event.target.value))}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por nome de Turno:</Form.Label>
                            <Form.Control value={turno} placeholder={"filtra por nome de turno"} onChange={(event) => dispatcher(actions.setTurnoAnaliseForm(event.target.value))}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row> :
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Filtrar por nome de Etapa:</Form.Label>
                                    <Form.Control value={etapa} placeholder={"filtra por nome de etapa"} onChange={(event) => dispatcher(actions.setEtapaNomeForm(event.target.value))}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Filtrar por nome de parametro:</Form.Label>
                                    <Form.Control value={parametroNome} placeholder={"filtra por nome de parametro"} onChange={(event) => dispatcher(actions.setParametroNome(event.target.value))}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Filtrar por nome de Turno:</Form.Label>
                                    <Form.Control value={turno} placeholder={"filtra por nome de turno"} onChange={(event) => dispatcher(actions.setTurnoAnaliseForm(event.target.value))}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                }
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
                    <Col style={{ marginBottom: 10 }}>
                        <Form.Check type="checkbox" label="Mostrar Analises em dia?" onChange={(event) => setMostrarEmDia(event.target.checked)} />
                    </Col>
                </Row>
            </Container>
            <div style={{ padding: 12 }}>
                <h3 style={{ textAlign: "center" }} >Registro de Analises</h3>
                <div className="table-responsive" >
                    <table>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center" }}>Frequencia</th>
                                <th style={{ textAlign: "center" }}>Data Plenejada</th>
                                <th style={{ textAlign: "center" }}>Turno</th>
                                <th style={{ textAlign: "center" }}>Etapa</th>
                                <th style={{ textAlign: "center" }}>Parametro</th>
                                <th style={{ textAlign: "center" }}>Minimo</th>
                                <th style={{ textAlign: "center" }}>Maximo</th>
                                <th style={{ textAlign: "center" }}>Unidade</th>
                                <th style={{ textAlign: "center" }}>Valor</th>
                                <th style={{ textAlign: "center" }}>Ação</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAnaliseFields.map((analiseField, index) => {
                                return (
                                    <tr hidden={!mostrarEmDia && analiseField.parametro.analiseHoje} key={analiseField.parametro.id} >
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }} >{`${analiseField.parametro.frequencia} / ${analiseField.parametro.escalaFrequencia}`}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }} >{OnlyDate(analiseField.parametro.dataPlanejada)}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ fontWeight: "BOLD", color: !analiseField.parametro.analiseHoje ? "RED" : "GREEN", textAlign: "center" }} >{analiseField.parametro.turno}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }} >{analiseField.parametro.etapaNome}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }}>{`${analiseField.parametro.nome} ${analiseField.parametro.id}`}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }}>{analiseField.parametro.pMin}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }}>{analiseField.parametro.pMax}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }}>{analiseField.parametro.unidade}</Form.Label></td>
                                        <td>{buildAnaliseInputMenu(analiseField, { onValueChange: onchangeAnaliseField, hideLabel: true })}</td>
                                        <td className="align-middle"><Button disabled={analiseField.valor ? false : true} style={{ backgroundColor: "BLUE", borderColor: "BLUE", alignmentBaseline: "center" }} onClick={() => checkoutAnalise(analiseField)}>Salvar</Button></td>
                                    </tr>
                                )

                            })}
                        </tbody>


                    </table>
                </div>
            </div>


        </>
    )

}


export default withMenuBar(withToastManager(MultiRegistroAnalise))