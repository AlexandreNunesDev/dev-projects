import React, { Component, Fragment } from "react"
import { Form, Button, Col, Container, Row } from "react-bootstrap"
import GenericSelect from "../Components/GenericSelect"

import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from "./MenuBar";
import ScqApi from "../Http/ScqApi";
import AnaliseChart from "../Components/AnaliseChart";


class IndicadorDeAnalise extends Component {

    constructor(props) {
        super(props)
         this.containerChartRef = React.createRef()
        
        this.state = {
            dataInicial: new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0],
            dataFinal: new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0],
            processos: [],
            etapas: [],
            processoId: '',
            etapaId: '',
            parametroId: '',
            analiseChartData : null,

        }

    }

    componentDidMount = () => {
        ScqApi.ListaProcessos().then(res => {
            this.setState({
                processos: res

            })
        })
    }

    loadChart = () => {
        ScqApi.LoadAnaliseChart(this.state.dataInicial,this.state.dataFinal,this.state.parametroId).then(res => {
         this.setState({
             analiseChartData : res
         })
          
        })
    }

    render() {
        return (
            <Fragment>
                <header>
                    <MenuBar></MenuBar>
                </header>
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
                                <Form.Group as={Col} controlId="formGridPassword">
                                    <Form.Label>Data Inicial</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        defaultValue={this.state.dataInicial}
                                        onChange={event => { this.setState({ dataInicial: event.target.value }); console.log(this.state.dataInicial) }}>

                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Data Final</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        defaultValue={this.state.dataFinal}
                                        onChange={event => { this.setState({ dataFinal: event.target.value }); console.log(this.state.dataFinal) }}>

                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group style={{ marginTop: 20 }}>
                                <Button style={{ margin: 5 }} variant="primary" onClick={() => this.loadChart()}>Carregar Grafico</Button>
                            </Form.Group>
                        </Form>
                    </Container>
                    <Container ref={this.containerChartRef}>
                        <Form.Row>
                         {this.state.analiseChartData && <AnaliseChart containerRef={this.containerChartRef} data={this.state.analiseChartData}></AnaliseChart>}
                        </Form.Row>
                
                    </Container>
                  
                </body>
            </Fragment>
        )
    }

}

export default IndicadorDeAnalise