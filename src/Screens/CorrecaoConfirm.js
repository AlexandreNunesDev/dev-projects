import { add } from 'mathjs';
import { useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { actions } from '../actions/actions';
import { withMenuBar } from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import { responseHandler } from '../Services/responseHandler';
import { toastInfo, toastOk } from '../Services/toastType';


const CorrecaoConfirm = (props) => {


  const dispatch = useDispatch()
  const ocp = useSelector(state => state.ocp.ocpToEdit)
  const [responsavel, setResponsavel] = useState()
  const [realizado, setRealizado] = useState()
  const toast = useToasts()
  const history = useHistory()



  const updateOcpDtos = (adicaoDto, quantidade) => {
    let ocpCopy = { ...ocp }
    let adicoesCopy = [...ocpCopy.adicoesDto].map(adTo => ({ ...adTo }))
    let indexToUpdate = adicoesCopy.findIndex(addCopy => addCopy.id == adicaoDto.id)
    adicoesCopy[indexToUpdate].quantidade = quantidade
    ocpCopy.adicoesDto = adicoesCopy
    dispatch(actions.ocpToEdit(ocpCopy))
  }

  const updateOcpDtosObservacao = (adicaoDto, observacao) => {
    let ocpCopy = { ...ocp }
    let adicoesCopy = [...ocpCopy.adicoesDto].map(adTo => ({ ...adTo }))
    let indexToUpdate = adicoesCopy.findIndex(addCopy => addCopy.id == adicaoDto.id)
    adicoesCopy[indexToUpdate].observacao = observacao
    ocpCopy.adicoesDto = adicoesCopy
    dispatch(actions.ocpToEdit(ocpCopy))
  }




  const confirmar = () => {
    if ((responsavel) && (realizado)) {
    let adicoes = ocp.adicoesDto.map(addDto => ({ id: addDto.id, quantidade: addDto.quantidade, ordemId: ocp.id, materiaPrimaId: addDto.idMp, unidade: addDto.unidade, realizada: realizado, responsavel: responsavel, observacao: addDto.observacao }))
      ScqApi.AdicaoCorrigir(adicoes, ocp.id).then(res => {
        responseHandler(res, toast, "OrdemDeCorrecao", toastInfo)
        history.push("/OrdensDeCorrecao")
      })
    } else {
      toast.addToast("Responsavel e realizada nao podem ser nulos", {appearance : 'success'})
    }

  }



return (
  <>
    <Container>
      <h3>Confirme as Quantidades</h3>

      <Form.Group as={Row}>
        <Form.Label>Realizado em: </Form.Label>
        <Form.Control
          type="datetime-local"
          onChange={event => setRealizado(event.target.value)}>

        </Form.Control>
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label>Realizado por: </Form.Label>
        <Form.Control onChange={(event) => setResponsavel(event.target.value)}>

        </Form.Control>
      </Form.Group>


      <h3 style={{ textAlign: "center", paddingBottom: 12 }}>Confirme as quantidades das Adições</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Materia Prima</th>
              <th>Quantidade</th>
              <th>Unidade</th>
              <th>Justificativa</th>
            </tr>
          </thead>
          <tbody>
            {ocp.adicoesDto.map(adicao => {
              return (
                <tr key={adicao.id}>
                  <td>{adicao.id}</td>
                  <td>{adicao.nomeMp}</td>
                  <td >
                    <Form.Control disabled={adicao.status} value={adicao.quantidade} placeholder={`Solicitado ${adicao.quantidade}`} onChange={(event) => updateOcpDtos(adicao, event.target.value)}></Form.Control>
                  </td>
                  <td>
                    {adicao.unidade}
                  </td>
                  <td >
                    <Form.Control disabled={adicao.status} value={adicao.observacao} placeholder={`Observacao`} onChange={(event) => updateOcpDtosObservacao(adicao, event.target.value)}></Form.Control>
                  </td>
                </tr>
              )

            })}
          </tbody>
        </table>
      </div>




      <Button style={{ margin: 12 }} onClick={() => {
        confirmar()
      }}>
        Confirmar
      </Button>
    </Container>
  </>




)
}

export default withMenuBar(CorrecaoConfirm)