import { useEffect, useRef } from "react"
import { Button, Col, Form } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useLocation, useParams } from "react-router-dom"
import DynamicFilterMenu from '../Components/DynamicFilterMenu'
import LoadingProgress from "../Components/LoadProgress"
import { withMenuBar } from '../Hocs/withMenuBar'
import { clear, updadteFieldsValues, updateActualConsultaPage, updateDataFinal, updateDataInicial, updateFields, updateFilteredOps, updateNumeroDeDados, updateOps, updatePage, updateTotalPages } from "../Reducers/consultaDinamicaReducer"
import { formatationRules, getFieldsFromRoute, getOpsFromRoute, hasDateFilter } from "../Services/consultaFields"

const Consultas = () => {

    const options = useSelector(state => state.options)
    const location = useLocation()
    const { consultaPage } = useParams()
    const referencia = useRef()
    const dispatcher = useDispatch()
    let history = useHistory()
    const consulta = useSelector(state => state.consulta)
    const ops = consulta.ops
    const fields = consulta.fields
    const fieldValues = consulta.fieldValues
    const historicoPage = consulta.historicoPage
    const totalPages = consulta.totalPages
    const dataInicial = consulta.dataInicial
    const dataFinal = consulta.dataFinal
    const pagina = consulta.actualConsultaPage
    const numeroDeDados = consulta.numeroDeDados
    const hasdata = hasDateFilter(consultaPage)

    const onEditClick = (obj) => {
        history.push(`/Editar${consultaPage}`, obj)
    }
    useEffect(() => {
        dispatcher(updateActualConsultaPage(consultaPage))
    }, [])

    useEffect(() => {
        if (consultaPage != pagina) {
            dispatcher(updadteFieldsValues([]))
            dispatcher(clear())
        } else {
            dispatcher(clear())
        }


    }, [consultaPage])

    useEffect(() => {
        if (!hasdata) {
            loadOps()
        }

    }, [consultaPage, options])

    useEffect(() => {
       if(historicoPage) loadOps()
    }, [historicoPage])




    const loadOps = (nextPage) => {
        let fields = getFieldsFromRoute(consultaPage)
        dispatcher(updateFields(fields))
        getOpsFromRoute(consultaPage, location.state?.options || options, dataInicial, dataFinal, nextPage || historicoPage, setTotalPages, numeroDeDados).then(res => {
            dispatcher(updateOps(res))
            dispatcher(updateFilteredOps(res))
        })
    }

    const shouldRenderDynamicMenu = () => {
        if (hasdata && (ops.length > 0) && (fields.length > 0) && (dataInicial && dataFinal)) {
            return true
        } else if (!hasdata && (ops.length > 0) && (fields.length > 0)) {
            return true
        } else {
            return false
        }
    }

    const setTotalPages = (totalPages) => {
        dispatcher(updateTotalPages(totalPages))
    }

    const paginaAnterior = () => {
        let paginaDestino = historicoPage - 1
        if (paginaDestino >= 0) {
            dispatcher(updatePage(paginaDestino))
        }
    }

    const proximaPagina = () => {
        let paginaDestino = historicoPage + 1
        if (paginaDestino <= totalPages) {
            dispatcher(updatePage(paginaDestino))
        }
    }

    const paginationButtons = () => {
        if (totalPages > 0) {
            return (<div style={{ textAlign: "center" }}>
                <Button style={{ marginLeft: 12, marginRight: 12, backgroundColor: "orange", borderColor: "orange" }} onClick={() => paginaAnterior()}>Pagina Anterior</Button>
                <Form.Label style={{ marginLeft: 12, marginRight: 12, marginTop: 8 }}><strong>Pagina atual:</strong> {historicoPage} / {totalPages}</Form.Label>
                <Button style={{ marginLeft: 12, marginRight: 12, backgroundColor: "orange", borderColor: "orange" }} onClick={() => proximaPagina()}>Proxima Pagina</Button>
            </div>)
        }

    }

    return (
        <div style={{ margin: 4 }}>
            <h3>Consulta de {consultaPage}</h3>
            {hasdata && <div> <Form.Row style={{ marginTop: 10 }}>
                <Form.Group as={Col}>
                    <Form.Label>Data Inicial</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={dataInicial}
                        onChange={event => dispatcher(updateDataInicial(event.target.value))}>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Data Final</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        defaultValue={dataFinal}
                        onChange={event => dispatcher(updateDataFinal(event.target.value))}>
                    </Form.Control>
                </Form.Group>
            </Form.Row>
            </div>}
            <Form.Group>
                <Form.Label>Numero de dados</Form.Label>
                <Form.Control  value={numeroDeDados} onChange={event => {
                    if(event.target.value > 100) dispatcher(updateNumeroDeDados(100))
                    else  dispatcher(updateNumeroDeDados(event.target.value))
            }}></Form.Control>
            </Form.Group>
            {hasdata && <Form.Row>
                <Button style={{ marginLeft: 8 }} onClick={() => loadOps()}>Carregar Dados</Button>
                {totalPages > 0 && paginationButtons()}
            </Form.Row>}


            {shouldRenderDynamicMenu() ? <DynamicFilterMenu consultaPage={consultaPage}  formatationRules={formatationRules(consultaPage)} ops={ops || []} onActionClick={(obj) => onEditClick(obj)} fieldValues={fieldValues} fieldsToInclude={fields} ></DynamicFilterMenu> :
                <div style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}> {hasdata ? <div></div> : <LoadingProgress></LoadingProgress>}</div>
            }
            {totalPages > 0 && paginationButtons()}

        </div>)

}

export default withMenuBar(Consultas)