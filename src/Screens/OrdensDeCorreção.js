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
import { BsDot } from "react-icons/bs";
import {isMobile} from 'react-device-detect';
import { Fragment } from "react";
import { Checkbox, FormGroup } from "@material-ui/core";




const TableHead = (props) => {
    return (

        <thead >
            <tr>
                <th style={{ textAlign: "center" }}>Id</th>
                {!isMobile  && <th colSpan={2} style={{ textAlign: "center" }}>Açoes</th>}
                
                <th style={{ textAlign: "center" }}>Processo</th>
                {
                    !isMobile ? <> <th style={{ textAlign: "center" }}>Etapa</th>
                    <th style={{ textAlign: "center" }}>Parametro</th>  </> :   <th style={{ textAlign: "center" }}>Etapa/Param.</th> 
                }
               
                {!isMobile &&  <th style={{ textAlign: "center" }}>Faixa mínima</th>}
                {!isMobile && <th style={{ textAlign: "center" }}>Faixa máxima</th>}
                {!isMobile && <th style={{ textAlign: "center" }}>Resultado</th>}
                <th style={{ textAlign: "center" }}>Correção</th>
                <th style={{ textAlign: "center" }}>Status</th>
            </tr>
        </thead>

    )
}


const buildStatusButton = (ocp,props) => {

    if(!ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP){
        return <td className="align-middle" style={{ textAlign: "center" }}><Button disabled={ocp.statusCorrecao} style={{alignmentBaseline: "center" , backgroundColor : "ORANGE", borderColor: "ORANGE", color : "BLACK"}} onClick={() => props.openCorrecaoConfirm(ocp)}>Corrigir</Button></td>
    } else if(ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP) {
        return <td className="align-middle" style={{ textAlign: "center" }}><Button disabled={!ocp.analiseStatus} style={{alignmentBaseline: "center",backgroundColor : "YELLOW", borderColor: "YELLOW" , color : "BLACK" }} onClick={() => props.reanalisar(ocp.analiseId, ocp.id)}>Reanalisar</Button></td>
    } else if (ocp.statusCorrecao && !ocp.analiseStatus && !ocp.statusOCP){
       return  <td className="align-middle" style={{ textAlign: "center" }}><Button disabled={ocp.statusOCP} style={{alignmentBaseline: "center",backgroundColor : "GREEN", borderColor: "GREEN"}} onClick={() => props.openCredentialsConfirm(ocp)}>Aprovar</Button></td>
    } else {
        return <td className="align-middle" style={{ textAlign: "center" }}><Button disabled={true} style={{ backgroundColor: 'GRAY'  , borderColor: 'GRAY' , alignmentBaseline: "center" }}>Encerrada</Button></td>
    }
    
}

const buildAdicaoDetails = (adicoesDto) => {
    return adicoesDto.map(adicao => {
        
        return(
                  <Form.Row key={adicao.nomeMp}>
                    <Form.Label style={{ textAlign: "center" }}><BsDot size={36} ></BsDot>{`${adicao.quantidade} ${adicao.unidade} ${adicao.nomeMp}`}</Form.Label>
                  </Form.Row>)
           
      });
  }

  const buildAcaoDetails = (ocp) => {

        
    return(
              <Form.Row>
                <Form.Label style={{ textAlign: "center" }}><BsDot size={36} ></BsDot>{`${ocp.acao} prazo ${ocp.prazo}`}</Form.Label>
              </Form.Row>)
       
 
}




const  isSameDate = (actualDate, refDate) => {
    if((actualDate.getDay() === refDate.getDay()) 
    && (actualDate.getMonth() === refDate.getMonth()) 
    && (actualDate.getFullYear() === refDate.getFullYear())) {      
        return true;
    } else {
        return false;
    }
}


