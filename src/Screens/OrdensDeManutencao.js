import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Col, Row, Form } from "react-bootstrap";
import ScqApi from "../Http/ScqApi";
import { withToastManager } from "react-toast-notifications";
import DeleteOmpConfirm from "../Components/DeleteOMPConfirm"
import { withMenuBar } from "../Hocs/withMenuBar";
import { downloadOmp } from "../Services/documentsDownload";
import GenericDropDown from "../Components/GenericDropDown";
import { isMobile } from "react-device-detect";


const TableHead = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Download</th>
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

const buttonLayout = (props, omp, statusToken) => {
    if (isMobile) {
        return (
            <>
                <Col>
                    <Button style={{ width: "100%" }} style={{ backgroundColor: "RED", borderColor: "RED" }} onClick={() => props.confirmDeleteDiolog(omp.id)}>Deletar Omp</Button>
                </Col>
                <Col>
                    {statusToken[0] === "concluido"
                        ? <Button style={{ width: "100%" }} onClick={() => {
                            props.verOmp(omp.id)
                        }}>Ver OMP</Button>
                        : <Button style={{ width: "100%" }} onClick={() => {
                            props.encerrarOmp(omp.id)
                        }}>Encerrar OMP</Button>}
                </Col>
            </>
        )
    } else {
        return (
            <Row>
                <Col>
                    <Button style={{ width: "100%" }} style={{ backgroundColor: "RED", borderColor: "RED" }} onClick={() => props.confirmDeleteDiolog(omp.id)}>Deletar Omp</Button>
                </Col>
                <Col>
                    {statusToken[0] === "concluido"
                        ? <Button style={{ width: "100%" }} onClick={() => {
                            props.verOmp(omp.id)
                        }}>Ver OMP</Button>
                        : <Button style={{ width: "100%" }} onClick={() => {
                            props.encerrarOmp(omp.id)
                        }}>Encerrar OMP</Button>}
                </Col>
            </Row>

        )
    }



}



const TableBody = props => {

    const ompTd = props.omps.map((omp, index) => {

        let data = String(omp.dataPlanejada).substr(0, 10)
        let statusToken = omp.status.split(":")
        return (

            <tr style={{ textAlign: "center" }} key={omp.id}>
                <td className="align-middle">{omp.id}</td>
                <td className="align-middle"><Button size={20} onClick={() => downloadOmp(omp)}>Download</Button></td>
                <td className="align-middle" >{omp.nomeProcesso}</td>


                <td className="align-middle">{`${FormatDate(data)}`}</td>
                <td className="align-middle">{omp.emitidoPor}</td>
                <td className="align-middle">
                    <Form.Label style={{ color: statusToken[1], fontWeight: 'bolder' }} >{statusToken[0]}</Form.Label>
                </td>
                <td className="align-middle" >
                    {buttonLayout(props, omp, statusToken)}
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
            omps: [],
            filteredOmps: [],
            showConfirm: false,
            filterType: '',
            trocasChoosedId: [],
            trocasChoosed: [],
            markAllHide: false,
            ompToDelete: null,
            showDeleteConfirm: false,
            deleteRdy: true,
            selection: ''

        }
    }

    componentDidMount() {
        ScqApi.LoadOmps().then(res => this.setState({ omps: res, filteredOmps: res }))
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

        this.setState({ ompToDelete: omp[0], showDeleteConfirm: true }, () => this.setState({ deleteRdy: false }))



    }

    deletarOmp = () => {
        ScqApi.DeleteOmp(this.state.ompToDelete.id).then(() => ScqApi.LoadOmps().then(res => this.setState({ omps: res })))

    }


    filterAction = (filterText) => {
        if (filterText !== "") {
            this.setState({
                filteredOmps: this.state.omps.filter((omp) => {
                    if (this.state.filterType === "Processo") {
                        return String(omp.nomeProcesso).toLowerCase().includes(filterText.toLowerCase())
                    }

                    if (this.state.filterType === "Status") {

                        return String(omp.status).toLowerCase().includes(filterText.toLowerCase())



                    }

                    return ""

                }),
                selection: filterText
            })
        } else {
            this.setState({
                filteredOmps: this.state.omps
            })
        }

    }





    render() {
        return (
            <>

                <Container >
                    <DeleteOmpConfirm show={this.state.showDeleteConfirm} deletarOmp={this.deletarOmp} omp={this.state.ompToDelete} handleClose={() => { this.setState({ showDeleteConfirm: false }) }}></DeleteOmpConfirm>
                    <Row className="justify-content-md-center">
                        <Col>
                            <Form.Control placeholder="filtrar por..." style={{ margin: 10 }} onChange={(event) => this.filterAction(event.target.value)
                            }></Form.Control>
                        </Col>
                        <Col md="auto">
                            <GenericDropDown display={"Tipo"} margin={10} itens={["Processo", "Status"]} onChoose={(item) => this.setState({ filterType: item })} style={{ margin: 10 }}>Filtrar </GenericDropDown>
                        </Col>

                    </Row>
                </Container>
                <div className="table-responsive">
                    <Table >
                        <TableHead></TableHead>

                        <TableBody setTrocaToList={this.addTrocaIdToChoosedIdList} filterType={this.state.filterType} selection={this.state.selection} omps={this.state.filteredOmps} encerrarOmp={this.encerrarOmp} verOmp={this.verOmp} confirmDeleteDiolog={this.confirmDeleteDiolog}  ></TableBody>

                    </Table>
                </div>


            </>

        )
    }

}

export default withToastManager(withMenuBar(Trocas))
