import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router-dom';



const VoceFoiDesconentado = (props) => {

    const history = useHistory()

    return ( 
        <>
        <Container>
            <h2>Voce foi desconectado</h2>
            <Form.Group>
                <Form.Row>
                <Form.Label>Clique para entrar novamente</Form.Label>
                </Form.Row>
           
                <Button onClick={() => history.push("/Login") }>Logar</Button>
            </Form.Group>
        </Container>
        </>

    )
}

export default withRouter(VoceFoiDesconentado)