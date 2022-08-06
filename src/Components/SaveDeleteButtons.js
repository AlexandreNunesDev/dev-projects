import { Button, Form } from "react-bootstrap"

const SaveDeleteButtons = ({saveClick, deleteClick}) => {
   return (<Form.Group>
        <Button style={{ margin: 2, backgroundColor: "RED", borderColor: "RED" }} variant="primary" type="reset" onClick={() => deleteClick()}  >Excluir</Button>
        <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={() => saveClick()}  >Salvar</Button>
    </Form.Group>)
}

export default SaveDeleteButtons