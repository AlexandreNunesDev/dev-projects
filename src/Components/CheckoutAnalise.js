import React, {useState } from 'react'
import { Button, Modal, Form, Row, Col} from 'react-bootstrap';
import {useHistory } from 'react-router-dom';

const CheckOutAnalise = (props) => {
    
  const [show, setShow] = useState(false);
  const unidade = props.parametro?.unidade === "pH" ? " " : props.parametro?.unidade  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let history = useHistory();

  

    return (
      <>
        <Button variant="primary" disabled={props.valid} style={{ margin: 5 }} onClick={handleShow}>
          Salvar
        </Button>
        <Modal size={"lg"}  show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Resumo de Analise</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
             {props.status === 'fofe' ? <h5 style={{color : 'red'}}>Analise Fora do Especificado</h5> : props.status === 'deft' ? <h5 style={{color : 'green'}}>Analise Dentro da Faixa de Trabalho</h5> : <h5 style={{color : '#fcba05'}}>Analise Fora da Faixa de Trabalho</h5> }
             <Row >
                <Col xs={3}>
                  <Form.Label>Resultado: </Form.Label>
                </Col>
                <Col>
                  <Form.Label>{`${props.resultado} ${unidade}`}</Form.Label>
                </Col>
              </Row>
              <Row style={{textAlign: "center"}}>
                <Col xs={4}>
                  <Form.Label>Faixa Mínima: </Form.Label>
                </Col>
                <Col>
                  <Form.Label>{`${props.parametro?.pMin} ${unidade}`}</Form.Label>
                </Col>
                <Col xs={4}>
                  <Form.Label>Faixa Máxima: </Form.Label>
                </Col>
                <Col >
                  <Form.Label>{`${props.parametro?.pMax}  ${unidade}`}</Form.Label>
                </Col>
                </Row>
                <Row style={{textAlign: "center"}}>
                <Col xs={4}>
                  <Form.Label>Faixa Mínima Trabalho: </Form.Label>
                </Col>
                <Col>
                  <Form.Label>{`${props.parametro?.pMinT} ${unidade}`}</Form.Label>
                </Col>
                <Col xs={4}>
                  <Form.Label>Faixa Máxima Trabalho: </Form.Label>
                </Col>
                <Col>
                  <Form.Label>{`${props.parametro?.pMaxT} ${unidade}`}</Form.Label>
                </Col>
               
               
              </Row>
            </Form>
          </Modal.Body>
          
         
          <Modal.Footer>
            <Button style={{ margin: 2 }} variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={() => { 
              if(props.analiseId){
                props.gerarOcpReanalise(history)
              } else {
                props.gerarOcp(history)
              }
             
              }}>
              Gerar Ocp
            </Button>
            {props.status !== "fofe" ? <Button style={{ margin: 2 }} variant="primary" onClick={() => { 
              if(props.analiseId){
                handleClose()
                props.salvarReanalise()
              } else {
                handleClose()
                props.salvarAnalise()
              }
             }}>
              Salvar
            </Button> : <Button disabled>
              Salvar
            </Button>  }
          </Modal.Footer> 
          
        </Modal>
      </>
    );
  
}
  

  export default CheckOutAnalise;