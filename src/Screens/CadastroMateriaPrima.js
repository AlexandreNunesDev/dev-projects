import React  from 'react'
import { Button, Form , Container, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScqApi from '../Http/ScqApi';
import NumberFormat from 'react-number-format';
import { withToastManager } from 'react-toast-notifications';
import UnidadeSelect from '../Components/UnidadeSelect';

import { withMenuBar } from '../Hocs/withMenuBar';
import { responseHandler } from '../Services/responseHandler';
import { WebSocketContext } from '../websocket/wsProvider';
import { toastOk } from '../Services/toastType';
import { connect } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';

class CadastroMateriaPrima extends React.Component {
    static contextType = WebSocketContext
    constructor(props){
        super(props)
    
        this.state = {
            materiaPrima : {},
            isNotEditable: true,
            nome : '',
            fornecedor : '',
            fatorTitulometrico : '',
            preco : '',
            unidade : ''
        }
    }

    showNotificationsReponse = (message) => {
        const { toastManager } = this.props;
        toastManager.add(message, {
            appearance: 'warning', autoDismiss: true
        })
      }

    componentDidMount () {
        ScqApi.ListaEtapas().then(res => this.setState({
            etapas : res
        }) )
        
    }


    salvarMateriaPrima = () => {
        const { toastManager } = this.props;
        let {nome,fornecedor,fatorTitulometrico, preco, unidade } = this.state
        if(fatorTitulometrico===''){
            fatorTitulometrico=1
        }
        const materiaPrima = {nome,fornecedor,fatorTitulometrico,preco,unidade}
            ScqApi.CriarMateriaPrima(materiaPrima,[this.props.loadMateriasPrima]).then(res => responseHandler(res,toastManager,"MateriaPrima",toastOk))
            this.cleanState()
            
      
       


    }

    nomeController = (event) => {
        this.setState({
            nome : event.target.value
        })
    }

    fornecedorController = (event) => {
        this.setState({
            fornecedor : event.target.value
        })
    }

    fatorController = (event) => {
        this.setState({
            fatorTitulometrico : event.target.value
        })
    }

    editSelection = (parametro) => {
        
        this.setState({parametro : parametro , nome : parametro.nome,pMax : parametro.pMax, pMin : parametro.pMin , formula : parametro.formula, titula : false, etapaId : parametro.etapa.id},()=>console.log(this.state.parametro))
        this.loadEtapasFromLinha(parametro.linha.id)
    }

   

    onFormulaBuilderClose = (formula) => {
        this.setState({
            formula : formula
        })
    }

    editSelection = (materiaPrima) => {
        this.setState({materiaPrima : materiaPrima , nome : materiaPrima.nome,fornecedor : materiaPrima.fornecedor, fatorTitulometrico : materiaPrima.fatorTitulometrico},()=>console.log(this.state.parametro))
    }

    enterEditMode = () => {
        this.props.history.push("/EditarMateriaPrima")
    }

    precoController = (event) => {

        let valor = String(event.target.value)

        this.setState({
            preco : valor
        },() =>console.log( this.state.preco))
    }

  

    cleanState = (deleteMessage) => {
        const { toastManager } = this.props;
        this.setState({
            isNotEditable: true,
            nome : '',
            fornecedor : '',
            fatorTitulometrico : '',
            preco : '',
            unidade : ''
        } ,() => console.log(this.state))    
        if(deleteMessage != null) {
            toastManager.add(deleteMessage, {
                appearance: 'warning', autoDismiss: true
              })
        }
    }


    
   

render() {
    return (
    <>
    <Container style = {{marginTop : 20}}>
    <h1>Cadastro de Matéria Prima</h1>
        <Form>
       
            <Form.Row>
            <Form.Group as={Col} controlId="nomeMateriaPrimaForm">
                <Form.Label>Nome Matéria Prima: </Form.Label>
                <Form.Control type="text" placeholder="Nome da Matéria Prima" value={this.state.nome} onChange={this.nomeController}/>
            </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="fornecedorMateriaPrimaForm">
                <Form.Label>Fornecedor: </Form.Label>
                <Form.Control type="text" placeholder="Nome do Fornecedor" value={this.state.fornecedor} onChange={this.fornecedorController} />
            </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col} controlId="fatorMateriaPrimaForm">
                <Form.Label>Preco: </Form.Label>
                <NumberFormat placeholder={"R$ 0.00"} customInput={Form.Control} allowedDecimalSeparators={["."]}  value={this.state.preco} onChange={this.precoController}/>
            </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col} controlId="fatorMateriaPrimaForm">
                <Form.Label>Fator Titulométrico: </Form.Label>
                <NumberFormat placeholder={"0.00"} customInput={Form.Control} allowedDecimalSeparators={["."]}   value={this.state.fatorTitulometrico} onChange={this.fatorController}/>
            </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col} controlId="fatorMateriaPrimaForm">
                <UnidadeSelect default={"Escolha uma Unidade"} type={"adicao"} title={"Unidade Mp"} onChange={(unidade) => this.setState({unidade : unidade}) }></UnidadeSelect>
            </Form.Group>
            </Form.Row>
            

            <Form.Group>
            <Form.Group>
                <Button style = {{margin:2}} variant="primary" type="reset" onClick={this.enterEditMode} >Editar</Button>
                <Button style = {{margin:2}} variant="primary" type="reset" onClick={this.salvarMateriaPrima}>Salvar</Button>
            </Form.Group>   
            </Form.Group>
        </Form>
    </Container>
    
    </>
        )

    }

}

export default withToastManager(withMenuBar(connect(mapToStateProps.toProps,dispatchers)(CadastroMateriaPrima)))