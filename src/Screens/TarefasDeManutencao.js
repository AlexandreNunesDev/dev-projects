import React from "react"

import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Col, Form } from "react-bootstrap";
import MenuBar from "./MenuBar";
import ScqApi from "../Http/ScqApi";


import { withToastManager } from "react-toast-notifications";
import GenericSelect from "../Components/GenericSelect";


const TableHead = () => {
    return (

        <thead >
            <tr style={{ textAlign: "center" }}>
                <th>Id</th>
                <th>Nome</th>
                <th>Instrução</th>
                <th>Data Planejada</th>
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

    const trocaTd = props.tarefas.map((tarefa, index) => {
        let check = props.markedTarefa.includes(tarefa.id)
        let data = String(tarefa.dataPlanejada).substr(0, 10)

        return (

            <tr style={{ textAlign: "center" }} key={tarefa.id}>
                <td className="align-middle">{tarefa.id}</td>
                <td className="align-middle">{tarefa.nome}</td>
                <td className="align-middle">{tarefa.codigo}</td>
                <td className="align-middle">{`${FormatDate(data)}`}</td>
                <td className="align-middle">
                    <Form.Label style={{ color: tarefa.pendente ? 'red' : 'green', fontWeight: 'bolder' }} >{tarefa.pendente ? "Pendente" : 'Em dia'}</Form.Label>
                </td>
                <td className="align-middle" >

                    <Form.Check.Input checked={check} onChange={(event) => props.setTarefaToList(event.target.checked, tarefa.id)} type="checkbox" />
                    <Form.Check.Label>Executar ?</Form.Check.Label>



                </td>
            </tr>
        )
    })

    return trocaTd

}



class TarefasDeManutencao extends React.Component {


    constructor(props) {
        super()
        this.state = {
            processos: [],
            tarefas: [],
            filteredTarefas: [],
            tarefaChoosedId: [],


        }
    }

    componentDidMount() {
        ScqApi.ListaProcessos().then(res => this.setState({ processos: res }))
    }

    addTarefaIdToList = (checked, id) => {

        if (checked) {


            this.setState({
                tarefaChoosedId: this.state.tarefaChoosedId.concat(id)
            }, () => console.log(this.state.tarefaChoosedId))

        } else {

            const removedArray = this.state.tarefaChoosedId.filter((value) => {
                return Number(value) !== Number(id)
            })
            this.setState({
                tarefaChoosedId: removedArray
            }, () => console.log(this.state.tarefaChoosedId))
        }

    }



    loadTarefas = (processoId) => {
        ScqApi.ListaTarefasByProcesso(processoId).then(res => {
            this.setState({
                tarefas: res,
                filteredTarefas: res
            })
        })
    }








    render() {
        return (
            <>
                <header>
                    <MenuBar></MenuBar>
                </header>
                <Container>
                    <Form.Row style={{padding : 10}}>
                        <Col >
                            <GenericSelect noLabel={true} title={"Processo"} returnType={"id"} default={"Escolha um Processo"} onChange={(processoId) => this.loadTarefas(processoId)} ops={this.state.processos}  ></GenericSelect>
                        </Col>
                        <Col>
                           
                            <Form.Control placeholder="filtrar por..." onChange={(event) => this.setState({
                                filteredTarefas: this.state.tarefas.filter((tarefa) => {
                                        return String(tarefa.nome).includes(event.target.value)
                                })
                            })}></Form.Control>
                        </Col>
                        <Col>
                            <Button onClick={() => {
                               this.props.history.push("/CadastroOmp",this.state.tarefas)
                            }} >Gerar OMP</Button>
                        </Col>
                    </Form.Row>

                </Container>
                <Table className="table table-hover">
                    <TableHead></TableHead>
                    <tbody>
                        <TableBody setTarefaToList={this.addTarefaIdToList} tarefas={this.state.filteredTarefas} markedTarefa={this.state.tarefaChoosedId} ></TableBody>
                    </tbody>
                </Table>



            </>

        )
    }

}

export default withToastManager(TarefasDeManutencao)
