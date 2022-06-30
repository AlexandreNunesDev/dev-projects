import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Image, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';
import scqlogo from '../img/logoscq.png';
import { version } from '../models/constantes';
import { logOut } from '../Reducers/globalConfigReducer';
import { BiUserCircle } from 'react-icons/bi'
const MenuBar = () => {


  const [user, setUser] = useState()
  const [show, setShow] = useState()
  const global = useSelector(state => state.global)
  const notifications = useSelector(state => state.notification.notifications)
  const dispatch = useDispatch()





  const showNotificationsReponse = (message) => {
    const { toastManager } = this.props;
    const status = message.split(":");
    let appearance = status.shift();
    let trueMessage = Array(status).pop();
    toastManager.add(trueMessage, {
      appearance: appearance, autoDismiss: true
    })
  }




  const resolveNotificacao = (notificacao) => {
    ScqApi.EditarNotificacao(notificacao.id).then(data => showNotificationsReponse(data))
    const newNotificationList = notifications.filter((notification) => {
      return notification.id !== notificacao.id
    })
  }


  const logUserOut = () => {
    dispatch(logOut())
    dispatch({ type: "eraseStore" })
  }

  if (global.userRole === "ADMIN_ROLE") {

    return (
      <>
        <div className='App tc f3'>
          <Navbar bg="light" expand="lg" >
            <NavItem style={{ marginRight: 20 }}>{version}</NavItem>
            <Image height={50} width={80} src={scqlogo} rounded />

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Link className="nav-link" to="/Home">Home</Link>
                <Link className="nav-link" to={!global.isAuth ? "/Login" : "/Home"} onClick={() => global.isAuth && logUserOut()}>{!global.isAuth ? "Login" : "Logout"}</Link>
                <NavDropdown title="Registros" id="basic-nav-dropdown">
                  <Link className="nav-link" to="/RegistroAnaliseMulti">Registro de Analise</Link>
                  <Link className="nav-link" to="/RegistroTempo">Registro de Tempo</Link>
                  <Link className="nav-link" to="/RegistroDeArea">Registro de Area</Link>
                </NavDropdown>
                <Link className="nav-link" to="/OrdensDeCorrecao">Ordens de Correção</Link>
                <Link className="nav-link" to='/Trocas' >Trocas</Link>
                <Link className="nav-link" to="/TarefasDeManutencao" >Tarefas de Manutenção</Link>

                <NavDropdown title="Consultas" id="basic-nav-dropdown">
                  <Link className="nav-link" to="/IndicadorDeAnalise">Indicador de Analises</Link>
                  <Link className="nav-link" to="/IndicadorDeOmp">Indicador de Omp</Link>
                  <Link className="nav-link" to="/IndicadorDeGastos">Indicador de Gastos</Link>
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

            {!isMobile && <NavItem style={{ marginRight: 20 }}><BiUserCircle size={24} /> Usuario: {global.userName}</NavItem>}
          </Navbar>

        </div>
      </>
    )
  } else if (global.userRole === "USER_ROLE") {
    return (
      <>

        <Navbar bg="light" expand="lg">
        <NavItem style={{ marginRight: 20 }}>{version}</NavItem>
          <Image height={50} width={80} src={scqlogo} rounded />

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Nav className="mr-auto">

              <Link className="nav-link" to="/Home">Home</Link>
              <Link className="nav-link" to={!global.isAuth ? "/Login" : "/Home"} onClick={() => global.isAuth && logUserOut()}>{!global.isAuth ? "Login" : "Logout"}</Link>
              <NavDropdown title="Registros" id="basic-nav-dropdown">
                <Link className="nav-link" to="/RegistroAnaliseMulti">Registro de Analise</Link>
                <Link className="nav-link" to="/RegistroTempo">Registro de Tempo</Link>
              </NavDropdown>
              <Link className="nav-link" to="/OrdensDeCorrecao">Ordens de Correção</Link>
              <Link className="nav-link" to='/Trocas' >Trocas</Link>
              <Link className="nav-link" to="/TarefasDeManutencao" >Tarefas de Manutenção</Link>
              <NavDropdown title="Consultas" id="basic-nav-dropdown">
                <Link className="nav-link" to="/IndicadorDeAnalise">Indicador de Analises</Link>
                <Link className="nav-link" to="/IndicadorDeOmp">Indicador de Omp</Link>
              </NavDropdown>

            </Nav>

          </Navbar.Collapse>


          {!isMobile && <NavItem style={{ marginRight: 20 }}> <BiUserCircle size={24} /> Usuario: {global.userName}</NavItem>}



        </Navbar>


      </>

    )

  } else {

    return (
      <>
        <Navbar bg="light" expand="lg">
          {<NavItem style={{ marginRight: 20 }}>{version}</NavItem>}
          <Image height={50} width={80} src={scqlogo} rounded />

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Link className="nav-link" to="/Home">Home</Link>
              <Link className="nav-link" to={!global.isAuth ? "/Login" : "/Home"} onClick={() => global.isAuth && logUserOut()}>{!global.isAuth ? "Login" : "Logout"}</Link>
              <Link className="nav-link" to="/Portal" >Portal Forms</Link>

            </Nav>

          </Navbar.Collapse>

        </Navbar>
      </>)
  }






}





export default MenuBar;