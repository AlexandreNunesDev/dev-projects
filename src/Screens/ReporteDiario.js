import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { connect } from "react-redux";
import GenericSelect from "../Components/GenericSelect";
import { withMenuBar } from "../Hocs/withMenuBar";
import dispatchers from "../mapDispatch/mapDispathToProps";
import mapToStateProps from "../mapStateProps/mapStateToProps";
import { reverse } from 'underscore.string';
import { DateAndTime, InverseOnlyDate, OnlyDate } from '../Services/stringUtils';
import ScqApi from '../Http/ScqApi';


const ReporteDiario = () => {

    const [processo, setProcesso] = useState()
    const [dataInicial, setDataInicial] = useState()
    const [dataFinal, setDataFinal] = useState()
    const [dataRef, setDataRef] = useState()
    const [textReporte, setTextReporte] = useState('')
    const [textAreaLength, setTextAreaLength] = useState(3)




    const setDataRange = (data) => {
        let dataI = new Date(data)
        let dataF = new Date(data)
        dataI.setUTCHours(0, 0, 0)
        dataF.setUTCHours(23, 59, 59)
        setDataFinal(dataF.toISOString())
        setDataInicial(dataI.toISOString())
        setDataRef(data)

    }


    const carregarReporte = () => {
        return dataInicial && dataFinal && processo && <Button onClick={() => {
            ScqApi.AnaliseReporte(dataInicial, dataFinal, processo.id).then(res => {
                setTextAreaLength(res.data.length)
                buildTextAndUrl(res)
            })
        }}>Carregar Reporte Diario</Button>
    }

    const enviarWhatsApp = () => {
        return textReporte && textReporte != '' && <Button onClick={() => sendWhats()}>Enviar Whats App</Button>
    }


    const sendWhats = () => {
        let textoFinal = ''
        let url = "https://api.whatsapp.com/send?text="

        var breakLineRegEx = new RegExp("\n", "g")
        var spaceRegEx = new RegExp("\s", "g")
        textoFinal = textReporte.replace(breakLineRegEx, "%0A")
        textoFinal = textoFinal.replace(spaceRegEx, "%20")
        url = url + textoFinal
        window.location = url
    }
    const buildTextAndUrl = (reporte) => {

        let message = `Segue relatorio linha ${reporte.processoNome}`;
        message = message.concat("\n")
        message = message.concat(`Dia: ${InverseOnlyDate(reporte.data)}`)
        message = message.concat("\n")
        message = message.concat("\n")
        let shouldRender = false
        reporte.etapas.forEach(etapaReporte => {
            if (etapaReporte.resultados.length > 0) {
                message = message.concat(`*Etapa: ${etapaReporte.etapaNome}*\n`)
                etapaReporte.resultados.forEach(result => {
                    shouldRender = result.show
                    if (result.show && result.status != "OK") {
                        let encodedUnit = encodeURIComponent(result.unidade)
                        message = message.concat(` ${result.parametro}: ${result.resultado} ${encodedUnit} ${result.status}`)
                        message = message.concat("\n")
                    }


                })
            }
            if (shouldRender) message = message.concat("\n")


        })

        setTextReporte(message)
    }




    return <>
        <Container style={{ marginTop: 20 }}>
            <GenericSelect title={"Processo"} onChange={(processo) => {
                setTextReporte('')
                setProcesso(processo)
            }} ></GenericSelect>
            <Form.Group>
                <Form.Label>Escolha a data:</Form.Label>
                <Form.Control type="date" value={dataRef} onChange={(event) => {
                    setTextReporte('')
                    setDataRange(event.target.value)
                }}></Form.Control>
            </Form.Group>
            {textReporte && <Form.Group>
                <Form.Label>Reporte:</Form.Label>
                <Form.Control as="textarea" rows={12} value={textReporte || ''} onChange={(event) => setTextReporte(event.target.value)}></Form.Control>
            </Form.Group>}
            {carregarReporte()}
            {enviarWhatsApp()}
        </Container>
    </>


}
export default withMenuBar(connect(mapToStateProps.toProps, dispatchers)(ReporteDiario))