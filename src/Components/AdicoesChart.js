
import { sort } from "mathjs";
import React, { PureComponent, useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, Legend, Tooltip, XAxis, YAxis } from "recharts";
import CustomChartTooltip from "./CustomChartTooltip";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { RiFileExcel2Fill } from "react-icons/ri";
import GenericSelect from "./GenericSelect";

//import CustomChartTooltip from "./CustoChartTooltip";




function AdicaoChart({ chartData, containerRef }) {

    const [entries, setEntries] = useState()
    const [displayDetails, setDispalyDetails] = useState([])
    const [processoClicked, setProcessoClicked] = useState([])
    const [somaContagemView, setSomaContagemProcessoView] = useState()
    const [periodo, setPeriodo] = useState()
    const referenciaTabela = useRef(null)

    const periodoDia = 86400000

    const renderLegend = (props) => {
        let customLegend = [{ value: "R$ total Ocp", color: "#2691fc" }, { value: "R$ total omp", color: "#8cf55f" }]

        return (
            <ul style={{ display: "flex", listStyleType: "none" }}>
                {
                    customLegend.map((entry, index) => (
                        <li style={{ color: entry.color, paddingLeft: 24 }} key={index}>{entry.value}</li>
                    ))
                }
            </ul>
        );
    }

    const getFormatedLabel = (processoNome) => {
        let regEx = /\d+/g
        let valores = regEx.exec(processoNome)
        console.log(valores)
        return valores ? +valores[0] : 2
    }

    useEffect(() => {
        const resultados = []

        let sorted = chartData.sort((a, b) => {
            if (getFormatedLabel(a.processoNome) > getFormatedLabel(b.processoNome)) {
                return 1
            }
            return -1
        })
        for (const adicaoChartDto of sorted) {
            let data = {
                "processoNome": adicaoChartDto.processoNome,
                "totalGastosOcp": adicaoChartDto.totalGastosOcp,
                "totalGastosOmp": adicaoChartDto.totalGastosOmp,
                "adicaoDetails": adicaoChartDto.adicaoDetails,

            }
            resultados.push(data)
        }
        setEntries(resultados)
    }, [chartData])


    useEffect(() => {
        let somacustocontagem = 0.0
        displayDetails.forEach(dp => somacustocontagem += +(Number(dp.gastoTotal) / Number(dp.contagemTotal)).toFixed(6))
        setSomaContagemProcessoView(somacustocontagem.toFixed(4))
    }, [displayDetails])

    



    return <>

        <BarChart width={containerRef.current.offsetWidth} onClick={(clickObj) => {
            setProcessoClicked(clickObj.activePayload[0].payload.processoNome)
            setDispalyDetails([...clickObj.activePayload[0].payload.adicaoDetails])
        }} height={500}
            data={entries}
            margin={{ top: 20, right: 30, left: 50, bottom: 0 }}>
            <Legend content={renderLegend} wrapperStyle={{ position: "relative", left: "45%" }} />
            <CartesianGrid />
            <XAxis tick={false} dataKey="processoNome" />
            <YAxis />
            <Tooltip content={(props) => CustomChartTooltip(props, ["adicaoDetails"], true)} />

            <Bar fill="#2691fc" stackId={"1"} dataKey="totalGastosOcp" >
            </Bar>

            <Bar fill="#8cf55f" stackId={"1"} dataKey="totalGastosOmp" >
            </Bar>
        </BarChart>
        <div style={{ marginTop: 24 }}>


            <h3>Gasto totalizado por Materia Prima {processoClicked}</h3>
            <DownloadTableExcel
                filename={`gastos-${processoClicked}`}
                sheet="scq"
                currentTableRef={referenciaTabela.current}
            >
                <Button variant="success"> Exportar <RiFileExcel2Fill /> </Button>
            </DownloadTableExcel>

            <Form.Group>


                <Form.Label bold>Explodir por periodo</Form.Label>
                <InputGroup>

                    <Form.Control type="text" ></Form.Control>
                    <Dropdown onChange={(event) => setPeriodo(event.target.value)}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Periodo
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Diario</Dropdown.Item>
                            <Dropdown.Item>Semanal</Dropdown.Item>
                            <Dropdown.Item>Mensal</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button onCarregarPeriodo>Carregar</Button>
                </InputGroup>
            </Form.Group>

            <div>
                <strong>Global custo/contagem: </strong><label>R$ {somaContagemView}</label>
            </div>
            <div className="table-responsive">
                <div className="tableFixHead">

                    <table ref={referenciaTabela}>
                        <thead>
                            <tr>
                                <th>Etapa</th>
                                <th>Materia Prima</th>
                                <th>Quantidade</th>
                                <th>Gasto Total</th>
                                <th>Gasto/contagem</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayDetails.map((dtails, index) => {

                                return <tr key={index}>
                                    <td>{dtails.etapaNome}</td>
                                    <td>{dtails.nomeMateriaPrima}</td>
                                    <td>{Number(dtails.quantidade).toFixed(2)}</td>
                                    <td>R${Number(dtails.gastoTotal).toFixed(2)}</td>
                                    <td>R${(Number(dtails.gastoTotal) / Number(dtails.contagemTotal)).toFixed(6)}</td>
                                    <td>{dtails.isOcp ? "Correção" : "Troca"}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


    </>
}

export default AdicaoChart;