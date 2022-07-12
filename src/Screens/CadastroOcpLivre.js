import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Spinner } from 'react-bootstrap';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory, withRouter } from 'react-router-dom';
import { withToastManager } from 'react-toast-notifications';
import AdicaoForm from '../Components/AdicaoForm';
import GenericSelect from '../Components/GenericSelect';
import { withMenuBar } from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import dispatchers from '../mapDispatch/mapDispathToProps';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import { clear, updateAdicoes } from '../Reducers/adicaoReducer';
import { responseHandler } from '../Services/responseHandler';
import { toastOk } from '../Services/toastType';
import { WebSocketContext } from '../websocket/wsProvider';




const redirectAnalise = (history, analise) => {
    history.push("/RegistroAnalise", analise)
}



const CadastroOcpLivre = (props) => {
    let history = useHistory();
    const context = useContext(WebSocketContext)
    const [mpQtds, setMpQtd] = useState([])
    const [responsavel, setResponsavel] = useState('')
    const [observacao, setObservacao] = useState('')
    const dispatcher = useDispatch()
    const [loading] = useState(false)
    const analiseToSave = useSelector(state => state.analise.analiseToSave)
    const processos = useSelector(state => state.options.processos)
    const etapas = useSelector(state => state.options.etapas)
    const [etapasOpts, setEtapas] = useState()
    const [processoId, setProcessoId] = useState()
    const [etapa, setEtapa] = useState()
    const adicoes = useSelector(state => state.adicaoForm.adicoes)
    const { toastManager } = props
    let unidade = ""



    useEffect(() => {
        
       if(processoId) setEtapas(etapas.filter(etapa => etapa.processoId == processoId))
    }, [processoId])



    const deleteAdicao = (adicaoId) => {
        ScqApi.deleteAdicao(adicaoId).then(res => {
            let adicoesDtoCopy = [...adicoes]
            dispatcher(updateAdicoes(adicoesDtoCopy.filter(addDto => Number(addDto.id) !== Number(adicaoId))))
            toastManager.add(`Adicao ${adicaoId || ""} deletada com sucesso`, { type: "info", autoDismiss: true })
        })
        dispatcher(clear())
    }



    const saveOcp = () => {
        let ocp = { parametroId: null, responsavel: responsavel, observacao: observacao, analiseId: null, etapaId: etapa.id, adicoes: adicoes }
        ScqApi.CriarOcp(ocp).then((res) => {
            responseHandler(res, toastManager, "OrdemDeCorrecao", toastOk)
        }
        );

        dispatcher(updateAdicoes([]))
        history.push("/OrdensDeCorrecao")

    }



    return (
        <>

            {

                loading ? <Container><Spinner animation="grow" />
                    <Form.Label>Aguarde , gerando OCP</Form.Label></Container>
                    :
                    <Container style={{ marginTop: 20 }}>
                        <h1>Cadastro de Ordem de Correção</h1>
                        <Form style={{ marginTop: 20 }}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <GenericSelect title={"Processo"} returnType={"id"} default={"Escolha um Processo"} ops={processos} onChange={(value) => setProcessoId(value)} selection={processoId}></GenericSelect>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <GenericSelect title={"Etapa"} returnType={"id"} default={"Escolha uma Etapa"} ops={etapasOpts} onChange={(value) => {
                                            setEtapa(etapas.find(etap => etap.id == value))
                                    }} selection={etapa?.id}></GenericSelect>
                                </Form.Group>
                            </Form.Row>

                            <AdicaoForm deleteAdicao={deleteAdicao} etapa={etapa}></AdicaoForm>

                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Responsavel: </Form.Label>
                                    <Form.Control type="text" onChange={(event) => setResponsavel(event.target.value)}></Form.Control>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label>Observação: </Form.Label>
                                    <Form.Control type="text" placeholder={"Ex: Add. Cx. Misutra"} onChange={(event) => setObservacao(event.target.value)}></Form.Control>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group >
                                    <Button style={{ margin: 2 }} onClick={() => {
                                        redirectAnalise(history, analiseToSave)
                                        redirectAnalise(history)
                                    }}>
                                        Cancelar
                                    </Button>
                                    <Button style={{ margin: 2 }} type="reset" onClick={() => {
                                        saveOcp(analiseToSave, mpQtds, responsavel, observacao, history, props, context)
                                    }}>
                                        Salvar
                                    </Button>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Container>
            }


        </>
    )


}



export default withToastManager(withRouter(withMenuBar(connect(mapToStateProps.toProps, dispatchers)(CadastroOcpLivre))))