import { Fragment } from 'react';
import { Button } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';
import { connect, useSelector } from "react-redux";
import { useHistory } from 'react-router';
import dispatchers from "../mapDispatch/mapDispathToProps";
import mapToStateProps from "../mapStateProps/mapStateToProps";
import { buildMotivo } from '../Services/ocpService';


const isSameDate = (actualDate, refDate) => {
    if ((actualDate.getDay() === refDate.getDay())
        && (actualDate.getMonth() === refDate.getMonth())
        && (actualDate.getFullYear() === refDate.getFullYear())) {
        return true;
    } else {
        return false;
    }
}




const buildAdicaoDetails = (ocp) => {
    const lis = ocp.adicoesDto.map((adicao, index) => {


        return (
            <li key={adicao.id} >
                <div style={{ borderColor: 'black', borderWidth: 2, borderStyle: 'double', margin: 4 }}>
                    <label style={{ color: adicao.status ? "green" : "orange" }}>{adicao.status ? "concluido" : "pendente"}</label>
                    <div className="text-nowrap"><strong>Qtd. Planejada: </strong>{`${adicao.quantidade} ${adicao.unidade} ${adicao.nomeMp}`}</div>
                    <div className="text-nowrap"><strong>Qtd. Realizado: </strong>{`${adicao.quantidadeRealizada} ${adicao.unidade} ${adicao.nomeMp}`}</div>
                    <div><strong>Responsavel: </strong> {adicao.realizadoPor}</div>
                    <div><strong>Realizado em: </strong> {adicao.realizadoEm}</div>
                    <div className="text-nowrap"><strong>Observacao: </strong> {adicao.observacao ? adicao.observacao : ""}</div>
                </div>
            </li>

        )

    });
    return (
        <div >
            <div><label><strong>Aberto por: </strong>{`${ocp.responsavel}`}</label></div>
            <div><label><strong >Observação Ocp: </strong>{`${ocp.observacao}`}</label></div>
            <h6 style={{ textAlign: "center" }}><strong>Adicoes</strong></h6>
            <ol>
                {lis}
            </ol>
        </div>
    )
}



