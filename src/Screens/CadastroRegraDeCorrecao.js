import { useEffect } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useToasts } from "react-toast-notifications"
import GenericSelect from "../Components/GenericSelect"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import { clearCorrecao, updadteEtapaRegras, updadteParametroRegras, updadteProcessoRegras, updadteRegras } from "../Reducers/regraCorrecoes"
import { responseHandler } from "../Services/responseHandler"
import { toastOk } from "../Services/toastType"

const CadastroDeRegraDeCorrecao = () => {

    const regras = useSelector(state => state.regraCorrecao.regras)
    const processo = useSelector(state => state.regraCorrecao.processo)
    const etapa = useSelector(state => state.regraCorrecao.etapa)
    const parametro = useSelector(state => state.regraCorrecao.parametro)
    const materiasPrimaOps = useSelector(state => state.options.materiasPrima)
    const dispatch = useDispatch()
    const toast = useToasts()


    useEffect(() => {
        if (etapa) {
            let materiasPrima = etapa.proportionMps.map(propMp => {
                let idMp = propMp.split(':')[0]
                let materiaPrima = materiasPrimaOps.filter(mp => mp.id == idMp)
                return materiaPrima[0]
            })
            let regrasToBeCreated = materiasPrima.map(mp => ({ mpId: mp.id, mpNome: mp.nome, parametroId: parametro.id, valorUnidade: getValorSugestao(etapa.volume, parametro.unidade, etapa.proportionMps, mp.id), variacaoMaxima: 0 }))
            dispatch(updadteRegras(regrasToBeCreated))
        }

        return () => dispatch(updadteRegras([]))



    }, [parametro])


    const getValorSugestao = (volume, unidade, proportionMp, mpId) => {
        let proportion = proportionMp.find(prop => prop.split(":")[0] == mpId)
        if (volume) {
            if (unidade == "%") {
                return +(volume * 0.01 * Number(proportion.split(":")[1])).toFixed(2)
            } else if (unidade == "g/l") {
                return +(volume / 1000 * Number(proportion.split(":")[1])).toFixed(2)
            } else if (unidade == 'mg/l' || unidade == "ml/l") {
                return +(volume / 10000 * Number(proportion.split(":")[1])).toFixed(2)
            }
        } else {
            return 0
        }


    }

    const updateRegrasField = (valor, field, index) => {
        let regrasCopy = [...regras].map(r => ({ ...r }))
        regrasCopy[index].valorUnidade = valor
        dispatch(updadteRegras(regrasCopy))
    }

    const updateVariacaoFiled = (valor, field, index) => {
        let regrasCopy = [...regras].map(r => ({ ...r }))
        regrasCopy[index].variacaoMaxima = valor
        dispatch(updadteRegras(regrasCopy))
    }

    const salvarCorrecoes = () => {

        ScqApi.CriarRegrasCorrecao(regras).then(res => responseHandler(res, toast, "Regra Correcao", toastOk))
        dispatch(clearCorrecao())
    }

    return (
        <>
            <Container>


               
                <div>
                    <GenericSelect title={"Processo"} displayType={"nome"} selection={processo?.id} onChange={(value) => dispatch(updadteProcessoRegras(value))}></GenericSelect>
                    <GenericSelect title={"Etapa"} displayType={"nome"} filter={processo?.id} filterField={"processoId"} selection={etapa?.id} onChange={(value) => dispatch(updadteEtapaRegras(value))}></GenericSelect>
                    <GenericSelect title={"Parametro"} displayType={"nome"} filter={etapa?.id} filterField={"etapaId"} selection={parametro?.id} onChange={(value) => dispatch(updadteParametroRegras(value))}></GenericSelect>
                </div>
                <div>
                    <Row>
                        <Col><Form.Label><strong>Unidade:</strong>{parametro?.unidade}</Form.Label></Col>
                        <Col><Form.Label><strong>Faixa Mínima:</strong>{parametro?.pMin}</Form.Label></Col>
                        <Col><Form.Label><strong>Faixa Máxima:</strong>{parametro?.pMax}</Form.Label></Col>
                    </Row>
                </div>
                <label style={{fontSize : 32}}><strong>Regras de Correcao para tanque de:</strong> {etapa?.volume} <strong>Lts</strong></label>
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
                            {regras && regras.map((regra, index) => {
                                return (<tr key={regra.mpId}>
                                    <td>{regra.mpNome}</td>
                                    <td><Form.Control type="number" pattern="0.00" placeholder="quantidade dosada para cada 1 unidade" value={regra.valorUnidade} onChange={event => updateRegrasField(event.target.value, regra, index)} /></td>
                                    <td><Form.Control type="number" pattern="0.00" placeholder="variação maxima da ultima analise" value={regra.variacaoMaxima} onChange={event => updateVariacaoFiled(event.target.value, regra, index)} /></td>
                                </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
                <div>
                    <Button style={{margin : 4,marginLeft : 0}} onClick={salvarCorrecoes} >Salvar</Button>
                </div>

            </Container>
        </>
    )


}


export default withMenuBar(CadastroDeRegraDeCorrecao)