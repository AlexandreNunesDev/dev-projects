import React, { useState, useEffect, useContext } from 'react'
import {withMenuBar} from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import { Button, Form, Container, Col } from 'react-bootstrap'
import { withToastManager } from 'react-toast-notifications'
import UnidadeSelect from '../Components/UnidadeSelect'
import GenericSelect from '../Components/GenericSelect';
import ModoEdicao from '../Components/ModoEdicao'
import { toastInfo } from '../Services/toastType';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';
import { responseHandler } from '../Services/responseHandler';
import { useLocation } from 'react-router-dom';





const EditarTroca = (props) => {

    const location = useLocation()
    const [troca, setTroca] = useState(location.state)
    const context = useContext(WebSocketContext)
    const [frequencia, setFrequencia] = useState(troca.frequencia)
    const [etapaId, setEtapaId] = useState(troca.etapaId)
    const [dataPlanejada, setdataPlanejada] = useState(troca.dataPlanejada)
    const [dataRealizada, setdataRealizada] = useState(troca.ultimaTroca)
    const [numeroGrupoArea, setNumeroGrupoArea] = useState('')
    const [contadorPlanejado, setContadorPlanejado] = useState(troca.areaPlanejada)
    const [contadorRealizado, setContadorRealizado] = useState(troca.areaRealizada)
    const [processoId, setProcessoId] = useState(troca.processoId)
    const [escalaFrequencia, setEscalaFrequencia] = useState(troca.escalaFrequencia)

    const {toastManager} = props
    
   


    const loadTroca = (troca) => {
        setTroca(troca)
        setFrequencia(troca.frequencia)
        setEtapaId(troca.etapaId)
        setProcessoId(troca.processoId)
        setEscalaFrequencia(troca.escalaFrequencia)
        let area = +troca.areaPlanejada
        setContadorPlanejado(area)
    }



   

    const salvarTroca = () => {
        let trocaToUpdadte = {id:troca.id,etapaId,escala : escalaFrequencia,frequencia,dataPlanejada,dataRealizada,contadorPlanejado,contadorRealizado}
        ScqApi.EditarTroca(trocaToUpdadte).then(res => responseHandler(res, toastManager,"Troca",toastInfo))
    }
    




    return (
        <>
          

            <Container style={{ marginTop: 20 }}>
                <h1>Editar Troca</h1>
                <Form>
                     <ModoEdicao  type={"troca"} getSelectedTroca={(troca) => loadTroca(troca)}></ModoEdicao>
                     {troca && <Form.Group style={{ marginTop: 20 }} >
                            <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Troca Id: {troca.id} || Data Planejada : {troca?.dataPlanejada }</Form.Label>
                        </Form.Group>}
                    <Form.Row>
                        <Col>
                            <GenericSelect returnType={"id"} title={"Processo"}  default={"Escolha um Processo"} onChange={(processoId) =>  setProcessoId(processoId)} selection={processoId}></GenericSelect>
                        </Col>
                        <Col>
                            <GenericSelect returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} filterField={"processoId"} filter={processoId} onChange={(etapaId) => { setEtapaId(etapaId) }} selection={etapaId}></GenericSelect>
                        </Col>
                    </Form.Row>


                    <Form.Row>
                       
                        <Col sm >
                            <Form.Label>Repetir a cada : </Form.Label>
                            <Form.Control type="number" value={frequencia} onChange={event => setFrequencia(event.target.value)} />
                        </Col>
                        <Col sm>
                            <UnidadeSelect selection={escalaFrequencia} type="frequenciaAnalise" title={"Unidade: "} default={"Escolha a escala"} onChange={escala => setEscalaFrequencia(escala)} />
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <Form.Label>Data Planejada : </Form.Label>
                            <Form.Control
                                type="date"
                                defaultValue={dataPlanejada}
                                onChange={event => { setdataPlanejada(event.target.value); console.log(dataPlanejada) }}>

                            </Form.Control>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <Form.Label>Data Realizada : </Form.Label>
                            <Form.Control
                                type="date"
                                defaultValue={dataRealizada}
                                onChange={event => { setdataRealizada(event.target.value); console.log(dataPlanejada) }}>

                            </Form.Control>
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

                    <Form.Group >

                        
                        <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={() => salvarTroca({id : troca.id, frequencia : frequencia, escala : escalaFrequencia, etapaId: troca.etapaId, dataPlanejada : troca.dataPlanejada, areaPlanejada : contadorPlanejado, numeroGrupoArea : numeroGrupoArea}, props.toastManager)} >Salvar</Button>
                    </Form.Group>

                </Form>
            </Container>

        </>
    )


}

export default withToastManager(withMenuBar(EditarTroca))