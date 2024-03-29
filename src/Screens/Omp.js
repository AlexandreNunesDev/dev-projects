import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Col, Row, Form } from "react-bootstrap";
import ScqApi from "../Http/ScqApi";
import GenericDropDown from "../Components/GenericDropDown";
import { withToastManager } from "react-toast-notifications";
import { withMenuBar } from "../Hocs/withMenuBar";
import GenericSelect from "../Components/GenericSelect";
import { connect } from "react-redux";
import mapToStateProps from "../mapStateProps/mapStateToProps";
import dispatchers from "../mapDispatch/mapDispathToProps";


const TableHead = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Processo</th>
                <th>Etapa</th>
                <th>Data Planejada</th>
                <th>Produtos</th>
                <th>Status</th>
                <th>Selecionar</th>
            </tr>
        </thead>

    )
}

const FormatDate = (data) => {
    const dataTokens = String(data).split("-");
    return dataTokens[2] + "-" + dataTokens[1] + "-" + dataTokens[0]

}

const TableBody = props => {

    const trocaTd = props.trocas.map((troca, index) => {
        let check = props.markedTroca.includes(troca.id)
        let data = String(troca.dataPlanejada).substr(0, 10)

        return (

            <tr style={{ textAlign: "center" }} key={troca.id}>
                <td className="align-middle">{troca.id}</td>
                <td className="align-middle">{troca.processoNome}</td>
                <td className="align-middle">{troca.etapaNome}</td>
                <td className="align-middle">{`${FormatDate(data)}`}</td>
                <td className="align-middle" key={troca.id} >
                    {troca.listaMontagens.map((pair, index) => {
                        return <div key={index}>{`${pair[0]} : ${pair[1]} ${pair[2]}`} </div>
                    })}
                </td>
                <td className="align-middle">
                    <Form.Label style={{ color: troca.pendente ? 'red' : 'green', fontWeight: 'bolder' }} >{troca.pendente ? "Pendente" : 'Em dia'}</Form.Label>
                </td>
                <td className="align-middle" >

                    <Form.Check checked={check} onChange={(event) => props.setTrocaToList(event.target.checked, troca.id)} type="checkbox" />
                    <Form.Label>Trocar ?</Form.Label>



                </td>
            </tr>
        )
    })

    return trocaTd

}



