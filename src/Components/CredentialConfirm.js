import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'

const CredentialConfirm = (props) => {


    return (
        <>
   
        <Modal show={props.show} onHide={() => props.closeCredentialConfirm()}  >
          <Modal.Header closeButton>
            <Modal.Title>Aprovação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <h4>{props.details}</h4>
                <Form.Group controlId="ccUsuario">
                    <Form.Label>Usuario: </Form.Label>
                    <Form.Control type="e-mail"  />
                </Form.Group>
                <Form.Group controlId="ccPassword">
                    <Form.Label>Password:  </Form.Label>
                    <Form.Control  type="password"  />
                </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => props.closeCredentialConfirm()} >
              Cancelar
            </Button>
            <Button variant="primary" type="submit" onClick={() => {props.aproveOcp(); props.closeCredentialConfirm() }}> 
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
           
    
    )
}

export default CredentialConfirm