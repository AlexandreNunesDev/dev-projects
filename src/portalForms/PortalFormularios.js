import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useDispatch, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { withMenuBar } from '../Hocs/withMenuBar';
import { buildFormModel } from '../models/portalFormsModel';
import { clear, setFormNameChoosed, setFullFormTarget, setSpreadSheetId } from '../Reducers/dyanamicForms';
import { getToken } from '../Services/auth';
import { getOauthToken } from '../Services/googleTokenService';
import DynamicVizualization from './dynamicVisualizer';


function PortalFormularios() {

    const [formNames,setFormNames] = useState([])
    const [targetRowIndex, setTargetRowIndex] = useState(0)
    const apiKey =  'AIzaSyAwUkhGE3_YB8cT4706OKT-xi3RpvnL014'
    const sheetBaseUrl = 'https://sheets.googleapis.com/v4/spreadsheets/1_RVYwW2QaWfaq3Ib-SOs6jo9qbGEbqh01rHRBrS2ewY/values'
    const dispatch = useDispatch()
    const fullFormTarget = useSelector(state => state.formsReducer.fullFormTarget)
    const [spreadSheetId,setSpreadSheetId] = useState()
    const formNameChoosed = useSelector(state => state.formsReducer.formNameChoosed)
    const toast =  useToasts()
    const [oauthClient,setOAuthClient] = useState()

    const httpClient = axios.create({ baseURL: sheetBaseUrl })
    httpClient.interceptors.request.use(async config => {
        config.url = config.url + `&key=${apiKey}`;
        return config;
    });



    useEffect(() => {
        httpClient.get(":batchGet?ranges=dadosPortal!A:A").then(res => {
            let formListNames = res.data.valueRanges[0].values.map(value => value[0])
            formListNames.shift()
            setFormNames(formListNames)
        })
        setOAuthClient(getOauthToken())
    }, [])

    const getValueRange = (response) => {
        return response.data.valueRanges
    }

    useEffect(() => {
        console.log(oauthClient)
    },[oauthClient])

    const setTargetForm = (selected) => {
        dispatch(clear())
        dispatch(setFormNameChoosed(selected))
        let index = formNames.findIndex(forms => forms == selected)
        setTargetRowIndex(index+2)
        httpClient.get(`:batchGet?ranges=dadosPortal!B${index+2}:E${index+2}`).then(async res => {
            let valueRanges = getValueRange(res)
            let values = valueRanges[0].values
            if(values) {
                let fullFormsModel = buildFormModel(valueRanges[0].values[0])
                dispatch(setFullFormTarget(fullFormsModel))
            } else {
                toast.addToast("Formulario não existente",{ appearance: 'warning' })
            }
            
        })
    }

    const openForm = (selected) => {
        httpClient.get(`:batchGet?ranges=dadosPortal!B${targetRowIndex}`).then(async res => {
            let linkWhats = getValueRange(res)[0].values[0][0]
            window.open(linkWhats)
        })
    }



    const enviarParaWahts = async () => {
        httpClient.get(`:batchGet?ranges=dadosPortal!D${targetRowIndex}`).then(async res => {
            let linkWhats = await axios.get(getValueRange(res)[0].values[0][0])
            linkWhats = linkWhats.data.values[0][0]
            window.open(linkWhats)
        })
    }

    const abreDrive = async () => {
        httpClient.get(`:batchGet?ranges=dadosPortal!E${targetRowIndex}`).then(async res => {
            let likeDrive = await axios.get(getValueRange(res)[0].values[0][0])
            likeDrive = likeDrive.config.url
            window.open(likeDrive)
        })
    }

    const linkGrafico = async () => {
        httpClient.get(`:batchGet?ranges=dadosPortal!C${targetRowIndex}`).then(async res => {
            let idSpreadSheet = getValueRange(res)[0].values[0]
            console.log(idSpreadSheet)
            setSpreadSheetId(idSpreadSheet)
        })
    }


return (
    <>
        <Container style={{marginTop : 24}}>
            <h2>Portal formularios</h2>
            <Typeahead id={"serachForm"}   clearButton onChange={(selected) => setTargetForm(selected)} options={formNames} />
            {fullFormTarget && <Button hidden={fullFormTarget.link == null} style={{margin : 16}} onClick={() => enviarParaWahts()}>Enviar para Whats App</Button>}
            {fullFormTarget && <Button hidden={fullFormTarget.idFormulario == null} style={{margin : 16}} onClick={() => openForm()}>Abrir Formulario</Button>}
            {fullFormTarget && <Button hidden={fullFormTarget.drive == null} style={{margin : 16}} onClick={() => abreDrive()}>Abrir Arquivos Drive</Button>}
            {fullFormTarget && <Button hidden={fullFormTarget.idPlanilha == null} style={{margin : 16}} onClick={() => linkGrafico()}>Ver dados</Button>}
            {spreadSheetId  && <DynamicVizualization selectedSpreadSheetUri={spreadSheetId}></DynamicVizualization>}
            
        </Container>
    </>
);
}

export default withMenuBar(PortalFormularios);