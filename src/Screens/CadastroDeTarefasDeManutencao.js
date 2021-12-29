import React, {useState, useEffect, useContext } from 'react'
import { Button, Form, Container, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScqApi from '../Http/ScqApi';
import {withToastManager} from 'react-toast-notifications'
import UnidadeSelect from '../Components/UnidadeSelect';
import GenericSelect from '../Components/GenericSelect';
import { withMenuBar } from '../Hocs/withMenuBar';
import { responseHandler } from '../Services/responseHandler';
import { connect, useSelector } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { toastOk } from '../Services/toastType';
import { WebSocketContext } from '../websocket/wsProvider';

const CadastroDeTarefasDeManutencao = (props) => {


    const [processoId , setProcessoId] = useState()
    const context = useContext(WebSocketContext)
    const [nome, setNome] = useState()
    const [dataExecutada, setDataExecutada] = useState(new Date())
    const [repetirAcada, setRepetirAcada] = useState()
    const [escala , setEscala] = useState()
    const [codigoDoDocumento , setCodigo] = useState()
    const processos = useSelector(state => state.options.processos)
 
    


   

        return (
            <>
         
            <Container style={{ marginTop: 20 }}>
                <h1>Cadastro de Tarefas de Manutencao</h1>
                <Form>
                    <Form.Row>
                        <Col>
                            <GenericSelect returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={processos} onChange={(processoId) => { setProcessoId(processoId) }} ></GenericSelect>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col sm >
                            <Form.Label>Nome: </Form.Label>
                            <Form.Control type="text" value={nome} onChange={event => {setNome(event.target.value)}} />
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <Form.Label>Data Planejada : </Form.Label>
                            <Form.Control
                                type="date"
                                defaultValue={dataExecutada}
                                onChange={event => {setDataExecutada(event.target.value) }}>
                            </Form.Control>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col sm >
                            <Form.Label>Repetir a cada : </Form.Label>
                            <Form.Control type="number" value={repetirAcada} onChange={event => {setRepetirAcada(event.target.value)}} />
                        </Col>
                    </Form.Row> 
                    <Form.Row>
                        <Col sm>
                            <UnidadeSelect type="frequenciaAnalise" title={"Unidade: "} default={"Escolha a unidade de tempo"} onChange={unidade => {setEscala(unidade)}} />
                        </Col>
                    </Form.Row> 
                    <Form.Row>
                        <Col sm >
                            <Form.Label>Codigo da Instrução: </Form.Label>
                            <Form.Control type="text" value={codigoDoDocumento} onChange={event => {setCodigo(event.target.value)}} />
                        </Col>
                    </Form.Row>                   
                  
                    <Form.Group >
                        <Button style={{ marginTop: 10 ,marginRight : 5}} variant="primary" onClick={() => { 
                            props.history.push("/EditarTarefa")
                        }} >Editar</Button>
                        <Button style={{ marginTop: 10 }} variant="primary" type="reset" onClick={() => {
                            const {toastManager} = props
                            const tarefaManutencao = {nome,processoId,codigoDoDocumento,dataExecutada: dataExecutada,escala: escala ,frequencia : repetirAcada}
                            ScqApi.CriarTarefaManutencao(tarefaManutencao,[props.loadTarefasDeManutencao]).then(res => responseHandler(res,toastManager,null,toastOk))
                     
                        }} >Salvar</Button>
                    </Form.Group>
                </Form>
            </Container>

        </>
        )
    }
export default withToastManager(withMenuBar(connect(mapToStateProps.toProps,dispatchers)(CadastroDeTarefasDeManutencao)))