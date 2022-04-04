import React, { Component } from "react"
import { Form, Button, Col, Container, Row, Table } from "react-bootstrap"
import GenericSelect from "../Components/GenericSelect"
import 'bootstrap/dist/css/bootstrap.min.css';
import ScqApi from "../Http/ScqApi";
import AnaliseChart from "../Components/AnaliseChart";
import { withMenuBar } from "../Hocs/withMenuBar";
import { formatIsoDate } from "../Services/stringUtils";
import { connect } from "react-redux";
import mapToStateProps from "../mapStateProps/mapStateToProps";
import dispatchers from "../mapDispatch/mapDispathToProps";
import { Fragment } from "react";


class IndicadorDeAnalise extends Component {

    constructor(props) {
        super(props)
        this.containerChartRef = React.createRef()

        this.state = {
            dataInicial: null,
            dataFinal: null,
            processos: [],
            etapas: [],
            processoId: null,
            etapaId: null,
            parametroId: null,
            analiseChartData: null,
            fullProcessoAnaliseChartData: null,
            fullEtapaAnaliseChartData: null,
            personalizarIntervalo: false,
            showAnalitics: false,
        }

    }


    reloadChart = () => {
        this.loadChart()
    }

    getFullEtapaAnaliseChart = () => {
        return this.state.fullEtapaAnaliseChartData.map((etapaChart, index) => <Fragment key={index} ><AnaliseChart showAnalitics={this.state.showAnalitics} chave={etapaChart.etapaId} containerRef={this.containerChartRef} data={etapaChart} reloadChart={this.reloadChart}></AnaliseChart></Fragment>)
    }

