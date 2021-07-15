import React, { useState, useEffect } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { Typeahead } from 'react-bootstrap-typeahead'
import { useSelector } from 'react-redux'





const AdicaoFree = (props) => {

    const materiasPrima = useSelector(state => state.options.materiasPrima)
    const [mpOptions, setMateriasPrimaOptions] = useState([])
    const [selectedMpNome, setSelectedMpNome] = useState([])
    const [selectedMp, setSelectedMp] = useState()
    const [quantidade, setQuantidade] = useState('')




 
    useEffect(() => {
        materiasPrima && setMateriasPrimaOptions(materiasPrima.map((mp) => {
            return mp.nome
        }))
    }, [materiasPrima])

    useEffect(() => {
        const filtered = materiasPrima.filter((mp, index) => {
            return mp.nome === selectedMpNome[0]
        })
        setSelectedMp(filtered[0])
    }, [selectedMpNome])


    const cleanForm = () => {

        setQuantidade('')
        setSelectedMpNome({})
    }

    const getMpQuantidade = (mpqtd) => {
      let token = mpqtd.split(":")
      return token[1]
    }




    return (
        <>

            <Row  >
                <Col>
                    <h4>Adicoes</h4>
                </Col>

            </Row>
          
            <Row >
                <Col>
                 
                    <Form.Group>

                        <Form.Label>Nome</Form.Label>

                        <Typeahead id={"searchMp"}
                            clearButton
                            onChange={(selected) => {
                                setSelectedMpNome(selected)
                            }}
                           
                            options={mpOptions}   />

                    </Form.Group>
                </Col>
                <Col>

                    <Form.Group>
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control value={quantidade} type="text" onChange={event => {
                            setQuantidade(event.target.value)


                        }} ></Form.Control>


                    </Form.Group>

                </Col>
                
                <div style={{ marginTop: 15 }} className="align-self-center">
                    <Button onClick={() => {
                        if (selectedMp) {
                            props.setMpQtd(quantidade, selectedMp.id, selectedMp.unidade, props.mpQtds.length,selectedMp.nome)
                            cleanForm()
                        }
                    }} >Adicionar</Button>
                </div>





            </Row>
          
            {props.mpQtds.length > 0 &&
                <Table >
                    <thead>

                        <tr>
                            <th>
                                <Form.Label>N</Form.Label>
                            </th>
                            <th md={'auto'}>
                                <Form.Label style={{ fontWeight: 'bold' }}>Materia Prima</Form.Label>
                            </th>
                            <th md={'auto'}>
                                <Form.Label style={{ fontWeight: 'bold' }}>Quantidade</Form.Label>
                            </th>
                            <th md={'auto'}>
                                <Form.Label>Acao</Form.Label>
                            </th>


                        </tr>
                    </thead>
                    <tbody>

                        {props.mpQtds.map((mpqtd, index) => {
                            return (
                                <tr key={index}>
                                    <td md={'auto'}>
                                        <Form.Label style={{ fontWeight: 'bold' }}>{index + 1}</Form.Label>
                                    </td>
                                    <td md={'auto'}>
                                        <Form.Label style={{ fontWeight: 'bold' }}>{props.mpNomes[index]}</Form.Label>
                                    </td>
                                    <td md={'auto'}>
                                        <Form.Label style={{ fontWeight: 'bold' }}>{getMpQuantidade(mpqtd)}</Form.Label>
                                    </td>
                                    <td md={'auto'}>
                                        <Button style={{ backgroundColor: "RED", borderColor: "RED" }} onClick={() => props.removeMpQtd(index)} >Del</Button>
                                    </td>

                                </tr>)
                        })}




                    </tbody>

                </Table>}

        </>
    )



}

export default AdicaoFree