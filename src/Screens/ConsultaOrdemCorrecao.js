/* import ScqApi from '../Http/ScqApi'
import { Button, Col, Container, Form } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { updateAnalises, updateAnaliseToGenerateOcp, updateAnaliseToSave, updateFilterdAnaliseHistorico, updateFilteredAnalises, updateFiltroEtapa, updateFiltroParametro, updateFiltroProcesso, updateHistoricoDataFinal, updateHistoricoDataInicial, updateOrdensToView } from '../Reducers/analiseReducer'
import { useEffect, useState } from 'react'
import { withMenuBar } from '../Hocs/withMenuBar'
import { useHistory } from 'react-router-dom'
import { backGroundByAnaliseStatus } from '../Services/analiseService'

const ConsultaOrdensCorrecao = () => {

    const dispatchers = useDispatch()
    const analisesHistorico = useSelector(state => state.analise.analises)
    const filteredAnalises = useSelector(state => state.analise.filteredAnaliseHistorico)
    const historicoDataInicial = useSelector(state => state.analise.dataInicioHistorico)
    const historicoDataFinal = useSelector(state => state.analise.dataFimHistorico)
    const historicoPage = useSelector(state => state.analise.historicoPage)
    const filtroProcesso = useSelector(state => state.analise.filtroProcesso)
    const filtroEtapa = useSelector(state => state.analise.filtroEtapa)
    const filtroParametro = useSelector(state => state.analise.filtroParametro)
    const history = useHistory()



    useEffect(() => {
        if (historicoDataInicial && historicoDataFinal) {
            ScqApi.LoadHistoricoAnaliseWithPage(historicoDataInicial, historicoDataFinal, historicoPage, 50)
                .then(res => {
                    dispatchers(updateAnalises(res))
                    dispatchers(updateFilterdAnaliseHistorico(filtra(res)))
                })

        }
    }, [historicoDataInicial, historicoDataFinal])

    const filtra = (historicoAnalise) => {
        let initialAnlises = historicoAnalise
        if (filtroProcesso) {
            initialAnlises = initialAnlises.filter(analise => analise.nomeProcesso.toLowerCase().startsWith(filtroProcesso.toLowerCase()))
        }
        if (filtroEtapa) {
            initialAnlises = initialAnlises.filter(analise => analise.nomeEtapa.toLowerCase().startsWith(filtroEtapa.toLowerCase()))
        }
        if (filtroParametro) {
            initialAnlises = initialAnlises.filter(analise => analise.nomeParametro.toLowerCase().startsWith(filtroParametro.toLowerCase()))
        }
        return initialAnlises
    }
    useEffect(() => {
        dispatchers(updateFilterdAnaliseHistorico(filtra(analisesHistorico)))
    }, [filtroProcesso, filtroEtapa, filtroParametro])

    const gerarOcp = (analise) => {
        dispatchers(updateAnaliseToSave(analise))
        history.push("/CadastroOcp")
    }

    const verOdens = (analise) => {
        dispatchers(updateOrdensToView(analise.ocps))
        history.push("/HistoricoCorrecao")
    }

    return (
        <Container>
            <Form>
                <h2>Selecione um periodo</h2>
                <Form.Row style={{ marginTop: 10 }}>
                    <Form.Group as={Col}>
                        <Form.Label>Data Inicial</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            defaultValue={historicoDataInicial}
                            onChange={event => dispatchers(updateHistoricoDataInicial(event.target.value))}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Data Final</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            defaultValue={historicoDataFinal}
                            onChange={event => dispatchers(updateHistoricoDataFinal(event.target.value))}>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <h2>Filtros</h2>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Filtrar Processo</Form.Label>
                        <Form.Control
                            value={filtroProcesso}
                            onChange={event => dispatchers(updateFiltroProcesso(event.target.value))}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Filtrar Etapa</Form.Label>
                        <Form.Control
                            value={filtroEtapa}
                            onChange={event => dispatchers(updateFiltroEtapa(event.target.value))}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Filtrar Parametro</Form.Label>
                        <Form.Control
                            value={filtroParametro}
                            onChange={event => dispatchers(updateFiltroParametro(event.target.value))}>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
            </Form>
            <h3>Analises</h3>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Data</th>
                        <th>Processo</th>
                        <th>Etapa</th>
                        <th>Parametro</th>
                        <th>Min</th>
                        <th>Min Trab.</th>
                        <th>Max Trab.</th>
                        <th>Max</th>
                        <th>Resultado</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {historicoDataInicial && historicoDataFinal && filteredAnalises.map(analise => {
                        return (<tr key={analise.id}>
                            <td>{analise.id}</td>
                            <td>{analise.data}</td>
                            <td>{analise.nomeProcesso}</td>
                            <td>{analise.nomeEtapa}</td>
                            <td>{analise.nomeParametro}</td>
                            <td>{analise.pMin}</td>
                            <td>{analise.pMinT}</td>
                            <td>{analise.pMaxT}</td>
                            <td>{analise.pMax}</td>
                            <td style={{ backgroundColor: backGroundByAnaliseStatus(analise.statusAnalise) }} >{analise.resultado} {analise.unidade}</td>
                            {
                                analise.ocps.length > 0 ? 
                                <td>
                                    <Button style={{margin : 2}} onClick={() => gerarOcp(analise)}>GERAR OCP</Button>
                                    <Button  variant="link" style={{margin : 2}} onClick={() => verOdens(analise)}>VER OCPs</Button>
                                </td> :
                                <td>
                                    <Button style={{margin : 2}} onClick={() => gerarOcp(analise)}>GERAR OCP</Button>
                                </td>

                            }

                        </tr>)
                    })}
                </tbody>

            </table>
        </Container>)

}

export default withMenuBar(ConsultaOrdensCorrecao) */