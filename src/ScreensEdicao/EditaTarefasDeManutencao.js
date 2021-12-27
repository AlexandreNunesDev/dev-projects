import React, { useState, useEffect } from 'react'
import { Button, Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {withMenuBar} from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import { withToastManager } from 'react-toast-notifications'
import UnidadeSelect from '../Components/UnidadeSelect';
import GenericSelect from '../Components/GenericSelect';
import ModoEdicao from '../Components/ModoEdicao'
import { responseHandler } from '../Services/responseHandler';
import { toastInfo } from '../Services/toastType';
import context from 'react-bootstrap/esm/AccordionContext';
import { useDispatch } from 'react-redux';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications/dist/ToastProvider';

const EditarTarefaDeManutencao = (props) => {


    const [processoId, setProcessoId] = useState()
    const [nome, setNome] = useState('')

    const [frequencia, setFrequencia] = useState('')
    const [escala, setEscala] = useState()
    const [codigoDoDocumento, setCodigo] = useState('')
    const [tarefa, setTarefa] = useState()
    const [dataPlenejada, setDataPlanejada] = useState()
    const dispatcher = useDispatch()
    const [processos, setProcessos] = useState()
    const history = useHistory()
    const toastManager = useToasts()


    useEffect(() => {
        ScqApi.ListaProcessos().then(res => setProcessos(res))

    }, [])

    useEffect(() => {
        if (tarefa) {
            console.log(tarefa)
            setNome(tarefa.nome)
            setCodigo(tarefa.codigo)
            setProcessoId(tarefa.processoId)
            setFrequencia(tarefa.frequencia)
            setDataPlanejada(tarefa.dataPlanejada)
            setEscala(tarefa.escalaFrequencia)

        }
    }, [tarefa])

    return (
        <>
    
            <Container style={{ marginTop: 20 }}>
                <h1>Editar Tarefa de Manutencao</h1>
                <Form>
                    <ModoEdicao type={"tarefa"} getSelectedTarefa={(tarefa) => setTarefa(tarefa)}  onDelete={(deleteMessage) => {toastManager.addToast(`${deleteMessage}`, {appearance: 'success', autoDismiss: true,onDismiss: () => { history.push("/CadastroTarefasDeManutencao")}})}}></ModoEdicao>
                    {tarefa && <Form.Group style={{ marginTop: 20 }} >
                        <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Tarefa Id: {tarefa.id} || Data Planejada : {tarefa?.dataPlanejada}</Form.Label>
                    </Form.Group>}
                    <Form.Row>
                        <Col>
                            <GenericSelect selection={processoId} returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={processos} onChange={(processoId) => { setProcessoId(processoId) }} ></GenericSelect>
                        </Col>
                        <Col sm >
                            <Form.Label>Nome: </Form.Label>
                            <Form.Control type="text" value={nome} onChange={event => { setNome(event.target.value) }} />
                        </Col>
                    </Form.Row>
                    <Form.Row>

                        <Col>
                            <Form.Label>Data Planejada : </Form.Label>
                            <Form.Control
                                type="date"
                                defaultValue={dataPlenejada}
                                onChange={event => { setDataPlanejada(event.target.value) }}>
                            </Form.Control>
                        </Col>

                        <Col sm >
                            <Form.Label>Repetir a cada : </Form.Label>
                            <Form.Control type="number" value={frequencia} onChange={event => { setFrequencia(event.target.value) }} />
                        </Col>
                        <Col sm>
                            <UnidadeSelect selection={escala} type="frequenciaAnalise" title={"Unidade: "} default={"Escolha a escala"} onChange={escala => { setEscala(escala) }} />
                        </Col>
                        <Col sm >
                            <Form.Label>Codigo da Instrução: </Form.Label>
                            <Form.Control type="text" value={codigoDoDocumento} onChange={event => { setCodigo(event.target.value) }} />
                        </Col>
                    </Form.Row>

                    <Form.Group >
                        <Button style={{ marginTop: 10, marginRight: 5 }} variant="primary" >Editar</Button>
                        <Button style={{ marginTop: 10 }} variant="primary" type="reset" onClick={() => {
                            const tarefaManutencao = {id:tarefa.id ,nome: nome, processoId: processoId, dataPlanejada : dataPlenejada, codigoDoDocumento: codigoDoDocumento, escala: escala, frequencia: frequencia }
                            ScqApi.EditarTarefaDeManutencao(tarefaManutencao).then(res => responseHandler(res,props,"Tarefa",toastInfo,context,[dispatchers().loadTarefasDeManutencao]))
                        

                        }} >Salvar</Button>
                    </Form.Group>
                </Form>
            </Container>

        </>
    )
}
export default withToastManager(withMenuBar(EditarTarefaDeManutencao))