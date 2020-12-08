import React, { useState, useEffect } from 'react'
import {capitalize,subId} from '../Services/stringUtils'
import ScqApi from '../Http/ScqApi';
import { Button, Form, Container, Col } from 'react-bootstrap'
import { withToastManager } from 'react-toast-notifications'
import MenuBar from './MenuBar'
import UnidadeSelect from '../Components/UnidadeSelect'
import GenericSelect from '../Components/GenericSelect';






const CadastroTroca = (props) => {

    const [dataPlanejada, setDataPlanejada] = useState(new Date())
    
    const [frequencia, setFrequencia] = useState()
    const [etapaId, setEtapaId] = useState()
    const [etapas, setEtapas] = useState()
    const [processos, setProcessos] = useState()
    const [escala, setEscala] = useState()
   


    useEffect(() => {
        ScqApi.ListaProcessos().then(res => setProcessos(res))
        
    }, []
    )

    const salvarTroca = () => {
        const troca = { id: null, dataPlanejada, frequencia, etapaId, escala }
    
        ScqApi.CriarTroca(troca).then(res => responseHandler(res))
    
     
    }

    const responseHandler = (response) => {
        const { toastManager } = props;
        if(response.error){
            response.data.forEach(erro => {
                toastManager.add(`${subId(capitalize(erro.field))} : ${erro.error}`, {
                    appearance: 'error', autoDismiss: true
                  })});
        } else {
            toastManager.add(`Troca etapa ${response.etapaNome} criado`, {
                appearance: 'success', autoDismiss: true
              })
        }

       
       
        
    }


    





    return (
        <>
            <header>
                <MenuBar ></MenuBar>
            </header>

            <Container style={{ marginTop: 20 }}>
                <h1>Cadastro de Troca</h1>
                <Form>
                    <Form.Row>
                        <Col>
                            <GenericSelect returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={processos} onChange={(processoId) => { ScqApi.ListaEtapasByProcesso(processoId).then(res => setEtapas(res)) }} ></GenericSelect>
                        </Col>
                        <Col>
                            <GenericSelect returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} ops={etapas} onChange={(etapaId) => { setEtapaId(etapaId) }}></GenericSelect>
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



                        <Col sm >
                            <Form.Label>Repetir a cada : </Form.Label>
                            <Form.Control type="number" value={frequencia} onChange={event => setFrequencia(event.target.value)} />
                        </Col>
                        <Col sm>
                            <UnidadeSelect type="frequenciaAnalise" title={"Unidade: "} default={"Escolha a escala"} onChange={escala => setEscala(escala)} />
                        </Col>
                    </Form.Row>

                    <Form.Group >

                        <Button style={{ margin: 2 }} variant="primary" onClick={() => {
                            props.history.push("/EditarTroca")
                        }}>Editar</Button>

                        <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={() => salvarTroca()} >Salvar</Button>
                    </Form.Group>

                </Form>
            </Container>

        </>
    )


}

export default withToastManager(CadastroTroca)