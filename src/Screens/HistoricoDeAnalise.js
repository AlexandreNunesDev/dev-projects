import { Container, TableBody, TableHead } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { Button, Col, Form, Table } from "react-bootstrap"
import { connect } from "react-redux"
import OcpView from "../Components/OcpView"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import dispatchers from "../mapDispatch/mapDispathToProps"
import mapToStateProps from "../mapStateProps/mapStateToProps"
import { formatIsoDate } from "../Services/stringUtils"

export const HistoricoDeAnalise = (props) => {

    const [options, setOptions] = useState(null)
    const [suggestionLi, setSuggestionLi] = useState(null)
   
    const [actualFilter, setActualFilter] = useState([])
    const [dataInicial, setDataInicial] = useState(null)
    const [dataFinal, setDataFinal] = useState(null)



    useEffect(() => {
        // Verifica se as datas são diferente de null
        if ((dataInicial !== null) && (dataFinal !== null)) {
            //Verifico se a data incial é menor que a data final
            let dataIn = new Date(dataInicial)
            let dataFi = new Date(dataFinal)
            if (dataIn.getTime() < dataFi.getTime()) {
                ScqApi.LoadAnaliseHistocial(dataInicial, dataFinal).then(res => {setOptions(res); setSuggestionLi(res) })
            }
        }

    }, [dataFinal, dataInicial])

    const filter = (value, needFilter) => {
    
        const searchTokens = value.split(",")
        if (needFilter) {
            if (value.length !== 0) {
                let resultList = []
                searchTokens.forEach(searchElement => {
                    if(searchElement.trim().length !== 0) {
                        let textToSearch = removeAccents(searchElement.toLowerCase()).trim()
                        let resultFilter
                        if(resultList.length > 0) {
                           resultFilter = dynamicFieldFilter(textToSearch,resultList)
                        }  else {
                            resultFilter = dynamicFieldFilter(textToSearch)
                        }
                      
                        if(resultFilter.length !== 0) {
                           resultList = resultFilter
                        }
                    } 
                });

                setSuggestionLi(resultList)
            } else {
                setSuggestionLi(options)
          
            }
        } else {
            setSuggestionLi([])
           
      
        }
    

    }



    const removeAccents = (str) => {
        var accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
        var accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        str = str.split('');
        var strLen = str.length;
        var i, x;
        for (i = 0; i < strLen; i++) {
            if (Number((x = accents.indexOf(str[i]))) !== -1) {
                str[i] = accentsOut[x];
            }
        }
        return str.join('');
    }


    const filterfunction = (object, textToSearch) => {
        if(actualFilter.length>1) {
            setActualFilter([])
        }
        
            let hasMatch = false;
           
            for (var [key] of Object.entries(object)) {
                //Se for string e comecar com o texto retorna true
                if (typeof object[key] === 'string') {
                    let acutalKeyToSearch = removeAccents(object[key].toLowerCase()).trim()
                    if (acutalKeyToSearch.startsWith(textToSearch)) {
                        setFiltersDisplay([key])
                        hasMatch = true
                    }

                }

            }
        



        return hasMatch

    }




    const dynamicFieldFilter = (valor,opsRef) => {
                if(opsRef) {
                    return opsRef.filter(op => filterfunction(op, valor));
                } else {
                    return options.filter(op => filterfunction(op, valor));
                }
           
        
       

    }

    const getRows = () => {

        return (
            <>
                {suggestionLi?.map(op => {
                    return (<tr key={op.id}>
                        <td style={{ textAlign: "center" }}>{op.id}</td>
                        <td style={{ textAlign: "center" }}>{op.nomeProcesso}</td>
                        <td style={{ textAlign: "center" }}>{op.nomeEtapa}</td>
                        <td style={{ textAlign: "center" }}>{op.nomeParametro}</td>
                        <td style={{ textAlign: "center" }}>{op.data}</td>
                        <td style={{ textAlign: "center" }}>{op.valor}</td>
                        <td style={{ textAlign: "center" }}>{op.pMin}</td>
                        <td style={{ textAlign: "center" }}>{op.pMax}</td>

                        <td style={{ textAlign: "center" }}><Button disabled={op.ocps.length === 0  ? true : false } onClick={() => { props.loadOcpView(op.id); props.showOcpView(true) }} >{op.ocps.length > 1 ?  `Ver ${op.ocps.length} Ocps` :  `Ver ${op.ocps.length === 0 ? '' : op.ocps.length } Ocp`  }</Button></td>
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
                    <th style={{ textAlign: "center" }}>Parametro</th>
                    <th style={{ textAlign: "center" }}>Data</th>
                    <th style={{ textAlign: "center" }}>Resultado</th>
                    <th style={{ textAlign: "center" }}>Min</th>
                    <th style={{ textAlign: "center" }}>Max</th>
                    <th style={{ textAlign: "center" }}>Ocps</th>
                </tr>


            </>
        )
    }



    const setFiltersDisplay = (key) => {
        let filterToAdd = key.toString().charAt(0).toUpperCase() + key.toString().replace(/([A-Z])/g, ' $1').trim().slice(1)
        if(actualFilter.length === 0) {
            setActualFilter([...actualFilter, filterToAdd])
        } else {
            if(!actualFilter.includes(filterToAdd)){
                setActualFilter([...actualFilter, filterToAdd])
            }
        }
       
      


    }


    return (
        <>

            <OcpView></OcpView>
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
                        <Form.Control placeholder="Filtrar por..." onChange={(event) => filter(event.target.value, true)}></Form.Control>
                    </Col>
                    <Col>
                        <Form.Label>Filtrado por: <b>  {actualFilter.join(",") || ''}</b></Form.Label>
                    </Col>
                </Form.Row>
                <h3 style={{ textAlign: "center", margin: 20 }}> Historico de Analise</h3>
                <Table>
                    <TableHead>
                        {getHeads()}
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