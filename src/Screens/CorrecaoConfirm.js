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

  const updateRealizadoEm = (adicaoDto, realizado) => {
    let ocpCopy = { ...ocp }
    let adicoesCopy = [...ocpCopy.adicoesDto].map(adTo => ({ ...adTo }))
    let indexToUpdate = adicoesCopy.findIndex(addCopy => addCopy.id == adicaoDto.id)
    adicoesCopy[indexToUpdate].realizada = realizado
    ocpCopy.adicoesDto = adicoesCopy
    dispatch(actions.ocpToEdit(ocpCopy))
  }


  const updateResponsavel = (adicaoDto, responsavel) => {
    let ocpCopy = { ...ocp }
    let adicoesCopy = [...ocpCopy.adicoesDto].map(adTo => ({ ...adTo }))
    let indexToUpdate = adicoesCopy.findIndex(addCopy => addCopy.id == adicaoDto.id)
    adicoesCopy[indexToUpdate].responsavel = responsavel
    ocpCopy.adicoesDto = adicoesCopy
    dispatch(actions.ocpToEdit(ocpCopy))
  }




  const confirmar = () => {
    let adicoes = ocp.adicoesDto.filter(add => {
      if ((!add.realizada) || (!add.responsavel)) {
        return false
      }
      if ((add.quantidade == 0) && (!add.observacao)) {
        return false
      }
      return true

    }

    ).map(addDto => ({ id: addDto.id, quantidade: addDto.quantidade, ordemId: ocp.id, materiaPrimaId: addDto.idMp, unidade: addDto.unidade, realizada: addDto.realizada, responsavel: addDto.responsavel, observacao: addDto.observacao }))
    ScqApi.AdicaoCorrigir(adicoes, ocp.id).then(res => {
      responseHandler(res, toast, "OrdemDeCorrecao", toastInfo)
      history.push("/OrdensDeCorrecao")
    })
  }

  const voltar = () => {
    history.goBack()
  }





  return (
    <>
      <div style={{ padding: 12 }}>
        <h3>Confirme as Quantidades</h3>
        <h3 style={{ textAlign: "center", paddingBottom: 12 }}>Confirme as quantidades das Adições</h3>
        <div className="table-responsive">
          <table >
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Id</th>
                <th style={{ textAlign: "center" }}>Materia Prima</th>
                <th style={{ textAlign: "center" }}>Quantidade</th>
                <th style={{ textAlign: "center" }}>Uni.</th>
                <th style={{ textAlign: "center" }}>Data</th>
                <th style={{ textAlign: "center" }}>Responsavel</th>
                <th style={{ textAlign: "center" }}>Justificativa</th>
              </tr>
            </thead>
            <tbody>
              {ocp.adicoesDto.map(adicao => {
                return (
                  <tr key={adicao.id}>
                    <td >{adicao.id}</td>
                    <td className="text-nowrap" >{adicao.nomeMp}</td>
                    <td  >
                      <Form.Control  disabled={adicao.status} value={adicao.quantidade} type={"number"} onChange={(event) => updateOcpDtos(adicao, event.target.value)}></Form.Control>
                    </td>
                    <td >
                      {adicao.unidade}
                    </td>
                    <td  >
                      <Form.Control
                        disabled={adicao.status}
                        style={{ borderColor: adicao.status || adicao.realizada ? null : "RED" }}
                        type="datetime-local"
                        defaultValue={adicao.realizada || adicao.realizadoEm}
                        onChange={event => updateRealizadoEm(adicao, event.target.value)}>
                      </Form.Control>
                    </td>
                    <td  >
                      <Form.Control disabled={adicao.status} value={adicao.responsavel} style={{ borderColor: adicao.status || adicao.responsavel ? null : "RED" }} onChange={(event) => updateResponsavel(adicao, event.target.value)}></Form.Control>
                    </td>
                    <td  >
                      <Form.Control disabled={adicao.status} value={adicao.observacao}  placeholder={`Observacao`} onChange={(event) => updateOcpDtosObservacao(adicao, event.target.value)}></Form.Control>
                    </td>
                  </tr>
                )

              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <Button style={{ margin: 12, backgroundColor: "gray", borderColor: "gray" }} onClick={() => {
          voltar()
        }}>
          Voltar
        </Button>

        <Button style={{ margin: 12 }} onClick={() => {
          confirmar()
        }}>
          Confirmar
        </Button>
      </div>
    </>




  )
}

export default withMenuBar(CorrecaoConfirm)