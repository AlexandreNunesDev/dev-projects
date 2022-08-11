import { useEffect, useState } from "react"
import { Container, Form } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import { useToasts } from "react-toast-notifications"
import SaveDeleteButtons from "../Components/SaveDeleteButtons"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import { responseHandler } from "../Services/responseHandler"
import { toastInfo, toastWarn } from "../Services/toastType"


const EditarAnalise = () => {

    const location = useLocation()
    const analise = location.state
    const [analista, setAnalista] = useState()
    const [resultado, setResultado] = useState()
    const [data, setData] = useState()
    const [observacaoAnalise, setObservacaoAnalise] = useState()
    const toastManager = useToasts()



    useEffect(() => {
        setAnalista(analise.analista)
        setResultado(analise.resultado)
        setData(analise.data)
        setObservacaoAnalise(analise.observacaoAnalise)

    }, [])

   /* {id,analista,resultado,status,ordemId,parametroId,data,observacaoAnalise} */

    const salvarClick = () => {
        let novaAnalise = { ...analise }
        novaAnalise.analista = analista
        novaAnalise.observacaoAnalise = observacaoAnalise
        novaAnalise.data = data
        novaAnalise.resultado = resultado
        ScqApi.EditarAnalise(novaAnalise).then(res => responseHandler(res, toastManager, "Analise", toastInfo))
    }

    const deletarClick = () => {
        ScqApi.DeleteAnalise(analise.id).then(res => responseHandler(res, toastManager, "Analise", toastWarn))
    }



    return (
        <Container>
            <h3>Editar Adicao</h3>

            <Form>
                <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Analise Id: {analise.id}</Form.Label>
                <Form.Group>
                    <Form.Label>Analista:</Form.Label>
                    <Form.Control value={analista} onChange={(event) => setAnalista(event.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Resultado:</Form.Label>
                    <Form.Control value={resultado} onChange={(event) => setResultado(event.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Observacao</Form.Label>
                    <Form.Control value={observacaoAnalise} onChange={(event) => setObservacaoAnalise(event.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group >
                    <Form.Label>Realizado em:</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={data}
                        onChange={event => setData(event.target.value)}>
                    </Form.Control>
                </Form.Group>
                <SaveDeleteButtons deleteConfirmMsg={`Voce deseja deletar analise ${analise.id}?`} saveClick={salvarClick} deleteClick={deletarClick} ></SaveDeleteButtons>
            </Form>
        </Container>
    )
}

export default withMenuBar(EditarAnalise)