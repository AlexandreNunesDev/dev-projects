import React, { Component, Fragment } from "react"
import { Form, Button, Col, Container, Row } from "react-bootstrap"
import GenericSelect from "../Components/GenericSelect"
import 'bootstrap/dist/css/bootstrap.min.css';
import ScqApi from "../Http/ScqApi";
import AnaliseChart from "../Components/AnaliseChart";
import { withMenuBar } from "../Hocs/withMenuBar";
import { formatIsoDate } from "../Services/stringUtils";


class IndicadorDeAnalise extends Component {

    constructor(props) {
        super(props)
         this.containerChartRef = React.createRef()
        
        this.state = {
            dataInicial: null,
            dataFinal: null,
            processos: [],
            etapas: [],
            processoId: '',
            etapaId: '',
            parametroId: '',
            analiseChartData : null,
            personalizarIntervalo : false

        }

    }

    componentDidMount = () => {
        ScqApi.ListaProcessos().then(res => {
            this.setState({
                processos: res

            })
        })
    }

    formatDate = (date) => {
        return new Date(date.toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]
    }

    loadChart = () => {
        ScqApi.LoadAnaliseChart(this.state.dataInicial,this.state.dataFinal,this.state.parametroId).then(res => {
         this.setState({
             analiseChartData : res
         })
          
        })
    }

    loadInterval = (intervalType) => {
        let dataAtual = new Date().getTime()
    
        switch (intervalType) {
           
            case 'semanal': this.getLastDate(86400000*7,dataAtual)
                break;
            case 'mensal' : this.getLastDate(86400000*30,dataAtual)
                break;
            case 'trimestral' : this.getLastDate(86400000*90,dataAtual)
                break;
            case 'anual' : this.getLastDate(86400000*365,dataAtual)
                break;
             default : return 'nada foi selecionado';
              
        }
    }

    getLastDate = (time,timeAtual) =>{
        this.setState({dataInicial : this.formatDate(new Date(timeAtual-time)), dataFinal : this.formatDate(new Date())}, () => console.log(this.state.dataInicial, this.state.dataFinal))
    }

    render() {
        return (
            <Fragment>
          
                <body>
                    <Container style={{ marginTop: 20 }}>
                        <Form>
                            <Row className="d-flex" >
                                <Col>
                                    <GenericSelect default={"Selecione um Processo"} returnType={"id"} title={"Processo"} showType={"nome"} ops={this.state.processos} onChange={(idProcesso) => {
                                        ScqApi.ListaEtapasByProcesso(idProcesso).then(res => {
                                            this.setState({
                                                etapas: res
                                            })
                                        })
                                    }}></GenericSelect>
                                </Col>
                                <Col>
                                    <GenericSelect default={"Selecione uma Etapa"} returnType={"id"} title={"Etapa"} ops={this.state.etapas} onChange={(idEtapa) => {
                                        ScqApi.ListaParametrosByEtapa(idEtapa).then(res => {
                                            this.setState({
                                                parametros: res
                                            })
                                        })
                                    }}></GenericSelect>
                                </Col>
                                <Col>
                                    <GenericSelect returnType={"id"} title={"Parametro"} default={"Escolha um Parametro"} ops={this.state.parametros} onChange={(parametroId) => this.setState({ parametroId: parametroId })} selection={this.state.parametro?.id} ></GenericSelect>
                                </Col>



                            </Row>
                            <Form.Row>
                              
                                <Col>
                                    <Button style={{backgroundColor : this.state.hightLight === 2 ? "BLUE" : "GRAY"}} onClick={() => {this.loadInterval("semanal"); this.setState({hightLight : 2})}}>7 dias</Button>
                                </Col>
                                <Col>
                                    <Button style={{backgroundColor : this.state.hightLight === 3 ? "BLUE" : "GRAY"}} onClick={() => {this.loadInterval("mensal"); this.setState({hightLight : 3})}}> 30 dias</Button>
                                </Col>
                                <Col>
                                    <Button style={{backgroundColor : this.state.hightLight === 4 ? "BLUE" : "GRAY"}} onClick={() => {this.loadInterval("trimestral"); this.setState({hightLight : 4})}}>90 dias</Button>
                                </Col>
                                <Col>
                                    <Button style={{backgroundColor : this.state.hightLight === 5 ? "BLUE" : "GRAY"}} onClick={() =>{ this.loadInterval("anual"); this.setState({hightLight : 5})}}>Anual</Button>
                                </Col>
                                <Col>
                                <Form.Group style={{marginTop : 5}}>
                                    <Form.Check.Input  type="checkbox" onChange={(event) => this.setState({personalizarIntervalo : event.target.checked },() => console.log(this.state.personalizarIntervalo))} />
                                    <Form.Check.Label>Intervalo Personalizado</Form.Check.Label>    
                                </Form.Group>
                                   
                                </Col>
                            </Form.Row>
                            
                            <Form.Row hidden={!this.state.personalizarIntervalo} style={{marginTop : 10}}>
                                <Form.Group as={Col}>
                                    <Form.Label>Data Inicial</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        defaultValue={this.state.dataInicial}
                                        onChange={event => { this.setState({ dataInicial: formatIsoDate(event.target.value) },() => console.log(this.state.dataInicial));  }}>

                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Data Final</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        defaultValue={this.state.dataFinal}
                                        onChange={event => { this.setState({ dataFinal: formatIsoDate(event.target.value) },() => console.log(this.state.dataFinal));  }}>

                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group style={{ marginTop: 20 }}>
                                <Button style={{ margin: 5 }} variant="primary" onClick={() => this.loadChart()}>Carregar Grafico</Button>
                            </Form.Group>
                        </Form>
                    </Container>
                    <Container ref={this.containerChartRef}>
                        
                         {this.state.analiseChartData && <AnaliseChart containerRef={this.containerChartRef} data={this.state.analiseChartData}></AnaliseChart>}
                   
                
                    </Container>
                  
                </body>
            </Fragment>
        )
    }

}

export default withMenuBar(IndicadorDeAnalise)