class Omp extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            trocas: [],
            filteredTroca: [],
            showConfirm: false,
            filterType: '',
            trocasChoosedId: [],
            trocasChoosed: [],
            markAllHide: false,
            filterText: '',
            processoId: null


        }
    }

    componentDidMount() {
        this.loadTrocas()
    }

    addTrocaIdToChoosedIdList = (checked, clickeTroca) => {

        if (!clickeTroca.programada) {
            if (checked) {


                this.setState((prevState) => ({
                    trocasChoosedId: [...prevState.trocasChoosedId, ...[clickeTroca]]
                }), () => console.log(this.state.trocasChoosedId));

            } else {

                const removedArray = this.state.trocasChoosedId.filter((value) => {
                    return Number(value) !== Number(clickeTroca)
                })
                this.setState({
                    trocasChoosedId: removedArray
                }, () => console.log(this.state.trocasChoosedId))
            }
        } else {
            const { toastManager } = this.props
            toastManager.add("Esta troca ja foi programada", {
                appearance: 'warning', autoDismiss: true
            })
        }



    }

    buildTrocasChoosedArray = () => {
        const TrocasChoosedArray = this.state.trocasChoosedId.map(id => {
            const trocaChoosed = this.state.trocas.filter(troca => {
                return Number(troca.id) === Number(id)
            })

            return trocaChoosed[0];
        })


        if (this.validateTrocasByProcesso(TrocasChoosedArray)) {

            this.props.history.push("/CadastroOmp", { trocas: TrocasChoosedArray })

        } else {
            const { toastManager } = this.props
            toastManager.add("Voce não pode gerar uma OMP de diferentes processos", {
                appearance: 'error', autoDismiss: true
            })
        }


    }

    validateTrocasByProcesso = (TrocasChoosedArray) => {
        let isEquals = true;
        let beforeId = 0;

        TrocasChoosedArray.forEach(element => {
            if (beforeId === 0) {
                beforeId = Number(element.processoId)
            } else {
                Number(element.processoId) === beforeId ? isEquals = true : isEquals = false
            }

        });


        if (isEquals) {
            return true;
        } else {
            return false;
        }
    }

    loadTrocas = () => {
        ScqApi.ListaTrocas().then(res => {
            this.setState({
                trocas: res,
                filteredTroca: res
            })
        })
    }

    markAll = () => {
        this.setState({
            trocasChoosedId: []
        })
        this.state.filteredTroca.forEach(troca => {
            this.addTrocaIdToChoosedIdList(true, troca.id)
        })
    }

    unmarkAll = () => {
        this.state.trocas.forEach(troca => {
            this.addTrocaIdToChoosedIdList(false, troca.id)
        })
    }

    showPendentes = (checked) => {

        if (checked) {
            this.setState({
                filteredTroca: this.state.trocas.filter((troca) => {
                    return troca.pendente === true
                })
            })
        } else {
            this.setState({
                filteredTroca: this.state.trocas
            })
        }

    }

    filterAction = (filterText) => {
        let tofilterTrocas = this.state.processoId ? this.filterByGlobalProcesso(this.state.processoId) : this.state.trocas
        if (filterText !== "") {
            this.setState({
                filteredTroca: tofilterTrocas.filter((troca) => {
                    if (this.state.filterType === "Processo") {
                        return String(troca.processoNome).toLowerCase().includes(filterText.toLowerCase())
                    }
                    if (this.state.filterType === "Etapa") {
                        return String(troca.etapaNome).toLowerCase().includes(filterText.toLowerCase())
                    }
                    if (this.state.filterType === "Status") {
                        if (String("Pendente").toLowerCase().trim().startsWith(filterText.toLowerCase().trim())) {
                            return troca.pendente === true
                        }
                        if (String("Em dia").toLowerCase().trim().startsWith(filterText.toLowerCase().trim())) {
                            return troca.pendente === false
                        }


                    }

                    return ""

                })
            })
        } else {
            this.state.processoId ? this.filterByGlobalProcesso(this.state.processoId) : this.setState({
                filteredTroca: this.state.trocas
            })

        }

    }


    filterByGlobalProcesso = (processoId) => {
        let filteredTrocas = this.state.trocas.filter(troca => Number(troca.processoId) === Number(processoId))
        this.setState({
            processoId: processoId,
            filteredTroca: filteredTrocas
        })
        return filteredTrocas
    }






    render() {
        return (
            <>


                <Row className="align-items-center">

                    <Col md="auto">
                        <Button disabled={this.state.trocasChoosedId.length !== 0 ? false : true} style={{ margin: 10 }} onClick={() => {
                            this.buildTrocasChoosedArray()
                        }}>Gerar OMP</Button>
                    </Col>

                    <Col style={{paddingTop : 20}} md="auto">
                        <GenericSelect noLabel={true} default={"--Selecione um Processo--"} onChange={(processoId) => this.filterByGlobalProcesso(processoId)} ops={this.props.processos} displayType={"nome"} returnType={"id"}></GenericSelect>
                    </Col>

                    <Col md="auto">
                        <Button hidden={this.state.markAllHide} style={{ margin: 10 }} onClick={() => { this.markAll(); this.setState({ markAllHide: true }) }}>Selecionar Todos</Button>
                        <Button hidden={!this.state.markAllHide} style={{ margin: 10 }} onClick={() => { this.unmarkAll(); this.setState({ trocasChoosedId: [], markAllHide: false }) }}>Desmarcar Todos</Button>
                    </Col>

                    <Col>
                        <Form.Control placeholder="filtrar por..." style={{ margin: 10 }} onChange={(event) => this.filterAction(event.target.value)
                        }></Form.Control>
                    </Col>
                    <Col md="auto">
                        <GenericDropDown display={"Tipo"} margin={10} itens={["Processo", "Etapa", "Status"]} onChoose={(item) => this.setState({ filterType: item })} style={{ margin: 10 }}>Filtrar </GenericDropDown>
                    </Col>
                    <Col md="auto">
                        <Button style={{ margin: 10 }} onClick={() => this.props.history.push("/OrdensDeManutencao")}>Ver Ordens</Button>
                    </Col>
                </Row>
                <div className="table-responsive">


                    <Table className="table table-hover" >
                        <TableHead></TableHead>
                        <tbody>
                            <TableBody setTrocaToList={this.addTrocaIdToChoosedIdList} trocas={this.state.filteredTroca} markedTroca={this.state.trocasChoosedId}></TableBody>
                        </tbody>


                    </Table>
                </div>




            </>

        )
    }

}

export default withToastManager(withMenuBar(connect(mapToStateProps.toProps, dispatchers)(Omp)))