const TableBody = (props) => {

    let firstDateLineCounter = 0
    let firstDate = new Date(props.ocps[0]?.prazo)

    //Pega a data damprimeira OCP da lista de OCPS enviadas pelo servidor
    let refDate = new Date(props.ocps[0]?.prazo)

    let ocpTd = props.ocps.map((ocp, index) => {

        //Pega data da ocp da atual iteraçao do Map e compara com a data da primeira OCP da lista de OCPS
        let actualDate = new Date(ocp.prazo)

        if(isSameDate(actualDate, refDate)) {

            isSameDate(actualDate, firstDate) && firstDateLineCounter++

            refDate = actualDate
            return (
                
                <tr key={ocp.id}>
    
                    <td className="align-middle" style={{ textAlign: "center" }}>{ocp.id}</td>
                    {!isMobile  && <th className="align-middle" style={{ textAlign: "center"}}><Button disabled={!ocp.isAdicao} size={20} onClick={() => downloadOcp(ocp.id)}>Download</Button></th>}
                    {!isMobile  && <th className="align-middle" style={{ textAlign: "center" }}><Button size={20} onClick={() => props.editarOcp(ocp)}>Editar</Button></th>}
                    <td className="align-middle" style={{ textAlign: "center" }}>{ocp.processoNome}</td>
                    {
                        !isMobile ? <> <td className="align-middle" style={{ textAlign: "center"}}>{ocp.etapaNome}</td>
                        <td className="align-middle" style={{ textAlign: "center" }}>{ocp.parametroNome}</td> </>
                        : <td className="align-middle" style={{ textAlign: "center"}}>{`${ocp.etapaNome} ${ocp.parametroNome}`}</td>
                    }
                   
                    {!isMobile  && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMin} ${ocp.unidade}`}</td>}
                    {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMax}  ${ocp.unidade}`}</td>}
                    {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.resultado}  ${ocp.unidade}`}</td>}
                    <td className="align-middle"  >{ocp.adicoesDto.length == 0 ? buildAcaoDetails(ocp) : buildAdicaoDetails(ocp.adicoesDto)}</td>
                    {buildStatusButton(ocp,props)}
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
                {!isMobile  && <th className="align-middle" style={{ textAlign: "center"}}><Button disabled={!ocp.isAdicao} size={20} onClick={() => downloadOcp(ocp.id)}>Download</Button></th>}
                {!isMobile  && <th className="align-middle" style={{ textAlign: "center" }}><Button size={20} onClick={() => props.editarOcp(ocp)}>Editar</Button></th>}
                <td className="align-middle" style={{ textAlign: "center" }}>{ocp.processoNome}</td>
                {
                    !isMobile ? <> <td className="align-middle" style={{ textAlign: "center"}}>{ocp.etapaNome}</td>
                    <td className="align-middle" style={{ textAlign: "center" }}>{ocp.parametroNome}</td> </>
                    : <td className="align-middle" style={{ textAlign: "center"}}>{`${ocp.etapaNome} ${ocp.parametroNome}`}</td>
                }
               
                {!isMobile  && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMin} ${ocp.unidade}`}</td>}
                {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.pMax}  ${ocp.unidade}`}</td>}
                {!isMobile && <td className="align-middle" style={{ textAlign: "center" }}>{`${ocp.resultado}  ${ocp.unidade}`}</td>}
                <td className="align-middle"  >{ocp.adicoesDto.length == 0 ? buildAcaoDetails(ocp) : buildAdicaoDetails(ocp.adicoesDto)}</td>
                {buildStatusButton(ocp,props)}
            </tr>
            </Fragment>
                )
        }
        

        
        

        
    })

    return (
            <>
             {firstDateLineCounter > 0 && <tr >
                <td className="align-middle" style={{ textAlign: "center" }} colSpan={11}>{firstDate.toLocaleDateString("pt-br")}</td>
             </tr>}
             {ocpTd}
             </>
             )

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
            details: '',
            showEncerradas : false
          
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
                
               
            },() => this.filterEncerradas())
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
        let text = `Aprovar OCP ${ocp.parametroNome} ${ocp.resultado}${ocp.unidade} \n |Faixa Especificada ${ocp.pMin} a ${ocp.pMax}| ? `
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


    

    adjustTableHeight = () => {
       var table =  document.getElementById("ocpTable")
       var rows = table.rows;
       var mostHeight = 0;
       for (var i = 0; i < rows.length; i++) {
        var rowTextHeight = rows[i].style.height
        if(rowTextHeight > mostHeight){
            mostHeight = rowTextHeight;
        } 
    }
    return mostHeight;
    }


    filterEncerradas = () => this.setState({
        showEncerradas : !this.state.showEncerradas,
       
    },this.setState({filteredOcps: this.state.ocps.filter((ocp)=> {
        if( this.state.showEncerradas && ocp.statusOCP){
            return true;
        }
    })}))





    render() {

        
        return (
            <>
                <Container >
                    <Row className="align-items-center">
                        <Col md="auto">
                            <Button style={{ margin: 10 }} onClick={() => this.props.history.push("/CadastroOcpAdicaoLivre")} >Gerar OCP</Button>
                        </Col>
                        <Col>
                            <Form.Control placeholder="filtrar por..." style={{ margin: 10 }} onChange={(event) => 
                            
                            {   
                                if(event.target.value.length===0) {
                                    this.setState({
                                        filteredOcps : this.state.ocps
                                    })
                                } else {
                                    this.setState({
                                        filteredOcps: this.state.ocps.filter((ocp) => {
                                            if (this.state.filterType === "Processo") {
                                                return String(ocp.processoNome).startsWith(event.target.value)
                                            }
                                            if (this.state.filterType === "Etapa") {
                                                return String(ocp.etapaNome).startsWith(event.target.value)
                                            }
                                            if (this.state.filterType === "Parametro") {
                                                return String(ocp.parametroNome).startsWith(event.target.value)
                                            }
                                            if (this.state.filterType === "Status") {
                                                if(String("Corrigir").toLowerCase().startsWith(event.target.value.toLowerCase())){
                                                    if(!ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP){
                                                        return true
                                                    } else {
                                                        return false
                                                    }
                                                    
                                                }
                                                if(String("Reanalisar").toLowerCase().startsWith(event.target.value.toLowerCase())){
                                                    if(ocp.statusCorrecao && ocp.analiseStatus && !ocp.statusOCP){
                                                        return true
                                                    } else {
                                                        return false
                                                    }
                                                    
                                                }
                                                if(String("Aprovar").toLowerCase().startsWith(event.target.value.toLowerCase())){
                                                    if(ocp.statusCorrecao && !ocp.analiseStatus && !ocp.statusOCP){
                                                        return true
                                                    } else {
                                                        return false
                                                    }

                                                  
                                                }
                                                if(String("Encerrada").toLowerCase().startsWith(event.target.value.toLowerCase())){
                                                    if(ocp.statusCorrecao && !ocp.analiseStatus && ocp.statusOCP){
                                                        return true
                                                    } else {
                                                        return false
                                                    }

                                                  
                                                }
                                                
                                            }
                                            return ""
        
                                        })
                                    })
                                }
                                }

                                

                    }></Form.Control>
                        </Col>
                   
                        <Col md="auto"  className="text-center text-md-right"  >
                       
    
                        <Form.Check checked={!this.state.showEncerradas}  label={"Encerradas?"} onClick={() => this.filterEncerradas()} ></Form.Check>
                        
                      
                        </Col>
             
                        
                        <Col md="auto">
                            <GenericDropDown display={"Tipo"} margin={10} itens={["Processo", "Etapa","Parametro","Status"]} onChoose={(item) => this.setState({ filterType: item})} style={{ margin: 10 }}>Filtrar </GenericDropDown>
                        </Col>
            
                    </Row>
                </Container>

                <div className="table-responsive">
                <Table id={"ocpTable"}>
                    <TableHead ></TableHead>
                    <TableBody showEncerradas={this.state.showEncerradas} editarOcp={this.editOcp} openCredentialsConfirm={(ocpToAprove) => this.setState({ ocpToAprove: ocpToAprove, details: this.getAproveDetails(ocpToAprove) }, () => this.setState({ show: true }))} openCorrecaoConfirm={(ocpToConfirm) => this.setState({ ocpToConfirm: ocpToConfirm, showCorrecaoConfirm: true })} ocps={this.state.filteredOcps} reanalisar={this.goToReanalise} aprovarOcp={this.aprovarOcp} history={this.props.history}></TableBody>
                </Table>
                </div>

                {this.state.ocpToConfirm && <CorrecaoConfirm closeCorrecaoConfim={() => this.setState({ showCorrecaoConfirm: false })} show={this.state.showCorrecaoConfirm}  statusCorrecao={this.state.ocpToConfirm.statusCorrecao} ocp={this.state.ocpToConfirm} correcaoConfirm={(isOcp, ocpId) => this.correcaoConfirm(isOcp, ocpId, this.state.ocpToConfirm.isAdicao)} correcaoType={this.state.ocpToConfirm.isAdicao ? "adicao" : "acao"}></CorrecaoConfirm>}
                <CredentialConfirm details={this.state.details} aproveOcp={() => this.aprovarOcp()} show={this.state.show} closeCredentialConfirm={() => this.setState({ show: false })}  ></CredentialConfirm>
            </>



        )
    }

}

export default withToastManager(withMenuBar(OrdensDeCorreção))
