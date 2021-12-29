import React, { Fragment, Component } from 'react'
import { Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScqApi, { callWithRedux } from '../Http/ScqApi';
import { withToastManager } from 'react-toast-notifications'
import { responseHandler } from '../Services/responseHandler';
import { withMenuBar } from '../Hocs/withMenuBar';

import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { connect } from 'react-redux';
import { WebSocketContext } from '../websocket/wsProvider';
import { toastOk } from '../Services/toastType';




class CadastroProcesso extends Component {
    static contextType = WebSocketContext
    constructor(props) {


        super(props)
        this.state = {
            isNotEditable: true,
            processo: null,
            nome: '',

        }
    }



    cleanState = (deleteMessage) => {
        const { toastManager } = this.props;
        this.setState({
            isNotEditable: true,
            linha: null,
            nome: '',
        }, () => console.log(this.state))
        if (deleteMessage != null) {
            toastManager.add(deleteMessage, {
                appearance: 'warning', autoDismiss: true
            })
        }
    }


    enterEditMode = () => {
        this.props.history.push("/EditarProcesso")
    }

    handleChange = (event) => {
        this.setState({ nome: event.target.value })
    }


    submitForm = () => {
        const { toastManager } = this.props;

        const processo = { id: null, nome: this.state.nome }

        ScqApi.CriarProcesso(processo,[this.props.loadProcessos]).then(response =>{this.props.addProcesso(response); responseHandler(response, toastManager,"Processo",toastOk)})
        

    }






    render() {
        return (
            <Fragment>

                <Container style={{ marginTop: 20 }}>
                    <h1>Cadastro de Processo</h1>

                    <Form>
                        <Form.Group controlId="processoLinhaNome">
                            <Form.Label>Nome: </Form.Label>
                            <Form.Control value={this.state.nome} type="text" placeholder="Entre o nome do Processo" onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group>

                            <Button style={{ margin: 2 }} variant="primary" onClick={this.enterEditMode}>Editar</Button>
                            <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={this.submitForm}>Salvar</Button>
                        </Form.Group>
                    </Form>
                </Container>

            </Fragment>
        )

    }

}

export default withToastManager(withMenuBar(connect(mapToStateProps.toProps,dispatchers)(CadastroProcesso)))