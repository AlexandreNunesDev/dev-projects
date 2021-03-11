import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Col, Form } from "react-bootstrap";
import ScqApi from "../Http/ScqApi";
import { withToastManager } from "react-toast-notifications";
import GenericSelect from "../Components/GenericSelect";
import GenericDropDown from "../Components/GenericDropDown";
import { withMenuBar } from "../Hocs/withMenuBar";


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
        let check = props.markedTarefas.includes(tarefa.id)
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

                    <Form.Check.Input checked={check} onChange={(event) => props.setTarefaToList(event.target.checked, tarefa)} type="checkbox" />
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
            filterType : "",
            markedTarefas : []


        }
    }

    componentDidMount() {
        ScqApi.ListaProcessos().then(res => this.setState({ processos: res }))
    }


    
    addTarefaIdToList = (checked, tarefa) => {

        if (checked) {
            this.setState((prevState) => ({
                markedTarefas : [...prevState.markedTarefas,...[tarefa.id]]
            }),()=>console.log(this.state.markedTarefas));

        } else {

            const removedMarkedId = this.state.markedTarefas.filter((value) => {
                return Number(value) !== Number(tarefa.id)
            })

            this.setState({
                markedTarefas : removedMarkedId
            
            }, () => console.log(this.state.markedTarefas) )
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

    pushWithSelectedTarefas = () => {
        let choosedTarefas = []



        for (const tarefaId of this.state.markedTarefas) {
            choosedTarefas = [...choosedTarefas,...this.state.tarefas.filter(value =>  Number(value.id) === Number(tarefaId))]
        }

       
        this.props.history.push("/CadastroOmp",{tarefasChecked : true,tarefas:choosedTarefas, markedIds :  this.state.markedTarefasId})

    }


    markAll = () => {
        this.setState({
            markedTarefas : []
        })
        this.state.tarefas.forEach(tarefa => {
            this.addTarefaIdToList(true, tarefa)
        })
    }

    unmarkAll = () => {
        this.state.tarefas.forEach(tarefa => {
            this.addTarefaIdToList(false, tarefa)
        })
    }


    
    filterAction = (filterText) => {
        if(filterText!=="" && this.state.filterType !==""){
            this.setState({
                filteredTarefas: this.state.tarefas.filter((tarefa) => {
                    if(this.state.filterType==="Nome"){
                        return String(tarefa.nome).includes(filterText)
                    }
                    if(this.state.filterType==="Status"){
                        return String(tarefa.status).includes(filterText)
                    }
                    if(this.state.filterType==="Data"){
                        return String(tarefa.dataPlanejada).includes(filterText)
                    }
                    return ""

                })
            })
        } else {
            this.setState({
                filteredTroca : this.state.trocas
            })
        }

   }




    render() {
        return (
            <>
    
                <Container>
                    <Form.Row style={{padding : 10}}>
                        <Col >
                            <GenericSelect noLabel={true} title={"Processo"}   returnType={"id"} default={"Escolha um Processo"} onChange={(processoId) => this.loadTarefas(processoId)} ops={this.state.processos}  ></GenericSelect>
                        </Col>
                        <Col>
                           
                            <Form.Control placeholder="buscar por nome..." onChange={(event) => this.filterAction(event.target.value)}></Form.Control>
                        </Col>
                        
                        <Col md="auto" >
                            <GenericDropDown display={"Tipo"}   itens={["Nome","Status","Data"]} onChoose={(item) => this.setState({filterType : item})} style={{margin : 10}}>Filtrar </GenericDropDown>
                       </Col>
                        <Col>
                            <Button onClick={() => {
                               this.pushWithSelectedTarefas()
                            }} >Gerar OMP</Button>
                        </Col>
                        <Col md="auto">
                            <Button hidden={this.state.markAllHide}  onClick={() => { this.markAll(); this.setState({ markAllHide: true }) }}>Selecionar Todos</Button>
                            <Button hidden={!this.state.markAllHide}  onClick={() => { this.unmarkAll(); this.setState({ markedTarefas: [], markAllHide: false }) }}>Desmarcar Todos</Button>
                        </Col>
                    </Form.Row>

                </Container>
                <Table className="table table-hover">
                    <TableHead></TableHead>
                    <tbody>
                        <TableBody setTarefaToList={this.addTarefaIdToList} tarefas={this.state.filteredTarefas} markedTarefas={this.state.markedTarefas} tarefasChoosed={this.state.tarefasChoosed} ></TableBody>
                    </tbody>
                </Table>



            </>

        )
    }

}

export default withToastManager(withMenuBar(TarefasDeManutencao))
