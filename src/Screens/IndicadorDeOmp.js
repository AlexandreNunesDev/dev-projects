import React, { useRef, useState } from "react"
import { Button, Col, Container, Form } from "react-bootstrap"
import OmpChart from "../Components/OmpChart"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import { formatIsoDate } from "../Services/stringUtils"


const IndicadorDeOmp = () => {

    const [dataInicial, setDataInicial] = useState(null)
    const [dataFinal, setDataFinal] = useState(null)
    const [chartData, setChartData] = useState(null)
    const containerRef = useRef(null)


    const loadChart = () => {
        ScqApi.LoadOmpChart(dataInicial, dataFinal).then(res => setChartData(res))
    }

    return <>

        <Container style={{marginTop : 20}}>
            <h2>Indicador de Omp</h2>
            <Form.Row style={{ marginTop: 10 }}>
                <Form.Group as={Col}>
                    <Form.Label>Data Inicial</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={dataInicial}
                        onChange={event => setDataInicial(formatIsoDate(event.target.value))}>

                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Data Final</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={dataFinal}
                        onChange={event => setDataFinal(formatIsoDate(event.target.value))}>
                    </Form.Control>
                </Form.Group>
            </Form.Row>
            <Form.Group style={{ marginTop: 20 }}>
                <Button style={{ margin: 5 }} variant="primary" onClick={() => loadChart()}>Carregar Grafico</Button>
            </Form.Group>
        </Container>

        <Container ref={containerRef}>
            {chartData && <OmpChart chartData={chartData} containerRef={containerRef}></OmpChart>}
        </Container>

    </>


}


export default withMenuBar(IndicadorDeOmp)