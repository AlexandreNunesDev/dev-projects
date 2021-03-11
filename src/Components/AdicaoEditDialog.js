
import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
const AdicaoEditDiaolog = (props) => {

    const [novaQuantidade, setNovaQuantidade] = useState(props.adicao[0].quantidade)


    return (
        <>
            <Modal show={props.show} onHide={() => props.handleClose(false)}>
                <Modal.Header closeButton>
                    <h3>Editando Quantidade Adicao : {props.adicao[0].id}</h3>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        
                        <Form.Label>
                            {props.adicao[0].nomeMp}
                        </Form.Label>
                        <Form.Control value={novaQuantidade} onChange={(event) => setNovaQuantidade(event.target.value)}></Form.Control>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {props.setAdicao(novaQuantidade,props.adicao[1]);props.handleClose(false) }}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>

        </>

    )

}

export default AdicaoEditDiaolog