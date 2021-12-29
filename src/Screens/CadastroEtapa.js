import React from 'react'
import { Button, Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScqApi from '../Http/ScqApi';
import GenericSelect from '../Components/GenericSelect';
import { withToastManager } from 'react-toast-notifications';
import MontagemComposition from '../Components/MontagemComposition';
import { responseHandler } from '../Services/responseHandler';
import { withMenuBar } from '../Hocs/withMenuBar';
import { connect } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { toastOk } from '../Services/toastType';
import { WebSocketContext } from '../websocket/wsProvider';


class CadastroEtapa extends React.Component {
    static contextType = WebSocketContext
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



        const { processoId, nome, posicao } = this.state
        const etapa = { processoId: processoId, nome, posicao, volume: this.state.volume }
        const { toastManager } = this.props;
        ScqApi.CriarEtapa(etapa,[this.props.loadEtapas]).then(res => {
            responseHandler(res,toastManager ,"Etapa",toastOk)
            const composes = this.state.montagemComposes.map((montagemCompose) => { return { quantidade: montagemCompose.quantidade, mpId: montagemCompose.mp.id, etapaId: res.id } })
            ScqApi.CriarMontagem(composes)
          
        })

      


    }


    



    cleanState = (deleteMessage) => {
        const { toastManager } = this.props;
        this.setState({
            isNotEditable: true,
            etapa: {},
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

    removeMontagemCompose = (ind) => {
        this.setState({
            montagemComposes: this.state.montagemComposes.filter((mc, index) => {
                return index !== ind
            })
        })
    }

    enterEditMode = () => {
        this.props.history.push("/EditarEtapa")
    }

    render() {
        return (
            <>
                <Container style={{ marginTop: 20 }}>
                    <h1>Cadastro de Etapa</h1>
                    <Form>

                        <Form.Row>
                            <Col>
                                <GenericSelect title={"Processo"} returnType={"id"} default={"Escolha um Processo"} onChange={this.selectedLinhaListner} ops={this.props.processos} isNotEditable={this.state.isNotEditable} selection={this.state.etapa.processoId}></GenericSelect>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Group controlId="nomeEtapaForm">
                                    <Form.Label>Nome: </Form.Label>
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
                                </Form.Row>
                                <Form.Row>
                                <Col>
                                    <Form.Label>Volume (Litros): </Form.Label>
                                    <Form.Control type="number" value={this.state.volume} onChange={(event) => this.setState({ volume: event.target.value })}></Form.Control>
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <MontagemComposition montagemComposes={this.state.montagemComposes} removeMontagemCompose={this.removeMontagemCompose} setMontagemComposes={(montagemCompose) => this.setMontagemComposes(montagemCompose)} ops={this.props.materiasPrima}></MontagemComposition>
                        <Form.Row>
         
                      
                            <Button style={{ margin: 2 }} variant="primary" onClick={this.enterEditMode}>Editar</Button>
              
          
                            <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={this.submitForm}>Salvar</Button>
                 
           
                        </Form.Row>
                    </Form>
                </Container>

            </>
        )

    }

}

export default withToastManager(withMenuBar(connect(mapToStateProps.toProps,dispatchers)(CadastroEtapa)))