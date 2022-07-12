import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { withToastManager } from 'react-toast-notifications';
import FormulaBuilder from '../Components/FormulaBuilder';
import GenericSelect from '../Components/GenericSelect';
import SelectEditable from '../Components/SelectEditable';
import UnidadeSelect from '../Components/UnidadeSelect';
import { withMenuBar } from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import { responseHandler } from '../Services/responseHandler';
import { toastOk } from '../Services/toastType';
import { WebSocketContext } from '../websocket/wsProvider';

const CadastroParametro = (props) => {
    const context = useContext(WebSocketContext)
    const history = useHistory()
    const [etapas, setEtapas] = useState()
    const [processoId, setProcessoId] = useState()
    const [etapaId, setEtapaId] = useState()
    const [etapa, setEtapa] = useState()
    const [nome, setNome] = useState()
    const [pMax, setPmax] = useState()
    const [pMin, setPmin] = useState()
    const [pMaxT, setPmaxT] = useState()
    const [pMinT, setPminT] = useState()
    const [titula, setTitula] = useState(false)
    const [formula, setFormula] = useState()
    const [unidade, setUnidade] = useState()
    const [escalaTempo, setEscalaTempo] = useState()
    const [frequenciaAnalise, setFrequenciaAnalise] = useState()
    const [showChart, setShowChart] = useState(true)
    const [controlado, setControlado] = useState(true)
    const [regras, setRegras] = useState()
    const etapasOps = useSelector(state => state.options.etapas)
    const processosOps = useSelector(state => state.options.processos)
    const materiasPrimaOps = useSelector(state => state.options.materiasPrima)





    const selectedProcesso = (processoId) => {
        setProcessoId(processoId)
        setEtapas(etapasOps.filter(etapa => etapa.processoId === Number(processoId)))
    }

    useEffect(() => {
        if (etapaId) {
            let etapa = etapasOps.filter(etapa => etapa.id == etapaId)[0]
            setEtapa(etapa)
            let materiasPrima = etapa.proportionMps.map(propMp => {
                let idMp = propMp.split(':')[0]
                let materiaPrima = materiasPrimaOps.filter(mp => mp.id == idMp)
                return materiaPrima[0]
            })
            let regrasToBeCreated = materiasPrima.map(mp => ({ mpId: mp.id, mpNome: mp.nome, parametroId: null, valorUnidade: getValorSugestao(etapa.volume, unidade, etapa.proportionMps, mp.id) }))
            setRegras(regrasToBeCreated)
        }

    }, [etapaId, unidade])




    const salvarParametro = () => {
        const { toastManager } = props;
        const parametro = { etapaId: etapaId, nome, pMax, pMin, formula: formula || "[V]", unidade, pMaxT, pMinT, escala: escalaTempo, frequencia: frequenciaAnalise, showChart: showChart, isHabilitado: controlado,regrasCorrecao : regras }
        ScqApi.CriarParametro(parametro).then(res => { responseHandler(res, toastManager, "Parametro", toastOk) })
    }

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

    const onFormulaBuilderClose = (formula) => {
        setFormula(formula)
    }

    const enterEditMode = () => {
        history.push("/EditarParametro")
    }

    const updateRegrasField = (valor, regraField, index) => {
        const regrasCopy = [...regras].map(r => ({ ...r }))
        regraField.valorUnidade = valor
        regrasCopy[index] = regraField
        setRegras(regrasCopy)
    }


    return (
        <>
            <Container style={{ marginTop: 20 }}>
                <h1>Cadastro de Parametro</h1>
                <Form>
                    <Form.Row>
                        <Col>
                            <GenericSelect title={"Processo"} returnType={"id"} default={"Escolha um Processo"} ops={processosOps} onChange={(value) => selectedProcesso(value)} selection={processoId}></GenericSelect>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <GenericSelect title={"Etapa"} returnType={"id"} default={"Escolha uma Etapa"} ops={etapas} onChange={(value) => setEtapaId(value)} selection={etapaId}></GenericSelect>
                        </Col>
                    </Form.Row>



                    <Form.Row>

                        <Form.Group as={Col} controlId="nomeParametroForm">
                            <Form.Label>Nome do Parametro: </Form.Label>

                            <SelectEditable getValue={(nome) => nome && setNome(nome)} default={"selecione um nome"} ops={["Concentracao", "pH", "Temperatura", "Condutividade", "Corrente", "Tensão",]}></SelectEditable>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Col >
                            <UnidadeSelect title={"Escolha um unidade"} type={"parametros"} default={"Escolha um unidade"} onChange={unidade => setUnidade(unidade)}></UnidadeSelect>
                        </Col>
                    </Form.Row>
                    <h3>Controle</h3>
                    <Form.Check type="checkbox" id="checkControlado">
                        <Form.Check.Input type="checkbox" checked={controlado} onChange={(event) => setControlado(event.target.checked)} />
                        <Form.Check.Label>Controlado ?</Form.Check.Label>
                    </Form.Check>
                    {controlado && <>


                        <Form.Row>
                            <Col  >
                                <Form.Label>Analise a cada : </Form.Label>
                                <Form.Control type="number" value={frequenciaAnalise} onChange={(event) => setFrequenciaAnalise(event.target.value)} />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col >
                                <UnidadeSelect type="frequenciaAnalise" title={"Unidade: "} selection={escalaTempo} default={"Escolha a escala"} onChange={(event) => setEscalaTempo(event.target.value)} />
                            </Col>
                        </Form.Row> </>}

                    <>
                        <h3>Faixas de Controle</h3>
                        <Form.Row>
                            <Form.Group sm as={Col} controlId="pMinParametroForm">
                                <Form.Label>Mínimo Especificado</Form.Label>
                                <Form.Control type="number" pattern="0.00" placeholder="Parametro Minimo" value={pMin} onChange={event => setPmin(event.target.value)} />
                            </Form.Group>
                            <Form.Group sm as={Col} controlId="pMinParametroForm">
                                <Form.Label>Mínimo Trabalho</Form.Label>
                                <Form.Control type="number" pattern="0.00" placeholder="Parametro Minimo" value={pMinT} onChange={event => setPminT(event.target.value)} />
                            </Form.Group>
                            <Form.Group sm as={Col} controlId="pMaxParametroForm">
                                <Form.Label>Máximo Trabalho</Form.Label>
                                <Form.Control type="number" placeholder="Parametro Máximo" value={pMaxT} onChange={event => setPmaxT(event.target.value)} />
                            </Form.Group>
                            <Form.Group sm as={Col} controlId="pMaxParametroForm">
                                <Form.Label>Máximo Especificado</Form.Label>
                                <Form.Control type="number" placeholder="Parametro Máximo" value={pMax} onChange={event => setPmax(event.target.value)} />
                            </Form.Group>


                        </Form.Row>
                    </>





                    <Form.Row>
                        <Form.Check style={{ marginRight: 15 }} type="checkbox" id="checkTitula">
                            <Form.Check.Input type="checkbox" checked={showChart} onChange={(event) => setShowChart(event.target.checked)} />
                            <Form.Check.Label>Exibir Gráfico ?</Form.Check.Label>
                        </Form.Check>

                        <Form.Check style={{ marginRight: 15 }} type="checkbox" id="checkTitula">
                            <Form.Check.Input type="checkbox" checked={titula} onChange={(event) => setTitula(event.target.checked)} />
                            <Form.Check.Label>Formulas ?</Form.Check.Label>
                        </Form.Check>


                    </Form.Row>






                    <Form.Row hidden={!titula}>
                        <Form.Group as={Col} controlId="formulaParametroForm">
                            <Form.Control readOnly={true} value={formula} type="text" placeholder="Formula" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="btnFormulaBuilderParametroForm">
                            <FormulaBuilder etapaId={etapaId} onClose={onFormulaBuilderClose} processos={processosOps} etapas={etapasOps}></FormulaBuilder>
                        </Form.Group>
                    </Form.Row>

                    {regras &&
                        <>
                            <h3>Regras de Correcao para tanque de {etapa.volume}</h3>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Materia Prima</th>
                                            <th>Quantidade / unidade:</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {regras.map((regra, index) => {
                                            return (<tr key={regra.mpId}>
                                                <td>{regra.mpNome}</td>
                                                <td><Form.Control type="number" pattern="0.00" placeholder="quantidade dosada para cada 1 unidade" value={regra.valorUnidade} onChange={event => updateRegrasField(event.target.value, regra, index)} /></td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>}
                    <Form.Group style={{ marginTop: 20 }}>
                        <Button style={{ margin: 5 }} variant="primary" type="reset" onClick={enterEditMode}>Editar</Button>
                        <Button style={{ margin: 5 }} variant="primary" type="reset" onClick={salvarParametro}>Salvar</Button>
                    </Form.Group>
                </Form>
            </Container>

        </>
    )

}

export default withToastManager(withMenuBar(CadastroParametro))