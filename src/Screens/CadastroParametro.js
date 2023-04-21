import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { withToastManager } from 'react-toast-notifications';
import FormulaBuilder from '../Components/FormulaBuilder';
import GenericSelect from '../Components/GenericSelect';
import SelectEditable from '../Components/SelectEditable';
import UnidadeSelect from '../Components/UnidadeSelect';
import { withMenuBar } from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import { updadteEtapaRegras } from '../Reducers/regraCorrecoes';
import { responseHandler } from '../Services/responseHandler';
import { toastOk } from '../Services/toastType';
import { WebSocketContext } from '../websocket/wsProvider';

const CadastroParametro = (props) => {
    const context = useContext(WebSocketContext)
    const history = useHistory()

    const [processoId, setProcessoId] = useState()
    const [etapaId, setEtapaId] = useState()

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
    const [reporteDiario, setShowReporteDiario] = useState(true)
    const [showChart, setShowChart] = useState(true)
    const [controlado, setControlado] = useState(true)
    const etapasOps = useSelector(state => state.options.etapas)
    const processosOps = useSelector(state => state.options.processos)
    const dispatch = useDispatch()




    const selectedProcesso = (processoId) => {
        setProcessoId(processoId)
    }

   



    const salvarParametro = () => {
        const { toastManager } = props;
        const parametro = { etapaId: etapaId, nome, pMax, pMin, formula: formula || "[V]", unidade, pMaxT, pMinT, escala: escalaTempo, frequencia: frequenciaAnalise, showChart: showChart, isHabilitado: controlado ,showReporteDiario : reporteDiario}
        ScqApi.CriarParametro(parametro).then(res => { responseHandler(res, toastManager, "Parametro", toastOk) })
    }

   

    const onFormulaBuilderClose = (formula) => {
        setFormula(formula)
    }

    const enterEditMode = () => {
        history.push("/EditarParametro")
    }   

    return (
        <>
            <Container style={{ marginTop: 20 }}>
                <h1>Cadastro de Parametro</h1>
                <Form>
                    <Form.Row>
                        <Col>
                            <GenericSelect title={"Processo"} displayType={"nome"} returnType={"id"} default={"Escolha um Processo"}  onChange={(id) => selectedProcesso(id)} selection={processoId || ''}></GenericSelect>
                        </Col>
                    </Form.Row>
                    <Form.Row>
                        <Col>
                            <GenericSelect title={"Etapa"} displayType={"nome"} returnType={"id"} default={"Escolha uma Etapa"} filter={processoId} filterField={"processoId"} onChange={(id) => setEtapaId(id)} selection={etapaId || ''}></GenericSelect>
                        </Col>
                    </Form.Row>



                    <Form.Row>

                        <Form.Group as={Col} controlId="nomeParametroForm">
                            <Form.Label>Nome do Parametro: </Form.Label>

                            <SelectEditable getValue={(nome) => nome && setNome(nome)} default={"selecione um nome"} ops={["Concentracao", "pH", "Temperatura", "Condutividade", "Corrente", "Tensão","Tempo"]}></SelectEditable>
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
                                <UnidadeSelect type="frequenciaAnalise" title={"Unidade: "} selection={escalaTempo} default={"Escolha a escala"} onChange={(valor) => setEscalaTempo(valor)} />
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
                        <Form.Check style={{ marginRight: 15 }} type="checkbox" >
                            <Form.Check.Input type="checkbox" checked={reporteDiario} onChange={(event) => setShowReporteDiario(event.target.checked)} />
                            <Form.Check.Label>Exibir Reporte Diario ?</Form.Check.Label>
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

                    <Form.Group style={{ marginTop: 20 }}>
                        <Button style={{ margin: 5 }} variant="primary" type="reset" onClick={salvarParametro}>Salvar</Button>
                    </Form.Group>
                </Form>
            </Container>

        </>
    )

}

export default withToastManager(withMenuBar(CadastroParametro))