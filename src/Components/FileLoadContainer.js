import { useRef } from "react";
import { Button, Container, Form } from "react-bootstrap";



const FileLoadContainer = ({ setFile, fileDto, deleteReduxFunctions }) => {


    const fileButtonRef = useRef(null)




    return (

        <Form.Group style={{ marginTop: 24 }} >
            <Form.Row>
                <input ref={fileButtonRef} type="file" style={{ display: "none" }} multiple onChange={(event) => setFile(event.target.files[0])} />
                <Button style={{ backgroundColor: "orange", borderColor: "black" }} onClick={() => fileButtonRef.current.click()} >Carregar Arquivo</Button>
            </Form.Row>
            {fileDto && <Form.Row>
                <Form.Label>{`Arquivo carregado ${fileDto?.name}`}</Form.Label>
            </Form.Row>}

        </Form.Group>


    )
}

export default FileLoadContainer