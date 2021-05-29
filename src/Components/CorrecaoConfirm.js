import { BsDot } from 'react-icons/bs';
import React, {useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'


const CorrecaoConfirm = (props) => {


 
  const [codigoOcp, setCodigo] = useState()
  
  const buildAdicaoDetails = (adicoesDto) => {
    return adicoesDto.map(adicao => {
        
        return(
                  <Form.Row key={adicao.nomeMp}>
                    <Form.Label><BsDot size={36} ></BsDot>{`${adicao.quantidade} ${adicao.unidade} ${adicao.nomeMp}`}</Form.Label>
                  </Form.Row>)
           
      });
  }
  
  const buildAcaoDetails = (ocp) => {

        
        return(
                  <Form.Row>
                    <Form.Label><BsDot size={36} ></BsDot>{`${ocp.acao} prazo ${ocp.prazo}`}</Form.Label>
                  </Form.Row>)
           
     
  }




    return (
      <>
      
        <Modal  show={props.show} onHide={() => props.closeCorrecaoConfim(false)}>
        <Modal.Header closeButton >
          <Modal.Title>Correcao Confirm</Modal.Title>
          
        </Modal.Header>
        <Modal.Body>
            
              {props.ocp.adicoesDto.length === 0 ? buildAcaoDetails(props.ocp) : buildAdicaoDetails(props.ocp.adicoesDto)}
         
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
              if(Number(ocpInt)===props.ocp.id){
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