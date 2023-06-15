import { useState } from "react"
import { Button, Form, Table } from "react-bootstrap"
import { DateAndTime } from "../Services/stringUtils"
import {BsFillNodePlusFill} from "react-icons/bs"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { updateFiltroEtapa, updateFiltroParametro, updateFiltroProcesso } from "../Reducers/analiseReducer"

const StatusParametro = ({ parametroStatusDto }) => {


    const [parametroView,setParamView] = useState()
    const history = useHistory()
    const dispatch = useDispatch()

    const goToanalise = (param) => {
        dispatch(updateFiltroProcesso(param.processo))
        dispatch(updateFiltroEtapa(param.etapa))
        dispatch(updateFiltroParametro(param.nome))
        history.push("/RegistroAnaliseMulti")
    }

    return<div>
        <h3>Status Parametro</h3>
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
                    <td><Button  onClick={() => setParamView(parametroStatusDto.parametrosEmDia)}>{parametroStatusDto.parametrosEmDia.length}</Button></td>
                    <td><Button onClick={() => setParamView(parametroStatusDto.parametrosAtrasados)}>{parametroStatusDto.parametrosAtrasados.length}</Button> </td>
                    <td>{parametroStatusDto.parametrosEmDia.length + parametroStatusDto.parametrosAtrasados.length}</td>
                </tr>

            </tbody >
        </Table >
        <ol>
            {parametroView && parametroView.map(param =><li>{`${param.processo} - ${param.etapa} : ${param.nome} - Real. ${DateAndTime(param.dataRealizada)} Planj. ${DateAndTime(param.dataPlanejada)}`} <BsFillNodePlusFill onClick={() =>goToanalise(param)}/></li> )}
        </ol>
    </div>
}

export default StatusParametro