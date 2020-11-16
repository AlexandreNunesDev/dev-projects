import React, { useEffect, useState } from 'react'
import { Button, Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from '../Screens/MenuBar';
import GenericSelect from '../Components/GenericSelect';
import SelectEditable from '../Components/SelectEditable'

import ScqApi from '../Http/ScqApi';
import FormulaBuilder from '../Components/FormulaBuilder';
import ModoEdicao from '../Screens/ModoEdicao';
import { withToastManager } from 'react-toast-notifications';
import UnidadeSelect from '../Components/UnidadeSelect';
import { useHistory } from 'react-router-dom';

const EditarParametro = (props) => {

    const {toastManager} = props;
    const history = useHistory()
    const [parametro, setParametro] = useState()
    const [frequenciaId, setFrequenciaId] = useState()
    const [processos, setProcessos] = useState([])
    const [processoId, setProcessoId] = useState()
    const [etapas, setEtapas] = useState()
    const [etapaId, setEtapaId] = useState()
    const [nome, setNome] = useState()
    const [pMax, setPmax] = useState()
    const [pMin, setPmin] = useState()
    const [pMaxT, setPmaxT] = useState()
    const [pMinT, setPminT] = useState()
    const [formula, setFormula] = useState()
    const [titula, setTitula] = useState(false)
    const [unidade, setUnidade] = useState()
    const [escalaTempo, setEscalaTempo] = useState()
    const [frequenciaAnalise, setFrequenciaAnalise] = useState()
    const [edited, setEdited] = useState(false)





    useEffect(() => {
        ScqApi.ListaProcessos().then(res => {
            setProcessos(res)
        })
    },[])


    useEffect(() => {
        processoId && ScqApi.ListaEtapasByProcesso(processoId).then(res => {
            setEtapas(res)
        })
    }, [processoId])

 

    useEffect(() => {
        if(parametro) {

        setNome(parametro.nome)
        setPmax(parametro.pMax)
        setPmin(parametro.pMin)
        setPmaxT(parametro.pMaxT)
        setPminT(parametro.pMinT)
        setFormula(parametro.formula)
        if(parametro.formula.length>0){
            setTitula(true)
        }
        setFrequenciaId(parametro.frequenciaId)
        setFrequenciaAnalise(parametro.frequencia)
        setEscalaTempo(parametro.escalaFrequencia)
        setProcessoId(parametro.processoId)
        setEtapaId(parametro.etapaId)
        setUnidade(parametro.unidade)
    }
    },[parametro])

    useEffect(() => {
        if(parametro) {

        setNome(null)
        setPmax(null)
        setPmin(null)
        setPmaxT(null)
        setPminT(null)
        setFormula(null)
        setTitula(false)
     
        setFrequenciaId(null)
        setFrequenciaAnalise(null)
        setEscalaTempo(null)
        setProcessoId(null)
        setEtapaId(null)
        setUnidade(null)
    }
    },[edited,parametro])



    
    const onSaveClick = () => {

        const newFrequencia = {id : frequenciaId, parametroId : parametro.id, escala : escalaTempo , frequencia : frequenciaAnalise }
        const editedParametro = { id : parametro.id, etapaId: etapaId, nome : nome, pMax : pMax, pMin : pMin, formula: formula || "[V]", unidade : unidade, pMaxT : pMaxT, pMinT : pMinT }

        ScqApi.EditarParametro(editedParametro).then(() => ScqApi.EditarFrequenciaAnalise(newFrequencia))
        
        toastManager.add(`Parametro: ${editedParametro.nome} editado com sucesso`, {appearance: 'success', autoDismiss: true ,autoDismissTimeout: 3000, onDismiss : () => {history.push("/CadastroParametro")}})
        setEdited(!edited)
    }


    return (
        <>
            <header>
                <MenuBar></MenuBar>
            </header>

            <Container style={{ marginTop: 20 }}>
                <h1>Editar de Parametro</h1>

                <Form>
                    <h4>Escolha o Parametro para editar</h4>
                    <ModoEdicao edited={edited} onDelete={(deleteMessage) => {toastManager.add(`${deleteMessage}`, {appearance: 'success', autoDismiss: true ,autoDismissTimeout: 3000,onDismiss: () => { history.push("/CadastroParametro")}}); setEdited(!edited)}} type={"parametro"} getSelectedParametro={(parametro) => setParametro(parametro)}></ModoEdicao>
                    {parametro && <Form.Group style={{ marginTop: 20 }} >
                             <Form.Label style={{color : "RED" ,fontWeight : "bold"}} >Parametro Id: {parametro.id}</Form.Label>
                         </Form.Group> }
                    <Form.Row>
                    <Col>
                            <GenericSelect title={"Processo"} returnType={"id"} default={"Escolha um Processo"} ops={processos} onChange={id => setProcessoId(id)} selection={processos && processoId}></GenericSelect>
                        </Col> 
                      <Col>
                            <GenericSelect title={"Etapa"} returnType={"id"} default={"Escolha uma Etapa"} ops={etapas} onChange={id => setEtapaId(id)} selection={etapas && etapaId}></GenericSelect>
                        </Col>
                    </Form.Row>



                    <Form.Row>

                        <Form.Group as={Col} controlId="nomeParametroForm">
                            <Form.Label>Nome do Parametro: </Form.Label>

                            <SelectEditable value={nome} getValue={(nome) => nome && setNome(nome)} default={"Clique 2x para digitar"} ops={["Concentracao", "pH", "Temperatura", "Condutividade", "Corrente", "Tensão"]}></SelectEditable>
                        </Form.Group>
                        <Col sm={3} >
                            <UnidadeSelect value={unidade}  title={"Escolha um unidade"} type={"parametros"} default={"Escolha um unidade"} onChange={unidade => setUnidade(unidade)}></UnidadeSelect>
                        </Col>

                        <Col sm={2} >
                            <Form.Label>Analise a cada : </Form.Label>
                            <Form.Control type="number" value={frequenciaAnalise} onChange={event => setFrequenciaAnalise(event.target.value)} />
                        </Col>
                        <Col sm={2}>
                            <UnidadeSelect value={escalaTempo} type="frequenciaAnalise" title={"Unidade: "} default={"Escolha a escala"} onChange={value => setEscalaTempo(value)} />
                        </Col>

                    </Form.Row>

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

                    <Form.Check type="checkbox" id="checkTitula">
                        <Form.Check.Input type="checkbox" checked={titula} onChange={(event) => setTitula(!titula)} />
                        <Form.Check.Label>Formulas ?</Form.Check.Label>
                    </Form.Check>



                    <Form.Row hidden={!titula}>
                        <Form.Group as={Col} controlId="formulaParametroForm">
                            <Form.Control readOnly={true} value={formula} type="text" placeholder="Formula" />
                        </Form.Group>
                        <Form.Group as={Col} controlId="btnFormulaBuilderParametroForm">
                            {etapaId && <FormulaBuilder etapaId={etapaId} onClose={formula => setFormula(formula)} processos={processos} etapas={etapas}></FormulaBuilder>}
                        </Form.Group>
                    </Form.Row>

                    <Form.Group style={{ marginTop: 20 }}>
                        
                        <Button style={{ margin: 5 }} variant="primary" type="reset" onClick={() => onSaveClick()}>Salvar</Button>
                    </Form.Group>
                </Form>
            </Container>
        </>

    )
}

export default withToastManager(EditarParametro)