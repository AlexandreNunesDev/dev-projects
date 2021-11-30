import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GenericSelect from '../Components/GenericSelect';
import { withMenuBar } from '../Hocs/withMenuBar';
import React from 'react';
import { Button, Container } from 'react-bootstrap';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { updateFormularios } from '../Reducers/formularioReducer';
import { Typeahead } from 'react-bootstrap-typeahead';
import { arrayExpression } from '@babel/types';
import { buildFormModel } from '../models/portalFormsModel';

function PortalFormularios() {

    const targetForm = useSelector(state => state.formulariosReducer.targetForm)
    const formNames = useSelector(state => state.formulariosReducer.formularios)
    const apiKey = useSelector(state => state.global.googlKey)
    const [fullFormTarget,setFullFormTarget] = useState()
    const sheetBaseUrl = useSelector(state => state.global.portalSheetApi)
    const [targetRowIndex, setTargetRowIndex] = useState(0)
    const httpClient = axios.create({ baseURL: sheetBaseUrl })
    const dispatch = useDispatch()
    httpClient.interceptors.request.use(async config => {
        config.url = config.url + `&key=${apiKey}`;
        return config;
    });



    useEffect(() => {

        httpClient.get(":batchGet?ranges=dadosPortal!A:A").then(res => {
            let formListNames = res.data.valueRanges[0].values.map(value => value[0])
            formListNames.shift()
            dispatch(updateFormularios(formListNames))
        })
        return () => {

        }
    }, [])

    const getValueRange = (response) => {
        return response.data.valueRanges
    }



    const setTargetForm = (selected) => {
        let index = formNames.findIndex(forms => forms == selected)
        setTargetRowIndex(index+2)
        httpClient.get(`:batchGet?ranges=dadosPortal!B${index+2}:D${index+2}`).then(async res => {
            let valueRanges = getValueRange(res)
            let fullFormsModel = buildFormModel(valueRanges[0].values[0])
            setFullFormTarget(fullFormsModel)
        })
    }

    const openForm = (selected) => {
        httpClient.get(`:batchGet?ranges=dadosPortal!B${targetRowIndex}`).then(async res => {
            let linkWhats = getValueRange(res)[0].values[0][0]
            window.open(linkWhats)
        })
    }

    useEffect(() => console.log(targetRowIndex), [targetRowIndex])


    const enviarParaWahts = async () => {
        httpClient.get(`:batchGet?ranges=dadosPortal!D${targetRowIndex}`).then(async res => {
            let linkWhats = await axios.get(getValueRange(res)[0].values[0][0])
            linkWhats = linkWhats.data.values[0][0]
            window.open(linkWhats)
        })
    }


return (
    <>
        <Container style={{marginTop : 24}}>
            <h2>Portal formularios</h2>
            <Typeahead id={"serachForm"} clearButton onChange={(selected) => setTargetForm(selected)} options={formNames} />
            {fullFormTarget && <Button hidden={fullFormTarget.link == null} style={{margin : 16}} onClick={() => enviarParaWahts()}>Enviar para Whats App</Button>}
            {fullFormTarget && <Button hidden={fullFormTarget.idFormulario == null} style={{margin : 16}} onClick={() => openForm()}>Abrir Formulario</Button>}
        </Container>
    </>
);
}

export default withMenuBar(PortalFormularios);