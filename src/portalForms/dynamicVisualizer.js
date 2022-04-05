import axios from "axios";
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Table } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { parseExcelDateToDate } from "../Services/stringUtils";
import ChartBuilder from "./chartBuilder";
import './fixedTables.css';
import { Cell, Row } from "./portalModels";
import { buildModels, getBatchRanges, getHeaders, getMaxColumns, getMaxRows } from "./spreadSheetApi";

function DynamicVizualization({ selectedSpreadSheetUri }) {
    const apiKey = 'AIzaSyAwUkhGE3_YB8cT4706OKT-xi3RpvnL014'
    const baseSpreadSheetApiUrl = "https://sheets.googleapis.com/v4/spreadsheets/"
    const httpClient = axios.create({ baseURL: `${baseSpreadSheetApiUrl}${selectedSpreadSheetUri}` })


    httpClient.interceptors.request.use(async config => {
        config.url = config.url + `key=${apiKey}`;

        return config;
    });

    const dispatch = useDispatch()
    const toatManager = useToasts()
    const [headers, setHeaders] = useState([])
    const [optionsHeaders, setOptionsHeaders] = useState()
    const [spreadSheetMetaData, setSpreadSheetMetadata] = useState()
    const [showChartBuilder,setShowChartBuilder] = useState(false)
    const [carimbos, setCarimbos] = useState()
    const [body, setBody] = useState([])
    const [dataInicial, setDataInicial] = useState()
    const [dataFinal, setDataFinal] = useState()
    const [maxCol, setMaxCol] = useState()
    const [maxRow, setMaxRow] = useState()
    const [eixoX, setEixoX] = useState()
    const [eixoY, setEixoY] = useState()
    const formNameChoosed = useSelector(state => state.formsReducer.formNameChoosed)


    useEffect(() => {
        if (selectedSpreadSheetUri) {
            httpClient.get("?").then(res => {
                let metaData = res.data.sheets[0]
                setSpreadSheetMetadata(metaData)
                let maxColums = getMaxColumns(metaData)
                let maxRows = getMaxRows(metaData)
                setMaxCol(maxColums)
                setMaxRow(maxRows)
            })
        }
    }, [selectedSpreadSheetUri])

    useEffect(() => {
        if (carimbos) {
            loadBodyData(carimbos[0].row, carimbos[carimbos.length - 1].row)
            loadHeaders()
        }

    }, [carimbos])



    function loadCarimbos() {
        if (maxCol && maxRow && dataInicial && dataFinal) {
            httpClient.get(`/values/:batchGet?ranges=R2C1:R${maxRow}C1&`).then(res => {
                let carimbosResponse = res.data.valueRanges[0].values
                let carimbos = carimbosResponse.map((carimbo, index) => {
                    return parseExcelDateToDate(carimbo)
                })

                let carimbosIndexados = []
                carimbos.filter((carimbo, index) => {
                    
                    if ((carimbo.getTime() > dataInicial.getTime()) && (carimbo.getTime() < dataFinal.getTime())) {
                        
                        carimbosIndexados.push(new Cell(1, index + 2, carimbo))
                        return true
                    } else {
                        return false
                    }
                })

                setCarimbos(carimbosIndexados)
            })
        } else {
            toatManager.addToast("Necessario selecionar range de datas", { appearance: "warning", autoDismiss :true })
        }

    }

   

    function loadHeaders() {
        httpClient.get(`/values/:batchGet?ranges=R1C1:R1C${maxCol}&`).then(res => {
            let headers = getHeaders(res)
            setHeaders(headers)
        })
    }


    function loadBodyData(initialRowIndex, lasRowIndex) {
        httpClient.get(`/values/:batchGet?ranges=R${initialRowIndex}C1:R${lasRowIndex}C${maxCol}&`).then(res => {
            let bodyData = getBatchRanges(res)
            let rows = buildModels(bodyData, maxCol)
            setBody(rows)
        })
    }


    function buildHeaders(headeers) {
        return <tr>
            {headeers.map(header => {
                return <th>{header}</th>
            })
            }
        </tr>
    }

    /** @param {Array<Row>} rows */
    function buildTable(rows) {
        let dataIni
        let dataFini
        let rowsToBuild
        if (dataFinal && dataInicial) {
            dataIni = dataInicial.getTime()
            dataFini = dataFinal.getTime()
            rowsToBuild = rows.filter(
                /** @param {Row} row */
                (row, index) => {

                    let dataRow = row.date.getTime()
                    if ((dataRow > dataIni) && (dataRow < dataFini)) {
                        return true
                    } else {
                        return false
                    }
                }
            )
        } else {
            rowsToBuild = rows
        }

        return (
            <>
                {rowsToBuild.map(row => {
                    return <tr>
                        {row.cells.map(cell => {
                            return <td>{cell.value}</td>
                        })}
                    </tr>
                })
                }
            </>)
    }






    return (
        <>
            <ChartBuilder setShow={setShowChartBuilder} show={showChartBuilder} headers={headers} rows={body} setEixoX={(xData) => setEixoX(xData)} setEixoY={(yData) => setEixoY(yData)}></ChartBuilder>
            {
                maxCol && maxRow && <>
                <h3>{`Dados - ${formNameChoosed} - carregado`}</h3>
                    <Form.Row style={{ marginTop: 10 }}>
                        <Form.Group as={Col}>
                            <Form.Label>Data Inicial</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                defaultValue={dataInicial}
                                onChange={event => setDataInicial(new Date(event.target.value))}>

                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Data Final</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                defaultValue={dataFinal}
                                onChange={event => setDataFinal(new Date(event.target.value))}>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col} >
                            <Button style={{position:"absolute", bottom:0}}  onClick={() => loadCarimbos()}>Carregar dados</Button>
                        </Form.Group>
                       {/*  <Form.Group as={Col} >
                            <Button style={{position:"absolute", bottom:0}}  onClick={() => setShowChartBuilder(true)}>Abrir construtor de graficos</Button>
                        </Form.Group> */}
                    </Form.Row>
                </>
            }
            
            <div className="tableFixHead" >
                <table>
                    <thead>{headers && buildHeaders(headers)}</thead>
                    <tbody>{body && buildTable(body)}</tbody>
                </table>
            </div>
            <div>

            </div>
        </>
    );
}

export default DynamicVizualization;