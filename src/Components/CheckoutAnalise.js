import React, { useState } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { withToastManager } from 'react-toast-notifications';

const CheckOutAnalise = (props) => {

  const [show, setShow] = useState(false);
  const unidade = props.parametro?.unidade === "pH" ? " " : props.parametro?.unidade

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let history = useHistory();


  const checkOpen = () => {
    if ((props.parametro?.cantBeUsed) && (!props.analiseId)) {
      const { toastManager } = props
      toastManager.add("Este parametro possui correcoes pendentes", {
        appearance: 'warning', autoDismiss: true
      })
    } else {
      handleShow()
    }
  }

  return (
    <>
      <Button variant="primary" hidden={props.hide || false} disabled={props.valid} style={{ margin: 5 }} onClick={() => checkOpen()}>
        Salvar
      </Button>
      <Modal size={"lg"} show={props.showCheckOut || show} onHide={props.showCheckOut == ! null ? props.closeCheckOut : handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Resumo de Analise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {props.status === 'fofe' ? <h5 style={{ color: 'red' }}>Analise Fora do Especificado</h5> : props.status === 'deft' ? <h5 style={{ color: 'green' }}>Analise Dentro da Faixa de Trabalho</h5> : <h5 style={{ color: '#fcba05' }}>Analise Fora da Faixa de Trabalho</h5>}
            <Row >
              <Col xs={3}>
                <Form.Label>Resultado: </Form.Label>
              </Col>
              <Col>
                <Form.Label>{`${props.resultado} ${unidade}`}</Form.Label>
              </Col>
            </Row>
            <Row style={{ textAlign: "center" }}>
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
            <Row style={{ textAlign: "center" }}>
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
            <Row>
              <Form.Group as={Col}> 
                <Form.Label>Observação</Form.Label>
                <Form.Control onChange={(event) => props.onValueChange(event.target.value)} ></Form.Control>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>


        <Modal.Footer>
          <Button style={{ margin: 2 }} variant="secondary" onClick={props.showCheckOut == ! null ? props.closeCheckOut : handleClose}>
            Cancelar
          </Button>
          <Button onClick={() => {
            if (props.analiseId) {
              props.gerarOcpReanalise(history)
            } else {
              props.gerarOcp(history)
            }

          }}>
            Gerar Ocp
          </Button>
          {props.status !== "fofe" ? <Button style={{ margin: 2 }} variant="primary" onClick={() => {
            if (props.analiseId) {
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
          </Button>}
        </Modal.Footer>

      </Modal>
    </>
  );

}


export default withToastManager(CheckOutAnalise);