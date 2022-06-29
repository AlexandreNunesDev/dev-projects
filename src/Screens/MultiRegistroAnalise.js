import { useDispatch, useSelector } from "react-redux"
import GenericSelect from "../Components/GenericSelect"
import React, { useContext, useEffect, useRef, useState } from "react"
import { actions } from "../actions/actions"
import { withMenuBar } from "../Hocs/withMenuBar"
import { analiseFieldFactory, timefieldFactory } from "../models/fieldModels"
import CheckoutAnalise from "../Components/CheckoutAnalise"
import ScqApi from "../Http/ScqApi"
import { responseHandler } from "../Services/responseHandler"
import { formatIsoDate, OnlyDate } from "../Services/stringUtils"
import { WebSocketContext } from "../websocket/wsProvider"
import dispatchers from "../mapDispatch/mapDispathToProps"
import { withToastManager } from "react-toast-notifications/dist/ToastProvider"
import { buildAnaliseInputMenu } from "../Services/analiseMenuBuilder"
import { getAnaliseStatus } from "../Services/analiseMenuBuilder"
import { useHistory } from "react-router"
import { clear, setAnaliseToSave } from "../Reducers/singleAnaliseReducer"

const { Form, Row, Button, Container, Col, Table } = require("react-bootstrap")

const MultiRegistroAnalise = (props) => {

    const analiseForm = useSelector(state => state.analiseReducer)
    const processos = useSelector(state => state.options.processos)
    const parametros = useSelector(state => state.options.parametros)
    const userName = useSelector(state => state.global.userName)
    const analiseToSave = useSelector(state => state.singleAnalise.analiseToSave)
    const dispatcher = useDispatch()
    const [analista, setAnalista] = useState()
    const [showData, setShowData] = useState()
    const [showCheckOut, setShowCheckOut] = useState()
    const [data, setData] = useState()
    const [nomeParametro, setNomeParametro] = useState()
    const [etapa, setEtapa] = useState()
    const [turno, setTurno] = useState()
    let dataFieldRef = useRef(null)
    const context = useContext(WebSocketContext)
    const reducerFunctions = dispatchers()
    const history = useHistory()



    const onProcessoIdChoose = (processoId) => {
        let analiseFields = parametros.filter(parametro => {
            if ((Number(parametro.processoId) === Number(processoId))) {
                return true
            }
        }).map((parametro, index) => analiseFieldFactory(index, parametro, '', null, false))
        dispatcher(actions.loadFieldAnalise(analiseFields))
        dispatcher(actions.setProcessoIdAnaliseForm(processoId))

    }

    const filterFields = (parametros, fieldToFilter, valueToFilter) => {
        return parametros.filter(parametro => {
            if (String(parametro[fieldToFilter]).toLocaleLowerCase().startsWith(valueToFilter.toLocaleLowerCase())) {
                return true
            } else {
                return false
            }
        })
    }


    useEffect(() => {
        let filteredFields = filterFields(parametros, "processoId", analiseForm.processoId)
        if (nomeParametro) filteredFields = filterFields(filteredFields, "nome", nomeParametro)
        if (etapa) filteredFields = filterFields(filteredFields, "etapaNome", etapa)
        if (turno) filteredFields = filterFields(filteredFields, "turno", turno)
        let analiseFields = filteredFields.map((parametro) => {
            let analiseField = analiseForm.analiseFields.filter(analiseField => Number(analiseField.parametro.id) === Number(parametro.id))[0]
            let analiseFieldUpdate = { ...analiseField }
            analiseFieldUpdate.parametro = parametro;
            return analiseFieldUpdate
        })
        dispatcher(actions.loadFieldAnalise(analiseFields))
    }, [parametros, nomeParametro, etapa,turno])


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
        dispatcher(actions.updadteAnaliseField(analiseField))
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
                {analiseToSave && <CheckoutAnalise onValueChange={(valor) => observacaoUpdate(valor)} hide={true} showCheckOut={showCheckOut} valid={true} resultado={analiseToSave.resultado} parametro={analiseToSave.parametro} status={analiseToSave.status} salvarAnalise={() => salvarAnalise()} gerarOcp={gerarOcp} closeCheckOut={() => closeCheckOut()}></CheckoutAnalise>}
                <Row>
                    <GenericSelect selection={analiseForm.processoId} title={"Escolha um processo"} ops={processos} returnType={"id"} displayType={"nome"} onChange={(processoId) => onProcessoIdChoose(processoId)} ></GenericSelect>
                </Row>
                <Row>
                    <Form.Group>
                        <Form.Control value={analista} placeholder={userName} onChange={(event) => setAnalista(event.target.value)}></Form.Control>
                    </Form.Group>
                </Row>
                <h3>Filtros</h3>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por nome de Etapa:</Form.Label>
                            <Form.Control value={etapa} placeholder={"filtra por nome de etapa"} onChange={(event) => setEtapa(event.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por nome de parametro:</Form.Label>
                            <Form.Control value={nomeParametro} placeholder={"filtra por nome de parametro"} onChange={(event) => setNomeParametro(event.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>Filtrar por nome de Turno:</Form.Label>
                            <Form.Control value={turno} placeholder={"filtra por nome de turno"} onChange={(event) => setTurno(event.target.value)}></Form.Control>
                        </Form.Group>
                    </Col>
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
            </Container>
            <div style={{ padding: 12 }}>
                <h3>Registro de Analises</h3>
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
                            {analiseForm.processoId && analiseForm.analiseFields.map((analiseField, index) => {
                                return (
                                    <tr hidden={!analiseField.parametro.habilitado} key={analiseField.index} >
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }} >{`${analiseField.parametro.frequencia} / ${analiseField.parametro.escalaFrequencia}`}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }} >{OnlyDate(analiseField.parametro.dataPlanejada)}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ fontWeight: "BOLD", color: !analiseField.parametro.analiseHoje ? "RED" : "GREEN", textAlign: "center" }} >{analiseField.parametro.turno}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }} >{analiseField.parametro.etapaNome}</Form.Label></td>
                                        <td className="align-middle"><Form.Label style={{ textAlign: "center" }}>{analiseField.parametro.nome}</Form.Label></td>
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