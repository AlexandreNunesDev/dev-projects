import React from 'react'
import { connect } from "react-redux"
import dispatchers from "../mapDispatch/mapDispathToProps"
import mapToStateProps from "../mapStateProps/mapStateToProps"
import { isMobile } from 'react-device-detect';
import { Button, Form } from 'react-bootstrap';
import { downloadOcp } from "../Services/documentsDownload";
import { BsDot } from 'react-icons/bs';
import { Fragment } from 'react';


const isSameDate = (actualDate, refDate) => {
    if ((actualDate.getDay() === refDate.getDay())
        && (actualDate.getMonth() === refDate.getMonth())
        && (actualDate.getFullYear() === refDate.getFullYear())) {
        return true;
    } else {
        return false;
    }
}




const buildAdicaoDetails = (adicoesDto) => {
    return adicoesDto.map(adicao => {

        return (
            <Form.Row key={adicao.nomeMp}>
                <Form.Label style={{ textAlign: "center" }}><BsDot size={36} ></BsDot>{`${adicao.quantidade} ${adicao.unidade} ${adicao.nomeMp}`}</Form.Label>
            </Form.Row>)

    });
}

const buildAcaoDetails = (ocp) => {

    return (
        <Form.Row>
            <Form.Label style={{ textAlign: "center" }}><BsDot size={36} ></BsDot>{`${ocp.acao} prazo ${ocp.prazo}`}</Form.Label>
        </Form.Row>)


}


