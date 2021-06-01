import { Button, Container, Form } from "react-bootstrap"
import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom"
import ScqApi from "../Http/ScqApi"
import { withToastManager } from "react-toast-notifications"
import validator from 'validator';


const Registrar = (props) => {

    const [estado] = useState()
    const [mail, setMail] = useState()
    const [password, setPassword] = useState()
    const [passwordConfirm, setPasswordConfirm] = useState()
    const history = useHistory()
    const {toastManager} = props

    const resgistrationResolver = (data) => {
        if(data === "message"){
            toastManager.add( "Usuario ja cadastrado", {
                appearance: 'warning', autoDismiss: 1000, onDismiss : ()=> {
                    history.push("/Login")
                }
                    })
        } else {
            history.push("/confirmYourMail")
        }
    }

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
                                <Form.Control type="email" placeholder="Entre com seu mail" onChange={(event) => setMail(event.target.value)} />


                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control type="password" placeholder="entre com sua senha" onChange={(event) => setPassword(event.target.value)}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Confirme a senha</Form.Label>
                                <Form.Control type="password" placeholder="confirme sua senha" onChange={(event) => setPasswordConfirm(event.target.value)} />
                            </Form.Group>
                           
                            <Button style={{ margin: 5 }} variant="primary" onClick={() => {
                                const {toastManager} = props
                                let passwordOk = passwordConfirm===password
                                let mailOk = validator.isEmail(mail)
                                if(passwordOk && mailOk){
                                    const loginForm = { mail, password }
                                    ScqApi.Register(loginForm).then(res => {
                                        resgistrationResolver(res);
                                        })
                                } else {
                                    if(!mailOk){
                                        toastManager.add(`Mail não permitido`, {
                                            appearance: 'error', autoDismiss: true
                                          }) 
                                    }
                                    if(!passwordOk){
                                        toastManager.add(`Senhas não são iguais`, {
                                            appearance: 'error', autoDismiss: true
                                          }) 
                                    }
                                    if(!passwordOk && !mailOk){
                                        toastManager.add(`Mail não permitido`, {
                                            appearance: 'error', autoDismiss: true
                                          }) 
                                          toastManager.add(`Senhas não são iguais`, {
                                            appearance: 'error', autoDismiss: true
                                          }) 
                                    }
                                    
                                }
                               
                            }}>
                                Registrar
                             </Button>
                            
                        </Form>
                    </Container>
             
            

    )
}

export default withToastManager(Registrar)