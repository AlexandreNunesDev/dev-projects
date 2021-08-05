import { Container, TableBody, TableHead } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { Button, Col, Form, Table } from "react-bootstrap"
import { connect } from "react-redux"
import { Label } from "recharts"
import GenericDropDown from "../Components/GenericDropDown"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import dispatchers from "../mapDispatch/mapDispathToProps"
import mapToStateProps from "../mapStateProps/mapStateToProps"
import { formatIsoDate } from "../Services/stringUtils"

export const HistoricoDeAnalise = () => {

    const [actualSearchValue, setActualSearchValue] = useState('')
    const [acutalObjId, setActualObjId] = useState('')
    const [options, setOptions] = useState(null)
    const [suggestionLi, setSuggestionLi] = useState(null)
    const [selected, setSelected] = useState(false)
    const [actualFilter, setActualFilter] = useState()
    const [dataInicial, setDataInicial] = useState(null)
    const [dataFinal, setDataFinal] = useState(null)



    useEffect(() => {
        // Verifica se as datas são diferente de null
        if ((dataInicial !== null) && (dataFinal !== null)) {
            //Verifico se a data incial é menor que a data final
            let dataIn = new Date(dataInicial)
            let dataFi = new Date(dataFinal)
            if (dataIn.getTime() < dataFi.getTime()) {
                ScqApi.LoadAnaliseHistocial(dataInicial, dataFinal).then(res => {setOptions(res); setSuggestionLi(res)})
            }
        }

    }, [dataFinal, dataInicial])

    const filter = (value, needFilter) => {
        if (needFilter) {
            if (value.length !== 0) {
                setSuggestionLi(dynamicFieldFilter(value))
                setSelected(true)
            } else {
                setSuggestionLi(options)
                setSelected(false)
            }
        } else {
            setSuggestionLi([])
            setActualSearchValue(value)
            setSelected(false)
        }

    }

    const updadteField = (value, needFilter) => {
        setActualSearchValue(value)
        filter(value, needFilter)

    }


    const filterfunction = (object, valor) => {

        let hasMatch = false;
        for (var [key] of Object.entries(object)) {
            //Se for string e comecar com o texto retorna true
            if (typeof object[key] === 'string') {
                if (object[key].toLowerCase().startsWith(valor.toLowerCase())) {
                    setActualFilter([key])
                    hasMatch = true
                }
            }

        }

        return hasMatch

    }




    const dynamicFieldFilter = (valor) => {
        return options.filter(op => filterfunction(op, valor));

    }

    const getRows = () => {
    
        return (
            <>
                {suggestionLi?.map(op => {
                    return(<tr>
                        <td style={{ textAlign: "center" }}>{op.id}</td>
                        <td style={{ textAlign: "center" }}>{op.nomeProcesso}</td>
                        <td style={{ textAlign: "center" }}>{op.nomeEtapa}</td>
                        <td style={{ textAlign: "center" }}>{op.nomeParametro}</td>
                        <td style={{ textAlign: "center" }}>{op.data}</td>
                        <td style={{ textAlign: "center" }}>{op.valor}</td>
                        <td style={{ textAlign: "center" }}>{op.pMin}</td>
                        <td style={{ textAlign: "center" }}>{op.pMax}</td>
                  
                        <td><Button>Ver Ocps</Button></td>
                    </tr>)
                })}

            </>
        )
    }

    const getHeads = () => {
        return (
            <>
              
                    <tr>
                        <th style={{ textAlign: "center" }}>Id</th>
                        <th style={{ textAlign: "center" }}>Processo</th>
                        <th style={{ textAlign: "center" }}>Etapa</th>
                        <th style={{ textAlign: "center" }}>Processo</th>
                        <th style={{ textAlign: "center" }}>Data</th>
                        <th style={{ textAlign: "center" }}> Resultado</th>
                        <th style={{ textAlign: "center" }}>Min</th>
                        <th style={{ textAlign: "center" }}>Max</th>
                        <th style={{ textAlign: "center" }}>Ação</th>
                    </tr>
                

            </>
        )
    }
    




    return (
        <>


            <Container style={{ marginTop: 20 }}>
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
                <Form.Row>
                    <Col>
                        <Form.Control placeholder="Filtrar por..." onChange={(event) => updadteField(event.target.value, true)}></Form.Control>
                    </Col>
                    <Col>
                        <Form.Label>Filtrado por: <b>  {` ${actualFilter?.toString().charAt(0).toUpperCase() +  actualFilter?.toString().replace(/([A-Z])/g, ' $1').trim().slice(1) || ''} `}</b></Form.Label>
                    </Col>
                </Form.Row>
                <h3 style={{ textAlign: "center", margin : 20 }}> Historico de Analise</h3>
                <Table>
                    <TableHead>
                        { getHeads()}
                    </TableHead>
                    <TableBody>
                        {options && getRows()}
                    </TableBody>
                </Table>

            </Container>
        </>
    )
}

export default withMenuBar(connect(mapToStateProps.toProps, dispatchers)(HistoricoDeAnalise))