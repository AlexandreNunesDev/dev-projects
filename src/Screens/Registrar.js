import { Button, Container, Form } from "react-bootstrap"
import React, { useEffect, useState } from 'react'

import { useHistory } from "react-router-dom"
import ScqApi from "../Http/ScqApi"

import { withToastManager } from "react-toast-notifications"



const Registrar = (props) => {

    const [estado, setEstado] = useState()
    const [mail, setMail] = useState()
    const [password, setPassword] = useState()
    const [passwordConfirm, setPasswordConfirm] = useState()
    const history = useHistory()

    

    useEffect(() => {
        if (estado) {
            estado.style.backgroundColor = "GREY"
        }


    }, [estado])

    return (

           
                    <Container style={{ marginTop: 20 }}>
                        <h1>Registrar</h1>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control type="email" placeholder="Entre com seu usuario" onChange={(event) => setMail(event.target.value)} />


                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control type="password" placeholder="entre com sua senha" onChange={(event) => setPassword(event.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Confirme a senha</Form.Label>
                                <Form.Control type="password" placeholder="confirme sua senha" onChange={(event) => setPasswordConfirm(event.target.value)} />
                            </Form.Group>
                           
                            <Button style={{ margin: 5 }} variant="primary" onClick={() => {
                                const {toastManager} = props
                                if(passwordConfirm===password){
                                    const loginForm = { mail, password }
                                    ScqApi.Register(loginForm).then(res => history.push(res))
                                } else {
                                    toastManager.add(`Senhas não coincidem`, {
                                        appearance: 'error', autoDismiss: true
                                      }) 
                                }
                               
                            }}>
                                Registrar
                             </Button>
                            
                        </Form>
                    </Container>
             
            

    )
}

export default withToastManager(Registrar)