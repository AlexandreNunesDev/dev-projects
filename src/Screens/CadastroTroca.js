import React, { useContext, useState } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withToastManager } from 'react-toast-notifications';
import GenericSelect from '../Components/GenericSelect';
import UnidadeSelect from '../Components/UnidadeSelect';
import { withMenuBar } from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import dispatchers from '../mapDispatch/mapDispathToProps';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import { responseHandler } from '../Services/responseHandler';
import { toastOk } from '../Services/toastType';
import { WebSocketContext } from '../websocket/wsProvider';






const CadastroTroca = (props) => {

    const [dataPlanejada, setDataPlanejada] = useState(new Date())
    const context = useContext(WebSocketContext)
    const [frequencia, setFrequencia] = useState()
    const [etapaId, setEtapaId] = useState()
    const [processoId, setProcessoId] = useState()

    const [etapas, setEtapas] = useState()
    const [unidade, setUnidade] = useState()
    const [areaPlanejada, setAreaPlanejada] = useState('')


   


    const salvarTroca = () => {
        const troca = { id: null, dataPlanejada, frequencia, etapaId, escala: unidade, areaPlanejada : areaPlanejada }
        const {toastManager} = props
        ScqApi.CriarTroca(troca,[props.loadTrocas]).then(res => responseHandler(res,toastManager,'Troca',toastOk))
    
     
    }

    





    return (
        <>
      
            <Container style={{ marginTop: 20 }}>
                <h1>Cadastro de Troca</h1>
                <Form>
                    <Form.Row>
                        <Col>
                            <GenericSelect returnType={"id"} title={"Processo"}  default={"Escolha um Processo"}  onChange={(id) =>setProcessoId(id) } ></GenericSelect>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <GenericSelect returnType={"id"} title={"Etapa"} filter={processoId} filterField={"processoId"} default={"Escolha uma Etapa"}  onChange={(id) => { setEtapaId(id) }}></GenericSelect>
                        </Col>
                    </Form.Row>


                    <Form.Row>
                        <Col>
                            <Form.Label>Data Planejada : </Form.Label>
                            <Form.Control
                                type="date"
                                defaultValue={dataPlanejada}
                                onChange={event => { setDataPlanejada(event.target.value); console.log(dataPlanejada) }}>

                            </Form.Control>
                        </Col>
                    </Form.Row>

                    <Form.Row>
                        <Col>
                            <Form.Label>Repetir a cada : </Form.Label>
                            <Form.Control type="number" value={frequencia} onChange={event => setFrequencia(event.target.value)} />
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <UnidadeSelect type="frequenciaAnalise" title={"Unidade: "} default={"Escolha a unidade de Tempo"} onChange={unidade => setUnidade(unidade)} />
                        </Col>
                    </Form.Row>
                    <Form.Row style={{ marginBottom: 16 }}>
                        <Col>
                            <Form.Label>Trocar a cada (metros quadrados) : </Form.Label>
                            <Form.Control type="number" value={areaPlanejada} onChange={event => setAreaPlanejada(event.target.value)} />
                        </Col>
                    </Form.Row>
                    <Form.Row>
                    <Form.Group >


                        <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={() => salvarTroca()} >Salvar</Button>
                    </Form.Group>
                    </Form.Row>
                </Form>
            </Container>

        </>
    )


}

export default withToastManager(withMenuBar(connect(mapToStateProps.toProps,dispatchers)(CadastroTroca)))