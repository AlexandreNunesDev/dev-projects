import React, { Component} from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button} from "react-bootstrap";
import MenuBar from "./MenuBar";
import ScqApi from "../Http/ScqApi";

import CredentialConfirm from '../Components/CredentialConfirm'
import CorrecaoConfirm from "../Components/CorrecaoConfirm";
import { withToastManager } from "react-toast-notifications";


const TableHead = () => {
    return (

        <thead >
            <tr>
                <th>Id</th>
                <th>Linha</th>
                <th>Parametro</th>
                <th>Faixa mínima</th>
                <th>Faixa máxima</th>
                <th>Resultado</th>
                <th colSpan="3" style={{ textAlign: "center" }}>Status</th>
            </tr>
        </thead>

    )
}

const TableBody = (props) => {



    let ocpTd = props.ocps.map((ocp,index) => {

    return (
        
        <tr key={ocp}>
           
            <td>{ocp.id}</td>
            <td>{ocp.linhaNome}</td>
            <td>{ocp.etapaNome}</td>
            <td>{`${ocp.pMin} ${ocp.unidade}`}</td>
            <td>{`${ocp.pMax}  ${ocp.unidade}`}</td>
            <td>{`${ocp.resultado}  ${ocp.unidade}`}</td>
            <td><Button disabled={ocp.statusCorrecao} style = {{ backgroundColor : ocp.statusCorrecao ? '#42f59e' : 'GRAY', borderColor :  ocp.statusCorrecao ? '#42f59e' : 'GRAY'  } } onClick={() => props.openCorrecaoConfirm(ocp)}>Corrigir</Button></td>
            <td><Button disabled={!ocp.analiseStatus} style = {{ backgroundColor : ocp.analiseStatus ?  'GRAY' : '#42f59e' , borderColor :  ocp.analiseStatus ?  'GRAY' : '#42f59e' } } onClick={() => props.reanalisar(ocp.analiseId,ocp.id)}>Reanalisar</Button></td>
            <td><Button style = {{ backgroundColor : ocp.ocpStatus ? '#42f59e' : 'GRAY', borderColor :  ocp.ocpStatus ? '#42f59e' : 'GRAY' } } onClick={() => props.openCredentialsConfirm(ocp)}>Aprovar</Button></td>
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
            ocps : [],
            codigoCorrecao : '',
            toastManager : toastManager,
            show : false,
            details : ''
        }
    }

  

    componentDidMount(){
       this.lodadOcps()
    }

    lodadOcps = () => {
        ScqApi.ListaOcps().then(res => {
            this.setState({
                ocps : res,
                ocpConfirm : {}
            })
        })
    }

    openCredentialsConfirm = (ocp) => {
        const details = this.getAproveDetails(ocp)
        this.setState({show : true, details : details})
    }

    goToReanalise = (analiseId,ocpId) => {
        ScqApi.LoadReanalise(analiseId).then(res => this.redirectAnalise(this.props.history,res,ocpId))
    }

    redirectAnalise = (history, analise,ocpId) => {
       
       history.push("/RegistroAnalise" , [analise,ocpId])
    }

    getAproveDetails = (ocp) => {
        let text = `Aprovar OCP ${ocp.parametroNome} ${ocp.resultado}${ocp.unidade} \n
        |Faixa Especificada ${ocp.pMin} a ${ocp.pMax}| ? `
        let newText = text.split("\n").map((item, i) => {
            return <p key={i}>{item}</p>;
            });
        return newText
    }


    correcaoConfirm = (isOcp,ocpId,isAdicao) => {

        
        
        if(isOcp){
            if(isAdicao){
                ScqApi.AdicaoCorrigir(ocpId).then(()=> window.location.reload())
               
   
            } else {
                ScqApi.AcaoCorrigir(ocpId).then(()=> window.location.reload())

            }
            
            
        } else {
            this.state.toastManager.add("Codigo OCP inserido estado errado", {
                appearance: 'error', autoDismiss: true
           
        })
    }
    
        
    }


    aprovarOcp = () => {
        ScqApi.AprovarOcp(this.state.ocpToAprove.id).then(this.setState({show : false},() => window.location.reload()))
    }



    

    

    render() {
        return (
            <>
                <header>
                    <MenuBar></MenuBar>
                </header>
                	
                 
                       <Table>
                       <TableHead></TableHead>
                       <tbody>
                       <TableBody openCredentialsConfirm={(ocpToAprove) => this.setState({ocpToAprove : ocpToAprove , details : this.getAproveDetails(ocpToAprove)},()=> this.setState({show : true}))}  openCorrecaoConfirm={(ocpToConfirm) => this.setState({ocpToConfirm : ocpToConfirm, showCorrecaoConfirm : true}) }  ocps={this.state.ocps} reanalisar={this.goToReanalise} aprovarOcp={this.aprovarOcp}></TableBody>
                       </tbody>
                   </Table>
                   {this.state.ocpToConfirm && <CorrecaoConfirm closeCorrecaoConfim={() => this.setState({show : false})} show={this.state.showCorrecaoConfirm} statusCorrecao={this.state.ocpToConfirm.statusCorrecao} ocpId={this.state.ocpToConfirm.id} correcaoConfirm={(isOcp,ocpId) => this.correcaoConfirm(isOcp,ocpId,this.state.ocpToConfirm.isAdicao)} correcaoType={this.state.ocpToConfirm.isAdicao ? "adicao" : "acao"}></CorrecaoConfirm>}
                   <CredentialConfirm details={this.state.details} aproveOcp={() => this.aprovarOcp() } show={this.state.show} closeCredentialConfirm={() => this.setState({show : false})}  ></CredentialConfirm>
                    </>
                    
             

        )
    }

}

export default withToastManager(OrdensDeCorreção)
