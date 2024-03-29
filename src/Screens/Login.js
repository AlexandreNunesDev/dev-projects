import { Button, Container, Form, ProgressBar } from "react-bootstrap"
import React from 'react'

import ScqApi from "../Http/ScqApi"
import { withToastManager } from "react-toast-notifications"

import { optionsLoad } from "../Services/storeService"
import { connect } from "react-redux"
import mapToStateProps from "../mapStateProps/mapStateToProps"
import dispatchers from "../mapDispatch/mapDispathToProps"


class Login extends React.Component {



    constructor(props) {


        super(props)
        this.state = {
            estado: true,
            usuario: null,
            senha: null,


        }
    }



    componentDidUpdate (prevProps) {
        if((this.props.global.isAuth) && (this.props.global.isAuth !== prevProps.global.isAuth)){
            optionsLoad(this.props,true)
            this.props.firstReload(false)
        }
    }

    authenticationHandler = (res) => {
        const { toastManager } = this.props

        if (res.token) {
            this.props.setLogIn(res)
            this.props.history.push("/Home")
        } else if (res.userName) {
            toastManager.add("Confirme sua conta para acessar", {
                appearance: 'warning', autoDismiss: true
            })
        } else {
            toastManager.add("Usuario Inexistente", {
                appearance: 'error', autoDismiss: true
            })
        }

    }

    render() {
        if (this.props.global.loading && this.props.global.loadedOptions.length < 7) {

            return (<Container>
                <ProgressBar now={this.props.global.loadedOptions.length} />
            </Container>)
        } else {
            return (
                <Container style={{ marginTop: 20 }}>
                    <h1>{!this.props.global.isAuth ? "Entrar" : "Sair"}</h1>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control type="email" placeholder="Entre com seu usuario" onChange={(event) => this.setState({ usuario: event.target.value })} />


                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control type="password" placeholder="entre com sua senha" onChange={(event) => this.setState({ senha: event.target.value })} />
                        </Form.Group>



                        {!this.props.global.isAuth ?

                            <Button style={{ margin: 5 }} variant="primary" onClick={() => {
                                const loginForm = { usuario: this.state.usuario, senha: this.state.senha }
                                ScqApi.Auth(loginForm).then(res => this.authenticationHandler(res)).catch(error => this.props.history.push("/ServidorError"))
                            }}>
                                Entrar
                            </Button>
                            :
                            <Button style={{ margin: 5 }} variant="primary" onClick={() => {
                                this.props.history.push("/Home");  this.props.setLogOut()
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


    }





}


export default withToastManager(connect(mapToStateProps.toProps, dispatchers)(Login))