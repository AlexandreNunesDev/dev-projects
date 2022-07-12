import ScqApi from "../Http/ScqApi"
import React, { useEffect, useRef, useState } from 'react'

const { Form, Col } = require("react-bootstrap")

const TitulaForm = (props) => {

    const refText = useRef(null)
    const [viragem, setviragem] = useState('')


    useEffect(() => {
        if (props.value) {
            refText.current.value = props.value
        }
    }, [props])

    const calcular = (event) => {
        if (event.key == "Enter") {
            ScqApi.Calcular(props.formula, viragem).then(res => {
                props.onCalculaResultado(res)
                refText.current.value = res
            })
        }

    }

    const recalcular = () => {
        refText.current.value = ''
        props.onCalculaResultado(null)

    }


    const onValuefieldChange = (value) => {
        setviragem(value)
        if (value === '') {
            props.onCalculaResultado(null)
        }
    }


    return (
        <>
            <Form.Row hidden={props.hideLabel}>
                <Col>
                    <Form.Label>
                        Viragem
                    </Form.Label>
                </Col>
            </Form.Row>
            <Form.Row>
                <Form.Control type="number" ref={refText} placeholder={"enter p/calc"} onFocus={() => recalcular()} onKeyDown={(event) => calcular(event)} onChange={(event) => onValuefieldChange(event.target.value)} />
            </Form.Row>
        </>

    )
}

export default TitulaForm