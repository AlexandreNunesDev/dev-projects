import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { useHistory, withRouter } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';

import { connect, useDispatch, useSelector } from 'react-redux';
import { withToastManager } from 'react-toast-notifications';
import AdicaoForm from '../Components/AdicaoForm';
import { withMenuBar } from '../Hocs/withMenuBar';
import dispatchers from '../mapDispatch/mapDispathToProps';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import Adicao from '../models/AdicaoModels';
import { clear, updateAdicoes } from '../Reducers/adicaoReducer';
import { responseHandler } from '../Services/responseHandler';
import { toastInfo, toastWarn } from '../Services/toastType';
import { isInsideFaixa } from '../Services/analiseService';







const EditarOcpAdicao = (props) => {

    const history = useHistory()
    const dispatcher = useDispatch()
    const ocp = useSelector(state => state.ocp)
    /** @type {Array<Adicao>} */
    const adicoes = useSelector(state => state.adicaoForm.adicoes)
    const [responsavel, setResponsavel] = useState(ocp.ocpToEdit.responsavel)
    const [observacao, setObservacao] = useState(ocp.ocpToEdit.observacao)
    const { toastManager } = props

    useEffect(() => {
        if (adicoes.length === 0) {
            let adicoesDtoToAdicoes = ocp.ocpToEdit.adicoesDto.map(adicaoDto => new Adicao(adicaoDto.id, adicaoDto.quantidade, adicaoDto.ocpId, adicaoDto.idMp, adicaoDto.unidade, adicaoDto.nomeMp ,adicaoDto.quantidadeRealizada,adicaoDto.status))
            dispatcher(updateAdicoes([...adicoesDtoToAdicoes, ...adicoes]))
        }

    }, [])


    const deleteAdicao = (adicaoId) => {
        ScqApi.deleteAdicao(adicaoId).then(res => {
            let adicoesDtoCopy = [...adicoes]
            dispatcher(updateAdicoes(adicoesDtoCopy.filter(addDto => Number(addDto.id) !== Number(adicaoId))))
            toastManager.add(`Adicao ${adicaoId} deletada com sucesso`, { type: "info", autoDismiss: true })
        })
        dispatcher(clear())
    }

    const salvarEdicaoOcp = () => {
        let newOcp = { id: ocp.ocpToEdit.id, responsavel, observacao, adicoes: adicoes }
        ScqApi.EditarOcpAdicao(newOcp).then(res => {
            responseHandler(res, toastManager, "OrdemDeCorrecao", toastInfo)
        })
        history.push("/OrdensDeCorrecao")
        dispatcher(clear())

    }

    const deletarOcp = () => {
        ScqApi.DeleteOcp(ocp.ocpToEdit.id).then(res => {
            responseHandler(res, toastManager, "OrdemDeCorrecao", toastWarn)
            history.push("/OrdensDeCorrecao")
        })
        dispatcher(clear())
    }



    return (
        <>
            <Container style={{ marginTop: 20 }}>
                <h1>{`Editar Ordem de Correcao : ${ocp.ocpToEdit.id}`}</h1>
                <Form style={{ marginTop: 20 }}>
                    <Form.Row>
                        <Form.Group xs={3} as={Col}>
                            <Form.Label>Etapa : {ocp.ocpToEdit.etapaNome}</Form.Label>
                        </Form.Group>
                        <Form.Group xs={3} as={Col} >
                            <Form.Label>Parametro : {`${ocp.ocpToEdit.parametroNome}`}</Form.Label>
                        </Form.Group>

                        <Form.Group xs={2} as={Col}>
                            <Form.Label>Faixa Mininima : {`${ocp.ocpToEdit.pMin} ${ocp.ocpToEdit.unidade}`}</Form.Label>
                        </Form.Group>
                        <Form.Group xs={2} as={Col} >
                            <Form.Label>Faixa Máxima : {`${ocp.ocpToEdit.pMax} ${ocp.ocpToEdit.unidade}`}</Form.Label>
                        </Form.Group>
                        <Form.Group xs={2} as={Col} >
                            <Form.Label style={{ color: !isInsideFaixa(ocp.ocpToEdit) ? 'red' : 'black' }}>Resultado: {`${ocp.ocpToEdit.resultado} ${ocp.ocpToEdit.unidade}`}</Form.Label>
                        </Form.Group>

                    </Form.Row>

                    <AdicaoForm deleteAdicao={deleteAdicao}></AdicaoForm>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Responsavel: </Form.Label>
                            <Form.Control type="text" value={responsavel} onChange={(event) => setResponsavel(event.target.value)}></Form.Control>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Observação: </Form.Label>
                            <Form.Control type="text" value={observacao} placeholder={"Ex: Add. Cx. Misutra"} onChange={(event) => setObservacao(event.target.value)}></Form.Control>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group >
                            <Button style={{ margin: 2 }} onClick={() => {
                                props.history.push("/OrdensDeCorrecao")
                                dispatcher(clear())
                            }} >
                                Cancelar
                            </Button>
                            <Button style={{ margin: 2, backgroundColor: 'RED', borderColor: 'RED' }} type="reset" onClick={() => deletarOcp()} >
                                Excluir Ocp
                            </Button>
                            <Button style={{ margin: 2 }} type="reset" onClick={() => salvarEdicaoOcp()} >
                                Salvar
                            </Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Container>



        </>
    )


}



export default withRouter(withMenuBar(withToastManager(connect(mapToStateProps.toProps, dispatchers)(EditarOcpAdicao))))