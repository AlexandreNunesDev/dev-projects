import React from 'react'
import { Modal, Navbar, Nav, NavDropdown, Badge, Button, Card, NavItem, Image, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ScqApi from '../Http/ScqApi';
import scqlogo from '../img/logoscq.png';
import { withToastManager } from 'react-toast-notifications';
import { logout } from '../Services/auth';
import { connect } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from "../mapDispatch/mapDispathToProps";
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';

class MenuBar extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      notifications: [],
      user: {},
      show: false,

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


  logUserOut() {
    this.props.setLogOut()
    logout()
  }







  render() {

    if (this.props.global.userRole === "ADMIN_ROLE") {

      return (
        <>
          <div className='App tc f3'>
            <Navbar bg="light" expand="lg" >
              {/* <Navbar.Brand href="/home"  >S.C.Q</Navbar.Brand> */}
              <Image height={50} width={80} src={scqlogo} rounded />

              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Link className="nav-link" to="/Home">Home</Link>
                  <Link className="nav-link" to={!this.props.global.isAuth ? "/Login" : "/Home"} onClick={() => this.props.global.isAuth && this.logUserOut()}>{!this.props.global.isAuth ? "Login" : "Logout"}</Link>
                  <NavDropdown title="Registros" id="basic-nav-dropdown">
                    <Link className="nav-link" to="/RegistroAnalise">Registro de Analise</Link>
                    <Link className="nav-link" to="/RegistroAnaliseMulti">Multi Registro de Analise</Link>
                    <Link className="nav-link" to="/RegistroTempo">Registro de Tempo</Link>
                  </NavDropdown>
                  <Link className="nav-link" to="/OrdensDeCorrecao">Ordens de Correção</Link>
                  <Link className="nav-link" to='/Omp' >OMP</Link>
                  <Link className="nav-link" to="/TarefasDeManutencao" >Tarefas de Manutenção</Link>

                  <NavDropdown title="Consultas" id="basic-nav-dropdown">
                    <Link className="nav-link" to="/IndicadorDeAnalise">Indicador de Analises</Link>
                    <Link className="nav-link" to="/IndicadorDeOmp">Indicador de Omp</Link>
                    <Link className="nav-link" to="/HistoricoDeAnalise">Historico de Analises</Link>
                  </NavDropdown>
                  <NavDropdown title="Cadastros" id="basic-nav-dropdown">
                    <Link className="dropdown-item" to="/CadastroProcesso">Processo</Link>
                    <Link className="dropdown-item" to="/CadastroEtapa">Etapa</Link>
                    <Link className="dropdown-item" to="/CadastroParametro">Parametro</Link>
                    <Link className="dropdown-item" to="/CadastroMateriaPrima">Matéria Prima</Link>
                    <Link className="dropdown-item" to="/CadastroTroca">Troca</Link>
                    <Link className="dropdown-item" to="/CadastroTarefasDeManutencao">Tarefa de Manutenção</Link>
                    <Link className="dropdown-item" to="/CadastroTurno">Turno</Link>
                    <Link className="dropdown-item" to="/Registrar">Novo usuario</Link>
                  </NavDropdown>
                </Nav>

              </Navbar.Collapse>

              {!isMobile && <NavItem style={{ marginRight: 20 }}>Usuario: {this.props.global.userName}</NavItem>}


              <NavItem>{isMobile ? <Button onClick={() => this.setState((prevState, props) => ({
                show: true
              }))}  ><Badge variant="light">{this.props.notifications.length}</Badge></Button> : <Button onClick={() => this.setState((prevState, props) => ({
                show: true
              }))}  >Notificacoes <Badge variant="light">{this.props.notifications.length}</Badge></Button>}</NavItem>

              <Modal show={this.state.show} onHide={() => this.setState({ show: false })}>
                <Modal.Body>
                  {this.props.notifications.map((notificacao, index) => {
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
    } else if (this.props.global.userRole === "USER_ROLE") {
      return (
        <>

          <Navbar bg="light" expand="lg">
            <Image height={50} width={80} src={scqlogo} rounded />

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">

              <Nav className="mr-auto">

                <Link className="nav-link" to="/Home">Home</Link>
                <Link className="nav-link" to={!this.props.global.isAuth ? "/Login" : "/Home"} onClick={() => this.props.global.isAuth && this.logUserOut()}>{!this.props.global.isAuth ? "Login" : "Logout"}</Link>
                <NavDropdown title="Registros" id="basic-nav-dropdown">
                  <Link className="nav-link" to="/RegistroAnalise">Registro de Analise</Link>
                  <Link className="nav-link" to="/RegistroAnaliseMulti">Multi Registro de Analise</Link>
                  <Link className="nav-link" to="/RegistroTempo">Registro de Tempo</Link>
                </NavDropdown>
                <Link className="nav-link" to="/OrdensDeCorrecao">Ordens de Correção</Link>
                <Link className="nav-link" to='/Omp' >OMP</Link>
                <Link className="nav-link" to="/TarefasDeManutencao" >Tarefas de Manutenção</Link>
                <NavDropdown title="Consultas" id="basic-nav-dropdown">
                  <Link className="nav-link" to="/IndicadorDeAnalise">Indicador de Analises</Link>
                  <Link className="nav-link" to="/IndicadorDeOmp">Indicador de Omp</Link>
                  <Link className="nav-link" to="/HistoricoDeAnalise">Historico de Analises</Link>

                </NavDropdown>

              </Nav>

            </Navbar.Collapse>


            {!isMobile && <NavItem style={{ marginRight: 20 }}>Usuario: {this.props.global.userName}</NavItem>}


            <NavItem>{isMobile ? <Button onClick={() => this.setState((prevState, props) => ({
              show: true
            }))}  ><Badge variant="light">{this.props.notifications.length}</Badge></Button> : <Button onClick={() => this.setState((prevState, props) => ({
              show: true
            }))}  >Notificacoes <Badge variant="light">{this.props.notifications.length}</Badge></Button>}</NavItem>

            <Modal show={this.state.show} onHide={() => this.setState({ show: false })}>
              <Modal.Body>
                {this.props.notifications.map((notificacao, index) => {
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
                <Link className="nav-link" to="/Home">Home</Link>
                <Link className="nav-link" to={!this.props.global.isAuth ? "/Login" : "/Home"} onClick={() => this.props.global.isAuth && this.logUserOut()}>{!this.props.global.isAuth ? "Login" : "Logout"}</Link>
              </Nav>

            </Navbar.Collapse>
          </Navbar>
        </>)
    }






  }

}

export default withToastManager(connect(mapToStateProps.toProps, dispatchers)(MenuBar));