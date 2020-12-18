import React, { useState, useEffect, useRef } from 'react'
import { Form, Button, Col, Row, Table } from 'react-bootstrap'
import GenericSelect from '../Components/GenericSelect';



const MontagemComposition = (props) => {


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
                    <GenericSelect returnType={"id"} noLabel={true} default={"Selecione uma Matéria Prima"} ops={props.ops} onChange={(mpId) => {
                        const materiaPrimaChoosen = props.ops.filter(materiaPrima => {
                            return Number(materiaPrima.id) === Number(mpId)
                        })
                        setMp(materiaPrimaChoosen[0])
                    }}></GenericSelect>
                </Col>
                <Col>
                    <Form.Control ref={quantidadeRef} type={'number'} placeholder={"Quantidade"} onChange={event => setQuantidade(event.target.value)} ></Form.Control>
                </Col>

               

                <Col>
                    <Button onClick={() => {
                        const montagemCompose = { quantidade: quantidade, mp: mp }
                        props.setMontagemComposes(montagemCompose)
                    }}>Adicionar</Button>
                </Col>
            </Row>
            <Table hidden={props.montagemComposes.length === 0 ? true : false}>
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
                            <Form.Label style={{ fontWeight: 'bold' }}>Açao</Form.Label>
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
                                    <Form.Label>{mc.mp.unidade}</Form.Label>
                                </td>
                                <td>                                
                                    <Form.Label>{mc.mp.nome}</Form.Label>
                                </td>
                                <td>                                
                                    <Button onClick={() => props.removeMontagemCompose(index)}>remover</Button>
                                </td>
                                
                            </tr>
                        </tbody>

                    )
                })}
            </Table>
        </>
    )



}

export default MontagemComposition