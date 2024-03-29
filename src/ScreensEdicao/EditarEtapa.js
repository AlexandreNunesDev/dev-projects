import React, { useState, useEffect, useContext } from 'react'
import { Button, Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModoEdicao from '../Components/ModoEdicao'
import ScqApi from '../Http/ScqApi';
import { withToastManager } from 'react-toast-notifications';
import GenericSelect from '../Components/GenericSelect';
import EditarMontagemComposition from './EditarMontagemComposition';
import { useHistory, useLocation } from 'react-router-dom';
import { withMenuBar } from '../Hocs/withMenuBar';
import { responseHandler } from '../Services/responseHandler';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';
import { toastInfo } from '../Services/toastType';
import { useSelector } from 'react-redux';
import SaveDeleteButtons from '../Components/SaveDeleteButtons';


const EditarEtapa = (props) => {

    const location = useLocation()
    const [nome, setNome] = useState('')
    const context = useContext(WebSocketContext)
    const [posicao, setPosicao] = useState('')
    const [volume, setVolume] = useState('')
    const [processoId, setProcessoId] = useState()
    const [montagemComposes, setMontagemComposes] = useState()
    const [removedCompose, setRemovedCompose] = useState()
    const [isEditableSelected, setIsEditableSelected] = useState(false)
    const [edited, setEdited] = useState(false)
    const [etapa, setEtapa] = useState(location.state)
    const processos= useSelector(state => state.options.processos)
    const mps= useSelector(state => state.options.materiasPrima)
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



    const onDelete = () => {
        ScqApi.DeleteEtapa(etapa.id).then(res => responseHandler(res,toastManager,"Etapa", toastInfo))
    }



    return (
        <>


            <Container style={{ marginTop: 20 }}>
                <h1>Editar Etapa</h1>
                <Form>
                    <h4>Escolha a Etapa para editar</h4>
                    {etapa && <Form.Group style={{ marginTop: 20 }} >
                        <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Etapa Id: {etapa.id}</Form.Label>
                    </Form.Group>}
                    <Form.Row>
                        <Col>
                            <GenericSelect title={"Processo"}  returnType={"id"} default={"Escolha um Processo"} onChange={(id) => setProcessoId(id)} ops={processos} isNotEditable={!isEditableSelected} selection={Number(processoId) || ''}></GenericSelect>
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
                    <SaveDeleteButtons deleteClick={onDelete} saveClick={submitForm} ></SaveDeleteButtons>
                </Form>
            </Container>

        </>
    )



}

export default withToastManager(withMenuBar(EditarEtapa))