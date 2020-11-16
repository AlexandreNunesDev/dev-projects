import React from 'react'
import { Button, Modal, Form} from 'react-bootstrap';

const DeleteOmpConfirm = (props) => {
 
  let dia = new Date(props.omp?.dataPlanejada).getDay()
  let mes = new Date(props.omp?.dataPlanejada).getMonth()
  let ano = new Date(props.omp?.dataPlanejada).getFullYear()
    return (
      <>
     
        <Modal size={"lg"}  show={props.show} >
          <Modal.Header closeButton>
            <Modal.Title>Deletar Ordem de Manutencao de Processo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Label>Voce deseja <strong style={{color:"RED"}}>Deletar</strong> OMP <strong>{props.omp?.id}</strong> : {props.omp?.nomeProcesso} programada para : <strong>{`${dia}-${mes}-${ano}`}</strong> 
            </Form.Label>
            </Form>
          </Modal.Body>
          
         
          <Modal.Footer>
            <Button style={{ margin: 2 }} variant="secondary" onClick={() => props.handleClose()}>
              Cancelar
            </Button>
            <Button disabled={props.deleteRdy} onClick={() => {props.deletarOmp(); props.handleClose()}}>
              Deletar
            </Button>
          
          </Modal.Footer> 
          
        </Modal>
      </>
    );
  
}
  

  export default DeleteOmpConfirm;