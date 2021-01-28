import React, { Fragment, Component } from 'react'
import { Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScqApi from '../Http/ScqApi';
import { withToastManager } from 'react-toast-notifications'
import { responseHandler } from '../Services/responseHandler';
import { withMenuBar } from '../Hocs/withMenuBar';




class CadastroProcesso extends Component {

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


        const processo = { id: null, nome: this.state.nome }
        ScqApi.CriarProcesso(processo).then(response => responseHandler(response, this.props,"Processo"))

        this.cleanState()




    }






    render() {
        return (
            <Fragment>

                <Container style={{ marginTop: 20 }}>
                    <h1>Cadastro de Processo</h1>

                    <Form onSubmit={this.handleSubmit}>
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

export default withToastManager(withMenuBar(CadastroProcesso))