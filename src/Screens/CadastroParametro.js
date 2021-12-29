import React from 'react'
import { Button, Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GenericSelect from '../Components/GenericSelect';
import SelectEditable from '../Components/SelectEditable'
import { responseHandler } from '../Services/responseHandler'
import ScqApi from '../Http/ScqApi';
import FormulaBuilder from '../Components/FormulaBuilder';
import { withToastManager } from 'react-toast-notifications';
import UnidadeSelect from '../Components/UnidadeSelect';
import { withMenuBar } from '../Hocs/withMenuBar';

import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { connect } from 'react-redux';
import { WebSocketContext } from '../websocket/wsProvider';
import { toastOk } from '../Services/toastType';

class CadastroParametro extends React.Component {
    static contextType = WebSocketContext
    constructor(props) {
        super(props)
        this.state = {
            parametro: {},
            isNotEditable: true,
            processos: [],
            etapas: [],
            processoId: '',
            etapaId: '',
            nome: '',
            pMax: '',
            pMin: '',
            pMaxT: '',
            pMinT: '',
            titula: true,
            formula: '',
            unidade: '',
            escalaTempo: '',
            frequenciaAnalise: '',
            showChart: true,
            controlado: true

        }

        this.titulaConfirm = this.titulaConfirm.bind(this)
    }


    componentDidMount = () => {
        this.setState({
            processos: this.props.processos
        })

    }





    selectedLinhaListner = (linhaId) => {
        this.setState({ linhaId: linhaId }, function () {

            this.loadEtapasFromLinha(linhaId)

        })
    }

    selectedEtapaListner = (etapaId) => {
        this.setState({ etapaId: etapaId }, function () {

        })
    }

    nomeParamTextController = (event) => {
        this.setState({ nome: event.target.value })
    }



    escalaTempoController = (escala) => {
        this.setState({ escalaTempo: escala }, () => console.log(this.state.nome))
    }
    frequenciaAnalise = (event) => {
        this.setState({ frequenciaAnalise: event.target.value })
    }

    loadEtapasFromLinha = (linhaId) => {

        this.setState({ etapas: this.props.etapas.filter(etapa => etapa.processoId === Number(linhaId)) })

    }

    titulaConfirm = () => {
        this.setState(prevState => ({
            titula: !prevState.titula,
    
        }));
    }

    controladoCheck = () => {
        this.setState(prevState => ({
            controlado: !prevState.controlado,
            escalaTempo:  "Dia",
            frequenciaAnalise: 0,

        }));
    }

    setShoweChart = () => {
        this.setState(prevState => ({
            showChart: !prevState.showChart
        }));
    }




    editSelection = (parametro) => {

        this.setState({ parametro: parametro, nome: parametro.nome, pMax: parametro.pMax, pMin: parametro.pMin, formula: parametro.formula, titula: false, etapaId: parametro.etapa.id }, () => console.log(this.state.parametro))
        this.loadEtapasFromLinha(parametro.linha.id)
    }





    salvarParametro = () => {
        const { toastManager } = this.props;
        const { etapaId, nome, pMax, pMin, formula, unidade, pMaxT, pMinT, frequenciaAnalise, escalaTempo } = this.state
        const parametro = { etapaId: etapaId, nome, pMax, pMin, formula: formula || "[V]", unidade, pMaxT, pMinT, escala: escalaTempo, frequencia: frequenciaAnalise, showChart: this.state.showChart,isHabilitado : this.state.controlado }

        if (this.state.isNotEditable) {
            ScqApi.CriarParametro(parametro,[this.props.loadParametros, this.props.loadEtapas]).then(res => { responseHandler(res, toastManager, "Parametro", toastOk) })

        }
    }

    onFormulaBuilderClose = (formula) => {
        this.setState({
            formula: formula
        })
    }

    enterEditMode = () => {
        let history = this.props.history
        history.push("/EditarParametro")
    }

    cleanState = (deleteMessage) => {
        const { toastManager } = this.props;
        this.setState({
            parametro: {},
            isNotEditable: true,
            processos: [],
            etapas: [],
            processoId: '',
            etapaId: '',
            nome: '',
            pMax: '',
            pMin: '',
            pMaxT: '',
            pMinT: '',
            titula: true,
            formula: '',
            unidade: '',
            escalaTempo: '',
            frequenciaAnalise: '',
        }, () => console.log(this.state))
        if (deleteMessage != null) {
            toastManager.add(deleteMessage, {
                appearance: 'warning', autoDismiss: true
            })
        }
    }


    render() {
        return (
            <>
                <Container style={{ marginTop: 20 }}>
                    <h1>Cadastro de Parametro</h1>
                    <Form onSubmit={this.onSubmitHandler}>
                        <Form.Row>
                            <Col>
                                <GenericSelect title={"Processo"} returnType={"id"} default={"Escolha um Processo"} ops={this.state.processos} onChange={this.selectedLinhaListner} selection={this.state.parametro?.linha?.id}></GenericSelect>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <GenericSelect title={"Etapa"} returnType={"id"} default={"Escolha uma Etapa"} ops={this.state.etapas} onChange={this.selectedEtapaListner} selection={this.state.parametro?.etapa?.id}></GenericSelect>
                            </Col>
                        </Form.Row>



                        <Form.Row>

                            <Form.Group as={Col} controlId="nomeParametroForm">
                                <Form.Label>Nome do Parametro: </Form.Label>

                                <SelectEditable getValue={(nome) => nome && this.setState({ nome: nome }, () => { console.log(this.state.nome) })} default={"selecione um nome"} ops={["Concentracao", "pH", "Temperatura", "Condutividade", "Corrente", "Tensão",]}></SelectEditable>
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Col >
                                <UnidadeSelect title={"Escolha um unidade"} type={"parametros"} default={"Escolha um unidade"} onChange={unidade => { this.setState({ unidade: unidade }); console.log(unidade) }}></UnidadeSelect>
                            </Col>
                        </Form.Row>
                        <h3>Controle</h3>
                        <Form.Check type="checkbox" id="checkControlado">
                                <Form.Check.Input type="checkbox" checked={this.state.controlado} onChange={this.controladoCheck} />
                                <Form.Check.Label>Controlado ?</Form.Check.Label>
                            </Form.Check>
                        {this.state.controlado && <>
                            
                            
                            <Form.Row>
                                <Col  >
                                    <Form.Label>Analise a cada : </Form.Label>
                                    <Form.Control type="number" value={this.state.frequenciaAnalise} onChange={this.frequenciaAnalise} />
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Col >
                                    <UnidadeSelect type="frequenciaAnalise" title={"Unidade: "} selection={this.state.escalaTempo} default={"Escolha a escala"} onChange={this.escalaTempoController} />
                                </Col>
                            </Form.Row> </>}

                        <>
                            <h3>Faixas de Controle</h3>
                            <Form.Row>
                                <Form.Group sm as={Col} controlId="pMinParametroForm">
                                    <Form.Label>Mínimo Especificado</Form.Label>
                                    <Form.Control type="number" pattern="0.00" placeholder="Parametro Minimo" value={this.state.pMin} onChange={event => this.setState({ pMin: event.target.value })} />
                                </Form.Group>
                                <Form.Group sm as={Col} controlId="pMinParametroForm">
                                    <Form.Label>Mínimo Trabalho</Form.Label>
                                    <Form.Control type="number" pattern="0.00" placeholder="Parametro Minimo" value={this.state.pMinT} onChange={event => this.setState({ pMinT: event.target.value })} />
                                </Form.Group>
                                <Form.Group sm as={Col} controlId="pMaxParametroForm">
                                    <Form.Label>Máximo Trabalho</Form.Label>
                                    <Form.Control type="number" placeholder="Parametro Máximo" value={this.state.pMaxT} onChange={event => this.setState({ pMaxT: event.target.value })} />
                                </Form.Group>
                                <Form.Group sm as={Col} controlId="pMaxParametroForm">
                                    <Form.Label>Máximo Especificado</Form.Label>
                                    <Form.Control type="number" placeholder="Parametro Máximo" value={this.state.pMax} onChange={event => this.setState({ pMax: event.target.value })} />
                                </Form.Group>


                            </Form.Row>
                        </>



                        <Form.Row>
                            <Form.Check style={{ marginRight: 15 }} type="checkbox" id="checkTitula">
                                <Form.Check.Input type="checkbox" checked={this.state.showChart} onChange={this.setShoweChart} />
                                <Form.Check.Label>Exibir Gráfico ?</Form.Check.Label>
                            </Form.Check>

                            <Form.Check style={{ marginRight: 15 }} type="checkbox" id="checkTitula">
                                <Form.Check.Input type="checkbox" checked={!this.state.titula} onChange={this.titulaConfirm} />
                                <Form.Check.Label>Formulas ?</Form.Check.Label>
                            </Form.Check>


                        </Form.Row>






                        <Form.Row hidden={this.state.titula}>
                            <Form.Group as={Col} controlId="formulaParametroForm">
                                <Form.Control readOnly={true} value={this.state.formula} type="text" placeholder="Formula" />
                            </Form.Group>
                            <Form.Group as={Col} controlId="btnFormulaBuilderParametroForm">
                                <FormulaBuilder etapaId={this.state.etapaId} onClose={this.onFormulaBuilderClose} processos={this.state.processos} etapas={this.state.etapas}></FormulaBuilder>
                            </Form.Group>
                        </Form.Row>

                        <Form.Group style={{ marginTop: 20 }}>
                            <Button style={{ margin: 5 }} variant="primary" type="reset" onClick={this.enterEditMode}>Editar</Button>
                            <Button style={{ margin: 5 }} variant="primary" type="reset" onClick={this.salvarParametro}>Salvar</Button>
                        </Form.Group>
                    </Form>
                </Container>

            </>
        )

    }

}

export default withToastManager(withMenuBar(connect(mapToStateProps.toProps, dispatchers)(CadastroParametro)))