
import { Button, Container } from "react-bootstrap"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { withMenuBar } from "../Hocs/withMenuBar"

const HistoricoCorrecao = () => {

    const ocps = useSelector(state => state.analise.ordensToView)
    const history = useHistory()

    return (
        <div style={{margin : 12}}>
            <h3>Historico de ocps</h3>
            <Button onClick={() =>history.push("/Analises") }>Voltar</Button>
            <div  className="table-responsive">


                <table>
                    <thead>
                        <th>id</th>
                        <th>dataAbertura</th>
                        <th>responsavel</th>
                        <th>processoNome</th>
                        <th>etapaNome</th>
                        <th>Materia prima</th>
                        <th>Quantidade programada</th>
                        <th>Realizado em</th>
                        <th>Realizado por</th>
                        <th>Quantidade realizada</th>

                    </thead>
                    <tbody>
                        {ocps.map(ocp => {
                            return ocp.adicoesDto.map(addDto => {
                                return (
                                    <tr>
                                        <td>{ocp.id}</td>
                                        <td>{ocp.dataAbertura}</td>
                                        <td>{ocp.responsavel}</td>
                                        <td>{ocp.processoNome}</td>
                                        <td>{ocp.etapaNome}</td>
                                        <td>{addDto.nomeMp}</td>
                                        <td>{addDto.quantidade} {addDto.unidade}</td>
                                        <td>{addDto.realizadoEm}</td>
                                        <td>{addDto.realizadoPor}</td>
                                        <td>{addDto.quantidadeRealizada} {addDto.unidade}</td>
                                    </tr>
                                )
                            })

                        })}
                    </tbody>
                </table>
            </div>
        </div>

    )


}

export default withMenuBar(HistoricoCorrecao)