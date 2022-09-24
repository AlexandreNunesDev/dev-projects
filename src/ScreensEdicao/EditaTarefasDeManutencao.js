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
import { useHistory, useLocation } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications/dist/ToastProvider';
import SaveDeleteButtons from '../Components/SaveDeleteButtons';

const EditarTarefaDeManutencao = (props) => {

    const location = useLocation()
    const [processoId, setProcessoId] = useState()
    const [nome, setNome] = useState('')
    const [tarefa, setTarefa] = useState(location.state)
    const [frequencia, setFrequencia] = useState('')
    const [escala, setEscala] = useState()
    const [codigoDoDocumento, setCodigo] = useState('')
    const [dataPlenejada, setDataPlanejada] = useState()
    const dispatcher = useDispatch()
    const [contadorPlanejado, setContadorPlanejado] = useState()
    const [contadorRealizado, setContadorRealizado] = useState()
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


    const deletarTarefa = () => {
        ScqApi.DeleteTarefa(tarefa.id)
    }


    const salvarTarefa = () => {
        const tarefaManutencao = {id:tarefa.id ,nome: nome, processoId: processoId, dataPlanejada : dataPlenejada, codigoDoDocumento: codigoDoDocumento, escala: escala, frequencia: frequencia,contadorPlanejado,contadorRealizado }
        ScqApi.EditarTarefaDeManutencao(tarefaManutencao).then(res => responseHandler(res,toastManager,"Tarefa",toastInfo))
    

    }

    return (
        <>
    
            <Container style={{ marginTop: 20 }}>
                <h1>Editar Tarefa de Manutencao</h1>
                <Form>
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
                   
                    </Form.Row>
                    <Form.Row style={{ marginBottom: 16 }}>
                        <Col>
                            <Form.Label>Contador Planejado : </Form.Label>
                            <Form.Control type="text" value={contadorPlanejado} onChange={event => setContadorPlanejado(event.target.value)} />
                        </Col>
                        <Col>
                            <Form.Label>Atual Quantiade Contador : </Form.Label>
                            <Form.Control type="text" value={contadorRealizado} onChange={event => setContadorRealizado(event.target.value)} />
                        </Col>
                    </Form.Row>
                    <SaveDeleteButtons saveClick={salvarTarefa} deleteClick={deletarTarefa}></SaveDeleteButtons>
                </Form>
            </Container>

        </>
    )
}
export default withToastManager(withMenuBar(EditarTarefaDeManutencao))