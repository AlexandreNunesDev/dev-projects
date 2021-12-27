import React, { useState, useEffect } from 'react'
import { Form, Table,Col,Row } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { Typeahead } from 'react-bootstrap-typeahead'
import ScqApi from '../Http/ScqApi'


const AdicaopH = (props) => {


    const [materiasPrima, setMateriasPrima] = useState([])
    const [mpOptions, setMateriasPrimaOptions] = useState([])
    const [selectedMp, setSelectedMp] = useState()


    useEffect(() => {
        ScqApi.ListaMateriaPrimas().then(response => setMateriasPrima(response))

    }, [])

    useEffect(() => {
        materiasPrima && setMateriasPrimaOptions(materiasPrima.map((mp) => {
            return mp.nome
        }))
    }, [materiasPrima])


    const selectedMpHandler = (selectedMpNome) => {
        const filtered = materiasPrima.filter((mp, index) => {
            return mp.nome === selectedMpNome[0]
        })
        setSelectedMp(filtered[0])
    }





    return (
        <>
            <h4>Adicoes</h4>
            <Row>
                <Col >
                    <Form.Label style={{ fontWeight: 'bold' }}>Materia Prima</Form.Label>
                </Col>
                <Col >
                    <Form.Label style={{ fontWeight: 'bold' }}>Quantidade</Form.Label>
                </Col>
            </Row>
            <Row>
                <Col >
                    <Typeahead

                        id={"searchMp"}
                        onChange={(selected) => {
                            selectedMpHandler(selected)
                        }}

                        options={mpOptions}

                    />

                </Col>
                <Col >
                    <Form.Control type="text" onChange={event => {
                        if (selectedMp) {
                            props.setMpQtd(event.target.value, selectedMp.id, selectedMp.unidade)
                        }

                    }} ></Form.Control>
                </Col>
            </Row>



        </>
    )



}

export default AdicaopH