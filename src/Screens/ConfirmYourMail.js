import React from 'react';
import { Container, Form } from 'react-bootstrap';
import { withMenuBar } from '../Hocs/withMenuBar';


const ConfirmMailPage = () => {
    return ( 
        <>
        <Container>
            <h2>Confirmacao de Conta</h2>
            <Form.Label>Vá para seu mail e confirme sua conta</Form.Label>
        </Container>
        </>

    )
}

export default withMenuBar(ConfirmMailPage)