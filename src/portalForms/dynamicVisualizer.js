import axios from "axios";
import React, { useEffect, useState } from 'react'
import { Button, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import GenericSelect from "../Components/GenericSelect";
import { setSpreadSheetMetadata, updadteHeaders, updateBody } from "../Reducers/dyanamicForms";
import { getBatchRanges, getHeaders, getMaxColumns, getMaxRows } from "./spreadSheetApi";

function DynamicVizualization({ selectedSpreadSheetUri }) {
    const apiKey = 'AIzaSyAwUkhGE3_YB8cT4706OKT-xi3RpvnL014'
    const baseSpreadSheetApiUrl = "https://sheets.googleapis.com/v4/spreadsheets/"
    const httpClient = axios.create({ baseURL: `${baseSpreadSheetApiUrl}${selectedSpreadSheetUri}` })

    httpClient.interceptors.request.use(async config => {
        console.log(config.url)
        config.url = config.url + `key=${apiKey}`;
        console.log(config.url)
        return config;
    });

    const [data, setData] = useState()
    const [selectedHeaders, setSelectedHeaders] = useState([])
    const [actualSpreadsheet, setActualSpreadSheet] = useState()
    const dispatch = useDispatch()
    const headers = useSelector(state => state.formsReducer.headers)
    const spreadSheetMetaData = useSelector(state => state.formsReducer.spreadSheetMetaData)
    const body = useSelector(state => state.formsReducer.body)




    useEffect(() => {
        if (selectedSpreadSheetUri) {
            httpClient.get("?").then(res => {
                let spreadSheetMetaData = res.data.sheets[0]
                dispatch(setSpreadSheetMetadata(spreadSheetMetaData))
                let maxColums = getMaxColumns(spreadSheetMetaData)
                let maxRows = getMaxRows(spreadSheetMetaData)
                httpClient.get(`/values/:batchGet?ranges=R1C1:R1C${maxColums}&`).then(res => dispatch(updadteHeaders(getHeaders(res))))
                httpClient.get(`/values/:batchGet?ranges=R2C1:R${maxRows}C${maxColums}&`).then(res => dispatch(updateBody(getBatchRanges(res))))

            })
        }
    }, [selectedSpreadSheetUri])

    const setConfigData = (headerIndex) => {

    }


    const buildHeader = () => {
        return <>
            <tr>
                {headers.map((header, index) => {
                    return <th key={index} style={{ textAlign: "center" }}>
                        <div>
                            <h4>Criterios</h4>
                            <div>
                                <Button>Adicionar</Button>
                            </div>
                            <div>
                                <Button>Remover</Button>
                            </div>
                        </div>
                    </th>
                })}
            </tr>
            <tr>
                {headers.map((header, index) => {
                    return <th key={index} style={{ textAlign: "center" }}><label className="text-nowrap">{header}</label></th>
                })}
            </tr>

        </>

    }

    const getBody = () => {

        return body.map((bLine, index) => {

            return <tr>
                {bLine.map((bElement, index) => {
                    return <td style={{ textAlign: "center" }} >{bElement}</td>
                })}
            </tr>
        })

    }






    return (<>
        <div className="table-responsive">
            <Table striped bordered hover>
                <thead>

                    {headers && buildHeader()}

                </thead>
                <tbody>
                    {body && getBody()}
                </tbody>
            </Table>
        </div>

    </>);
}

export default DynamicVizualization;