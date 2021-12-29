import React from 'react'
import { Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import GenericSelect from '../Components/GenericSelect';
import ScqApi from '../Http/ScqApi';
import CheckOutAnalise from '../Components/CheckoutAnalise';
import { withToastManager } from 'react-toast-notifications';
import TitulaForm from './TitulaForm';
import { withMenuBar } from '../Hocs/withMenuBar';
import { responseHandler } from '../Services/responseHandler';
import { connect } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps'
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';
import { formatIsoDate } from '../Services/stringUtils';


const valueForm = (props) => {
    return (
        <>
            <Form.Label>
                Valor
            </Form.Label>
            <Form.Control type="number" placeholder={"0.00"} onChange={(event) => props.onChange(event.target.value)} />
        </>
    )
}





class RegistroDeAnalise extends React.Component {
    static contextType = WebSocketContext

    constructor(props) {
        super(props)
        this.dataFieldRef = React.createRef();

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
            valorForm: null,
            data: null,
            showData: false,
            observacao : null

        }
    }




    componentDidUpdate(prevProps) {
        if (prevProps.parametros !== this.props.parametros) {
            this.onEtapaSelect(this.state.etapaId)
        }
    }



    componentDidMount() {
        const analise = this.props.location.state && this.props.location.state[0]
        const ocpId = this.props.location.state && this.props.location.state[1]
        if (analise) {
            const processo = { id: analise.processoId, nome: analise.processoNome }
            const etapa = { id: analise.etapaId, nome: analise.etapaNome }
            const parametro = { id: analise.parametroId, nome: analise.parametroNome, menuType: analise.menuType, pMin: analise.pMin, pMax: analise.pMax, pMaxT: analise.pMaxT, pMinT: analise.pMinT, formula: analise.formula, unidade: analise.unidade }
            this.setState({
                processos: [processo],
                processo: processo,
                etapa: etapa,
                etapas: [etapa],
                parametro: parametro,
                parametros: [parametro],
                analista: analise.analista,
                analise: analise,
                ocpId: ocpId
            }, () => this.onParametroSelect(analise.parametroId))

        }
    }

    onLinhaSelect = (linhaId) => {
        this.setState({
            etapas: this.props.etapas.filter(etapa => {
                if ((etapa.processoId === Number(linhaId)) && (!etapa.hasNoParam)) {
                    return true
                } else {
                    return false
                }

            })
        })
    }

    onEtapaSelect = (etapaId) => {
        this.setState({
            etapaId: etapaId,
            parametros: this.props.parametros.filter(parametro => parametro.etapaId === Number(etapaId))
        })
    }


    onParametroSelect = (parametroId) => {
        this.state.parametros.forEach(parametro => {
            if (Number(parametro.id) === Number(parametroId)) {
                if (parametro.menuType === "Acao") {
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




    salvarAnalise = () => {
        const {toastManager} = this.props
        if (this.state.analise) {
            this.salvarReanalise()
        } else {
            
                const { analista, resultado, status } = this.state
                let nomeAnalista
                if (analista === '') {
                    nomeAnalista = this.props.global.userName
                } else {
                    nomeAnalista = analista;
                }
    
                const analise = { id: null, parametroId: this.state.parametro.id, analista: nomeAnalista, resultado: resultado, status: status, data: this.state.data,observacaoAnalise : this.state.observacao }
    
                ScqApi.CriarAnalise(analise,[this.props.loadParametros, this.props.loadOcps]).then(res => {
                    responseHandler(res,toastManager, "Analise", 'success')
                })
            


            
        }

    }

    salvarReanalise = () => {

        const { id } = this.state.analise
        const analise = { id: id, analista: this.state.analista, resultado: this.state.resultado, status: this.state.status, parametroId: this.state.parametro.id, ocpId: this.state.ocpId , observacaoAnalise : this.state.observacao }
        const {toastManager} = this.props
        ScqApi.EditarAnalise(analise,[this.props.loadParametros, this.props.loadOcps]).then((res) => responseHandler(res, toastManager, "Analise", 'info' ))




    }


    gerarOcpReanalise = (history) => {
        const { id } = this.state.analise
        const analise = { id: id, analista: this.state.analista, resultado: this.state.resultado, status: this.state.status, parametroId: this.state.parametro.id, ocpId: this.state.ocpId ,observacaoAnalise : this.state.observacao}
        history.push('/CadastroOcp' + this.state.parametro.menuType, analise)

    }


    gerarOcp = (history) => {
        const { analista, resultado, status } = this.state
        const analise = { id: null, parametroId: this.state.parametro.id, analista: analista, resultado: resultado, status: status, data: this.state.data,observacaoAnalise : this.state.observacao }
        history.push('/CadastroOcp' + this.state.parametro.menuType, analise)
    }


    showData = (checked) => {
        if(checked === true) {
            this.setState({ showData: checked })
        } else {
            this.dataFieldRef.current.value = null
            this.setState({ showData: checked, data : null })
        }
         
    }

    render() {
        return (
            <>


                <Container style={{ marginTop: 20 }}>
                    <h1>Registro de Analise</h1>
                    <Form>
                        <Form.Row>
                            <Col style={{ marginBottom: 10 }}>
                               
                                <Form.Check type="checkbox" label="Selecionar Data?" onChange={(event) => this.showData(event.target.checked)  } />
                                <Form.Group hidden={!this.state.showData}>
                                <Form.Label>Data: </Form.Label>
                                <Form.Control
                                    ref={this.dataFieldRef}
                                    type="datetime-local"
                                    defaultValue={this.state.data}
                                    onChange={event => { this.setState({ data: formatIsoDate(event.target.value)})}}>

                                </Form.Control>
                                </Form.Group>
                            </Col>
                        </Form.Row>

                        <Form.Row>
                            <Col>
                                <GenericSelect displayType={"nome"} returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={this.props.processos} onChange={this.onLinhaSelect} selection={this.state.processo?.id}></GenericSelect>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <GenericSelect displayType={"nome"} returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} ops={this.state.etapas} onChange={this.onEtapaSelect} selection={this.state.etapa?.id} ></GenericSelect>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <GenericSelect displayType={"nome"} returnType={"id"} title={"Parametro"} default={"Escolha um Parametro"} ops={this.state.parametros} onChange={(parametroId) => this.onParametroSelect(parametroId)} selection={this.state.parametro?.id} ></GenericSelect>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>
                                    Nome do Analista:
                                </Form.Label>
                                <Form.Control type="text" placeholder={this.props.global.userName} value={this.state.analista} onChange={this.nomeAnalistaListner} />
                            </Col>

                        </Form.Row>
                        <Form.Row>

                            <Col>

                                {this.state?.valorForm}
                            </Col>
                        </Form.Row>


                        <Form.Group style={{ marginTop: 20 }}>
                            <CheckOutAnalise onValueChange={(valor) => this.setState({observacao : valor})} valid={!this.state.calcDisabled} resultado={this.state.resultado} parametro={this.state.parametro} status={this.state.status} salvarAnalise={this.salvarAnalise} salvarReanalise={this.salvarReanalise} gerarOcpReanalise={this.gerarOcpReanalise} gerarOcp={this.gerarOcp} analiseId={this.state.analise?.id}></CheckOutAnalise>
                        </Form.Group>

                    </Form>

                </Container>


            </>
        )

    }

}

export default withToastManager(withMenuBar(connect(mapToStateProps.toProps, dispatchers)(RegistroDeAnalise)))