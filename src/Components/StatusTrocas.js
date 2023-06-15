import { useState } from "react"
import { Button, Table } from "react-bootstrap"
import { DateAndTime } from "../Services/stringUtils"

const StatusTroca = ({ trocaStatusDto }) => {

    const [trocasView,setTrocasView] = useState()
   

    return <div>
        <h3>Status Troca</h3>
        <Table>
            <thead>
                <tr>
                    <th>Em dia</th>
                    <th>Em atraso</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><Button  onClick={() => setTrocasView(trocaStatusDto.trocasEmDia)}> {trocaStatusDto.trocasEmDia.length}</Button></td>
                    <td><Button  onClick={() => setTrocasView(trocaStatusDto.trocasAtrasadas)}>{trocaStatusDto.trocasAtrasadas.length}</Button></td>
                    <td>{trocaStatusDto.trocasEmDia.length + trocaStatusDto.trocasAtrasadas.length}</td>
                </tr>

            </tbody >
        </Table >
        <ol>
            {trocasView && trocasView.map(troca =><li>{`${troca.etapa} - Real. ${DateAndTime(troca.dataRealizada)} Planj. ${DateAndTime(troca.dataPlanejada)}`} </li> )}
        </ol>
        </div>
       
}

export default StatusTroca