    getGlobalsStats = () => {
        let qtd = this.state.fullProcessoAnaliseChartData.length
        let globalRed = 0
        let globalYellow = 0
        let globalGreen = 0
        let globalFreq = 0
        this.state.fullProcessoAnaliseChartData.forEach((processoChart) => { globalGreen += Number(processoChart.numbersOfGreen); globalRed += Number(processoChart.numbersOfRed); globalYellow += Number(processoChart.numbersOfYellow); globalFreq += Number(processoChart.numbersOfInsideFrequency) })
        globalRed = globalRed / qtd
        globalYellow = globalYellow / qtd
        globalGreen = globalGreen / qtd
        globalFreq = globalFreq / qtd
        return (
            <div hidden={!this.state.showAnalitics} >
                <h3>Indice Global</h3>
                <Table>
                    <thead>
                        <tr>
                            <th style={{textAlign: "center" }}>Faixas vermelhas</th>
                            <th style={{textAlign: "center" }}>Faixas amarelas</th>
                            <th style={{textAlign: "center" }}>Faixas verdes</th>
                            <th style={{textAlign: "center" }}>Frequencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ backgroundColor: "#ed493e", textAlign: "center" }}>{globalRed.toFixed(2)} %</td>
                            <td style={{ backgroundColor: "#f0e06c", textAlign: "center" }}>{globalYellow.toFixed(2)} %</td>
                            <td style={{ backgroundColor: "#8ae364", textAlign: "center" }}>{globalGreen.toFixed(2)} %</td>
                            <td style={{ backgroundColor: "#7fb2f0", textAlign: "center" }}>{globalFreq.toFixed(2)} %</td>
                        </tr>
                    </tbody>
                </Table>
            </div>


        )


    }

    getFullProcessoAnaliseChart = () => {
        return this.state.fullProcessoAnaliseChartData.map((processoChart, index) => <AnaliseChart showAnalitics={this.state.showAnalitics} chave={processoChart.etapaId} containerRef={this.containerChartRef} data={processoChart} reloadChart={this.reloadChart}></AnaliseChart>)

    }

    formatDate = (date) => {
        return new Date(date.toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]
    }

    loadChart = () => {


        if (this.state.processoId != null && this.state.etapaId == null && this.state.parametroId == null) {
            ScqApi.LoadFullProcessoChart(this.state.dataInicial, this.state.dataFinal, this.state.processoId).then(res => {
                this.setState({
                    fullProcessoAnaliseChartData: res
                })

            })
        }

        if (this.state.processoId != null && this.state.etapaId != null && this.state.parametroId == null) {
            ScqApi.LoadFullEtapaChart(this.state.dataInicial, this.state.dataFinal, this.state.etapaId).then(res => {
                this.setState({
                    fullEtapaAnaliseChartData: res
                })

            })
        }

        if (this.state.processoId != null && this.state.etapaId != null && this.state.parametroId != null) {
            ScqApi.LoadAnaliseChart(this.state.dataInicial, this.state.dataFinal, this.state.parametroId).then(res => {
                this.setState({
                    analiseChartData: res
                })

            })
        }



    }

    loadInterval = (intervalType) => {
        let dataAtual = new Date().getTime()

        switch (intervalType) {

            case 'semanal': this.getLastDate(86400000 * 7, dataAtual)
                break;
            case 'mensal': this.getLastDate(86400000 * 30, dataAtual)
                break;
            case 'trimestral': this.getLastDate(86400000 * 90, dataAtual)
                break;
            case 'anual': this.getLastDate(86400000 * 365, dataAtual)
                break;
            default: return 'nada foi selecionado';

        }
    }

    getLastDate = (time, timeAtual) => {
        this.setState({ dataInicial: this.formatDate(new Date(timeAtual - time)), dataFinal: this.formatDate(new Date()) }, () => console.log(this.state.dataInicial, this.state.dataFinal))
    }

    render() {
        return (
            <>


                <Container style={{ marginTop: 20 }}>
                    <Form>

                        <Row>
                            <Col>
                                <GenericSelect default={"Selecione um Processo"} returnType={"id"} title={"Processo"} showType={"nome"} ops={this.props.processos} onChange={(idProcesso) => {
                                    this.setState({
                                        etapas: this.props.etapas.filter(etapa => etapa.processoId === Number(idProcesso)),
                                        processoId: idProcesso
                                    })

                                }}></GenericSelect>
                            </Col>
                        </Row>
                        <Row>


                            <Col>
                                <GenericSelect default={"Selecione uma Etapa"} returnType={"id"} title={"Etapa"} ops={this.state.etapas} onChange={(idEtapa) => {
                                    this.setState({
                                        parametros: this.props.parametros.filter(parametro => parametro.etapaId === Number(idEtapa)),
                                        etapaId: idEtapa
                                    })

                                }}></GenericSelect>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <GenericSelect returnType={"id"} title={"Parametro"} default={"Escolha um Parametro"} ops={this.state.parametros} onChange={(parametroId) => this.setState({ parametroId: parametroId })} selection={this.state.parametro?.id} ></GenericSelect>
                            </Col>
                        </Row>



                        <Form.Row>

                            <Col >
                                <Button style={{ backgroundColor: this.state.hightLight === 2 ? "BLUE" : "GRAY" }} onClick={() => { this.loadInterval("semanal"); this.setState({ hightLight: 2 }) }}>7 dias</Button>
                            </Col>
                            <Col >
                                <Button style={{ backgroundColor: this.state.hightLight === 3 ? "BLUE" : "GRAY" }} onClick={() => { this.loadInterval("mensal"); this.setState({ hightLight: 3 }) }}> 30 dias</Button>
                            </Col>
                            <Col>
                                <Button style={{ backgroundColor: this.state.hightLight === 4 ? "BLUE" : "GRAY" }} onClick={() => { this.loadInterval("trimestral"); this.setState({ hightLight: 4 }) }}>90 dias</Button>
                            </Col>
                            <Col >
                                <Button style={{ backgroundColor: this.state.hightLight === 5 ? "BLUE" : "GRAY" }} onClick={() => { this.loadInterval("anual"); this.setState({ hightLight: 5 }) }}>Anual</Button>
                            </Col >
                            <Col>
                                <Form.Group style={{ marginTop: 5 }}>
                                    <Form.Check type="checkbox" label="Intervalo Personalizado" onChange={(event) => this.setState({ personalizarIntervalo: event.target.checked })} />
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group style={{ marginTop: 5 }}>
                                    <Form.Check type="checkbox" label="Modo Gerencial" onChange={(event) => this.setState({ showAnalitics: event.target.checked })} />
                                </Form.Group>

                            </Col>
                        </Form.Row>
                            {this.state.fullProcessoAnaliseChartData && this.getGlobalsStats()}

                        <Form.Row hidden={!this.state.personalizarIntervalo} style={{ marginTop: 10 }}>
                            <Form.Group as={Col}>
                                <Form.Label>Data Inicial</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    defaultValue={this.state.dataInicial}
                                    onChange={event => { this.setState({ dataInicial: formatIsoDate(event.target.value) }) }}>

                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col}>
                                <Form.Label>Data Final</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    defaultValue={this.state.dataFinal}
                                    onChange={event => { this.setState({ dataFinal: formatIsoDate(event.target.value) }) }}>

                                </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <Form.Group style={{ marginTop: 20 }}>
                            <Button style={{ margin: 5 }} variant="primary" onClick={() => { this.setState({ fullProcessoAnaliseChartData: [], fullEtapaAnaliseChartData: [], analiseChartData: null }, () => this.loadChart()) }}>Carregar Grafico</Button>
                        </Form.Group>

                    </Form>
                </Container>

                <Container ref={this.containerChartRef}>
                    {this.state.fullProcessoAnaliseChartData && this.getFullProcessoAnaliseChart()}
                    {this.state.fullEtapaAnaliseChartData && this.getFullEtapaAnaliseChart()}
                    {this.state.analiseChartData && <AnaliseChart chave={1} showAnalitics={this.state.showAnalitics} containerRef={this.containerChartRef} data={this.state.analiseChartData} reloadChart={this.reloadChart}></AnaliseChart>}
                </Container>


            </>
        )
    }

}

export default withMenuBar(connect(mapToStateProps.toProps, dispatchers)(IndicadorDeAnalise))