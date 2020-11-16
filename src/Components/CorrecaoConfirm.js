import React, {useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const CorrecaoConfirm = (props) => {


 
  const [codigoOcp, setCodigo] = useState()
  
  




    return (
      <>
      
        <Modal  show={props.show} onHide={() => props.closeCorrecaoConfim(false)}>
        <Modal.Header closeButton  >
          <Modal.Title>Correcao Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
            <Form.Row>
                <Form.Label>Digite numero da {props.correcaoType}</Form.Label>
            </Form.Row>
            <Form.Row>
                 <Form.Control onChange={(event) => setCodigo(event.target.value)}></Form.Control>
            </Form.Row>
          
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={()  => {
              let ocpInt = Number(codigoOcp).toString()
              if(Number(ocpInt)===props.ocpId){
                props.correcaoConfirm(true,ocpInt)
                props.closeCorrecaoConfim(false)
              } else {
                props.correcaoConfirm(false,ocpInt)
                props.closeCorrecaoConfim(false)
              }
            }}>
                Confirmar
            </Button>
        </Modal.Footer>
      </Modal>
    </>
    

    )
}

export default CorrecaoConfirm