import React, { useState, useEffect, useContext } from 'react'
import { Button, Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModoEdicao from '../Components/ModoEdicao'
import ScqApi from '../Http/ScqApi';
import { withToastManager } from 'react-toast-notifications';
import GenericSelect from '../Components/GenericSelect';
import EditarMontagemComposition from './EditarMontagemComposition';
import { useHistory } from 'react-router-dom';
import { withMenuBar } from '../Hocs/withMenuBar';
import { responseHandler } from '../Services/responseHandler';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';
import { toastInfo } from '../Services/toastType';


const EditarEtapa = (props) => {

    const [nome, setNome] = useState('')
    const context = useContext(WebSocketContext)
    const [posicao, setPosicao] = useState('')
    const [volume, setVolume] = useState('')
    const [processoId, setProcessoId] = useState()
    const [montagemComposes, setMontagemComposes] = useState()
    const [removedCompose, setRemovedCompose] = useState()
    const [isEditableSelected, setIsEditableSelected] = useState(false)
    const [processos, setProcessos] = useState()
    const [edited, setEdited] = useState(false)
    const [etapa, setEtapa] = useState()
    const [mps, setMps] = useState()
    const { toastManager } = props
    const history = useHistory()



    const addEditedMontagemComposes = (montagemCompose) => {

        setMontagemComposes(montagemComposes.concat(montagemCompose))
    }

    const submitForm = () => {
        const {toastManager} = props
        const replacedEtapa = { id: etapa.id, processoId: processoId, nome: nome, posicao: posicao, volume: volume }

        ScqApi.EditarEtapa(replacedEtapa).then(res => {
            responseHandler(res, toastManager, "Etapa", toastInfo)
            const composes = montagemComposes.map((montagemCompose) => { return { id: montagemCompose.id, quantidade: montagemCompose.quantidade, mpId: montagemCompose.mpId, etapaId: etapa.id } })
            if (montagemComposes.length !== 0) {
                ScqApi.CriarMontagem(composes)
            }
        })

        if (removedCompose) {
            let idsMcs = removedCompose.map(mc => { return mc.id })
            ScqApi.DeleteMontagemCompose(idsMcs)
        }





    }


    useEffect(() => {
        ScqApi.ListaProcessos().then(res => setProcessos(res))
        ScqApi.ListaMateriaPrimas().then(res => setMps(res))

    }, [])

    useEffect(() => {
        console.log(montagemComposes)
        console.log(removedCompose)

    }, [montagemComposes, removedCompose])


    const removerMontagemCompose = (indexToRemove) => {
        setRemovedCompose(montagemComposes.filter((value, index) => {
            return index === indexToRemove
        }))
        setMontagemComposes(montagemComposes.filter((value, index) => {
            return index !== indexToRemove
        }))

    }



    useEffect(() => {
        if (etapa) {
            setProcessoId(etapa.processoId)
            setVolume(etapa.volume)
            setNome(etapa.nome)
            setPosicao(etapa.posicao)
            setIsEditableSelected(true)
            ScqApi.FindMontagemByEtapaId(etapa.id).then(res => setMontagemComposes(res))
        }

    }, [etapa])





    return (
        <>


            <Container style={{ marginTop: 20 }}>
                <h1>Editar Etapa</h1>
                <Form>
                    <h4>Escolha a Etapa para editar</h4>
                    <ModoEdicao edited={edited} onDelete={(deleteMessage) => { toastManager.add(`${deleteMessage}`, { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000, onDismiss: () => { history.push("/CadastroEtapa") } }); setEdited(!edited) }} type={"etapa"} getSelectedEtapa={(etapa) => setEtapa(etapa)}></ModoEdicao>
                    {etapa && <Form.Group style={{ marginTop: 20 }} >
                        <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Etapa Id: {etapa.id}</Form.Label>
                    </Form.Group>}
                    <Form.Row>
                        <Col>
                            <GenericSelect title={"Processo"} returnType={"id"} default={"Escolha um Processo"} onChange={(id) => setProcessoId(id)} ops={processos} isNotEditable={!isEditableSelected} selection={Number(processoId)}></GenericSelect>
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

export default withToastManager(withMenuBar(EditarEtapa))