const OcpsTableBody = (props) => {



    const buildStatusButton = (ocp) => {

        if (!ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP) {
            return <Button disabled={ocp.statusCorrecao} style={{ alignmentBaseline: "center", backgroundColor: "ORANGE", borderColor: "ORANGE", color: "BLACK" }} onClick={() => props.openCorrecaoConfirm(ocp)}>Corrigir</Button>
        } else if (ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP) {
            return <Button disabled={!ocp.analiseStatus} style={{ alignmentBaseline: "center", backgroundColor: "YELLOW", borderColor: "YELLOW", color: "BLACK" }} onClick={() => props.reanalisar(ocp.analiseId, ocp.id)}>Reanalisar</Button>
        } else if (ocp.statusCorrecao && !ocp.analiseStatus && !ocp.statusOCP) {
            return <Button disabled={ocp.statusOCP} style={{ alignmentBaseline: "center", backgroundColor: "GREEN", borderColor: "GREEN" }} onClick={() => props.openCredentialsConfirm(ocp)}>Aprovar</Button>
        } else {
            return <Button disabled={true} style={{ backgroundColor: 'GRAY', borderColor: 'GRAY', alignmentBaseline: "center" }}>Encerrada</Button>
        }
    
    }

    const filterHandler = () => {
        let filteredByFilterType = []
        
        if(props.ocp.actualfilter === '') {
            filteredByFilterType = props.ocp.ocps
        } else {
            filteredByFilterType = props.ocp.ocps.filter((ocp) => {
                if (props.ocp.filterType === "Processo") {
                    return String(ocp.processoNome).toLowerCase().startsWith(props.ocp.actualFilter.toLowerCase())
                }
                if (props.ocp.filterType === "Etapa") {
                    return String(ocp.etapaNome).toLowerCase().startsWith(props.ocp.actualFilter.toLowerCase())
                }
                if (props.ocp.filterType === "Parametro") {
                    return String(ocp.parametroNome).toLowerCase().startsWith(props.ocp.actualFilter.toLowerCase())
                }
                if (props.ocp.filterType === "Status") {
                    if (String("Corrigir").toLowerCase().startsWith(props.ocp.actualFilter.toLowerCase())) {
                        if (!ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP) {
                            return true
                        } else {
                            return false
                        }
        
                    }
                    if (String("Reanalisar").toLowerCase().startsWith(props.ocp.actualFilter.toLowerCase())) {
                        if (ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP) {
                            return true
                        } else {
                            return false
                        }
        
                    }
                    if (String("Aprovar").toLowerCase().startsWith(props.ocp.actualFilter.toLowerCase())) {
                        if (ocp.statusCorrecao && !ocp.analiseStatus && !ocp.statusOCP) {
                            return true
                        } else {
                            return false
                        }
        
        
                    }
                    if (String("Encerrada").toLowerCase().startsWith(props.ocp.actualFilter.toLowerCase())) {
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
       
    
        if (!props.ocp.showEncerradas) {
            return filteredByFilterType.filter((ocp) => {
                return ocp.statusOCP === false
            })
        
        } else {
            return filteredByFilterType
       
        }
    
    
    }
    

    let firstDateLineCounter = 0
    let firstDate = new Date(props.ocp.ocps[0]?.prazo)
   
    //Pega a data damprimeira OCP da lista de OCPS enviadas pelo servidor
    let refDate = new Date(props.ocp.ocps[0]?.prazo)

    let ocpTd = filterHandler().map((ocp, index) => {
        let buttonKey = ocp.statucOcp ? 1 : !ocp.analiseStatus ?  2 : 3
        //Pega data da ocp da atual iteraçao do Map e compara com a data da primeira OCP da lista de OCPS
        let actualDate = new Date(ocp.prazo)

        if (isSameDate(actualDate, refDate)) {

            isSameDate(actualDate, firstDate) && firstDateLineCounter++

            refDate = actualDate
            return (

                <tr key={ocp.id}>
                    <td className="align-middle" style={{ textAlign: "center" }}>{ocp.id}</td>
                    {!isMobile && <th className="align-middle" style={{ textAlign: "center" }}><Button disabled={!ocp.isAdicao} size={20} onClick={() => downloadOcp(ocp.id)}>Download</Button></th>}
                    {!isMobile && <th className="align-middle" style={{ textAlign: "center" }}><Button size={20} onClick={() => this.editOcp(ocp)}>Editar</Button></th>}
                    <td className="align-middle" style={{ textAlign: "center" }}>{ocp.processoNome}</td>
                    {
                        !isMobile
                            ?
                            <>
                                <td className="align-middle" style={{ textAlign: "center" }}>{ocp.etapaNome}</td>
                                <td className="align-middle" style={{ textAlign: "center" }}>{ocp.parametroNome}</td>
                            </>
                            :
                            <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.etapaNome} ${ocp.parametroNome}`}</td>
                    }
                    {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMin} ${ocp.unidade}`}</td>}
                    {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMax}  ${ocp.unidade}`}</td>}
                    {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.resultado}  ${ocp.unidade}`}</td>}
                    <td className="align-middle">{ocp.adicoesDto.length === 0 ? buildAcaoDetails(ocp) : buildAdicaoDetails(ocp.adicoesDto)}</td>
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
                        {!isMobile && <th className="align-middle" style={{ textAlign: "center" }}><Button disabled={!ocp.isAdicao} size={20} onClick={() => downloadOcp(ocp.id)}>Download</Button></th>}
                        {!isMobile && <th className="align-middle" style={{ textAlign: "center" }}><Button size={20} onClick={() => this.editOcp(ocp)}>Editar</Button></th>}
                        <td className="align-middle" style={{ textAlign: "center" }}>{ocp.processoNome}</td>
                        {
                        !isMobile ? <> <td className="align-middle" style={{ textAlign: "center" }}>{ocp.etapaNome}</td>
                        <td className="align-middle" style={{ textAlign: "center" }}>{ocp.parametroNome}</td> </>
                        : <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.etapaNome} ${ocp.parametroNome}`}</td>
                        }

                        {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMin} ${ocp.unidade}`}</td>}
                        {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMax}  ${ocp.unidade}`}</td>}
                        {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.resultado}  ${ocp.unidade}`}</td>}
                        <td  className="align-middle"  >{ocp.adicoesDto.length === 0 ? buildAcaoDetails(ocp) : buildAdicaoDetails(ocp.adicoesDto)}</td>
                        <td className="align-middle" style={{ textAlign: "center" }} key={buttonKey}>{buildStatusButton(ocp)}</td>
                    </tr>
                </Fragment>
            )
        }






    })
    
    if(props.ocp.ocps.length === 0) {
        return <h1>Voce não possui conrreçoes</h1>
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

export default  connect(mapToStateProps.toProps,dispatchers)(OcpsTableBody)