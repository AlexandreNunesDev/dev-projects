import React, { useState, useEffect } from 'react'
import { Button, Form, Container, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModoEdicao from '../Screens/ModoEdicao'
import MenuBar from '../Screens/MenuBar';
import ScqApi from '../Http/ScqApi';
import {withToastManager} from 'react-toast-notifications';
import {capitalize,subId} from '../Services/stringUtils'
import GenericSelect from '../Components/GenericSelect';
import EditarMontagemComposition from './EditarMontagemComposition';
import { useHistory } from 'react-router-dom';


const EditarEtapa = (props) => {

    const [nome, setNome] = useState()
    const [posicao, setPosicao] = useState()
    const [volume, setVolume] = useState()
    const [processoId , setProcessoId] = useState()
    const [montagemComposes, setMontagemComposes] = useState()
    const [removedCompose, setRemovedCompose] = useState()
    const [isEditableSelected, setIsEditableSelected] = useState(false)
    const [processos , setProcessos] = useState()
    const [edited, setEdited] = useState(false)
    const [etapa, setEtapa] = useState()
    const [mps, setMps] = useState()
    const { toastManager } = props
    const history = useHistory()
    


    const addEditedMontagemComposes = (montagemCompose) =>{
        
        setMontagemComposes(montagemComposes.concat(montagemCompose))
    }

    const responseHandler = (response) => {
        const { toastManager } = props;
        if(response.error){
            response.data.forEach(erro => {
                toastManager.add(`${subId(capitalize(erro.field))} : ${erro.error}`, {
                    appearance: 'error', autoDismiss: true
                  })});
        } else {
            toastManager.add(`Etapa ${response.nome} editada com sucesso`, {
                appearance: 'success', autoDismiss: true, onDismiss : () => window.location.reload()
              })
        }
    }

    const submitForm = () => {
            const replacedEtapa = { id: etapa.id, processoId: processoId, nome : nome, posicao : posicao,volume : volume }
   
            ScqApi.EditarEtapa(replacedEtapa).then(res => {
                responseHandler(res)
                const composes = montagemComposes.map((montagemCompose) => { return { id : montagemCompose.id ,quantidade: montagemCompose.quantidade, mpId: montagemCompose.mpId, etapaId: etapa.id} })
                if(montagemComposes.length!==0) {
                    ScqApi.CriarMontagem(composes)
                } 
            })

            if(removedCompose){

                let idsMcs = removedCompose.map(mc => {return mc.id})
               
                ScqApi.DeleteMontagemCompose(idsMcs)
            }
          

        

  
    }

   
    useEffect(() => {
        ScqApi.ListaProcessos().then(res => setProcessos(res))
        ScqApi.ListaMateriaPrimas().then(res => setMps(res))
       
    },[])

    useEffect(() => {
       console.log(montagemComposes)
       console.log(removedCompose)
       
    },[montagemComposes,removedCompose])


    const removerMontagemCompose = (indexToRemove) =>{
        setRemovedCompose(montagemComposes.filter((value,index) => {
            return index === indexToRemove
        }))
        setMontagemComposes(montagemComposes.filter((value,index) => {
            return index !== indexToRemove
        }))
        
    }



    useEffect(() => {
        if(etapa) {
            setProcessoId(etapa.processoId)
            setVolume(etapa.volume)
            setNome(etapa.nome)
            setPosicao(etapa.posicao)

            setIsEditableSelected(true)
            ScqApi.FindMontagemByEtapaId(etapa.id).then(res => setMontagemComposes(res))
        }
        
    },[etapa])

    useEffect(() => {
        setProcessoId(null)
        setVolume(null)
        setNome(null)
        setPosicao(null)
        setIsEditableSelected(false)
        setMontagemComposes([])
    },[edited])



        return (
            <>

                <header>
                    <MenuBar></MenuBar>
                </header>

                <Container style={{ marginTop: 20 }}>
                    <h1>Editar Etapa</h1>
                    <Form>
                        <h4>Escolha a Etapa para editar</h4>
                        <ModoEdicao edited={edited} onDelete={(deleteMessage) => {toastManager.add(`${deleteMessage}`, {appearance: 'success', autoDismiss: true ,autoDismissTimeout: 3000,onDismiss: () => { history.push("/CadastroEtapa")}}); setEdited(!edited)}} type={"etapa"} getSelectedEtapa={(etapa) => setEtapa(etapa)}></ModoEdicao>
                        {etapa && <Form.Group style={{ marginTop: 20 }} >
                             <Form.Label style={{color : "RED" ,fontWeight : "bold"}} >Etapa Id: {etapa.id}</Form.Label>
                         </Form.Group> }
                        <Form.Row>
                            <Col>
                                <GenericSelect title={"Processo"} returnType={"id"}  default={"Escolha um Processo"} onChange={(id) => setProcessoId(id)} ops={processos} isNotEditable={!isEditableSelected} selection={Number(processoId)}></GenericSelect>
                            </Col>
                            <Col>
                                <Form.Group >
                                    <Form.Label>Nome Etapa: </Form.Label>
                                    <Form.Control type="text" placeholder="Nome da Etapa" value={nome} onChange={(event) => setNome(event.target.value)} />
                                </Form.Group>
                            </Col>
                        </Form.Row>


                        <Form.Group >
                            <Form.Row>
                                <Col>
                                    <Form.Label>Posição: </Form.Label>
                                    <Form.Control type="number" min="0" placeholder="Posicao da Etapa" value={posicao} onChange={(event) => setPosicao(event.target.value)} />
                                </Col>
                                <Col>
                                    <Form.Label>Volume (Litros): </Form.Label>
                                    <Form.Control type="number" value={volume} onChange={(event) => setVolume(event.target.value)}></Form.Control>
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        {montagemComposes && <EditarMontagemComposition montagemComposes={montagemComposes} removerMontagemCompose={(indexToRemove) => removerMontagemCompose(indexToRemove)} setMontagemComposes={(montagemCompose) => addEditedMontagemComposes(montagemCompose)} ops={mps}></EditarMontagemComposition>}

                        <Form.Group>
                            
                            <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={submitForm}>Salvar</Button>
                        </Form.Group>
                    </Form>
                </Container>

            </>
        )

    

}

export default withToastManager(EditarEtapa)