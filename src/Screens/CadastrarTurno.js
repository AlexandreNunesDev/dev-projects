import { useContext, useEffect, useState } from "react"
import React from "react"
import { Button, Col, Container, Form } from "react-bootstrap"
import { withMenuBar } from "../Hocs/withMenuBar"
import { useHistory } from "react-router"
import ScqApi from "../Http/ScqApi"
import { responseHandler } from "../Services/responseHandler"
import { withToastManager } from "react-toast-notifications"
import { toastOk } from "../Services/toastType"
import { WebSocketContext } from "../websocket/wsProvider"
import dispatchers from "../mapDispatch/mapDispathToProps"
import { useDispatch } from "react-redux"

const CadastrarTurno = (props) => {

    const context = useContext(WebSocketContext)
    const dispatch = useDispatch()
    const [nome, setNome] = useState('')
    const [inicio, setInicio] = useState()
    const [fim, setFim] = useState()
    const history = useHistory()
    const reducersFunctions = dispatchers()

    useEffect(() => {
        console.log(`inicio ${inicio} : fim ${fim}`)
    }, [inicio, fim])

    const salvarTurno = () => {
        const turno = { nome, inicio, fim }
        ScqApi.CriarTurno(turno).then(res => responseHandler(res, props, "Turno", toastOk, context, [reducersFunctions.loadTurnos]))
    }



    return (
        <>
            <Container style={{ marginTop: 20 }}>
                <h1>Cadastro de Turno</h1>
                <Form>
                    <Form.Row >
                        <Form.Group as={Col}>
                            <Form.Label>Nome</Form.Label>
                            <Form.Control value={nome} onChange={event => setNome(event.target.value)}></Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Horario de Inicio</Form.Label>
                            <Form.Control
                                type="time"
                                defaultValue={inicio}
                                onChange={event => setInicio(event.target.value)}>

                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Horario de Fim</Form.Label>
                            <Form.Control
                                type="time"
                                defaultValue={fim}
                                onChange={event => setFim(event.target.value)}>

                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group style={{ marginTop: 20 }}>
                        <Button style={{ margin: 5 }} variant="primary" type="reset" onClick={() => history.push("/EditarTurno")}>Editar</Button>
                        <Button style={{ margin: 5 }} variant="primary" type="reset" onClick={() => salvarTurno()}>Salvar</Button>
                    </Form.Group>
                </Form>
            </Container>
        </>
    )
}

export default withMenuBar(withToastManager(CadastrarTurno))