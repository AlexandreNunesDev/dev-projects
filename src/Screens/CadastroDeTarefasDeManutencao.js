import React, {useState, useEffect } from 'react'
import { Button, Form, Container, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {capitalize,subId} from '../Services/stringUtils'
import ScqApi from '../Http/ScqApi';
import {withToastManager} from 'react-toast-notifications'
import UnidadeSelect from '../Components/UnidadeSelect';
import GenericSelect from '../Components/GenericSelect';
import { withMenuBar } from '../Hocs/withMenuBar';

const CadastroDeTarefasDeManutencao = (props) => {


    const [processoId , setProcessoId] = useState()
    const [nome, setNome] = useState()
    const [dataExecutada, setDataExecutada] = useState(new Date())
    const [repetirAcada, setRepetirAcada] = useState()
    const [escala , setEscala] = useState()
    const [codigoDoDocumento , setCodigo] = useState()
   
    const [processos, setProcessos] = useState()
    

    useEffect(() => {
        ScqApi.ListaProcessos().then(res => setProcessos(res))
        
    }, []
    )

    const responseHandler = (response) => {
        const { toastManager } = props;
        if(response.error){
            response.data.forEach(erro => {
                toastManager.add(`${subId(capitalize(erro.field))} : ${erro.error}`, {
                    appearance: 'error', autoDismiss: true
                  })});
        } else {
            toastManager.add(`Tarefa de Manutençao ${response.nome} criado`, {
                appearance: 'success', autoDismiss: true
              })
        }

       
       
        
    }

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
                            const tarefaManutencao = {nome,processoId,codigoDoDocumento,dataExecutada: dataExecutada,escala: escala ,frequencia : repetirAcada}
                            ScqApi.CriarTarefaManutencao(tarefaManutencao).then(res => responseHandler(res))
                     
                        }} >Salvar</Button>
                    </Form.Group>
                </Form>
            </Container>

        </>
        )
    }
export default withToastManager(withMenuBar(CadastroDeTarefasDeManutencao))