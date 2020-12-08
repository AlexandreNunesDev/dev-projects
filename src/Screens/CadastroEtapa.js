import React from 'react'
import { Button, Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from './MenuBar';
import ScqApi from '../Http/ScqApi';
import GenericSelect from '../Components/GenericSelect';
import {capitalize} from '../Services/stringUtils'
import { withToastManager } from 'react-toast-notifications';
import MontagemComposition from '../Components/MontagemComposition';
import { getToken } from '../Services/auth';


class CadastroEtapa extends React.Component {

    constructor(props) {

        super(props)
        this.volumeRef = React.createRef()
        this.state = {
         
            processos: [],
            processoId: '',
            nome: '',
            posicao: '',
            etapa: {},
            volume: '',
            montagemComposes: []
        }
    }



    componentDidMount() {
        console.log(getToken())
        ScqApi.ListaProcessos().then(res => {
            this.setState({
                processos: res

            })
        })
        ScqApi.ListaMateriaPrimas().then(res => {
            this.setState({
                mps: res
            })
        })
    }

    responseHandler = (response) => {
        const { toastManager } = this.props;
        if(response.error){
            response.data.forEach(erro => {
                toastManager.add(`${capitalize(erro.field)} : ${erro.error}`, {
                    appearance: 'error', autoDismiss: true
                  })});
        } else {
            toastManager.add(`Etapa ${response.nome} criada`, {
                appearance: 'success', autoDismiss: true
              })
        }
    }
    selectedLinhaListner = (processoId) => {
        this.setState({ processoId: processoId })
    }

    handleChangeEtapaNome = (event) => {
        this.setState({ nome: event.target.value });
    }

    handleChangeEtapaPos = (event) => {
        this.setState({ posicao: event.target.value });
    }

    submitForm = () => {

        const { toastManager } = this.props

            const { processoId, nome, posicao } = this.state
            const etapa = { processoId: processoId, nome, posicao, volume: this.state.volume }
       
            ScqApi.CriarEtapa(etapa).then(res => {
                this.responseHandler(res)
                const composes = this.state.montagemComposes.map((montagemCompose) => { return { quantidade: montagemCompose.quantidade, mpId: montagemCompose.mp.id, etapaId: res.id } })
                ScqApi.CriarMontagem(composes).then(res => this.cleanState())
            })
         
           

  
    }


    notifyEtapaCriation = (toastManager,newEtapa) => {
        toastManager.add(`Etapa ${newEtapa.nome} criada com sucesso`, {
            appearance: 'success', autoDismiss: true
        })
    }



   
    cleanState = (deleteMessage) => {
        const { toastManager } = this.props;
        this.setState({
            isNotEditable: true,
            etapa: {},
            processo: {},
            nome: '',
            posicao: '',
            volume: null,
            montagemComposes: []
        }, () => console.log(this.state))
        if (deleteMessage != null) {
            toastManager.add(deleteMessage, {
                appearance: 'warning', autoDismiss: true
            })
        }
    }


    setMontagemComposes = (montagemCompose) => {
        this.setState({
            montagemComposes: this.state.montagemComposes.concat(montagemCompose)
        })
    }

    enterEditMode = () => {
        this.props.history.push("/EditarEtapa")
    }

    render() {
        return (
            <>

                <header>
                    <MenuBar></MenuBar>
                </header>

                <Container style={{ marginTop: 20 }}>
                    <h1>Cadastro de Etapa</h1>
                    <Form>
                        
                        <Form.Row>
                            <Col>
                                <GenericSelect title={"Processo"} returnType={"id"}  default={"Escolha um Processo"} onChange={this.selectedLinhaListner} ops={this.state.processos} isNotEditable={this.state.isNotEditable} selection={this.state.etapa.processoId}></GenericSelect>
                            </Col>
                            <Col>
                                <Form.Group controlId="nomeEtapaForm">
                                    <Form.Label>Nome Etapa: </Form.Label>
                                    <Form.Control type="text" placeholder="Nome da Etapa" value={this.state.nome} onChange={this.handleChangeEtapaNome} />
                                </Form.Group>
                            </Col>
                        </Form.Row>


                        <Form.Group controlId="posicaoEtapaForm">
                            <Form.Row>
                                <Col>
                                    <Form.Label>Posição: </Form.Label>
                                    <Form.Control type="number" min="0" placeholder="Numero do Tanque" value={this.state.posicao} onChange={this.handleChangeEtapaPos} />
                                </Col>
                                <Col>
                                    <Form.Label>Volume (Litros): </Form.Label>
                                    <Form.Control type="number" value={this.state.volume} onChange={(event) => this.setState({ volume: event.target.value })}></Form.Control>
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <MontagemComposition montagemComposes={this.state.montagemComposes} setMontagemComposes={(montagemCompose) => this.setMontagemComposes(montagemCompose)} ops={this.state.mps}></MontagemComposition>

                        <Form.Group>
                            <Button style={{ margin: 2 }} variant="primary" onClick={this.enterEditMode}>Editar</Button>
                            <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={this.submitForm}>Salvar</Button>
                        </Form.Group>
                    </Form>
                </Container>

            </>
        )

    }

}

export default withToastManager(CadastroEtapa)