
import { useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { useToasts } from "react-toast-notifications"
import GenericSelect from "../Components/GenericSelect"
import SaveDeleteButtons from "../Components/SaveDeleteButtons"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import { clearCorrecao, updadteEtapaRegras, updadteParametroRegras, updadteProcessoRegras, updadteRegras } from "../Reducers/regraCorrecoes"
import { responseHandler } from "../Services/responseHandler"
import { toastOk } from "../Services/toastType"

const EditarRegraDeCorrecao = () => {

    const location = useLocation()
    const regra = location.state
    const processo = useSelector(state => state.regraCorrecao.processo)
    const etapa = useSelector(state => state.regraCorrecao.etapa)
    const [valorUnidade, setValorUnidade] = useState()
    const [variacaoMaxima, setVariacaoMaxima] = useState()
    const dispatch = useDispatch()
    const toast = useToasts()


    useEffect(() => {
        setValorUnidade(regra.valorUnidade)
        setVariacaoMaxima(regra.variacaoMaxima)
    },[regra])

    const excluirCorrecao = () => {
        ScqApi.deleteRegraDeCorrecao(regra.id)
    }
    const salvarCorrecoes = () => {
        let novaRegra = {id : regra.id ,mpId : regra.materiaPrima.id,parametroId : regra.parametroDto.id,valorUnidade : valorUnidade ,variacaoMaxima :variacaoMaxima }
        ScqApi.AtualizaRegrasCorrecao(novaRegra).then(res => responseHandler(res, toast, "Regra Correcao", toastOk))
    }

    return (
        <>
            <Container>



                <div>
                    <GenericSelect title={"Processo"} displayType={"nome"} selection={regra.parametroDto.processoId} onChange={(value) => dispatch(updadteProcessoRegras(value))}></GenericSelect>
                    <GenericSelect title={"Etapa"} displayType={"nome"} filter={processo?.id} filterField={"processoId"} selection={regra.parametroDto.etapaId} onChange={(value) => dispatch(updadteEtapaRegras(value))}></GenericSelect>
                    <GenericSelect title={"Parametro"} displayType={"nome"} filter={etapa?.id} filterField={"etapaId"} selection={regra.parametroDto.id} onChange={(value) => dispatch(updadteParametroRegras(value))}></GenericSelect>
                </div>
                <div>
                    <Row>
                        <Col><Form.Label><strong>Unidade:</strong>{regra.parametroDto.unidade}</Form.Label></Col>
                        <Col><Form.Label><strong>Faixa Mínima:</strong>{regra.parametroDto.pMin}</Form.Label></Col>
                        <Col><Form.Label><strong>Faixa Máxima:</strong>{regra.parametroDto.pMax}</Form.Label></Col>
                    </Row>
                </div>
                <label style={{ fontSize: 32 }}><strong>Regras de Correcao para tanque de:</strong> {regra.volume} <strong>Lts</strong></label>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Materia Prima</th>
                                <th>Quantidade / unidade:</th>
                                <th>Variacao Maxima:</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{regra.materiaPrima.nome}</td>
                                <td><Form.Control type="number" pattern="0.00" placeholder="quantidade dosada para cada 1 unidade" value={valorUnidade} onChange={event => setValorUnidade(event.target.value, regra)} /></td>
                                <td><Form.Control type="number" pattern="0.00" placeholder="variação maxima da ultima analise" value={variacaoMaxima} onChange={event => setVariacaoMaxima(event.target.value, regra)} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <SaveDeleteButtons saveClick={salvarCorrecoes} deleteClick={excluirCorrecao}></SaveDeleteButtons>

            </Container>
        </>
    )


}


export default withMenuBar(EditarRegraDeCorrecao)