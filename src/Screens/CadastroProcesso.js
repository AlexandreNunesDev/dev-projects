import React, { Fragment, Component } from 'react'
import { Button, Form, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import MenuBar from './MenuBar';
import ScqApi from '../Http/ScqApi';
import {withToastManager} from 'react-toast-notifications'
import {capitalize,subId} from '../Services/stringUtils'



class CadastroProcesso extends Component {

    constructor(props) {
        
          
        super(props)
        this.state =  {
            isNotEditable : true,
            processo : null,
            nome : '',
            
        }
    }

    

    cleanState = (deleteMessage) => {
        const { toastManager } = this.props;
        this.setState({
            isNotEditable: true,
            linha: null,
            nome: '',
        } ,() => console.log(this.state))    
        if(deleteMessage != null) {
            toastManager.add(deleteMessage, {
                appearance: 'warning', autoDismiss: true
              })
        }
    }

    responseHandler = (response) => {
        const { toastManager } = this.props;
        if(response.error){
            response.data.forEach(erro => {
                toastManager.add(`${subId(capitalize(erro.field))} : ${erro.error}`, {
                    appearance: 'error', autoDismiss: true
                  })});
        } else {
            toastManager.add(`Processo ${response.nome} criado`, {
                appearance: 'success', autoDismiss: true
              })
        }

       
       
        
    }

    enterEditMode = () => {
        this.props.history.push("/EditarProcesso")
    }

    handleChange = (event) => {
        this.setState({nome : event.target.value})  
    }


    submitForm = () => {


            const processo = { id: null, nome: this.state.nome }
            ScqApi.CriarProcesso(processo).then(response => this.responseHandler(response) )
           
            this.cleanState()
        

        

    }
       
    
  
   
    

    render() {
        return (
            <Fragment>
                
                <header>
                    <MenuBar></MenuBar>
                </header>
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

export default  withToastManager(CadastroProcesso)