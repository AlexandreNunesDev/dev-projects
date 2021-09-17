import { useDispatch, useSelector } from "react-redux"
import GenericSelect from "../Components/GenericSelect"
import React, { useEffect, useRef, useState } from "react"
import { actions } from "../actions/actions"
import { withMenuBar } from "../Hocs/withMenuBar"
import { timefieldFactory } from "../models/timeField"

const { Form, Row, Button, Container, Col, Table } = require("react-bootstrap")

const RegistroDetempos = () => {

    const timeForm = useSelector(state => state.timeReducer)
    const processos = useSelector(state => state.options.processos)
    const parametros = useSelector(state => state.options.parametros)
    const dispatcher = useDispatch()
    const [intervaloCiclo, setTimer] = useState()
    const [intervaloProcesso, setIntervaloProcesso] = useState()
    const ref = useRef()


    const setInitialTime = (timeField) => {
        dispatcher(actions.updateTimeField(timeField))
    }

    const setFinalTime = (timeField) => {
        let timeFieldToSet = { ...timeField }
        timeFieldToSet.finalTime = new Date()
        dispatcher(actions.updateTimeField(timeFieldToSet))
    }


    const startStopMeasureCiclo = (isMeasure) => {
        if (isMeasure) {
            setTimer(setInterval(() => dispatcher(actions.setCiclo()), 1000))
        } else {
            clearInterval(intervaloCiclo);
            setTimer(null)
        }
    }

    const startStopMeasureProcess = (timeField, isMeasure) => {
        let tField = { ...timeField }
        if (timeField.initialTime === null) {
            tField.initialTime = new Date()
            setInitialTime(tField)
        }
        if (isMeasure) {
            setIntervaloProcesso(setInterval(() => setFinalTime(tField), 1000))
        } else {
            clearInterval(intervaloProcesso);
            setIntervaloProcesso(null)
        }
    }




    const onProcessoIdChoose = (processoId) => {

        dispatcher(actions.loadFieldTime(parametros.filter(parametro => {
            if ((Number(parametro.processoId) === Number(processoId)) && (parametro.unidade === "s")) {
                return true
            }
        }).map((parametro, index) => timefieldFactory(index, parametro.etapaNome, null, null, parametro.id))))
        dispatcher(actions.setTimeProcessId(processoId))
    }





    return (
        <>
            <Container style={{ marginTop: 20 }}>
                <Row>
                    <GenericSelect title={"Escolha um processo"} ops={processos} returnType={"id"} displayType={"nome"} onChange={(processoId) => onProcessoIdChoose(processoId)} ></GenericSelect>
                </Row>
                <Container style={{ padding: 30 }}>
                    <Table >
                        <thead>
                            <tr>
                                <th style={{ textAlign: "center" }}>Etapa</th>
                                <th style={{ textAlign: "center" }}>Tempo</th>
                                <th style={{ textAlign: "center" }} colSpan={2}>Ação</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="align-middle"><Form.Label>Ciclo</Form.Label></td>
                                <td className="align-middle"><Form.Control value={`${timeForm.ciclo} segundos`}></Form.Control></td>
                                <td className="align-middle">{intervaloCiclo ? <Button style={{ backgroundColor: "ORANGE", borderColor: "ORANGE",alignmentBaseline: "center" }} onClick={() => startStopMeasureCiclo(false)}>Parar</Button> : <Button onClick={() => startStopMeasureCiclo(true)}>Iniciar</Button>}</td>
                                <td className="align-middle"> <Button style={{ backgroundColor: "RED", borderColor: "RED",alignmentBaseline: "center" }} onClick={() => dispatcher(actions.clearCiclo())}>Resetar</Button></td>
                            </tr>
                            {timeForm.processoId && timeForm.timeFields.map((timeField, index) => {
                                return (
                                    <tr key={index} >
                                        <td className="align-middle"><Form.Label>{timeField.label}</Form.Label></td>
                                        <td className="align-middle"><Form.Control value={timeField.initialTime && timeField.finalTime && `${(new Date(timeField.finalTime).getTime() / 1000).toFixed(0) - (new Date(timeField.initialTime).getTime() / 1000).toFixed(0)} segundos`}></Form.Control></td>
                                        <td className="align-middle">{intervaloProcesso ? <Button style={{ backgroundColor: "ORANGE", borderColor: "ORANGE",alignmentBaseline: "center" }} onClick={() => startStopMeasureProcess(timeField, false)}>Parar</Button> : <Button style={{ borderColor: intervaloProcesso ? "GREEN" : "BLUE" }} onClick={() => startStopMeasureProcess(timeField, true)}>Iniciar</Button>}</td>
                                        <td className="align-middle"><Button style={{ backgroundColor: "RED", borderColor: "RED" ,alignmentBaseline: "center"}} onClick={() => dispatcher(actions.updateTimeField(timefieldFactory(index, timeField.label, null, null, timeField.parametroId)))}>Resetar</Button></td>
                                    </tr>
                                )
                            })}
                        </tbody>


                    </Table>

                </Container>
            </Container>
        </>
    )

}

export default withMenuBar(RegistroDetempos)