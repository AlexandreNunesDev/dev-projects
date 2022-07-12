import { useEffect, useRef, useState } from "react"
import { isMobile } from "react-device-detect"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"
import { withToastManager } from "react-toast-notifications/dist/ToastProvider"
import CheckoutAnalise from "../Components/CheckoutAnalise"
import GenericSelect from "../Components/GenericSelect"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import dispatchers from "../mapDispatch/mapDispathToProps"
import { updadteEtapaNome, updateAnaliseToSave, updateFilteredAnalises, updateFiltroEtapa, updateFiltroParametro, updateFrequencia, updateParametroNome, updateProcessoId, updateTurno } from "../Reducers/analiseReducer"
import { buildAnaliseInputMenu, getAnaliseStatus, loadButtons } from "../Services/analiseMenuBuilder"
import { responseHandler } from "../Services/responseHandler"
import { formatIsoDate, OnlyDate, onlyTime } from "../Services/stringUtils"

const { Form, Row, Button, Container, Col, Table } = require("react-bootstrap")

const MultiRegistroAnalise = (props) => {


    const processos = useSelector(state => state.options.processos)
    const parametros = useSelector(state => state.options.parametros)
    const userName = useSelector(state => state.global.userName)
    const frequencia = useSelector(state => state.analise.frequencia)
    const analiseToSave = useSelector(state => state.analise.analiseToSave)
    const filteredAnalises = useSelector(state => state.analise.filteredAnalises)
    const dispatcher = useDispatch()
    const [analista, setAnalista] = useState()
    const [showData, setShowData] = useState()
    const [mostrarEmDia, setMostrarEmDia] = useState(true)
    const [showCheckOut, setShowCheckOut] = useState()
    const [data, setData] = useState()
    const analiseFields = useSelector(state => state.analise.analiseFields)
    const parametroNome = useSelector(state => state.analise.filtroParametro)
    const etapaNome = useSelector(state => state.analise.filtroEtapa)
    const turno = useSelector(state => state.analise.turno)
    const processoId = useSelector(state => state.analise.processoId)
    let dataFieldRef = useRef(null)
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
        let analiseFieldsCopy = [...analiseFields].map(afi => ({ ...afi }))
        if (processoId) analiseFieldsCopy = filterFields(analiseFieldsCopy, "processoId", processoId)
        if (parametroNome) analiseFieldsCopy = filterFields(analiseFieldsCopy, "parametroNome", parametroNome, true)
        if (etapaNome) analiseFieldsCopy = filterFields(analiseFieldsCopy, "etapaNome", etapaNome, true)
        if (turno) analiseFieldsCopy = filterFields(analiseFieldsCopy, "turno", turno, true)
        if (frequencia) analiseFieldsCopy = filterFields(analiseFieldsCopy, "frequencia", frequencia, true)
        let toBuildFields = analiseFieldsCopy.map(fiCopy => {
            let filteredCopy = filteredAnalises.find(fiField => fiField.parametroId == fiCopy.parametroId)
            let orignalCopy = { ...fiCopy }
            orignalCopy.valor = filteredCopy && filteredCopy.valor
            return orignalCopy
        })

        dispatcher(updateFilteredAnalises(toBuildFields))

    }, [analiseFields, processoId, parametroNome, etapaNome, turno, frequencia])


    const salvarAnalise = () => {
        const { toastManager } = props
        ScqApi.CriarAnalise(analiseToSave).then(res => {
            responseHandler(res, toastManager, "Analise", 'success')
        })
        setShowCheckOut(false)
    }

    const gerarOcp = () => {
        history.push({ pathname: '/CadastroOcp' })

    }

    const onchangeAnaliseField = (analiseField) => {
        const index = filteredAnalises.findIndex(fieldAnalise => Number(fieldAnalise.parametroId) === Number(analiseField.parametroId))
        const stateCpy = [...filteredAnalises].map(fi => ({ ...fi }))
        if (index !== -1) stateCpy[index] = analiseField
        dispatcher(updateFilteredAnalises(stateCpy))
    }

    const onTdClick = (analiseField) => {
        const index = filteredAnalises.findIndex(fieldAnalise => Number(fieldAnalise.parametroId) === Number(analiseField.parametroId))
        const stateCpy = [...filteredAnalises].map(fi => ({ ...fi }))
        let analiseFieldCopy = { ...analiseField }
        analiseFieldCopy.isLate = false
        if (index !== -1) stateCpy[index] = analiseFieldCopy
        dispatcher(updateFilteredAnalises(stateCpy))
    }


    const checkoutAnalise = (analiseField) => {
        let nomeAnalista
        if (analista) {
            nomeAnalista = analista;
        } else {
            nomeAnalista = userName
        }
        let analiseFieldCheckOut = { ...analiseField }
        let parametroToRef = parametros.find(param => param.id == analiseField.parametroId)
        analiseFieldCheckOut.analiseStatus = getAnaliseStatus(analiseFieldCheckOut.valor, parametroToRef)

        setShowCheckOut(true)
        let analiseCheckout = { id: null, parametroId: analiseFieldCheckOut.parametroId, analista: nomeAnalista, resultado: analiseFieldCheckOut.valor, status: analiseFieldCheckOut.analiseStatus, data: data, ocpId: null, observacaoAnalise: '', parametro: parametroToRef }
        dispatcher(updateAnaliseToSave(analiseCheckout))
    }

    const closeCheckOut = () => {
        setShowCheckOut(false)
    }


    const observacaoUpdate = (valor) => {
        let analiseCheckOutWithObservacao = { ...analiseToSave }
        analiseCheckOutWithObservacao.observacaoAnalise = valor
        dispatcher(updateAnaliseToSave(analiseCheckOutWithObservacao))
    }






    return (
        <>


            <Container>
                <Container>
                    <h2>Registro de Analise</h2>
                    {analiseToSave && <CheckoutAnalise onValueChange={(valor) => observacaoUpdate(valor)} hide={true} showCheckOut={showCheckOut} valid={true} resultado={analiseToSave.resultado} parametro={analiseToSave.parametro} status={analiseToSave.status} salvarAnalise={() => salvarAnalise()} gerarOcp={gerarOcp} closeCheckOut={() => closeCheckOut()}></CheckoutAnalise>}
                    <Row>
                        <GenericSelect selection={processoId} title={"Escolha um processo"} ops={processos} returnType={"id"} displayType={"nome"} onChange={(processoId) => dispatcher(updateProcessoId(processoId))} ></GenericSelect>
                    </Row>
                    <Row>
                        <Form.Group>
                            <Form.Label>Nome Analista:</Form.Label>
                            <Form.Control value={analista} placeholder={userName} onChange={(event) => setAnalista(event.target.value)}></Form.Control>
                        </Form.Group>
                    </Row>
                </Container>
                <h3>Filtros</h3>
                {!isMobile ? <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por nome de Etapa:</Form.Label>
                            <Form.Control value={etapaNome} placeholder={"filtra por nome de etapa"} onChange={(event) => dispatcher(updateFiltroEtapa(event.target.value))}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por nome de parametro:</Form.Label>
                            <Form.Control value={parametroNome} placeholder={"filtra por nome de parametro"} onChange={(event) => dispatcher(updateFiltroParametro(event.target.value))}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por nome de Turno:</Form.Label>
                            <Form.Control value={turno} placeholder={"filtra por nome de turno"} onChange={(event) => dispatcher(updateTurno(event.target.value))}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por frequencia:</Form.Label>
                            <Form.Control value={frequencia} placeholder={"filtra por frequencia"} onChange={(event) => dispatcher(updateFrequencia(event.target.value))}></Form.Control>
                        </Form.Group>
                    </Col>
                </Row> :
                    <>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Filtrar por nome de Etapa:</Form.Label>
                                    <Form.Control value={etapaNome} placeholder={"filtra por nome de etapa"} onChange={(event) => dispatcher(updateFiltroEtapa(event.target.value))}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Filtrar por nome de parametro:</Form.Label>
                                    <Form.Control value={parametroNome} placeholder={"filtra por nome de parametro"} onChange={(event) => dispatcher(updateFiltroParametro(event.target.value))}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Filtrar por nome de Turno:</Form.Label>
                                    <Form.Control value={turno} placeholder={"filtra por nome de turno"} onChange={(event) => dispatcher(updateTurno(event.target.value))}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Filtrar por frequencia:</Form.Label>
                                    <Form.Control value={frequencia} placeholder={"filtra por frequencia"} onChange={(event) => dispatcher(updateFrequencia(event.target.value))}></Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                }
                <Row>
                    <Col><Button onClick={() => dispatchers(dispatcher).loadAnaliseFields()}>Recarregar Pagina</Button></Col>
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
                        <Form.Check type="checkbox" checked={mostrarEmDia} label="Mostrar Analises em dia?" onChange={(event) => setMostrarEmDia(event.target.checked)} />
                    </Col>
                </Row>
            </Container>
            <div style={{ padding: 12 }}>
                <h3 style={{ textAlign: "center" }} >Registro de Analises</h3>

                <div className="table-responsive" >
                    <div className="tableFixHead" >
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "center" }}>Frequencia</th>
                                    <th style={{ textAlign: "center" }}>Data Plenejada</th>
                                    <th style={{ textAlign: "center" }}>Turno</th>
                                    <th style={{ textAlign: "center" }}>Processo</th>
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
                                {filteredAnalises.map((analiseField, index) => {
                                    return (
                                        <tr hidden={!mostrarEmDia && analiseField.parametro.analiseHoje && analiseField.isHabilitado} key={analiseField.parametroId} >
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center" }} >{`${analiseField.frequencia}`}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center" }} >{OnlyDate(analiseField.dataPlanejada)}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ fontWeight: "BOLD", color: !analiseField.analiseHoje ? "RED" : "GREEN", textAlign: "center" }} >{`${analiseField.turno} ${onlyTime(analiseField.dataPlanejada)}`}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center", maxWidth: 120 }} >{analiseField.processoNome}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center", maxWidth: 120 }} >{analiseField.etapaNome}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center", maxWidth: 120 }}>{analiseField.parametroNome}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center" }}>{analiseField.pMin}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center" }}>{analiseField.pMax}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center" }}>{analiseField.unidade}</Form.Label></td>
                                            {buildAnaliseInputMenu(analiseField, { onValueChange: onchangeAnaliseField, hideLabel: true, onTdClick: onTdClick })}
                                            <td className="align-middle">{loadButtons(analiseField, checkoutAnalise)}</td>
                                        </tr>
                                    )

                                })}
                            </tbody>


                        </table>
                    </div>
                </div>
            </div>


        </>
    )

}


export default withMenuBar(withToastManager(MultiRegistroAnalise))