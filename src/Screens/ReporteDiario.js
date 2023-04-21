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
    const [reporte, setReporte] = useState()


    const setDataRange = (data) => {
        let dataI = new Date(data)
        let dataF = new Date(data)
        dataI.setHours(0)
        dataI.setMinutes(0)
        dataI.setSeconds(0)

        dataF.setHours(23)
        dataF.setMinutes(59)
        dataF.setSeconds(59)
        setDataFinal(dataF.toISOString())
        setDataInicial(dataI.toISOString())
        setDataRef(data)

    }


    const carregarReporte = () => {
        return dataInicial && dataFinal && processo && <Button onClick={() => ScqApi.AnaliseReporte(dataInicial, dataFinal, processo.id).then(res => setReporte(res))}>Carregar Reporte Diario</Button>
    }

    const enviarWhatsApp = () => {
        return reporte && <Button onClick={() => sendWhats()}>Enviar Whats App</Button>
    }

    const sendWhats = () => {
        let baseurl = `https://api.whatsapp.com/send?text=Segue relatorio linha ${reporte.processoNome}`;
        baseurl = baseurl.concat("%0A")
        baseurl = baseurl.concat(`Dia: ${InverseOnlyDate(reporte.data)}`)
        baseurl = baseurl.concat("%0A")
        baseurl = baseurl.concat("%0A")
        reporte.etapas.forEach(etapaReporte => {
            baseurl = baseurl.concat(`*Etapa: ${etapaReporte.etapaNome}*%0A`)
            etapaReporte.resultados.forEach(result => {
                if(result.show) {
                    let encodedUnit = encodeURIComponent(result.unidade)
                    baseurl = baseurl.concat(` ${result.parametro}: ${result.resultado} ${encodedUnit} ${result.status}`)
                    baseurl = baseurl.concat("%0A")
                }
                   
            
            })
            baseurl = baseurl.concat("%0A")

        })
        var regexReplace = new RegExp(" ", "g")
        let finalUrl = baseurl.replace(regexReplace, "%20")
        window.location = finalUrl
    }

    return <>
        <Container style={{ marginTop: 20 }}>
            <GenericSelect title={"Processo"} onChange={(processo) => setProcesso(processo)} ></GenericSelect>
            <Form.Group>
                <Form.Label>Escolha a data:</Form.Label>
                <Form.Control type="date" value={dataRef} onChange={(event) => setDataRange(event.target.value)}></Form.Control>
            </Form.Group>
            {carregarReporte()}
            {enviarWhatsApp()}
        </Container>
    </>


}
export default withMenuBar(connect(mapToStateProps.toProps, dispatchers)(ReporteDiario))