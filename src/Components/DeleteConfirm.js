import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const DeleteConfirm = ({details,show,closeCredentialConfirm,confirmCancel,deleteSelection }) => {


    return (
        <>
   
        <Modal show={show} onHide={() => closeCredentialConfirm()}  >
          <Modal.Header closeButton>
            <Modal.Title>Aprovação</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <h4>{details}</h4>
                  </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => confirmCancel()} >
              Cancelar
            </Button>
            <Button variant="primary" type="submit" onClick={() => {deleteSelection()}}> 
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
           
    
    )
}

export default DeleteConfirm