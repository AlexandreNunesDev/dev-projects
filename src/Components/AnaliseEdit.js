import React, { useState } from 'react'
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications/dist/ToastProvider';
import ScqApi from '../Http/ScqApi';
import dispatchers from '../mapDispatch/mapDispathToProps';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import ocpsReducer from '../Reducers/ocpReducers';
import { formatIsoDate } from '../Services/stringUtils';
import { toastWarn } from '../Services/toastType';
import CredentialConfirm from './CredentialConfirm';


const AnaliseEdit = (props) => {



  const [dataPlanejada, setDataPlanejada] = useState()
  const [showDelete, setShowDelete] = useState(false)
  const toastManager = useToasts()



  const closeCredentialConfirm = () => {
    setShowDelete(false)
  }

  const deleteAnalise = () => {
    ScqApi.DeleteAnalise(props.analise.id).then(() => {
      props.handleClose(); toastManager.addToast("Analise deletada com sucesso", {
        appearance: toastWarn, autoDismiss: true
      }); props.reloadChart()
    })
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
                <Form.Label>Data Realizada : </Form.Label>
                <Form.Control
                  type="datetime-local"
                  defaultValue={props?.analise?.defaultData}
                  onChange={event => {
                    let data = new Date(event.target.value);
                    setDataPlanejada(formatIsoDate(data))
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
          <Button onClick={() => { setShowDelete(true) }}>
            Excluir
          </Button>
          {props.ocps && <Button onClick={() => {props.showOcps(true)}}>
           {props.ocps.length > 1 ? `Ver ${props.ocps.length} ocps` : `Ver ${props.ocps.length == 0 ? "" :props.ocps.length} ocp` } 
          </Button> }
          
          <Button onClick={() => props.history.push("/CadastroOcpAdicao", props.analise)}>
            Gerar Ocp
          </Button>
          <Button onClick={() => { ScqApi.UpdataAnaliseData(props.analise.id, dataPlanejada); props.handleClose(false); props.reloadChart() }}>
            Salvar
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );

}


export default withRouter(connect(mapToStateProps.toProps, dispatchers)(AnaliseEdit));
