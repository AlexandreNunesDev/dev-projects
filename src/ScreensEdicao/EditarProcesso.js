import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Button, Form, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withMenuBar } from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import { withToastManager } from 'react-toast-notifications'
import { useHistory, useLocation } from 'react-router-dom';
import { WebSocketContext } from '../websocket/wsProvider';
import { toastInfo } from '../Services/toastType';
import { responseHandler } from '../Services/responseHandler';
import SaveDeleteButtons from '../Components/SaveDeleteButtons';

const EditarProcesso = (props) => {

    const location = useLocation()
    const [processo, setProcesso] = useState(location.state)
    const [id, setId] = useState()
    const context = useContext(WebSocketContext)
    const [nome, setNome] = useState()
    const [isEditableSelected, setIsEditableSelected] = useState(false)
    const [edited, setEdited] = useState(false)
    const { toastManager } = props
    const history = useHistory()





    const submitForm = (event) => {
        const replaceProcesso = { id: id, nome: nome }
        ScqApi.EditarProcesso(replaceProcesso).then(res => responseHandler(res, toastManager, "Processo", toastInfo, context))

    }

    const deleteProcesso = (event) => {
        ScqApi.DeleteProcesso(id).then(res => responseHandler(res, toastManager, "Processo", toastInfo, context))

    }




    useEffect(() => {
        if (processo) {
            setNome(processo.nome)
            setId(processo.id)
            setIsEditableSelected(true)
        }

    }, [processo])







    return (
        <Fragment>



            <Container style={{ marginTop: 20 }}>
                <h1>Editar Processo</h1>
                <Form>
                    <Form.Group style={{ marginTop: 20 }} hidden={!isEditableSelected}>
                        <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Processo Id: {id}</Form.Label>
                    </Form.Group>
                    <Form.Group controlId="processoLinhaNome">
                        <Form.Label>Processo: </Form.Label>
                        <Form.Control value={nome} type="text" placeholder="Entre o nome do Processo" onChange={event => setNome(event.target.value)} />
                    </Form.Group>
                    <SaveDeleteButtons deleteClick={deleteProcesso} saveClick={submitForm}></SaveDeleteButtons>
                </Form>
            </Container>

        </Fragment>
    )


}

export default withToastManager(withMenuBar(EditarProcesso))