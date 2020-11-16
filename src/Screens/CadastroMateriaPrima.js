import React  from 'react'
import { Button, Form , Container, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from './MenuBar';
import ScqApi from '../Http/ScqApi';

import { withToastManager } from 'react-toast-notifications';
import UnidadeSelect from '../Components/UnidadeSelect';

class CadastroMateriaPrima extends React.Component {

    constructor(props){
        super(props)
        this.precoText = React.createRef()
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
        const {toastManager} = this.props
        let {nome,fornecedor,fatorTitulometrico, preco, unidade } = this.state
        if(fatorTitulometrico===''){
            fatorTitulometrico=1
        }
        const materiaPrima = {nome,fornecedor,fatorTitulometrico,preco,unidade}
            ScqApi.CriarMateriaPrima(materiaPrima)
            this.cleanState()
            toastManager.add(`Materia Prima ${materiaPrima.nome} criada com sucesso`, {
                appearance: 'success', autoDismiss: true
              })
      
       


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
        this.setState({
            preco : event.target.value
        })
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
    <header>
        <MenuBar></MenuBar>
    </header>

    <Container style = {{marginTop : 20}}>
    <h1>Cadastro de Matéria Prima</h1>
        <Form>
       
            <Form.Row>
            <Form.Group as={Col} controlId="nomeMateriaPrimaForm">
                <Form.Label>Nome Matéria Prima: </Form.Label>
                <Form.Control type="text" placeholder="Nome da Matéria Prima" value={this.state.nome} onChange={this.nomeController}/>
            </Form.Group>
            
            <Form.Group as={Col} controlId="fornecedorMateriaPrimaForm">
                <Form.Label>Fornecedor: </Form.Label>
                <Form.Control type="text" placeholder="Nome do Fornecedor" value={this.state.fornecedor} onChange={this.fornecedorController} />
            </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="fatorMateriaPrimaForm">
                <Form.Label>Preco: </Form.Label>
                <Form.Control type="text" placeholder={"R$ 0,00"} ref={this.precoText} value={this.state.preco} onChange={this.precoController}/>
            </Form.Group>
            <Form.Group as={Col} controlId="fatorMateriaPrimaForm">
                <Form.Label>Fator Titulométrico: </Form.Label>
                <Form.Control type="text" placeholder="Fator Titulometrico" value={this.state.fatorTitulometrico} onChange={this.fatorController} />
            </Form.Group>
            <Form.Group as={Col} controlId="fatorMateriaPrimaForm">
                <UnidadeSelect default={"Escolha uma Unidade"} type={"adicao"} title={"Unidade Mp"} onChange={(unidade) => this.setState({unidade : unidade}) }></UnidadeSelect>
            </Form.Group>
            </Form.Row>
            
            
            <Form.Group>
                <Button style = {{margin:2}} variant="primary" type="reset" onClick={this.enterEditMode} >Editar</Button>
                <Button style = {{margin:2}} variant="primary" type="reset" onClick={this.salvarMateriaPrima}>Salvar</Button>
            </Form.Group>   
        </Form>
    </Container>
    
    </>
        )

    }

}

export default withToastManager(CadastroMateriaPrima)