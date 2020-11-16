import { Button, Container, Form } from "react-bootstrap"
import React, { useEffect, useState } from 'react'

import { Link, useHistory } from "react-router-dom"
import ScqApi from "../Http/ScqApi"
import { isAuthenticated, login, logout } from "../Services/auth"
import { withToastManager } from "react-toast-notifications"



const Login = (props) => {

    const [estado] = useState()
    const [mail, setMail] = useState()
    const [password, setPassword] = useState()
    
    const history = useHistory()

  

    useEffect(() => {
        if (estado) {
            estado.style.backgroundColor = "GREY"
        }


    }, [estado])

    const authenticationHandler = (res) => {
        const {toastManager} = props
        if(res.token){
            login(res)
            history.push("/Home")
        } else if(res.userName) {
            toastManager.add( "Confirme sua conta para acessar", {
                appearance: 'warning', autoDismiss: true
        })
        } else {
            toastManager.add( "Usuario Inexistente", {
                appearance: 'error', autoDismiss: true
        })
        }
    }
    

    return (

           
                    <Container style={{ marginTop: 20 }}>
                        <h1>{!isAuthenticated() ? "Entrar" : "Sair"}</h1>
                        <Form>
                            <Form.Group  controlId="formBasicEmail">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Control type="email" placeholder="Entre com seu usuario" onChange={(event) => setMail(event.target.value)} />


                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control type="password" placeholder="entre com sua senha" onChange={(event) => setPassword(event.target.value)} />
                            </Form.Group>
                           
                         
                            <Button style={{ margin: 5 }} variant="primary" onClick={() => {
                                history.push("/Registrar")
                               
                            }}>
                                Registrar
                             </Button>
                             {!isAuthenticated() ? 

                            <Button style={{ margin: 5 }} variant="primary" onClick={() => {
                                const loginForm = { mail, password }
                                ScqApi.Auth(loginForm).then(res =>  authenticationHandler(res))
                            }}>
                                Entrar
                             </Button>
                            :
                            <Button style={{ margin: 5 }} variant="primary" onClick={() => {
                                logout(); history.push("/Home")
                            }}>
                                Sair
                             </Button>
                            }
                            <Form.Group controlId="formBasicCheckbox">
                                <Link>esqueceu a senha?</Link>
                            </Form.Group>
                        </Form>
                    </Container>
             
            

    )
}

export default withToastManager(Login)