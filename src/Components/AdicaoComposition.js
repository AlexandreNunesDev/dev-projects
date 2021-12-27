import React from 'react'
import { Form, Table,Col,Row } from 'react-bootstrap'




const AdicaoComposition = (props) => {

    return (
        <>
            <Row>
                <Col>
                    <h4>Adicoes</h4>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label style={{ fontWeight: 'bold' }}>Materia Prima</Form.Label>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label style={{ fontWeight: 'bold' }}>Quantidade</Form.Label>
                    </Form.Group>
                </Col>
            </Row>
                {props.mps?.map((mp, index) => {
                    const correcaoArray = props.correcaoArray
                    let actualPair = []
                    let actualCorrection = 0;
                    correcaoArray.forEach((pair) => {
                        actualPair = String(pair).split(":")
                        if (String(actualPair[0]) === String(mp.id)) {
                            actualCorrection = actualPair[1]
                        }
                    })
                    return (
                        <Row key={index}>
                            <Col >
                                <Form.Label>{mp.nome}</Form.Label>
                            </Col>
                            <Col >
                                <Form.Control type="number" placeholder={`Correcao Surgerida ${props.unidadeParametro === "%" ? actualCorrection * 10 : actualCorrection} ${mp.unidade}`} onChange={event => props.setMpQtd(event.target.value, mp.id, mp.unidade, index)}></Form.Control>
                            </Col>
                        </Row>

                    )
                })}
        </>
    )



}

export default AdicaoComposition