import React from "react"
import { Button, Form } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { updateAnaliseToSave, updateOrdensToView } from "../Reducers/analiseReducer"
import TitulaForm from "../Screens/TitulaForm"
import { backGroundByAnaliseStatus } from "./analiseService"

const analiseFieldChange = (value, analiseField, onChange) => {
    let aField = { ...analiseField }
    aField.valor = value
    if (value !== '') {
        aField.canCheckOut = true
    } else {
        aField.canCheckOut = false
    }
    onChange(aField)

}

const HistoricoMenu = (analiseField) => {

    const dispatchers = useDispatch()
    const history = useHistory()

    const gerarOcp = (analiseField) => {
        let analiseCopy = {...analiseField}
        analiseCopy.resultado = analiseCopy.lastValue
        dispatchers(updateAnaliseToSave(analiseCopy))
        history.push("/CadastroOcp")
    }

    const verOdens = (analiseField) => {
        dispatchers(updateOrdensToView(analiseField.ocps))
        history.push("/HistoricoCorrecao")
    }

    return (
        analiseField.ocps.length > 0 ?
            <div>
                <Button onClick={() => gerarOcp(analiseField)}>GERAR OCP</Button>
                <Button variant="link" onClick={() => verOdens(analiseField)}>VER OCPs</Button>

            </div> :
            <div>
                <Button onClick={() => gerarOcp(analiseField)}>GERAR OCP</Button>
            </div>



    )
}

export const loadButtons = (analiseField, checkoutAnalise) => {
    if (!analiseField.isLate) {
        return <div><Button style={{ alignmentBaseline: "center" }} onClick={() => checkoutAnalise(analiseField)}>Salvar</Button></div>
    } else {
        return HistoricoMenu(analiseField)
    }
}

const valueForm = (analiseField, { onValueChange, hideLabel, onTdClick }) => {
    return (
        <td onClick={() => onTdClick(analiseField)} style={{ minWidth : 180}}><Form.Control value={analiseField.valor} type="number" placeholder="0.0"  onChange={(event) => analiseFieldChange(event.target.value, analiseField, onValueChange)} /></td>
    )
}

const formTitula = (analiseField, { onValueChange, hideLabel ,onTdClick}) => {
    return <td onClick={() => onTdClick(analiseField)} style={{ minWidth : 180}} ><TitulaForm value={analiseField.valor} hideLabel={hideLabel} onCalculaResultado={(valor) => analiseFieldChange(valor, analiseField, onValueChange)} formula={analiseField.formula}></TitulaForm></td>
}

const formLastValueDisplay = (analiseField, { onValueChange, hideLabel ,onTdClick}) => {
    return <td onClick={() => onTdClick(analiseField)} style={{ backgroundColor: backGroundByAnaliseStatus(analiseField.analiseStatus) }}>{analiseField.lastValue} {analiseField.unidade}</td >
}


export const buildAnaliseInputMenu = (analiseField, payload) => {
    if (!analiseField.isLate) {
        if (analiseField.needCalculo) {
            return formTitula(analiseField, payload)
        } else {
            return valueForm(analiseField, payload)
        }
    } else {
        return formLastValueDisplay(analiseField,payload)
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
