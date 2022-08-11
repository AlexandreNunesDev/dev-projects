import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import DeleteConfirm from "./DeleteConfirm"

const SaveDeleteButtons = ({ saveClick, deleteClick, voltarClick, deleteConfirmMsg }) => {

    const [show,setShow] = useState()
    const history = useHistory()

    const onDeleteClick = () => {
        setShow(true)
       
    }

    const cancelDelete = () => {
        setShow(false)
    }

    const onVoltarClick = () => {
        if(voltarClick) {
            voltarClick()
        } else {
            history.goBack()
        }
    }


    return (

        <>
            <DeleteConfirm details={deleteConfirmMsg || "Voce tem certeza que deseja seguir com essa operação"}
                closeCredentialConfirm={cancelDelete}
                show={show}
                deleteSelection={deleteClick}
                confirmCancel={cancelDelete}
            ></DeleteConfirm>
            <Form.Group>
            <Button style={{ margin: 2, backgroundColor: "GRAY", borderColor: "GRAY" }} variant="primary" type="reset" onClick={() => onVoltarClick()}  >Voltar</Button>
                <Button style={{ margin: 2, backgroundColor: "RED", borderColor: "RED" }} variant="primary" type="reset" onClick={() => onDeleteClick()}  >Excluir</Button>
                <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={() => saveClick()}  >Salvar</Button>
            </Form.Group>
        </>)
}

export default SaveDeleteButtons