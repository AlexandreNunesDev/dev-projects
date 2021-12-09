import dispatchers from "../mapDispatch/mapDispathToProps"
import mapToStateProps from "../mapStateProps/mapStateToProps"
import React from "react"


import { connect } from "react-redux"
import { Modal, Table } from "react-bootstrap"


const getRows = (ocp) => {

    return (
    <tr key={ocp.id}>
        <td style={{ textAlign: "center" }}>{ocp.id}</td>
        <td style={{ textAlign: "center" }}>{ocp.processoNome}</td>
        <td style={{ textAlign: "center" }}>{ocp.etapaNome}</td>
        <td style={{ textAlign: "center" }}>{ocp.parametroNome}</td>
        <td style={{ textAlign: "center" }}>{ocp.adicoesDto.length > 0 && ocp.isAdicao ?  ocp.adicoesDto[0].data : ocp.dataAcao}  </td>
        <td style={{ textAlign: "center" }}>{ocp.adicoesDto.length > 0 && ocp.isAdicao ?  ocp.adicoesDto.map(adicao => <li prefix>{`${adicao.quantidade} ${adicao.unidade} ${adicao.nomeMp}`}</li>) : ocp.acao}</td>
        <td style={{ textAlign: "center" }}>{ocp.responsavel}</td>
    </tr>)

}

const getHeads = () => {
    return (
        <>

            <tr>
                <th style={{ textAlign: "center" }}>Id</th>
                <th style={{ textAlign: "center" }}>Processo</th>
                <th style={{ textAlign: "center" }}>Etapa</th>
                <th style={{ textAlign: "center" }}>Parametro</th>
                <th style={{ textAlign: "center" }}>Data</th>
                <th style={{ textAlign: "center" }}>Adicoes/Acao</th>
                <th style={{ textAlign: "center" }}>Responsavel</th>
             
            </tr>


        </>
    )
}






const OcpView = (props) => {
    const onCloseOcpView = () => {
        props.showOcpView(false)
        props.loadOcpView([]) 
    }
    return (
    <Modal size={"xl"} show={props.ocp.showOcpView} onHide={() => onCloseOcpView() }>
        <Modal.Header closeButton>
            <Modal.Title>Ocps da analise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Table striped bordered hover>
                <thead>
                    {getHeads()}
                </thead>
                <tbody>
                    {props.ocp.ocpsView.map(ocp => getRows(ocp))}
                </tbody>
            </Table>


        </Modal.Body>


        <Modal.Footer>
        
        </Modal.Footer>

    </Modal>
    )

}


export default connect(mapToStateProps.toProps, dispatchers)(OcpView)