import { Button, Container, Form, ProgressBar } from "react-bootstrap"
import React, { useEffect, useState } from 'react'

import ScqApi from "../Http/ScqApi"
import { withToastManager } from "react-toast-notifications"

import { optionsLoad } from "../Services/storeService"
import { connect, useDispatch, useSelector } from "react-redux"
import mapToStateProps from "../mapStateProps/mapStateToProps"
import dispatchers from "../mapDispatch/mapDispathToProps"
import { logIn, logOut } from "../Reducers/globalConfigReducer"
import { useHistory } from "react-router-dom"
import { useToasts } from "react-toast-notifications/dist/ToastProvider"


const Login = (props) => {


    const global = useSelector(state => state.global)
    const dispatch = useDispatch()
    const [usuario, setUsuario] = useState('')
    const [senha, setSenha] = useState('')
    const history = useHistory()
    const toastManager = useToasts()

    useEffect(() => {
        if ((global.isAuth)) {
            optionsLoad(props, true)
        }
    }, [global.isAuth])

    const authenticationHandler = (res) => {

        if (res.token) {
            dispatch(logIn(res))
            history.push("/Home")
        } else if (res.userName) {
            toastManager.addToast("Confirme sua conta para acessar", {
                appearance: 'warning', autoDismiss: true
            })
        } else {
            toastManager.addToast("Usuario Inexistente", {
                appearance: 'error', autoDismiss: true
            })
        }

    }
        return (
            <Container style={{ marginTop: 20 }}>
                <h1>{!global.isAuth ? "Entrar" : "Sair"}</h1>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Usuario</Form.Label>
                        <Form.Control type="email" placeholder="Entre com seu usuario" onChange={(event) => setUsuario(event.target.value)} />


                    </Form.Group>

                    <Form.Group id="password">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type="password" placeholder="entre com sua senha" onChange={(event) => setSenha(event.target.value)} />
                    </Form.Group>



                    {!global.isAuth ?

                        <Button style={{ margin: 5 }} variant="primary" onClick={() => {
                            const loginForm = { usuario: usuario, senha: senha }
                            ScqApi.Auth(loginForm).then(res => authenticationHandler(res)).catch(error => history.push("/ServidorError"))
                        }}>
                            Entrar
                        </Button>
                        :
                        <Button style={{ margin: 5 }} variant="primary" onClick={() => {
                            history.push("/Home");  dispatch(logOut());
                            dispatch({type : "eraseStore"})
                        }}>
                            Sair
                        </Button>
                    }
                    <Form.Group controlId="formBasicCheckbox">

                    </Form.Group>
                </Form>
            </Container>
        )
    }




export default withToastManager(connect(mapToStateProps.toProps, dispatchers)(Login))