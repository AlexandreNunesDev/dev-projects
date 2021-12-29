import ScqApi from "../Http/ScqApi"
import React, { useEffect, useRef, useState } from 'react'

const { Form, Button, Col } = require("react-bootstrap")

const TitulaForm = (props) => {

    const refText = useRef(null)
    const [viragem, setviragem] = useState('')
    const [isHidden, setisHidden] = useState(false)


    useEffect(() => {
        if (props.value) {
            refText.current.value = props.value
            setisHidden(true)
        }
    }, [])

    const calcular = () => {
        ScqApi.Calcular(props.formula, viragem).then(res => {
            props.onCalculaResultado(res)
            setisHidden(true)
            refText.current.value = res
        })
    }

    const recalcular = () => {
        refText.current.value = ''
        props.onCalculaResultado(null)
        setisHidden(false)

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


                <Col>
                    <Form.Control type="number" ref={refText} placeholder={"0.00"} onChange={(event) => onValuefieldChange(event.target.value)} />
                </Col>



                <Col>

                    <Button variant="primary" hidden={isHidden} onClick={() => { calcular() }}>Calcular</Button>
                    <Button variant="primary" hidden={!isHidden} onClick={() => { recalcular() }}>Recalcular</Button>
                </Col>

            </Form.Row>
        </>

    )
}

export default TitulaForm