import React, { useEffect, useState } from 'react'
import { Form, Col, } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';


const CadastroDeOcp = (props) => {

    const [acao, setAcao] = useState()
    const [observacao, setObservacao] = useState()
    const [prazo, setPrazo] = useState(new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0])
    const [responsavel, setResponsavel] = useState('')





    useEffect(() => {
        props.updateOcp({ analiseId: props.analise?.id || null, responsavel, observacao, acao, prazo, parametroId: props.parametroId })
    }, [observacao, acao, prazo, responsavel])


    return (
        <>


            <Form.Row  >
                <Col>
                    <h4>Ação</h4>
                </Col>

            </Form.Row>
            <Form.Row>
                <Col >
                    <Form.Group>
                        <Form.Label>Observacao: </Form.Label>
                        <Form.Control type="text" placeholder={"Porque o problema ocorreu"} onChange={(event) => setObservacao(event.target.value)}></Form.Control>
                    </Form.Group>
                </Col>
                <Col >
                    <Form.Group>
                        <Form.Label>Acao: </Form.Label>
                        <Form.Control type="text" placeholder={"O que sera feito para resolver"} onChange={(event) => setAcao(event.target.value)}></Form.Control>
                    </Form.Group>
                </Col>

            </Form.Row>

            <Form.Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Prazo: </Form.Label>
                        <Form.Control
                            type="datetime-local"
                            defaultValue={prazo}
                            onChange={event => { setPrazo(event.target.value) }}>
                        </Form.Control>
                    </Form.Group>

                </Col>
                <Col >
                    <Form.Group>
                        <Form.Label>Responsavel: </Form.Label>
                        <Form.Control type="text" placeholder={"Responsavel pela ação"} onChange={event => setResponsavel(event.target.value)}></Form.Control>
                    </Form.Group>

                </Col>

            </Form.Row>





        </>

    )


}



export default withRouter(connect(mapToStateProps.toProps, dispatchers)(CadastroDeOcp))