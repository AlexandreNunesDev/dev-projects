import moment from 'moment';
import React, { useState } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router-dom';
import { withToastManager } from 'react-toast-notifications';
import ScqApi from '../Http/ScqApi';
import { responseHandler } from '../Services/responseHandler';
import { formatIsoDate } from '../Services/stringUtils';
import CredentialConfirm from './CredentialConfirm';


const AnaliseEdit = (props) => {


  const [dataPlanejada,setDataPlanejada] = useState()
  const [showDelete,setShowDelete] = useState(false)

  let history = useHistory();
  
  const closeCredentialConfirm = () => {
    setShowDelete(false)
  }

  const deleteAnalise = () => {
    ScqApi.DeleteAnalise(props.analise.id)
  }

  return (
    <>

      <CredentialConfirm show={showDelete} closeCredentialConfirm={closeCredentialConfirm} 
      aproveOcp={deleteAnalise}></CredentialConfirm>
      <Modal size={"lg"} show={props.show} onHide={() => props.handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Editor de Analise: Analise {props?.analise?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Label>
                  {`Resultado: ${props?.analise?.Resultado} ${props?.analise?.unidade}`}
                </Form.Label>
              </Col>
            
            </Row>
            <Row>
            <Col>
              <Form.Label>Data Planejada : </Form.Label>
                <Form.Control
                  type="datetime-local"
                  defaultValue={props?.analise?.defaultData}
                  onChange={event => {
                    let data = new Date(event.target.value);
                    setDataPlanejada(formatIsoDate)
                   }}>
                </Form.Control>
                </Col>
            </Row>
          </Form>
        </Modal.Body>


        <Modal.Footer>
          <Button style={{ margin: 2 }} variant="secondary" onClick={() => props.handleClose(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setShowDelete(true)}> 
            Excluir
          </Button>
          <Button onClick={() => props.history.push("/CadastroOcpAdicaoLivre",props.analise)}>
            Gerar Ocp
          </Button>
          <Button onClick={() => ScqApi.UpdataAnaliseData(props.analise.id,dataPlanejada)}>
            Salvar
            </Button>
        </Modal.Footer>

      </Modal>
    </>
  );

}


export default withRouter(AnaliseEdit);
