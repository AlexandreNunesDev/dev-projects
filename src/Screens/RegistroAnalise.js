import React from 'react'
import {  Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GenericSelect from '../Components/GenericSelect';
import ScqApi from '../Http/ScqApi';
import CheckOutAnalise from '../Components/CheckoutAnalise';
import { withToastManager } from 'react-toast-notifications';
import TitulaForm from './TitulaForm';
import {capitalize,subId} from '../Services/stringUtils'
import { withMenuBar } from '../Hocs/withMenuBar';



const valueForm = (props) => {
    return (
        <Form.Group as={Col} >
            <Form.Control type="text" placeholder={"Valor"} onChange={(event) => props.onChange(event.target.value)} />
        </Form.Group>
    )
}



class RegistroDeAnalise extends React.Component {


    constructor(props) {
        super(props)
        

        this.state = {
            processos: [],
            etapas: [],
            parametros: [],
            processo: null,
            etapa: null,
            parametro: null,
            analista: '',
            analise: null,
            resultado: '',
            status: false,
            calcDisabled: false,
            analiseId: '',
            valorForm: null
        }
    }

    componentDidMount() {
        const analise = this.props.location.state && this.props.location.state[0]
        const ocpId = this.props.location.state && this.props.location.state[1]

        if (analise) {

            const processo = { id: analise.processoId, nome: analise.processoNome }
            const etapa = { id: analise.etapaId, nome: analise.etapaNome }
            const parametro = { id: analise.parametroId, nome: analise.parametroNome, menuType: analise.menuType, pMin: analise.pMin, pMax: analise.pMax, pMaxT : analise.pMaxT, pMinT : analise.pMinT, formula: analise.formula, unidade : analise.unidade }
            this.setState({
                processos: [processo],
                processo: processo,
                etapa: etapa,
                etapas: [etapa],
                parametro: parametro,
                parametros: [parametro],
                analista: analise.analista,
                analise: analise,
                ocpId : ocpId


            },() => this.onParametroSelect(analise.parametroId))

        } else {
            ScqApi.ListaProcessos().then(res => {

                this.setState({
                    processos: res

                })
            })
        }

    }

    onLinhaSelect = (linhaId) => {
        ScqApi.ListaEtapasByProcesso(linhaId).then(res => {
            this.setState({
                etapas: res
            })
        })
    }

    onEtapaSelect = (etapaId) => {
        ScqApi.ListaParametrosByEtapa(etapaId).then(res => {
            this.setState({
                parametros: res
            })
        })
    }


    onParametroSelect = (parametroId) => {
        this.state.parametros.forEach(parametro => {
            if (Number(parametro.id) === Number(parametroId)) {
                if(parametro.menuType==="Acao"){
                            this.setState({
                            parametro: parametro,
                            valorForm: valueForm({ onChange: this.setAnaliseStatus }),
    
                        })
                   
                } else {
                    if (parametro.unidade === "pH") {
                        this.setState({
                            parametro: parametro,
                            valorForm: valueForm({ onChange: this.setAnaliseStatus }),
    
                        })
                    } else {
                        this.setState({
                            parametro: parametro,
                            valorForm: <TitulaForm onCalculaResultado={this.setAnaliseStatus} formula={parametro.formula}></TitulaForm>,
    
                        })
                    }
                   
                }
            }
        });

    }

    nomeAnalistaListner = (event) => {
        this.setState({
            analista: event.target.value
        })
    }


    setAnaliseStatus = (resultado) => {
        if (resultado < this.state.parametro?.pMin || resultado > this.state.parametro?.pMax) {
            this.setState({
                resultado: resultado,
                status: 'fofe',
                calcDisabled: true
            })
        } else if ((resultado > this.state.parametro?.pMinT && resultado < this.state.parametro?.pMaxT)) {
            this.setState({
                resultado: resultado,
                status: 'deft',
                calcDisabled: true
            })
        } else {
            this.setState({
                resultado: resultado,
                status: 'foft',
                calcDisabled: true
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
            toastManager.add(`Analise processo ${response.id} criada`, {
                appearance: 'success', autoDismiss: true
              })
        }

       
       
        
    }



    salvarAnalise = () => {
        if (this.state.analise) {
            this.salvarReanalise()
        } else {
  
            const { analista, resultado, status } = this.state
            const analise = { id: null, parametroId: this.state.parametro.id, analista: analista, resultado: resultado, status: status, data: null }
           
                ScqApi.CriarAnalise(analise).then(res => {
                    this.responseHandler(res)
                })
               

        
        }







    }

    salvarReanalise = () => {

        const { id } = this.state.analise
        const analise = { id: id, analista: this.state.analista, resultado: this.state.resultado, status: this.state.status, parametroId: this.state.parametro.id, ocpId : this.state.ocpId }
       
            ScqApi.EditarAnalise(analise).then(() => this.props.history.push("/OrdensDeCorrecao"))
            
       
           

        }





    

    gerarOcpReanalise = (history) => {
        const { id } = this.state.analise
        const analise = { id: id, analista: this.state.analista, resultado: this.state.resultado, status: this.state.status, parametroId: this.state.parametro.id, ocpId : this.state.ocpId }
        history.push('/CadastroOcp'+this.state.parametro.menuType , analise)
    
    }


    gerarOcp = (history) => {
        const { analista, resultado, status } = this.state
            const analise = { id: null, parametroId: this.state.parametro.id, analista: analista, resultado: resultado, status: status, data: null }
        history.push('/CadastroOcp'+this.state.parametro.menuType , analise)
    }

    render() {
        return (
            <>
    

                <Container style={{ marginTop: 20 }}>
                    <h1>Registro de Analise</h1>
                    <Form>
                        <Form.Row>
                            <Col>
                                <GenericSelect displayType={"nome"} returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={this.state.processos} onChange={this.onLinhaSelect} selection={this.state.processo?.id}></GenericSelect>
                            </Col>
                            <Col>
                                <GenericSelect displayType={"nome"} returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} ops={this.state.etapas} onChange={this.onEtapaSelect} selection={this.state.etapa?.id} ></GenericSelect>
                            </Col>
                            <Col>
                                <GenericSelect displayType={"nome"} returnType={"id"} title={"Parametro"} default={"Escolha um Parametro"} ops={this.state.parametros} onChange={(parametroId) => this.onParametroSelect(parametroId)} selection={this.state.parametro?.id} ></GenericSelect>
                            </Col>
                        </Form.Row>


                        <Form.Row>
                            <Col>
                                <Form.Group controlId="nomaAnaliseForm">

                                    <Form.Control type="text" placeholder="Nome do Analista" value={this.state.analista} onChange={this.nomeAnalistaListner} />
                                </Form.Group>
                            </Col>
                            <Col>
                                {this.state?.valorForm}
                            </Col>
                        </Form.Row>


                        <Form.Group style={{ marginTop: 20 }}>
                            <CheckOutAnalise valid={!this.state.calcDisabled} resultado={this.state.resultado} parametro={this.state.parametro} status={this.state.status} salvarAnalise={this.salvarAnalise} salvarReanalise={this.salvarReanalise} gerarOcpReanalise={this.gerarOcpReanalise} gerarOcp={this.gerarOcp} analiseId={this.state.analise?.id}></CheckOutAnalise>
                        </Form.Group>
                    </Form>

                </Container>


            </>
        )

    }

}

export default withToastManager(withMenuBar(RegistroDeAnalise))