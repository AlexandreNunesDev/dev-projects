import { useEffect, useState } from "react"
import { Button, Container, Form, Row } from "react-bootstrap"
import { useHistory, useLocation } from "react-router-dom"
import { useToasts } from "react-toast-notifications"
import GenericSelect from "../Components/GenericSelect"
import SaveDeleteButtons from "../Components/SaveDeleteButtons"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import { setProcessoId } from "../Reducers/ompReducer"
import { responseHandler } from "../Services/responseHandler"
import { toastInfo } from "../Services/toastType"

const EditarContador = () => {

    const location = useLocation()
    const [contador, setContador] = useState(location.state)
    const [processoId, seProcessoId] = useState()
    const [valor, setValor] = useState()
    const history = useHistory()
    const toastManager = useToasts()

    useEffect(() => {
        if (contador) {
            setValor(contador.valor)
            seProcessoId(contador.processoId)
        }

    }, [contador])

    const saveContador = () => {
        let contadorToUpdadte = { quantidade: valor, processoId: processoId }
        ScqApi.updateContador(contador.id, contadorToUpdadte).then(res => responseHandler(res, toastManager, "contador", toastInfo))
    }

    const deleteContador = () => {
        ScqApi.deleteContador(contador.id).then(res => {
            responseHandler(res, toastManager, "contador", toastInfo)
            ScqApi.listAllContadores(contador.processoId).then(res => {
                history.push("/Consultas/contador", { options: { contador: res } })
            })
        })

    }



    return (
        <Container>
            <h3>Editar Contador</h3>
            {contador && <Form.Group style={{ marginTop: 20 }} >
                <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Contador Id: {contador.id}</Form.Label>
            </Form.Group>}
            <Form.Group>
                <Form.Label>Quantidade</Form.Label>
                <Form.Control value={valor || ""} onChange={(event) => setValor(event.target.value)}></Form.Control>
            </Form.Group>
            <GenericSelect title={"Processo"} selection={processoId || ""} returnType={"id"} valueType={"id"} displayType={"nome"} onChange={(processoId) => setProcessoId(processoId)}></GenericSelect>
            <SaveDeleteButtons deleteClick={deleteContador} saveClick={saveContador} ></SaveDeleteButtons>
        </Container>
    )

}

export default withMenuBar(EditarContador)