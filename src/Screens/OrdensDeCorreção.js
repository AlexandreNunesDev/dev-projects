import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Row, Col, Form, Container } from "react-bootstrap";
import ScqApi from "../Http/ScqApi";
import CredentialConfirm from '../Components/CredentialConfirm'
import CorrecaoConfirm from "../Components/CorrecaoConfirm";
import { withToastManager } from "react-toast-notifications";
import { withMenuBar } from "../Hocs/withMenuBar";
import GenericDropDown from "../Components/GenericDropDown";
import { isMobile } from 'react-device-detect';
import mapStateToProps from "../mapStateProps/mapStateToProps"
import { connect } from "react-redux";
import dispatchers from "../mapDispatch/mapDispathToProps";
import { WebSocketContext } from "../websocket/wsProvider";
import OcpsTableBody from "../Components/OcpsTableBody";
import { responseHandler } from "../Services/responseHandler";
import { toastOk } from "../Services/toastType";
import { store } from "../store";




const TableHead = (props) => {
    return (
        <thead >
            <tr>
                <th style={{ textAlign: "center" }}>Id</th>
                {!isMobile && <th colSpan={2} style={{ textAlign: "center" }}>Açoes</th>}

                <th style={{ textAlign: "center" }}>Processo</th>
                {!isMobile ?
                    <>
                        <th style={{ textAlign: "center" }}>Etapa</th>
                        <th style={{ textAlign: "center" }}>Parametro</th>
                    </>
                    :
                    <th style={{ textAlign: "center" }}>Etapa/Param.</th>
                }

                {!isMobile && <th style={{ textAlign: "center" }}>Faixa mínima</th>}
                {!isMobile && <th style={{ textAlign: "center" }}>Faixa máxima</th>}
                {!isMobile && <th style={{ textAlign: "center" }}>Resultado</th>}
                <th style={{ textAlign: "center" }}>Correção</th>
                <th style={{ textAlign: "center" }}>Status</th>
            </tr>
        </thead>

    )
}












class OrdensDeCorreção extends Component {
    static contextType = WebSocketContext

    constructor(props) {
        super(props)

        const { toastManager } = this.props;
        this.state = {
            ocps: [],
            filteredOcps: [],
            codigoCorrecao: '',
            toastManager: toastManager,
            show: false,
            details: '',
            showEncerradas: false,
            actualFilter: "",
            ocpConfirm: {},
            filterType: '',
            showCorrecaoConfirm: false

        }
    }



    openCredentialsConfirm = (ocp) => {
        const details = this.getAproveDetails(ocp)
        this.setState({ show: true, details: details })
    }

    goToReanalise = (analiseId, ocpId) => {
        ScqApi.FindAnalise(analiseId).then(res => this.redirectAnalise(this.props.history, res, ocpId))
    }

    redirectAnalise = (history, analise, ocpId) => {
        this.props.setSingleAnalise(analise)
        history.push("/RegistroAnalise", {reanalise : true})
    }

    getAproveDetails = (ocp) => {
        let text = `Aprovar OCP ${ocp.parametroNome} ${ocp.resultado}${ocp.unidade} \n |Faixa Especificada ${ocp.pMin} a ${ocp.pMax}| ? `
        let newText = text.split("\n").map((item, i) => {
            return <p key={i}>{item}</p>;
        });
        return newText
    }


    correcaoConfirm = (isOcp, ocpId, isAdicao) => {
        if (isOcp) {
            if (isAdicao) {
                ScqApi.AdicaoCorrigir(ocpId, [this.props.loadOcps]).then(res => responseHandler(res, this.state.toastManager, "Correcao", toastOk))
            } else {
                ScqApi.AcaoCorrigir(ocpId, [this.props.loadOcps]).then(res => responseHandler(res, this.state.toastManager, "Correcao", toastOk))

            }
        } else {
            this.state.toastManager.add("Codigo OCP inserido estado errado", {
                appearance: 'error', autoDismiss: true
            })
        }


    }


    aprovarOcp = () => {
        ScqApi.AprovarOcp(this.state.ocpToAprove.id, [this.props.loadOcps]).then(res => responseHandler(res, this.state.toastManager, "Correcao", toastOk))
    }


    adjustTableHeight = () => {
        var table = document.getElementById("ocpTable")
        var rows = table.rows;
        var mostHeight = 0;
        for (var i = 0; i < rows.length; i++) {
            var rowTextHeight = rows[i].style.height
            if (rowTextHeight > mostHeight) {
                mostHeight = rowTextHeight;
            }
        }
        return mostHeight;
    }


    

    render() {


        return (
            <>
                <Container >
                    <Row className="align-items-center">
                        <Col>
                            <Form.Control placeholder="filtrar por..." style={{ margin: 10 }} value={this.props.ocp.actualFilter} onChange={(event) => this.props.setActualFilter(event.target.value)}></Form.Control>
                        </Col>
                        <Col md="auto">
                            <GenericDropDown display={ this.props.ocp.filterType|| "Tipo"} margin={10} va itens={["Processo", "Etapa", "Parametro"]} onChoose={(filterType) => this.props.setFilterType(filterType)} style={{ margin: 10 }}>Filtrar </GenericDropDown>
                        </Col>
                    </Row>
                </Container>

                <div className="table-responsive">
                    <Table id={"ocpTable"}>
                        <TableHead ></TableHead>
                        <tbody>
                            <OcpsTableBody editarOcp={this.editOcp} openCredentialsConfirm={(ocpToAprove) => this.setState({ ocpToAprove: ocpToAprove, details: this.getAproveDetails(ocpToAprove) }, () => this.setState({ show: true }))} openCorrecaoConfirm={(ocpToConfirm) => this.setState({ ocpToConfirm: ocpToConfirm, showCorrecaoConfirm: true })} reanalisar={this.goToReanalise} aprovarOcp={this.aprovarOcp} history={this.props.history}></OcpsTableBody>
                        </tbody>

                    </Table>
                </div>

                {this.state.ocpToConfirm && <CorrecaoConfirm closeCorrecaoConfim={(value) => this.setState({ showCorrecaoConfirm: value })} show={this.state.showCorrecaoConfirm} statusCorrecao={this.state.ocpToConfirm.statusCorrecao} ocp={this.state.ocpToConfirm} correcaoConfirm={(isOcp, ocpId) => this.correcaoConfirm(isOcp, ocpId, this.state.ocpToConfirm.isAdicao)} correcaoType={this.state.ocpToConfirm.isAdicao ? "adicao" : "acao"}></CorrecaoConfirm>}
                <CredentialConfirm details={this.state.details} aproveOcp={() => this.aprovarOcp()} show={this.state.show} closeCredentialConfirm={(value) => this.setState({ show: value })}  ></CredentialConfirm>
            </>



        )
    }

}



export default withToastManager(withMenuBar(connect(mapStateToProps.toProps, dispatchers)(OrdensDeCorreção)))
