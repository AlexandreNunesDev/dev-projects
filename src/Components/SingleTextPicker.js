import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'

const SingleTextPicker = ({show,closeClick,label,onSaveClick,onFieldUpdate,fieldVal}) => {




    return (
        <>
   
        <Modal show={show} onHide={() => closeClick()}  >
          <Modal.Header closeButton>
            <Modal.Title>Definir responsavel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <Form.Group>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control value={fieldVal} type="text" onChange={(event) => onFieldUpdate(event.target.value) } />
                </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => closeClick()} >
              Cancelar
            </Button>
            <Button variant="primary" type="submit" onClick={() => {onSaveClick(); closeClick() }}> 
              Confirmar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
           
    
    )
}

export default SingleTextPicker