import axios from "axios";
import React, { useEffect, useState } from 'react';
import { Button } from "react-bootstrap";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { HiFilter } from 'react-icons/hi';
import { useDispatch, useSelector } from "react-redux";
import FilterDynamic, { calcValues } from "../Components/FilterDynamic";
import { clear, loadOptionsHeaders, setChoosedHeaders, setDynamicOpenFilter, setSpreadSheetMetadata, updadteHeaders, updateBody } from "../Reducers/dyanamicForms";
import './fixedTables.css';
import { getBatchRanges, getHeaders, getMaxColumns, getMaxRows } from "./spreadSheetApi";

function DynamicVizualization({ selectedSpreadSheetUri }) {
    const apiKey = 'AIzaSyAwUkhGE3_YB8cT4706OKT-xi3RpvnL014'
    const baseSpreadSheetApiUrl = "https://sheets.googleapis.com/v4/spreadsheets/"
    const httpClient = axios.create({ baseURL: `${baseSpreadSheetApiUrl}${selectedSpreadSheetUri}` })


    httpClient.interceptors.request.use(async config => {
        config.url = config.url + `key=${apiKey}`;

        return config;
    });

    const dispatch = useDispatch()
    const headers = useSelector(state => state.formsReducer.headers)
    const addedHeaders = useSelector(state => state.formsReducer.addedHeaders)
    const optionsHeaders = useSelector(state => state.formsReducer.optionsHeaders)
    const toEditHeader = useSelector(state => state.formsReducer.toEditHeader)
    const body = useSelector(state => state.formsReducer.body)
    const regras = useSelector(state => state.formsReducer.regras)


    useEffect(() => {
        if (selectedSpreadSheetUri) {
            httpClient.get("?").then(res => {
                let spreadSheetMetaData = res.data.sheets[0]
                dispatch(setSpreadSheetMetadata(spreadSheetMetaData))
                let maxColums = getMaxColumns(spreadSheetMetaData)
                let maxRows = getMaxRows(spreadSheetMetaData)
                httpClient.get(`/values/:batchGet?ranges=R1C1:R1C${maxColums}&`).then(res => {
                    let headersToLoad = getHeaders(res).map((header, index) => {
                        return ({ index: index, header: header })
                    })
                    dispatch(updadteHeaders(headersToLoad))
                    dispatch(loadOptionsHeaders(headersToLoad))
                })
                httpClient.get(`/values/:batchGet?ranges=R2C1:R${maxRows}C${maxColums}&`).then(res => {
                    let bodyData = getBatchRanges(res)
                    for (let bLine of bodyData) {
                        for (let index = bLine.length; index < maxColums; index++) {
                            bLine.push("")
                        }

                    }
                    dispatch(updateBody(bodyData))
                })

            })
        }
    }, [selectedSpreadSheetUri])





    const buildHeaderPicker = () => {
        return optionsHeaders.map((addedHeader, index) => {

            return <div key={index} className="form-check">
                <label className="form-check-label no">
                    {addedHeader.header}
                </label>
                <AiOutlineArrowRight onClick={(event) => addHeaders(index)} />
            </div>
        })

    }

    const removeHeaders = (indexSelected) => {
        let willStayHeaders = addedHeaders.filter((header, index) => indexSelected !== index)
        let willBeRemovedHeader = addedHeaders.filter((header, index) => indexSelected === index)[0]
        let newOptionsHeader = [...optionsHeaders]
        newOptionsHeader.push(willBeRemovedHeader)
        newOptionsHeader.sort((a, b) => a.index - b.index)
        dispatch(loadOptionsHeaders(newOptionsHeader))
        dispatch(setChoosedHeaders(willStayHeaders))

    }

    const addHeaders = (indexSelected) => {
        let willStayHeaders = optionsHeaders.filter((header, index) => indexSelected !== index)
        let willBeAddedHeader = optionsHeaders.filter((header, index) => indexSelected === index)[0]
        let newAddedHeader = [...addedHeaders]
        newAddedHeader.push(willBeAddedHeader)
        newAddedHeader.sort((a, b) => a.index - b.index)
        dispatch((loadOptionsHeaders(willStayHeaders)))
        dispatch(setChoosedHeaders(newAddedHeader))
    }

    const buildFilterHeaders = () => {
        return addedHeaders.map((added, index) => {
            return <div key={index} className="d-flex flex-row ">
                <div> <AiOutlineArrowLeft onClick={() => removeHeaders(index)} /></div>
                <div>
                    <label>
                        {added.header}
                    </label>
                </div>
                <div>
                    <HiFilter onClick={() => dispatch(setDynamicOpenFilter(added))} />
                </div>


            </div>
        })

    }

    const filterBody = () => {
        let fullFilteredBody = []
        if (addedHeaders.length > 0) {
            //itera para cada row
            for (const bodyRow of body) {
                let filteredBodyRow = bodyRow.filter((bodyCol, index) => {
                    return addedHeaders.findIndex(addedHeader => addedHeader.index === index) > -1
                })
                fullFilteredBody.push(filteredBodyRow)
            }
        } else {
            fullFilteredBody = [...body]
        }

        //fullFilteredBody = filterByRegras(fullFilteredBody)

        return fullFilteredBody.map((bLine, index) => {
            return <tr key={index}>
                {bLine.map((bElement, index) => {
                    return <td key={index} style={{ textAlign: "center" }} >{bElement}</td>
                })}
            </tr>
        })

    }

    const filterHeaders = () => {
        let fullFilteredHeader = []
       
        if (addedHeaders.length == 0) {
            fullFilteredHeader = [...headers]
        } else {
            fullFilteredHeader = [...addedHeaders]
        }

        let regrasCopy = [...regras]
        let regrasResult = []
        let regraSortedByOrder = regrasCopy.sort((regra1, regra2) => regra1.order - regra2.order)
        let indexToUpdadte = 0
        for (const regra of regraSortedByOrder) {

            if (regra.type === "calc") {
                const { values, headerRef } = regra
                let total = 0
                let newBodyLine = []
                body.forEach(bLine => {
                    let thenum = bLine[headerRef.index].match(/\d+[,.]*\d+/)

                    if ((thenum != null) && (thenum.length >= 1) && (!Number.isNaN(thenum[0]))) {
                        let valor = +thenum[0].replace(/[,.]/, "")
                        total += valor
                        newBodyLine.push(valor)
                    }
                });

                newBodyLine.sort((a, b) => a - b)
                let max = newBodyLine[newBodyLine.length - 1]
                let min = newBodyLine[0]
                let media = total / newBodyLine.length
                let calcs = [total, media, max, min]
                let regraCopy = { ...regra }
                regraCopy.calc = calcs


                regrasCopy[indexToUpdadte] = regraCopy
                regrasResult = regrasCopy

            }
            indexToUpdadte++
        }




        return <thead>
            <tr>{fullFilteredHeader.map((header, index) => {
                let filteredByHeader = regrasResult.filter(regra => regra.headerRef.index === header.index)
                return <th key={index} style={{ textAlign: "center" }} >{header.header} {filteredByHeader.map((regraFiltered, index) => {
                    let indexForValue = calcValues.findIndex(calcValue => calcValue === regraFiltered.values[0])
                    return <li key={index} style={{ textAlign: "center" }} >{`${regraFiltered.values[0]} ${Math.floor(regraFiltered.calc[indexForValue])}`}</li>
                })} </th>
            })} </tr>

        </thead>
    }

    const buildTable = () => {
        return <>
            <h3>Tabela de Dados</h3>
            <div className="tableFixHead" >
                <table >
                    {addedHeaders && filterHeaders()}
                    <tbody >
                        {addedHeaders && filterBody()}
                    </tbody>
                </table>
            </div>

        </>
    }


    const openRuleSaver = () => {

    }





    return (
        <>
            {toEditHeader && <FilterDynamic header={toEditHeader} headerName={toEditHeader.header} headers={addedHeaders} ></FilterDynamic>}
            <div className="container">
                <div className="row">
                    <div className="card col">
                        <h2>Opções</h2>
                        <div className="overflow-auto" style={{ height: 400, padding: 12 }}>
                            {optionsHeaders && buildHeaderPicker()}
                        </div>
                    </div>
                    <div className="card col">
                        <h2>Filtros</h2>
                        <div className="overflow-auto" style={{ height: 400, padding: 12 }}>
                            {addedHeaders && buildFilterHeaders()}
                        </div>
                        <Button onClick={() => openRuleSaver()}>Salvar Regra</Button>
                    </div>
                </div>
            </div>

            {buildTable()}
        </>
    );
}

export default DynamicVizualization;