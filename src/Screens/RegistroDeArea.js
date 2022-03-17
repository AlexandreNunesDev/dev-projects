import { useState } from "react"
import { Button, Container, Form } from "react-bootstrap"
import { useToasts, withToastManager } from "react-toast-notifications"
import FileLoadContainer from "../Components/FileLoadContainer"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import { responseHandler } from "../Services/responseHandler"
import { formatIsoDate } from "../Services/stringUtils"
import { toastInfo } from "../Services/toastType"

 const RegistroDeArea = () => {

    const [dataInicial, setDataInicial] = useState()
    const [dataFinal, setDataFinal] = useState()
    const [fileDto, setFileDto] = useState()
    const toastManager = useToasts()


    const salvar = () => {
        const form = new FormData();
        form.append('file', fileDto)
        ScqApi.UpLoadAreaWithExcel(dataInicial,dataFinal,form).then(res => responseHandler(res,toastManager,"Troca", toastInfo))
    }
    
    return (
        <>
            <Container style={{ marginTop: 20 }}>
            <h3>Registro de Area Tratada</h3>
                    <Form.Group as="Row">
                        <Form.Label>Data de referencia incial:</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            defaultValue={dataInicial}
                            onChange={event => setDataInicial(formatIsoDate(event.target.value))}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as="Row">
                        <Form.Label>Data de referencia final:</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            defaultValue={dataFinal}
                            onChange={event => setDataFinal(formatIsoDate(event.target.value))}>
                        </Form.Control>
                    </Form.Group>
                    <FileLoadContainer deleteReduxFunctions={null} fileDto={fileDto} setFile={(file) => setFileDto(file)}></FileLoadContainer>
                    <Button style={{marginTop : 16}} onClick={() => salvar()} >Salvar</Button> 

            </Container>
            
        </>
    )
}

export default withMenuBar(withToastManager(RegistroDeArea))

