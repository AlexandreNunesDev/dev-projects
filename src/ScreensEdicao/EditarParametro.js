import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { withToastManager } from 'react-toast-notifications';
import FormulaBuilder from '../Components/FormulaBuilder';
import GenericSelect from '../Components/GenericSelect';
import SaveDeleteButtons from '../Components/SaveDeleteButtons';
import SelectEditable from '../Components/SelectEditable';
import UnidadeSelect from '../Components/UnidadeSelect';
import { withMenuBar } from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import { getValorSugestao } from '../Services/ocpService';
import { responseHandler } from '../Services/responseHandler';
import { toastInfo } from '../Services/toastType';
import { WebSocketContext } from '../websocket/wsProvider';


const EditarParametro = (props) => {


    const location = useLocation()
    const { toastManager } = props;
    const history = useHistory()
    const [parametro, setParametro] = useState(location.state)
    const context = useContext(WebSocketContext)
    const [processos, setProcessos] = useState([])
    const [processoId, setProcessoId] = useState()
    const [etapas, setEtapas] = useState()
    const [etapaId, setEtapaId] = useState()
    const [etapa, setEtapa] = useState()
    const [nome, setNome] = useState()
    const [pMax, setPmax] = useState()
    const [pMin, setPmin] = useState()
    const [pMaxT, setPmaxT] = useState()
    const [pMinT, setPminT] = useState()
    const [formula, setFormula] = useState()
    const [titula, setTitula] = useState(false)
    const [unidade, setUnidade] = useState()
    const [showChart, setShowChart] = useState()
    const [escalaTempo, setEscalaTempo] = useState()
    const [frequenciaAnalise, setFrequenciaAnalise] = useState()
    const [edited, setEdited] = useState(false)
    const [habilitado, setHabilitado] = useState()
    const [regras, setRegras] = useState()
    const etapasOps = useSelector(state => state.options.etapas)
    const processosOps = useSelector(state => state.options.processos)
    const materiasPrimaOps = useSelector(state => state.options.materiasPrima)




    useEffect(() => {
        processoId && setEtapas(etapasOps.filter(etap => etap.processoId == processoId))
    }, [processoId])



    useEffect(() => {
        if (parametro) {

            setNome(parametro.nome)
            setPmax(parametro.pMax)
            setPmin(parametro.pMin)
            setPmaxT(parametro.pMaxT)
            setPminT(parametro.pMinT)
            setFormula(parametro.formula)
            setHabilitado(parametro.habilitado)
            if (parametro.formula.length > 0) {
                setTitula(true)
            }
            setShowChart(parametro.showChart)

            setFrequenciaAnalise(parametro.frequencia)
            setEscalaTempo(parametro.escalaFrequencia)
            setProcessoId(parametro.processoId)
            setEtapaId(parametro.etapaId)
            setUnidade(parametro.unidade)
            setEtapa(etapasOps.filter(etap => etap.id == parametro.etapaId)[0])
        }
    }, [parametro])

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


    const updateRegrasField = (valor, regraField, index) => {
        const regrasCopy = [...regras].map(r => ({ ...r }))
        regraField.valorUnidade = valor
        regrasCopy[index] = regraField
        setRegras(regrasCopy)
    }


    const onSaveClick = () => {
        const editedParametro = { id: parametro.id, etapaId: etapaId, nome: nome, pMax: pMax, pMin: pMin, formula: formula || "[V]", unidade: unidade, pMaxT: pMaxT, pMinT: pMinT, escala: escalaTempo, frequencia: frequenciaAnalise, showChart, isHabilitado: habilitado, regrasCorrecao: regras }
        ScqApi.EditarParametro(editedParametro).then(res => responseHandler(res, toastManager, "Parametro", toastInfo))

    }

    const onDelete = () => {
        ScqApi.DeleteEtapa(etapa.id).then(msg => {
            toastManager.add(`${msg}`, { appearance: 'success', autoDismiss: true, autoDismissTimeout: 3000, onDismiss: () => { history.push("/CadastroParametro") } })
        })

    }


    return (
        <>


            <Container style={{ marginTop: 20 }}>
                <h1>Editar de Parametro</h1>

                <Form>
                    <h4>Escolha o Parametro para editar</h4>
                    {parametro && <Form.Group style={{ marginTop: 20 }} >
                        <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Parametro Id: {parametro.id}</Form.Label>
                    </Form.Group>}
                    <Form.Row>
                        <Col>
                            <GenericSelect title={"Processo"} displayType={"nome"} returnType={"id"} default={"Escolha um Processo"} ops={processosOps} onChange={id => setProcessoId(id)} selection={processos && processoId}></GenericSelect>
                        </Col>
                        <Col>
                            <GenericSelect title={"Etapa"} displayType={"nome"} returnType={"id"} default={"Escolha uma Etapa"} ops={etapas} onChange={id => setEtapaId(id)} selection={etapas && etapaId}></GenericSelect>
                        </Col>
                    </Form.Row>



                    <Form.Row>

                        <Form.Group as={Col} controlId="nomeParametroForm">
                            <Form.Label>Nome do Parametro: </Form.Label>

                            <SelectEditable value={nome} getValue={(nome) => nome && setNome(nome)} default={"Clique 2x para digitar"} ops={["Concentracao", "pH", "Temperatura", "Condutividade", "Corrente", "Tensão"]}></SelectEditable>
                        </Form.Group>
                        <Col sm={3} >
                            <UnidadeSelect selection={unidade} title={"Escolha um unidade"} type={"parametros"} default={"Escolha um unidade"} onChange={unidade => setUnidade(unidade)}></UnidadeSelect>
                        </Col>

                        <Col sm={2} >
                            <Form.Label>Analise a cada : </Form.Label>
                            <Form.Control type="number" value={frequenciaAnalise || ''} onChange={event => setFrequenciaAnalise(event.target.value)} />
                        </Col>
                        <Col sm={2}>
                            <UnidadeSelect selection={escalaTempo} type="frequenciaAnalise" title={"Unidade: "} default={"Escolha a escala"} onChange={value => setEscalaTempo(value)} />
                        </Col>

                    </Form.Row>

                    <Form.Row>
                        <Form.Group sm as={Col} controlId="pMinParametroForm">
                            <Form.Label>Mínimo Especificado</Form.Label>
                            <Form.Control type="number" pattern="0.00" placeholder="Parametro Minimo" value={pMin || ''} onChange={event => setPmin(event.target.value)} />
                        </Form.Group>
                        <Form.Group sm as={Col} controlId="pMinParametroForm">
                            <Form.Label>Mínimo Trabalho</Form.Label>
                            <Form.Control type="number" pattern="0.00" placeholder="Parametro Minimo" value={pMinT || ''} onChange={event => setPminT(event.target.value)} />
                        </Form.Group>
                        <Form.Group sm as={Col} controlId="pMaxParametroForm">
                            <Form.Label>Máximo Trabalho</Form.Label>
                            <Form.Control type="number" placeholder="Parametro Máximo" value={pMaxT || ''} onChange={event => setPmaxT(event.target.value)} />
                        </Form.Group>
                        <Form.Group sm as={Col} controlId="pMaxParametroForm">
                            <Form.Label>Máximo Especificado</Form.Label>
                            <Form.Control type="number" placeholder="Parametro Máximo" value={pMax || ''} onChange={event => setPmax(event.target.value)} />
                        </Form.Group>


                    </Form.Row>


                    <Form.Row>
                        <Form.Check style={{ marginRight: 15 }} type="checkbox" id="checkTitula">
                            <Form.Check.Input type="checkbox" checked={showChart || false} onChange={(event) => setShowChart(!showChart)} />
                            <Form.Check.Label>Exibir Gráfico ?</Form.Check.Label>
                        </Form.Check>
                        <Form.Check style={{ marginRight: 15 }} type="checkbox" id="checkTitula">
                            <Form.Check.Input type="checkbox" checked={titula || false} onChange={(event) => setTitula(!titula)} />
                            <Form.Check.Label>Formulas ?</Form.Check.Label>
                        </Form.Check>


                        <Form.Check style={{ marginRight: 15 }} type="checkbox" id="checkHabilitado">
                            <Form.Check.Input type="checkbox" checked={habilitado || false} onChange={(event) => setHabilitado(event.target.checked)} />
                            <Form.Check.Label>Habilitado</Form.Check.Label>
                        </Form.Check>

                    </Form.Row>



                    <Form.Row hidden={!titula}>
                        <Form.Group as={Col} controlId="formulaParametroForm">
                            <Form.Control readOnly={true} value={formula || ''} type="text" placeholder="Formula" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="btnFormulaBuilderParametroForm">
                            {etapaId && <FormulaBuilder etapaId={etapaId} onClose={formula => setFormula(formula)} processos={processos} etapas={etapas}></FormulaBuilder>}
                        </Form.Group>
                    </Form.Row>
                    <SaveDeleteButtons saveClick={onSaveClick} deleteClick={onDelete}></SaveDeleteButtons>
                </Form>
            </Container>
        </>

    )
}

export default withToastManager(withMenuBar(EditarParametro))