const OcpsTableBody = (props) => {


    const history = useHistory()
    const ocpState = useSelector(state => state.ocp)


    const editOcp = (ocp) => {
        props.ocpToEdit(ocp)
        history.push("/EditarOcp")


    }


    const getCorrectionButton = (ocp) => {
        return <Button disabled={ocp.statusCorrecao} style={{ alignmentBaseline: "center", backgroundColor: "ORANGE", borderColor: "ORANGE", color: "BLACK" }} onClick={() => props.openCorrecaoConfirm(ocp)}>Corrigir</Button>
    }

    const getReanalisebutton = (ocp) => {
        return <Button disabled={!ocp.analiseStatus} style={{ alignmentBaseline: "center", backgroundColor: "YELLOW", borderColor: "YELLOW", color: "BLACK" }} onClick={() => props.reanalisar(ocp.analiseId, ocp.id)}>Reanalisar</Button>
    }

    const getAproveOcpButton = (ocp) => {
        return <Button disabled={ocp.statusOCP} style={{ alignmentBaseline: "center", backgroundColor: "GREEN", borderColor: "GREEN" }} onClick={() => props.openCredentialsConfirm(ocp)}>Aprovar</Button>
    }

    const getEncerradaOcpButton = () => {
        return <Button disabled={true} style={{ backgroundColor: 'GRAY', borderColor: 'GRAY', alignmentBaseline: "center" }}>Encerrada</Button>
    }

    const buildStatusButton = (ocp) => {
        if (!ocp.statusCorrecao) {
            return getCorrectionButton(ocp)
        } else if (ocp.analiseStatus) {
            return getReanalisebutton(ocp)
        } else if (!ocp.statusOCP) {
            return getAproveOcpButton(ocp)
        } else {
            return getEncerradaOcpButton()
        }
    }

    const filterHandler = () => {
        let filteredByFilterType = []

        if (ocpState.actualfilter === '') {
            filteredByFilterType = ocpState.ocps
        } else {
            filteredByFilterType = ocpState.ocps.filter((ocp) => {
                if (ocpState.filterType === "Processo") {
                    return String(ocp.processoNome).toLowerCase().startsWith(ocpState.actualFilter.toLowerCase())
                }
                if (ocpState.filterType === "Etapa") {
                    return String(ocp.etapaNome).toLowerCase().startsWith(ocpState.actualFilter.toLowerCase())
                }
                if (ocpState.filterType === "Parametro") {
                    return String(ocp.parametroNome).toLowerCase().startsWith(ocpState.actualFilter.toLowerCase())
                }
                if (ocpState.filterType === "Status") {
                    if (String("Corrigir").toLowerCase().startsWith(ocpState.actualFilter.toLowerCase())) {
                        if (!ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP) {
                            return true
                        } else {
                            return false
                        }

                    }
                    if (String("Reanalisar").toLowerCase().startsWith(ocpState.actualFilter.toLowerCase())) {
                        if (ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP) {
                            return true
                        } else {
                            return false
                        }

                    }
                    if (String("Aprovar").toLowerCase().startsWith(ocpState.actualFilter.toLowerCase())) {
                        if (ocp.statusCorrecao && !ocp.analiseStatus && !ocp.statusOCP) {
                            return true
                        } else {
                            return false
                        }


                    }
                    if (String("Encerrada").toLowerCase().startsWith(ocpState.actualFilter.toLowerCase())) {
                        if (ocp.statusCorrecao && !ocp.analiseStatus && ocp.statusOCP) {
                            return true
                        } else {
                            return false
                        }


                    }

                }
                return true

            })
        }


        if (!ocpState.showEncerradas) {
            return filteredByFilterType.filter((ocp) => {
                return ocp.statusOCP === false
            })

        } else {
            return filteredByFilterType

        }


    }


    let firstDateLineCounter = 0
    let firstDate = new Date(ocpState.ocps[0]?.prazo)

    //Pega a data damprimeira OCP da lista de OCPS enviadas pelo servidor
    let refDate = new Date(ocpState.ocps[0]?.prazo)

    let ocpTd = filterHandler().map((ocp, index) => {
        let buttonKey = ocp.statucOcp ? 1 : !ocp.analiseStatus ? 2 : 3
        //Pega data da ocp da atual iteraçao do Map e compara com a data da primeira OCP da lista de OCPS
        let actualDate = new Date(ocp.prazo)

        if (isSameDate(actualDate, refDate)) {

            isSameDate(actualDate, firstDate) && firstDateLineCounter++

            refDate = actualDate
            return (

                <tr key={ocp.id}>
                    <td className="align-middle" style={{ textAlign: "center" }}>{ocp.id}</td>
                    <td className="align-middle" style={{ textAlign: "center" }}><Button size={20} onClick={() => editOcp(ocp)}>Editar</Button></td>
                    <td className="align-middle" style={{ textAlign: "center" }}>{ocp.processoNome}</td>
                    <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.etapaNome}`}</td>
                    {/* <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMax}`}</td>
                    <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMin}`}</td>
                    <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.resultado}`}</td> */}
                    <td className="align-middle" style={{ textAlign: "center" }}>{buildMotivo(ocp.motivo)}</td>
                    <td className="align-middle">{buildAdicaoDetails(ocp)}</td>
                    <td className="align-middle" style={{ textAlign: "center" }} key={buttonKey}>{buildStatusButton(ocp)}</td>
                </tr>
            )
        } else {
            refDate = actualDate
            return (
                <Fragment key={ocp.id}>
                    <tr >
                        <td className="align-middle" style={{ textAlign: "center" }} colSpan={11}>{actualDate.toLocaleDateString("pt-br")}</td>
                    </tr>
                    <tr>
                        <td className="align-middle" style={{ textAlign: "center" }}>{ocp.id}</td>
                        <td className="align-middle" style={{ textAlign: "center" }}><Button size={20} onClick={() => editOcp(ocp)}>Editar</Button></td>
                        <td className="align-middle" style={{ textAlign: "center" }}>{ocp.processoNome}</td>
                        <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.etapaNome}`}</td>
                        {/* <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMax}`}</td>
                        <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMin}`}</td>
                        <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.resultado}`}</td> */}
                        <td className="align-middle" style={{ textAlign: "center" }}>{buildMotivo(ocp.motivo)}</td>
                        <td className="align-middle">{buildAdicaoDetails(ocp)}</td>
                        <td className="align-middle" style={{ textAlign: "center" }} key={buttonKey}>{buildStatusButton(ocp)}</td>
                    </tr>
                </Fragment>
            )
        }






    })

    if (ocpState.ocps.length === 0) {
        return <></>
    } else {
        return (

            <>
                {firstDateLineCounter > 0 && <tr >
                    <td className="align-middle" style={{ textAlign: "center" }} colSpan={11}>{firstDate.toLocaleDateString("pt-br")}</td>
                </tr>}
                {ocpTd}
            </>
        )
    }


}

export default connect(mapToStateProps.toProps, dispatchers)(OcpsTableBody)
