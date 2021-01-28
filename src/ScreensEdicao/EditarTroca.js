import React, { useState, useEffect } from 'react'
import {withMenuBar} from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import { Button, Form, Container, Col } from 'react-bootstrap'
import { withToastManager } from 'react-toast-notifications'
import UnidadeSelect from '../Components/UnidadeSelect'
import GenericSelect from '../Components/GenericSelect';
import ModoEdicao from '../Components/ModoEdicao'



const salvarTroca = (troca,toastManager) => {
    
   
    ScqApi.EditarTroca(troca)

    toastManager.add(`Troca cadastrada com sucesso`, {
        appearance: 'success', autoDismiss: true
    })
}


const EditarTroca = (props) => {


    const [frequencia, setFrequencia] = useState()
    const [etapaId, setEtapaId] = useState()
    const [etapas, setEtapas] = useState()
    const [processos, setProcessos] = useState()
    const [processoId, setProcessoId] = useState()
    const [escalaFrequencia, setEscalaFrequencia] = useState()
    const [troca, setTroca] = useState()
    
   


    useEffect(() => {
        ScqApi.ListaProcessos().then(res => setProcessos(res))
        
    }, [])

    useEffect(() => {
       processoId && ScqApi.ListaEtapasByProcesso(processoId).then(res => setEtapas(res))
        
    }, [processoId])

    useEffect(() => {
        if(troca) {
            setFrequencia(troca.frequencia)
            setEtapaId(troca.etapaId)
            setProcessoId(troca.processoId)
            setEscalaFrequencia(troca.escalaFrequencia)
       
  
    }
    }, [troca])

   






    return (
        <>
          

            <Container style={{ marginTop: 20 }}>
                <h1>Editar Troca</h1>
                <Form>
                     <ModoEdicao  type={"troca"} getSelectedTroca={(troca) => setTroca(troca)}></ModoEdicao>
                     {troca && <Form.Group style={{ marginTop: 20 }} >
                            <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Troca Id: {troca.id} || Data Planejada : {troca?.dataPlanejada }</Form.Label>
                        </Form.Group>}
                    <Form.Row>
                        <Col>
                            <GenericSelect returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={processos} onChange={(processoId) => { ScqApi.ListaEtapasByProcesso(processoId).then(res => setEtapas(res)) }} selection={processoId}></GenericSelect>
                        </Col>
                        <Col>
                            <GenericSelect returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} ops={etapas} onChange={(etapaId) => { setEtapaId(etapaId) }} selection={etapaId}></GenericSelect>
                        </Col>
                    </Form.Row>


                    <Form.Row>
                       
                        <Col sm >
                            <Form.Label>Repetir a cada : </Form.Label>
                            <Form.Control type="number" value={frequencia} onChange={event => setFrequencia(event.target.value)} />
                        </Col>
                        <Col sm>
                            <UnidadeSelect value={escalaFrequencia} type="frequenciaAnalise" title={"Unidade: "} default={"Escolha a escala"} onChange={escala => setEscalaFrequencia(escala)} />
                        </Col>
                    </Form.Row>

                    <Form.Group >

                        
                        <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={() => salvarTroca({id : troca.id, frequencia : frequencia, escala : escalaFrequencia, etapaId: troca.etapaId, dataPlanejada : troca.dataPlanejada}, props.toastManager)} >Salvar</Button>
                    </Form.Group>

                </Form>
            </Container>

        </>
    )


}

export default withToastManager(withMenuBar(EditarTroca))