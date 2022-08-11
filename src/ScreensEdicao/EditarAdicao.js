import { useEffect, useState } from "react"
import { Container, Form } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import { useToasts } from "react-toast-notifications"
import SaveDeleteButtons from "../Components/SaveDeleteButtons"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import { responseHandler } from "../Services/responseHandler"
import { toastInfo, toastWarn } from "../Services/toastType"


const EditarAdicao = () => {

    const location = useLocation()
    const adicao = location.state
    const [quantidade, setQuantidade] = useState()
    const [quantidadeRealizada, setQuantidadeRealizada] = useState()
    const [realizadoPor, setRealizadoPor] = useState()
    const [realizadoEm, setRealizadoEm] = useState()
    const [observacao, setObservacao] = useState()
    const toastManager = useToasts()

    useEffect(() => {
        setQuantidade(adicao.quantidade)
        setRealizadoPor(adicao.realizadoPor)
        setRealizadoEm(adicao.realizadoEm)
        setObservacao(adicao.observacao)
        setQuantidadeRealizada(adicao.quantidadeRealizada)

    }, [])


    const salvarClick = () => {
        let novaAdica = { ...adicao }
        novaAdica.quantidade = quantidadeRealizada
        novaAdica.realizadoPor = realizadoPor
        novaAdica.observacao = observacao
        novaAdica.realizada = realizadoEm
        ScqApi.EditarAdicao(adicao.id, novaAdica).then(res => responseHandler(res, toastManager, "Adicao", toastInfo))
    }

    const deletarClick = () => {
        ScqApi.deleteAdicao(adicao.id).then(res => responseHandler(res, toastManager, "Adicao", toastWarn))
    }



    return (
        <Container>
            <h3>Editar Adicao</h3>

            <Form>
                <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Adicao Id: {adicao.id}</Form.Label>
                <Form.Group>
                    <Form.Label>Quantidade planejada:</Form.Label>
                    <Form.Control value={quantidade} onChange={(event) => setQuantidade(event.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Quantidade realizada:</Form.Label>
                    <Form.Control value={quantidadeRealizada} onChange={(event) => setQuantidadeRealizada(event.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Observacao</Form.Label>
                    <Form.Control value={observacao} onChange={(event) => setObservacao(event.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group >
                    <Form.Label>Realizado em:</Form.Label>
                    <Form.Control
                        type="date"
                        defaultValue={realizadoEm}
                        onChange={event => setRealizadoEm(event.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Realizado por:</Form.Label>
                    <Form.Control value={realizadoPor} onChange={(event) => setRealizadoPor(event.target.value)}></Form.Control>
                </Form.Group>
                <SaveDeleteButtons deleteConfirmMsg={`Voce deseja deletar adicao ${adicao.id}?`} saveClick={salvarClick} deleteClick={deletarClick} ></SaveDeleteButtons>
            </Form>
        </Container>
    )
}

export default withMenuBar(EditarAdicao)