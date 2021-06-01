import React from 'react'
import {Modal, Navbar, Nav, NavDropdown, Badge, Button, Dropdown, Card, NavItem, Image, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScqApi from '../Http/ScqApi';
import scqlogo from '../logoscq.png';
import { withToastManager } from 'react-toast-notifications';
import { getUserName, getUserRole, isAuthenticated} from '../Services/auth';
import { connect } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from "../mapDispatch/mapDispathToProps";



class MenuBar extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      notifications: [],
      user: {},
      show : false
    }
  }


  showNotificationsReponse = (message) => {
    const { toastManager } = this.props;
    const status = message.split(":");
    let appearance = status.shift();
    let trueMessage = Array(status).pop();
    toastManager.add(trueMessage, {
      appearance: appearance, autoDismiss: true
    })
  }

  

  resolveNotificacao = (notificacao) => {
    ScqApi.EditarNotificacao(notificacao.id).then(data => this.showNotificationsReponse(data))

    const newNotificationList = this.state.notifications.filter((notification) => {
      return notification.id !== notificacao.id
    })
    this.setState({
      notifications: newNotificationList
    })
  }








  render() {

    if (getUserRole() === "ADMIN_ROLE") {
      return (
        <>
          <div className='App tc f3'>
          <Navbar bg="light" expand="lg" >
            {/* <Navbar.Brand href="/home"  >S.C.Q</Navbar.Brand> */}
            <Image height={50} width={80} src={scqlogo} rounded />

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/Home">Home</Nav.Link>
                <Nav.Link href="/Login">{!isAuthenticated() ? "Login" : "Logout"}</Nav.Link>
                <Nav.Link href="/RegistroAnalise">Registro de Analise</Nav.Link>
                <Nav.Link href="/OrdensDeCorrecao">Ordens de Correção</Nav.Link>
                <Nav.Link href='/Omp' >OMP</Nav.Link>
                <Nav.Link href="/TarefasDeManutencao" >Tarefas de Manutenção</Nav.Link>
                <Nav.Link href="/IndicadorDeAnalise">Indicador de Analises</Nav.Link>

                <NavDropdown title="Cadastros" id="basic-nav-dropdown">

                  <NavDropdown.Item href="/CadastroProcesso">Processo</NavDropdown.Item>
                  <NavDropdown.Item href="/CadastroEtapa">Etapa</NavDropdown.Item>
                  <NavDropdown.Item href="/CadastroParametro">Parametro</NavDropdown.Item>
                  <NavDropdown.Item href="/CadastroMateriaPrima">Matéria Prima</NavDropdown.Item>
                  <NavDropdown.Item href="/CadastroTroca">Trocas</NavDropdown.Item>
                  <NavDropdown.Item href="/CadastroTarefasDeManutencao">Tarefas de Manutenção</NavDropdown.Item>
                  <NavDropdown.Item href="/Registrar">Novo usuario</NavDropdown.Item>
                </NavDropdown>

              </Nav>

            </Navbar.Collapse>
            <NavItem style={{ marginRight: 20 }}>Usuario: {getUserName()}</NavItem>
  
        

              <Button onClick={() => this.setState((prevState, props) => ({
  show : true
}))}  >Notificacoes <Badge variant="light">{this.props.notifications.length}</Badge></Button>
                <Modal show={this.state.show} onHide={() => this.setState({show : false})}>
                  <Modal.Body>

                  

               
                 {this.props.notifications.map((notificacao,index) => {
                  let firstWord = notificacao.messagem.substr(0, notificacao.messagem.indexOf(":"));
                  return (
                   <Row key={index} >

                 
                      <Card  >
                        <Card.Header>{notificacao.id} Notificacao de {firstWord}</Card.Header>
                        <Card.Body>
                          <Card.Text>
                            {notificacao.messagem}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                      </Row>
  
                  )
                })}
                </Modal.Body>
                 </Modal>




          </Navbar>

          </div>
        </>
      )
    } else if (getUserRole() === "USER_ROLE") {
      return (
        <>

          <Navbar bg="light" expand="lg">
            <Image height={50} width={80} src={scqlogo} rounded />

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/Home">Home</Nav.Link>
                <Nav.Link href="/Login">{!isAuthenticated() ? "Login" : "Logout"}</Nav.Link>
                <Nav.Link href="/RegistroAnalise">Registro de Analise</Nav.Link>
                <Nav.Link href="/OrdensDeCorrecao">Ordens de Correção</Nav.Link>
                <Nav.Link href='/Omp'>Omp</Nav.Link>
                <Nav.Link href="/TarefasDeManutencao" >Tarefas de Manutenção</Nav.Link>
                <Nav.Link href="/IndicadorDeAnalise">Indicador de Analises</Nav.Link>

              </Nav>

            </Navbar.Collapse>
            <NavItem style={{ marginRight: 20 }}>Usuario: {getUserName()}</NavItem>
            <Dropdown drop="left" navbar={true}>

              <Dropdown.Toggle>Notificacoes <Badge variant="light">{this.state.notifications.length}</Badge></Dropdown.Toggle>
              <Dropdown.Menu>
                {this.state.notifications.map((notificacao) => {
                  let firstWord = notificacao.messagem.substr(0, notificacao.messagem.indexOf(":"));
                  return (
                    <Dropdown.Item key={notificacao.id}>
                      <Card>
                        <Card.Header>{notificacao.id} Notificacao de {firstWord}</Card.Header>
                        <Card.Body>
                          <Card.Text>
                            {notificacao.messagem}
                          </Card.Text>
                          <Button variant="primary" onClick={() => this.resolveNotificacao(notificacao)}>Resolvido</Button>
                        </Card.Body>
                      </Card>
                    </Dropdown.Item>
                  )
                })}

              </Dropdown.Menu>

            </Dropdown>

          </Navbar>


        </>

      )

    } else {

      return (
        <>
          <Navbar bg="light" expand="lg">
            <Image height={50} width={80} src={scqlogo} rounded />

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/Home">Home</Nav.Link>

                <Nav.Link href="/Login">{!isAuthenticated() ? "Login" : "Logout"}</Nav.Link>
              </Nav>

            </Navbar.Collapse>
          </Navbar>
        </>)
    }






  }

}

export default withToastManager(connect(mapToStateProps.toProps,dispatchers)(MenuBar));