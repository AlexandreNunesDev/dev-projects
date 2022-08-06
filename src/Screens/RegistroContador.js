import { useEffect, useState } from "react"
import { Button, Container, Form, Row } from "react-bootstrap"
import { useToasts, withToastManager } from "react-toast-notifications"
import FileLoadContainer from "../Components/FileLoadContainer"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import { responseHandler } from "../Services/responseHandler"
import { formatIsoDate } from "../Services/stringUtils"
import { toastInfo, toastNok } from "../Services/toastType"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

const RegistroDeContador = () => {

    const history = useHistory()
    const [dataInicial, setDataInicial] = useState()
    const [dataFinal, setDataFinal] = useState()
    const [fileDto, setFileDto] = useState()
    const toastManager = useToasts()
    const processos = useSelector(state => state.options.processos)
    const [procesosField, setProcessosField] = useState()
    const [isLoadedByFile, setIsloadedByFile] = useState()


    useEffect(() => {
        setProcessosField(processos.map(processo => ({ processoId: processo.id, processoNome: processo.nome, quantidade: 0 })))
    }, [])

    const salvar = () => {
        if (dataFinal && dataInicial) {
            if (fileDto) {
                const form = new FormData();
                form.append('file', fileDto)
                ScqApi.UploadQuantidadeProducaoWithFile(dataInicial, dataFinal, form).then(res => responseHandler(res, toastManager, "Troca", toastInfo))
            } else {
                ScqApi.UploadQuantidadeProducaoWithForm(dataInicial, dataFinal, procesosField).then(res => responseHandler(res, toastManager, "Troca", toastInfo))
            }
        } else {
            toastManager.addToast("Voce nao selcionou as datas", {autoDismiss : true, appearance : toastNok})
        }



    }

    const updadteProcessoFieldQuantidade = (index, quantidade) => {
        const stateCpy = [...procesosField].map(fi => ({ ...fi }))
        if (index !== -1) stateCpy[index].quantidade = quantidade
        setProcessosField(stateCpy)
    }

    const showContadotHistorico =  (processoId) => {
        ScqApi.listAllContadores(processoId).then(res => {
            history.push("/Consultas/contador",{options : {contador : res}})
        })
       
    }

    return (
        <>
            <Container style={{ marginTop: 20 }}>
                <h3>Registro de Contador</h3>
                <Form.Group as={Row}>
                    <Form.Label>Data de referencia incial:</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={dataInicial}
                        onChange={event => setDataInicial(formatIsoDate(event.target.value))}>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label>Data de referencia final:</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={dataFinal}
                        onChange={event => setDataFinal(formatIsoDate(event.target.value))}>
                    </Form.Control>
                </Form.Group>
                <Form.Check type="checkbox" id="checkControlado">
                    <Form.Check.Input type="checkbox" checked={isLoadedByFile} onChange={(event) => setIsloadedByFile(event.target.checked)} />
                    <Form.Check.Label>Carregar por planilha ?</Form.Check.Label>
                </Form.Check>
                {isLoadedByFile ?
                    <FileLoadContainer deleteReduxFunctions={null} fileDto={fileDto} setFile={(file) => setFileDto(file)}></FileLoadContainer>
                    : <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Processo</th>
                                    <th>Quantidade</th>
                                    <th>Hitorico</th>
                                </tr>
                            </thead>
                            <tbody>
                                {procesosField?.map((processosField, index) => {
                                    return <tr key={index}>
                                        <td ><Form.Label>{processosField.processoNome}</Form.Label></td>
                                        <td ><Form.Control value={processosField.quantidade} onChange={(event) => updadteProcessoFieldQuantidade(index, event.target.value)}></Form.Control></td>
                                        <td ><Button onClick={() => showContadotHistorico(processosField.processoId)}>Ver historico</Button></td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>

                }

                <Button style={{ marginTop: 16 }} onClick={() => salvar()} >Salvar</Button>

            </Container>

        </>
    )
}

export default withMenuBar(withToastManager(RegistroDeContador))

