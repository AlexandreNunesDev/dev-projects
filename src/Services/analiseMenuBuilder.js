import React from "react"
import { Form } from "react-bootstrap"
import TitulaForm from "../Screens/TitulaForm"

const analiseFieldChange = (value, analiseField, onChange) => {
    let aField = {...analiseField} 
    aField.valor = value
    if(value !== '') {
     aField.canCheckOut = true
    } else {
     aField.canCheckOut = false
    }
    onChange(aField)
   
 }

const valueForm = (analiseField,{ onValueChange, hideLabel }) => {

    return (
        <>
            <Form.Label hidden={hideLabel}>Valor</Form.Label>
            <Form.Control value={analiseField.valor} style={{width : "69%"}} type="number" placeholder={"0.00"} onChange={(event) => analiseFieldChange(event.target.value,analiseField,onValueChange)} />
        </>
    )
}

const formTitula = (analiseField, {onValueChange,hideLabel}) => {
    return <TitulaForm  value={analiseField.valor} hideLabel={hideLabel} onCalculaResultado={(valor) => analiseFieldChange(valor,analiseField,onValueChange)} formula={analiseField.parametro.formula}></TitulaForm>
}


export const buildAnaliseInputMenu = (analiseField, payload) => {
    if (analiseField.parametro.menuType === "Acao") {
           return valueForm(analiseField,payload)
    } else {
        if (analiseField.parametro.unidade === "pH") {
            return valueForm(analiseField,payload)
        } else {
            return formTitula(analiseField,payload)
        }

    }

}


export const getAnaliseStatus = (resultado, parametro) => {
    if (resultado < parametro?.pMin || resultado > parametro?.pMax) {
        return 'fofe'
    } else if ((resultado > parametro?.pMinT && resultado < parametro?.pMaxT)) {
        return 'deft'
    } else {
        return 'foft'
    }
}
