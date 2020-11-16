import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Col, Row, Form } from "react-bootstrap";
import MenuBar from "./MenuBar";
import ScqApi from "../Http/ScqApi";

import { withToastManager } from "react-toast-notifications";
import DeleteOmpConfirm from "../Components/DeleteOMPConfirm"


const TableHead = () => {
    return (

        <thead >
            <tr style={{textAlign: "center"}}>
                <th>Id</th>
                <th>Processo</th>
                <th>Data Planejada</th>
                <th>Emitido por</th>
                <th>Status</th>
                <th>Encerrar</th>
            </tr>
        </thead>

    )
}

const FormatDate = (data) => {
    const dataTokens = String(data).split("-");
    return dataTokens[2] + "-" + dataTokens[1] + "-" + dataTokens[0]

}

const TableBody = props => {

      const ompTd = props.omps.map((omp,index) => {

        let data = String(omp.dataPlanejada).substr(0,10)
        
    return (
        
        <tr style={{textAlign: "center"}} key={omp.id}>
            <td className="align-middle">{omp.id}</td>
            <td className="align-middle">{omp.nomeProcesso}</td>
           
         
            <td className="align-middle">{`${FormatDate(data)}`}</td>
            <td className="align-middle">{omp.emitidoPor}</td>
            <td className="align-middle">
                <Form.Label style={{color : omp.status==="atrasado" ? 'red' : 'green', fontWeight : 'bolder'}} >{omp.status}</Form.Label>
            </td>
            <td className="align-middle" >
                <Form.Row>

                <Col>
                    <Button style={{backgroundColor : "RED" , borderColor : "RED"}}  onClick={() => props.confirmDeleteDiolog(omp.id)}>Deletar Omp</Button>
                  
                </Col>
                <Col>
                {omp.status==="concluido" 
                ? <Button onClick={() => {
                    props.verOmp(omp.id)
                }}>Ver OMP</Button> 
                :<Button onClick={() => {
                    props.encerrarOmp(omp.id)
                }}>Encerrar OMP</Button>}
                </Col>
                </Form.Row>
            </td>
        </tr>
        )
    })

    return ompTd

}



class Trocas extends React.Component {


    constructor(props) {
        super()
        this.state = {
            omps : [],
            showConfirm : false,
            filterType : '',
            trocasChoosedId : [],
            trocasChoosed : [],
            markAllHide : false,
            ompToDelete : null,
            showDeleteConfirm : false,
            deleteRdy : true

        }
    }

    componentDidMount(){
      ScqApi.LoadOmps().then(res => this.setState({omps : res}))
    }

    encerrarOmp = (ompId) => {
        const omp = this.state.omps.filter(ordem => {
            return ordem.id === ompId
        })
        this.props.history.push("/FinalizarOmp", omp[0])
       
    }

    verOmp = (ompId) => {
        const omp = this.state.omps.filter(ordem => {
            return ordem.id === ompId
        })
        this.props.history.push("/VerOmp", omp[0])
       
    }

    confirmDeleteDiolog = (ompId) => {
        const omp = this.state.omps.filter(ordem => {
            return ordem.id === ompId
        })

        this.setState({ompToDelete : omp[0] , showDeleteConfirm : true}, () => this.setState({deleteRdy : false}))
        
        
       
    }

    deletarOmp = () => {
        ScqApi.DeleteOmp(this.state.ompToDelete.id).then(() =>  ScqApi.LoadOmps().then(res => this.setState({omps : res})))
       
    }

   




    

    render() {
        return (
            <>
                <header>
                    <MenuBar></MenuBar>
                </header>
                    <Container >
                    <DeleteOmpConfirm show={this.state.showDeleteConfirm} deletarOmp={this.deletarOmp} omp={this.state.ompToDelete} handleClose={() => {this.setState({showDeleteConfirm : false})}}></DeleteOmpConfirm>
                        <Row className="justify-content-md-center">
                       
                   
                       </Row>
                    </Container>
                    <Table className="table table-hover">
                        <TableHead></TableHead>
                        <tbody>
                        <TableBody setTrocaToList={this.addTrocaIdToChoosedIdList} omps={this.state.omps} encerrarOmp={this.encerrarOmp} verOmp={this.verOmp} confirmDeleteDiolog={this.confirmDeleteDiolog}  ></TableBody>
                        </tbody>
                    </Table>
                    
                    
            </>

        )
    }

}

export default withToastManager(Trocas)
