import { useEffect, useRef } from "react"
import { Button, Col, Form, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useToasts } from "react-toast-notifications"
import ScqApi from "../Http/ScqApi"
import Adicao from "../models/AdicaoModels"
import { updateAdicoes } from "../Reducers/adicaoReducer"
import { updadteRegras, updadtecorrigirPara } from "../Reducers/regraCorrecoes"
import { toastWarn } from "../Services/toastType"

const CalculadoraDeCorrecao = () => {


    const analiseToSave = useSelector(state => state.analise.analiseToSave)
    const regras = useSelector(state => state.regraCorrecao.regras)
    const corrigirPara = useSelector(state => state.regraCorrecao.corrigirPara)
    const dispatch = useDispatch()
    const toast = useToasts()


    useEffect(() => {
        ScqApi.EncontrarUmaRegraCorrecaoPorParametro(analiseToSave.parametroId).then(res => {
            dispatch(updadteRegras(res))
        });
        dispatch(updadtecorrigirPara(analiseToSave.resultado))
    }, [])


    const multiplyAllUnitFactors = (valor, isFromQuantidadeField) => {
        if (!(+valor > +analiseToSave.pMax)) {
            let regrasToUpdate = [...regras].map(r => {
                let regraCopy = { ...r }
                regraCopy.quantidade = checkIfNeedQuantidadeFromRule(analiseToSave.resultado,valor, regraCopy.valorUnidade)
                return regraCopy
            })

            dispatch(updadtecorrigirPara(valor.toFixed(2)))
            dispatch(updadteRegras(regrasToUpdate))
        } else {
            if (+valor > +analiseToSave.pMax) {
                dispatch(updadtecorrigirPara(analiseToSave.pMax))
            } else {
                dispatch(updadtecorrigirPara(valor))
            }

            isFromQuantidadeField && toast.addToast(`O valor nao pode ser maior que ${analiseToSave.pMax} ${analiseToSave.unidade}`, { appearance: toastWarn, autoDismiss: true })

        }

    }

    const checkIfNeedQuantidadeFromRule = (resultado, valor, valorUnidade) => {
        let multiplicarPor = valor - resultado
        multiplicarPor = multiplicarPor < 0 ? multiplicarPor * -1 : multiplicarPor
        if ((valorUnidade < 0) && (valor < resultado)) {
            return +(-valorUnidade * multiplicarPor).toFixed(2)
        }
         if ((valorUnidade < 0) && (valor > resultado)){
            return 0
        }
        if ((valorUnidade > 0) && (valor < resultado)){
            return 0
        }
        if ((valorUnidade > 0) && (valor > resultado)){
            return +(valorUnidade * multiplicarPor).toFixed(2)
        }


    }

    const adjustCorrecao = (valor, index) => {
        let regrasCopy = [...regras].map(r => ({ ...r }))
        regrasCopy[index].quantidade = valor
        dispatch(updadteRegras(regrasCopy))
    }

    const adjustCorrecaoTarget = (valor, index) => {
        let corrigirPara = valor / regras[index].valorUnidade
        corrigirPara += +analiseToSave.resultado
        multiplyAllUnitFactors(+(corrigirPara), true)

    }

    const applyCorrecoes = () => {
        dispatch(updateAdicoes(regras.map(regra => new Adicao(null, regra.quantidade || 0, null, regra.materiaPrima.id, regra.materiaPrima.unidade, regra.materiaPrima.nome)).filter(r => r.quantidade > 0)))
    }






    return (
        <>
            {regras.length > 0 ?
                <div>
                    <Form.Group>
                        <Form.Label style={{ fontWeight: 'bold' }}>Corrigir para:</Form.Label>
                        <Form.Control type={"number"} min={analiseToSave.resultado} value={corrigirPara} onChange={(event) => multiplyAllUnitFactors(event.target.value,)} />
                    </Form.Group>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Materia Prima</th>
                                    <th>Quantidade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {regras && regras.map((regra, index) => {
                                    return (<tr key={index}>
                                        <td>{regra.materiaPrima.nome}</td>
                                        <td><Form.Control type="number" value={regra.quantidade} onChange={(event) => adjustCorrecao(event.target.value, index)} onKeyDown={event => event.key == "Enter" && adjustCorrecaoTarget(event.target.value, index)} /></td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Button style={{ margin: 8, marginLeft: 0 }} disabled={regras.length == 0} onClick={() => applyCorrecoes()} >Aplicar correcoes</Button>
                </div>
                : <h3>Este parametro nao possui regras para correcoes</h3>}
        </>
    )
}

export default CalculadoraDeCorrecao