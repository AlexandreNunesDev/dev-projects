import { useDispatch, useSelector } from "react-redux"
import GenericSelect from "../Components/GenericSelect"
import React, { useContext, useEffect, useRef, useState } from "react"
import { actions } from "../actions/actions"
import { withMenuBar } from "../Hocs/withMenuBar"
import { analiseFieldFactory, timefieldFactory } from "../models/fieldModels"
import CheckoutAnalise from "../Components/CheckoutAnalise"
import ScqApi from "../Http/ScqApi"
import { responseHandler } from "../Services/responseHandler"
import { formatIsoDate } from "../Services/stringUtils"
import { WebSocketContext } from "../websocket/wsProvider"
import dispatchers from "../mapDispatch/mapDispathToProps"
import { withToastManager } from "react-toast-notifications/dist/ToastProvider"
import { buildAnaliseInputMenu } from "../Services/analiseMenuBuilder"
import { getAnaliseStatus } from "../Services/analiseMenuBuilder"
import { useHistory } from "react-router"

const { Form, Row, Button, Container, Col, Table } = require("react-bootstrap")

const MultiRegistroAnalise = (props) => {

    const analiseForm = useSelector(state => state.analiseReducer)
    const processos = useSelector(state => state.options.processos)
    const parametros = useSelector(state => state.options.parametros)
    const userName = useSelector(state => state.global.userName)
    const dispatcher = useDispatch()
    const [analista, setAnalista] = useState()
    const [showData, setShowData] = useState()
    const [showCheckOut, setShowCheckOut] = useState()
    const [checkOutAnaliseField, setCheckOutAnaliseField] = useState()
    const [data, setData] = useState()
    let dataFieldRef = useRef(null)
    const context = useContext(WebSocketContext)
    const reducerFunctions = dispatchers()
    const history = useHistory()
    const [analiseToCheckOut, setAnaliseToCheckOut] = useState(null)



    const onProcessoIdChoose = (processoId) => {
        let analiseFields = parametros.filter(parametro => {
            if ((Number(parametro.processoId) === Number(processoId))) {
                return true
            }
        }).map((parametro, index) => analiseFieldFactory(index, parametro, '', null, false))
        dispatcher(actions.loadFieldAnalise(analiseFields))
        dispatcher(actions.setProcessoIdAnaliseForm(processoId))

    }


    useEffect(() => {
        let analiseFields = parametros.filter(parametro => {
            if ((Number(parametro.processoId) === Number(analiseForm.processoId))) {
                return true
            }
        }).map((parametro) => {
            let analiseField = analiseForm.analiseFields.filter(analiseField => Number(analiseField.parametro.id) === Number(parametro.id))[0]
            let analiseFieldUpdate = { ...analiseField }
            analiseFieldUpdate.parametro = parametro;
            return analiseFieldUpdate
        })
        dispatcher(actions.loadFieldAnalise(analiseFields))
    }, [parametros])


    const salvarAnalise = () => {
        const { toastManager } = props
        ScqApi.CriarAnalise(analiseToCheckOut, [dispatchers().loadParametros, dispatchers().loadOcps]).then(res => {
            responseHandler(res, toastManager, "Analise", 'success')
        })
        setShowCheckOut(false)
    }

    const gerarOcp = () => {
        history.push({ pathname: `/CadastroOcp${checkOutAnaliseField.parametro.menuType}`, state: analiseToCheckOut })

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
        setCheckOutAnaliseField(analiseFieldCheckOut)
        setShowCheckOut(true)
        setAnaliseToCheckOut({ id: null, parametroId: analiseFieldCheckOut.parametro.id, analista: nomeAnalista, resultado: analiseFieldCheckOut.valor, status: analiseFieldCheckOut.analiseStatus, data: data  })
    }

    const closeCheckOut = () => {
        setShowCheckOut(false)
        setCheckOutAnaliseField(null)
        setAnaliseToCheckOut(null)
    }


    const observacaoUpdate = (valor) => {
        let analiseCheckOutWithObservacao = { ...analiseToCheckOut }
        analiseCheckOutWithObservacao.observacaoAnalise = valor
        setAnaliseToCheckOut(analiseCheckOutWithObservacao)
    }






    return (
        <>



            {analiseToCheckOut && <CheckoutAnalise onValueChange={(valor) => observacaoUpdate(valor)} hide={true} showCheckOut={showCheckOut} valid={true} resultado={checkOutAnaliseField.valor} parametro={checkOutAnaliseField.parametro} status={checkOutAnaliseField.analiseStatus} salvarAnalise={salvarAnalise} gerarOcp={gerarOcp} closeCheckOut={() => closeCheckOut()}></CheckoutAnalise>}
            <Container style={{ marginTop: 20 }}>

                <Row>
                    <GenericSelect selection={analiseForm.processoId} title={"Escolha um processo"} ops={processos} returnType={"id"} displayType={"nome"} onChange={(processoId) => onProcessoIdChoose(processoId)} ></GenericSelect>
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
                    <h3>Registro de Analises</h3>
                    <div className="table-responsive">
                        <Table >
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "center" }}>Turno</th>
                                    <th style={{ textAlign: "center" }}>Etapa</th>
                                    <th style={{ textAlign: "center" }}>Parametro</th>
                                    <th style={{ textAlign: "center" }}>Valor</th>
                                    <th style={{ textAlign: "center" }}>Ação</th>
                                </tr>
                            </thead>

                            <tbody>
                                {analiseForm.processoId && analiseForm.analiseFields.map((analiseField, index) => {
                                    return (
                                        <tr hidden={!analiseField.parametro.habilitado || !analiseField.parametro.analiseHoje} key={analiseField.index} >
                                            <td className="align-middle"><Form.Label style={{ fontWeight: analiseField.parametro.turno === "Atrasado" && "BOLD", color: analiseField.parametro.turno === "Atrasado" ? "RED" : "BLACK", textAlign: "center" }} >{analiseField.parametro.turno}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center" }} >{analiseField.parametro.etapaNome}</Form.Label></td>
                                            <td className="align-middle"><Form.Label style={{ textAlign: "center" }}>{analiseField.parametro.nome}</Form.Label></td>
                                            <td className="align-middle">{buildAnaliseInputMenu(analiseField, { onValueChange: onchangeAnaliseField, hideLabel: true })}</td>
                                            <td className="align-middle">{analiseField.parametro.analiseHoje ? <Button disabled={analiseField.valor ? false : true} style={{ backgroundColor: "BLUE", borderColor: "BLUE", alignmentBaseline: "center" }} onClick={() => checkoutAnalise(analiseField)}>Salvar</Button> : <Button disabled={true} style={{ backgroundColor: "GRAY", borderColor: "GRAY", alignmentBaseline: "center" }}>Salvar</Button>}</td>
                                        </tr>
                                    )

                                })}
                            </tbody>


                        </Table>
                    </div>
                </Container>
            </Container>
        </>
    )

}


export default withMenuBar(withToastManager(MultiRegistroAnalise))