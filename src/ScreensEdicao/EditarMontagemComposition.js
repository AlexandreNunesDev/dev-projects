import React, { useState, useEffect, useRef } from 'react'
import { Form, Button, Col, Row, Table } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead';



const EditarMontagemComposition = (props) => {


    const [quantidade, setQuantidade] = useState('')
    const [mp, setMp] = useState('')
    const quantidadeRef = useRef()


    useEffect(() => {
        quantidadeRef.current.value = ''
    }, [props.montagemComposes])

    return (
        <>
            <h4>Composicao de Montagem</h4>
            <Row>
              
                
                <Col>
                <Typeahead id={"searchMp"}
                        clearButton
                        labelKey={"nome"}
                        onChange={(mp) => setMp(mp[0])}
                        options={props.ops || []} />
                </Col>

                <Col>
                    <Form.Control ref={quantidadeRef} type={'number'} placeholder={"Quantidade"} onChange={event => setQuantidade(event.target.value)} ></Form.Control>
                </Col>

                <Col>
                    <Button onClick={() => {
                 
                        const montagemCompose = { quantidade: Number(quantidade), mpNome : mp.nome,mpId : mp.id,unidade : mp.unidade,id : null}
                        props.setMontagemComposes(montagemCompose)
                    }}>Adicionar</Button>
                </Col>
            </Row>
            <Table style={{marginTop : 12}} hidden={props.montagemComposes.length === 0 ? true : false}>
                <thead>
                    <tr>
                        <th md={'auto'}>
                            <Form.Label style={{ fontWeight: 'bold' }}>Id</Form.Label>
                        </th>
                        <th md={'auto'}>
                            <Form.Label style={{ fontWeight: 'bold' }}>Qtd</Form.Label>
                        </th>
                        <th md={'auto'}>
                            <Form.Label style={{ fontWeight: 'bold' }}>Un.</Form.Label>
                        </th>
                        <th>
                            <Form.Label style={{ fontWeight: 'bold' }}>Nome</Form.Label>
                        </th>
                        <th>
                            <Form.Label style={{ fontWeight: 'bold' }}>Ação</Form.Label>
                        </th>
                    </tr>
                </thead>
                {props.montagemComposes.map((mc, index) => {
                    return (


                        <tbody key={index}>
                            <tr>
                                <td md={'auto'}>
                                    <Form.Label>{index + 1}</Form.Label>
                                </td>
                                <td md={'auto'}>
                                    <Form.Label>{mc.quantidade}</Form.Label>
                                </td>
                                <td md={'auto'}>
                                    <Form.Label>{mc.unidade}</Form.Label>
                                </td>
                                <td>                                
                                    <Form.Label>{mc.mpNome}</Form.Label>
                                </td>
                                <td>                                
                                    <Button style={{backgroundColor : "RED", borderColor : "RED"}} onClick={() => {
                                        props.removerMontagemCompose(index)
                                    }}>Remover</Button>
                                </td>
                                
                            </tr>
                        </tbody>

                    )
                })}
            </Table>
        </>
    )



}

export default EditarMontagemComposition