import { useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import { withMenuBar } from "../Hocs/withMenuBar"
import ScqApi from "../Http/ScqApi"
import { DateAndTime } from "../Services/stringUtils"

const HistoricoTroca = () => {

    const location = useLocation()
    const state = location.state
    const [trocas, setTrocas] = useState([])

    useEffect(() => {
        if (state.trocaId) ScqApi.listOmpTrocaItens(state.trocaId).then(res => {
            setTrocas(res)
        } )
    }, [])


    return <Container>
        <h3>Historico de Trocas</h3>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Etapa</th>
                    <th>Posicao</th>
                    <th>Contagem Planejada</th>
                    <th>Contagem Realizada</th>
                    <th>Realizado em</th>
                    <th>Plan/Realiz.</th>
                    <th>Status</th>

                </tr>
            </thead>
            <tbody>
                {trocas.map(troca => {
                    return (
                        <tr>
                            <td>{troca.id}</td>
                            <td>{troca.etapaNome}</td>
                            <td>{troca.posicao}</td>
                            <th>{troca.contagemPlanejada}</th>
                            <th>{troca.contagemRealizada}</th>
                            <td >{troca.isRealizado && DateAndTime(troca.realizadaEm)}</td>
                            <td >{`${Number(troca.contagemRealizada/troca.contagemPlanejada).toFixed(2)}%`}</td>
                            <td style={{backgroundColor : !troca.isRealizado ? "RED" : "transparent" }}>{troca.isRealizado ? "Realizado ": "Nao realizado"}</td>
                        </tr>
                    )
                })}

            </tbody>
        </table>
    </Container>
}

export default withMenuBar(HistoricoTroca)