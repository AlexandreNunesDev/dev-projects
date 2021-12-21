import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, Form, Row, Col, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {FiDelete} from 'react-icons/fi'
import { insert } from 'underscore.string'
import { setChoosedHeaders, setDynamicOpenFilter, updateRegras } from '../Reducers/dyanamicForms';
import GenericSelect from './GenericSelect';


export const calcValues = ["Total", "Media", "Maximo", "Mínimo"]

const FilterDynamic = ({ headerName, headers, header }) => {

  const dispatch = useDispatch()
  const addedHeaders = useSelector(state => state.formsReducer.addedHeaders)
  const isDynamicFilterOpen = useSelector(state => state.formsReducer.isDynamicFilterOpen)
  const regras = useSelector(state => state.formsReducer.regras)
  const [nomeRelacao, setNomeRelacao] = useState('')
  const [valorFiltro, setNomeFiltro] = useState('')
  const [calcularChoosed, setCalcularChoosed] = useState()
  const [filterTypeChoosed, setFilterTypeChoosed] = useState()
  const [relacionaMentoFormula, setRelacionamentoFormula] = useState(`[${headerName}]`)
  const formulaRef = useRef()
  const [ruleManuType, setRuleMenuType] = useState()
  

  const saveFilter = () => {
    let addedHeaderWithoutActual = addedHeaders.filter(addedHeader => addedHeader.index !== header.index)
    let headerToMutate = { ...header }
    headerToMutate.relationName = nomeRelacao
    addedHeaderWithoutActual.push(headerToMutate)
    dispatch(setChoosedHeaders(addedHeaderWithoutActual.sort(addedHeader => addedHeader.index - headerToMutate.index)))
    dispatch(setDynamicOpenFilter())
  }


  const buildRuleModel = (ruleType, ruleValues, ruleOrder,headerRef) => {
    return ({ type: ruleType, values: ruleValues, order: ruleOrder, headerRef ,calc : null })
  }

  const buildRuleMenu = () => {
    switch (ruleManuType) {
      case "Calcular":
        return getCalcularMenu()
      case "Relacionar":
        return getRelacionarMenu()
      case "Filtrar":
        return getFiltrarMenu()
      default:
        break;
    }

  }



  const adicinarRegra = (ruleToAdd) => {
    dispatch(updateRegras([...regras, ruleToAdd]))
  }

  const addRuleButton = (ruleToAdd) => {
    return <Button style={{marginTop : 24}} onClick={() => adicinarRegra(ruleToAdd)}>Adicionar Regra</Button>
  }

  const getFiltrarMenu = () => {
    return <>
      <Row>
        <GenericSelect title={"Tipo filtro"} ops={["maior", "maior-igual", "igual", "menor-igual", "menor"]} onChange={(value) => setFilterTypeChoosed(value)} ></GenericSelect>
      </Row>
      <Row>
        <Form.Group>
          <Form.Label>Filtro</Form.Label>
          <Form.Control value={valorFiltro} onChange={(event) => setNomeFiltro(event.target.value)}></Form.Control>
        </Form.Group>
      </Row>
      {addRuleButton(buildRuleModel("filter", [filterTypeChoosed, valorFiltro], 1, header ))}
    </>
  }


  const formulaInsert = (charToInsert) => {
    formulaRef.current.value = insert(formulaRef.current.value, formulaRef.current.selectionStart, `[${charToInsert}]`)
    setRelacionamentoFormula(`${formulaRef.current.value}`)
    formulaRef.current.focus()
  }

  const getRelacionarMenu = () => {
    return <>
      <Row>
        <GenericSelect title={"Relacionar"} ops={headers} returnType={"header"} displayType={"header"} onChange={(valor) => formulaInsert(valor)} ></GenericSelect>
      </Row>
      <Row>
        <Form.Label >Formula relacionamento</Form.Label>
        <Form.Control ref={formulaRef} value={relacionaMentoFormula} onChange={(event) => setRelacionamentoFormula(event.target.value)}></Form.Control>
      </Row>

      {addRuleButton(buildRuleModel("relacao", [relacionaMentoFormula], 2,header))}
    </>
  }

  const getCalcularMenu = () => {
    return <>
      <Row>
        <GenericSelect title={"Calcular"} ops={calcValues} onChange={(value) => setCalcularChoosed(value)} ></GenericSelect>
      </Row>
      {addRuleButton(buildRuleModel("calc", [calcularChoosed], 3,header))}
    </>
  }

  const removeRegra = (regra) => {
    let newRegras = regras.filter(regraI => regraI.headerRef.index !== regra.headerRef.index)
    dispatch(updateRegras(newRegras))
    
  }

  const getRegraDisplayMenu = (regra) => {
    const { type, values, order } = regra
    return <li>{`Tipo: ${type} Valores: ${values.join(",")}`} <FiDelete onClick={() => removeRegra(regra)} style={{marginLeft : 12}}/> </li>
  }

  return (
    <>
      <Modal size={"lg"} show={isDynamicFilterOpen} onHide={() => dispatch(setDynamicOpenFilter())}>
        <Modal.Header closeButton>
          <Modal.Title>Aplicar Regras: {headerName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Form>
              <Row>
                <GenericSelect title={"Tipo Regra"} ops={["Calcular", "Relacionar", "Filtrar"]} onChange={(valor) => setRuleMenuType(valor)} ></GenericSelect>
              </Row>
              {ruleManuType && buildRuleMenu()}
            </Form>
            <h3>Suas regras</h3>
            <ol>
              {regras && regras.filter(regra => regra.headerRef.index === header.index).map(regra => getRegraDisplayMenu(regra))}
            </ol>

          </Container>
        </Modal.Body>


        <Modal.Footer>
          <Button style={{ margin: 2 }} variant="secondary" onClick={() => dispatch(setDynamicOpenFilter())}>
            Confirmar
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );

}


export default FilterDynamic;