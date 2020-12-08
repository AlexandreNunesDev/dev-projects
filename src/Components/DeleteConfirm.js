import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const DeleteConfirm = (props) => {


    return (
        <>
   
        <Modal show={props.show} onHide={() => props.closeCredentialConfirm()}  >
          <Modal.Header closeButton>
            <Modal.Title>Aprovação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <h4>{props.details}</h4>
                  </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => props.confirmCancel()} >
              Cancelar
            </Button>
            <Button variant="primary" type="submit" onClick={() => {props.deleteSelection()}}> 
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
           
    
    )
}

export default DeleteConfirm