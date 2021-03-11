import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Row, Col, Form, Container } from "react-bootstrap";
import ScqApi from "../Http/ScqApi";
import CredentialConfirm from '../Components/CredentialConfirm'
import CorrecaoConfirm from "../Components/CorrecaoConfirm";
import { withToastManager } from "react-toast-notifications";
import { downloadOcp } from "../Services/documentsDownload";
import { withMenuBar } from "../Hocs/withMenuBar";
import GenericDropDown from "../Components/GenericDropDown";


const TableHead = () => {
    return (

        <thead >
            <tr>
                <th style={{ textAlign: "center" }}>Id</th>
                <th colSpan={2} style={{ textAlign: "center" }}>Açoes</th>
                
                <th style={{ textAlign: "center" }}>Processo</th>
                <th style={{ textAlign: "center" }}>Etapa</th>
                <th style={{ textAlign: "center" }}>Parametro</th>
                <th style={{ textAlign: "center" }}>Faixa mínima</th>
                <th style={{ textAlign: "center" }}>Faixa máxima</th>
                <th style={{ textAlign: "center" }}>Resultado</th>
                <th colSpan="3" style={{ textAlign: "center" }}>Status</th>
            </tr>
        </thead>

    )
}

const TableBody = (props) => {



    let ocpTd = props.ocps.map((ocp, index) => {

        return (

            <tr key={ocp.id}>

                <td className="align-middle" style={{ textAlign: "center" }}>{ocp.id}</td>
                <th className="align-middle" style={{ textAlign: "center" }}><Button disabled={!ocp.isAdicao} size={20} onClick={() => downloadOcp(ocp.id)}>Download</Button></th>
                <th className="align-middle" style={{ textAlign: "center" }}><Button size={20} onClick={() => props.editarOcp(ocp)}>Editar</Button></th>
                <td className="align-middle" style={{ textAlign: "center" }}>{ocp.processoNome}</td>
                <td className="align-middle" style={{ textAlign: "center" }}>{ocp.etapaNome}</td>
                <td className="align-middle" style={{ textAlign: "center" }}>{ocp.parametroNome}</td>
                <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMin} ${ocp.unidade}`}</td>
                <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMax}  ${ocp.unidade}`}</td>
                <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.resultado}  ${ocp.unidade}`}</td>
                <td><Button disabled={ocp.statusCorrecao} style={{ backgroundColor: ocp.statusCorrecao ? '#42f59e' : 'GRAY', borderColor: ocp.statusCorrecao ? '#42f59e' : 'GRAY', alignmentBaseline: "center" }} onClick={() => props.openCorrecaoConfirm(ocp)}>Corrigir</Button></td>
                <td><Button disabled={!ocp.analiseStatus} style={{ backgroundColor: ocp.analiseStatus ? 'GRAY' : '#42f59e', borderColor: ocp.analiseStatus ? 'GRAY' : '#42f59e' }} onClick={() => props.reanalisar(ocp.analiseId, ocp.id)}>Reanalisar</Button></td>
                <td><Button disabled={ocp.statusOCP} style={{ backgroundColor: ocp.statusOCP ? '#42f59e' : 'GRAY'  , borderColor: ocp.statusOCP ? '#42f59e' : 'GRAY'  }} onClick={() => props.openCredentialsConfirm(ocp)}>Aprovar</Button></td>
            </tr>
        )
    })

    return ocpTd

}



class OrdensDeCorreção extends Component {


    constructor(props) {
        super(props)

        const { toastManager } = this.props;
        this.state = {
            ocps: [],
            filteredOcps : [],
            codigoCorrecao: '',
            toastManager: toastManager,
            show: false,
            details: ''
        }
    }



    componentDidMount() {
        this.lodadOcps()
    }

    lodadOcps = () => {
        ScqApi.ListaOcps().then(res => {
            this.setState({
                ocps: res,
                filteredOcps : res,
                ocpConfirm: {},
                filterType : '',
               
            })
        })
    }

    openCredentialsConfirm = (ocp) => {
        const details = this.getAproveDetails(ocp)
        this.setState({ show: true, details: details })
    }

    goToReanalise = (analiseId, ocpId) => {
        ScqApi.LoadReanalise(analiseId).then(res => this.redirectAnalise(this.props.history, res, ocpId))
    }

    redirectAnalise = (history, analise, ocpId) => {

        history.push("/RegistroAnalise", [analise, ocpId])
    }

    getAproveDetails = (ocp) => {
        let text = `Aprovar OCP ${ocp.parametroNome} ${ocp.resultado}${ocp.unidade} \n
        |Faixa Especificada ${ocp.pMin} a ${ocp.pMax}| ? `
        let newText = text.split("\n").map((item, i) => {
            return <p key={i}>{item}</p>;
        });
        return newText
    }


    correcaoConfirm = (isOcp, ocpId, isAdicao) => {
        if (isOcp) {
            if (isAdicao) {
                ScqApi.AdicaoCorrigir(ocpId).then(() => window.location.reload())


            } else {
                ScqApi.AcaoCorrigir(ocpId).then(() => window.location.reload())

            }


        } else {
            this.state.toastManager.add("Codigo OCP inserido estado errado", {
                appearance: 'error', autoDismiss: true

            })
        }


    }


    aprovarOcp = () => {
        ScqApi.AprovarOcp(this.state.ocpToAprove.id).then(this.setState({ show: false }, () => window.location.reload()))
    }

    editOcp = (ocp) => {
        if(ocp.isAdicao){
            this.props.history.push("/EditarOcpAdicao", ocp)
        } else {
            this.props.history.push("/EditarOcpAcao", ocp)
        }
      
    }







    render() {
        return (
            <>
                <Container >
                    <Row className="justify-content-md-center">
                        <Col md="auto">
                            <Button style={{ margin: 10 }} onClick={() => this.props.history.push("/CadastroOcpAdicaoLivre")} >Gerar OCP</Button>
                        </Col>
                        <Col>
                            <Form.Control placeholder="filtrar por..." style={{ margin: 10 }} onChange={(event) => this.setState({
                                filteredOcps: this.state.ocps.filter((ocp) => {
                                    if (this.state.filterType === "Processo") {
                                        return String(ocp.linhaNome).startsWith(event.target.value)
                                    }
                                    if (this.state.filterType === "Etapa") {
                                        return String(ocp.etapaNome).startsWith(event.target.value)
                                    }
                                    if (this.state.filterType === "Parametro") {
                                        return String(ocp.parametroNome).startsWith(event.target.value)
                                    }
                                    return ""

                                })
                            })}></Form.Control>
                        </Col>
                        <Col md="auto">
                            <GenericDropDown display={"Tipo"} margin={10} itens={["Processo", "Etapa","Parametro"]} onChoose={(item) => this.setState({ filterType: item})} style={{ margin: 10 }}>Filtrar </GenericDropDown>
                        </Col>
            
                    </Row>
                </Container>

                <Table>
                    <TableHead></TableHead>
            
                    <TableBody  editarOcp={this.editOcp} openCredentialsConfirm={(ocpToAprove) => this.setState({ ocpToAprove: ocpToAprove, details: this.getAproveDetails(ocpToAprove) }, () => this.setState({ show: true }))} openCorrecaoConfirm={(ocpToConfirm) => this.setState({ ocpToConfirm: ocpToConfirm, showCorrecaoConfirm: true })} ocps={this.state.filteredOcps} reanalisar={this.goToReanalise} aprovarOcp={this.aprovarOcp} history={this.props.history}></TableBody>
                   
                </Table>

                {this.state.ocpToConfirm && <CorrecaoConfirm closeCorrecaoConfim={() => this.setState({ showCorrecaoConfirm: false })} show={this.state.showCorrecaoConfirm}  statusCorrecao={this.state.ocpToConfirm.statusCorrecao} ocp={this.state.ocpToConfirm} correcaoConfirm={(isOcp, ocpId) => this.correcaoConfirm(isOcp, ocpId, this.state.ocpToConfirm.isAdicao)} correcaoType={this.state.ocpToConfirm.isAdicao ? "adicao" : "acao"}></CorrecaoConfirm>}
                <CredentialConfirm details={this.state.details} aproveOcp={() => this.aprovarOcp()} show={this.state.show} closeCredentialConfirm={() => this.setState({ show: false })}  ></CredentialConfirm>
            </>



        )
    }

}

export default withToastManager(withMenuBar(OrdensDeCorreção))
