import React from 'react'
import { Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';


/* */


const GenericSelect = ({ noLabel, title, onChange, ops, selection, returnType, displayType, filter, filterField }, props) => {

    const processos = useSelector(state => state.options.processos)
    const etapas = useSelector(state => state.options.etapas)
    const parametros = useSelector(state => state.options.parametros)

    if ((ops == null) && (title == "Processo")) ops = processos
    if ((ops == null) && (title == "Etapa")) ops = etapas
    if ((ops == null) && (title == "Parametro")) ops = parametros
    if (filter) ops = ops.filter(op => op[filterField] == filter)


    const getTrueValue = (clickedIndex) => {
        let returnValue = ops.filter((op, index) => index == clickedIndex - 1)[0]
        if (returnType) {
            onChange(returnValue[returnType])
        } else {
            onChange(returnValue)
        }
          


    }

    return (
        <Form.Group >
            <Form.Label hidden={noLabel}>{title}</Form.Label>
            <Form.Control as="select" value={selection} onChange={(event) => getTrueValue(event.target.selectedIndex)}>
                <option unselectable="on" value={null} key={0}>-- {props.default ? props.default : "Seleciona uma Opção"} --</option>
                {ops && ops.map((op, index) => {
                    return <option value={op[returnType] || op.id || op} key={op.id || index}>{op[displayType || "nome"] || op} </option>
                })
                }
            </Form.Control>
        </Form.Group>
    )


}


export default GenericSelect