import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route, withRouter } from 'react-router-dom';
import CadastroEtapa from './Screens/CadastroEtapa';
import CadastroParametro from './Screens/CadastroParametro';
import CadastroTurno from './Screens/CadastrarTurno';
import CadastroMateriaPrima from './Screens/CadastroMateriaPrima';
import RegistroDeAnalise from './Screens/RegistroAnalise';
import OrdensDeCorreção from './Screens/OrdensDeCorreção';
import IndicadorDeAnalise from './Screens/IndicadorDeAnalise';
import Home from './Screens/Home';
import CadastroDeOcpAdicao from './Screens/CadastroOcpWithAdicao';
import CadastroDeOcpAcao from './Screens/CadastroOcpWithAcao';
import CadastroProcesso from './Screens/CadastroProcesso';
import CadastroTroca from './Screens/CadastroTroca';
import CadastroDeTarefasDeManutencao from './Screens/CadastroDeTarefasDeManutencao';
import CadastroDeOcpLivre from './Screens/CadastroOcpWithLivre'
import CadastroOmp from './Screens/CadastroOmp';
import OrdensDeManutencao from './Screens/OrdensDeManutencao';
import FinalizarOmp from './Screens/FinalizarOmp';
import VerOmp from './Screens/VerOmp';
import EditarProcesso from './ScreensEdicao/EditarProcesso';
import EditarEtapa from './ScreensEdicao/EditarEtapa';
import EditarParametro from './ScreensEdicao/EditarParametro';
import EditarMateriaPrima from './ScreensEdicao/EditarMateriaPrima';
import EditarTroca from './ScreensEdicao/EditarTroca';
import EditaTarefasDeManutencao from './ScreensEdicao/EditaTarefasDeManutencao';
import Omp from './Screens/Omp';
import TarefasDeManutencao from './Screens/TarefasDeManutencao';
import Login from './Screens/Login';
import ConfirmMailPage from './Screens/ConfirmYourMail';
import {  isAuthenticated, isTokenExpired, logout } from './Services/auth';
import Registrar from './Screens/Registrar';
import VoceFoiDesconectado from './Screens/VoceFoiDesconectado';
import AlgoDeuErrado from './Screens/algoDeuErrado';
import ServidorError from './Screens/ServidorError';
import EditarOcpAdicao from './ScreensEdicao/EditarOcpAdicao';
import EditarOcpAcao from './ScreensEdicao/EditarOcpAcao';
import MultiRegistroAnalise from './Screens/NovoRegistroAnalise'
import dispatchers from './mapDispatch/mapDispathToProps';
import { connect } from 'react-redux';
import mapToStateProps from './mapStateProps/mapStateToProps'
import { WebSocketContext } from './websocket/wsProvider';
import { optionsLoad } from './Services/storeService';
import HistoricoDeAnalise from './Screens/HistoricoDeAnalise';
import RegistroDetempos from './Screens/RegistroDeTempos';
import RegistroAnalise from './Screens/RegistroAnalise';








class App extends React.Component {
  
  static contextType = WebSocketContext
  constructor(props) {

   
    super(props)

    this.state = {
      notificacoes: [],
      user: {},
     
  
    }

  }
  



  initiate()  {
    if ((isAuthenticated(this.props.global.tokenInfo)) && (isTokenExpired(this.props.global.tokenExpiration))) {
          logout()
          this.props.setLogOut()
          this.props.history.push("/VoceFoiDesconectado")
    }
}


  componentDidMount() {
    this.initiate()
    this.reloadStore = setInterval(() => {
      optionsLoad(this.props,true)
    },600000)
 
    }

   
  
    componentWillUnmount () {
      console.log("Limpou refresher")
      clearInterval(this.reloadStore)
    }




  render() {



    if (this.props.global.userRole === "ADMIN_ROLE") {
      return (
        <>
       
          <Switch>
            <Route path='/' exact={true} component={Home}/> 
            <Route path='/VoceFoiDesconectado' exact={true} component={VoceFoiDesconectado} />
            <Route path='/Home' exact={true} component={Home} />
            <Route path='/Login' exact={true} component={Login} />
            <Route path='/Registrar' exact={true} component={Registrar} />
            <Route path='/RegistroAnalise' exact={true} component={RegistroAnalise} />
            <Route path='/RegistroAnaliseMulti' exact={true} component={MultiRegistroAnalise} />
            <Route path='/RegistroTempo' exact={true} component={RegistroDetempos} />
            <Route path='/OrdensDeCorrecao' exact={true} component={OrdensDeCorreção} />
            <Route path='/OMP' exact={true} component={Omp} />
            <Route path='/IndicadorDeAnalise' exact={true} component={IndicadorDeAnalise} />
            <Route path='/CadastroProcesso' exact={true} component={CadastroProcesso} />
            <Route path='/CadastroEtapa' exact={true} component={CadastroEtapa} />
            <Route path='/CadastroParametro' exact={true} component={CadastroParametro} />
            <Route path='/CadastroMateriaPrima' exact={true} component={CadastroMateriaPrima} />
            <Route path='/CadastroOcpAdicao' exact={true} component={CadastroDeOcpAdicao } />
            <Route path='/CadastroOcpLivre' exact={true} component={CadastroDeOcpLivre} />
            <Route path='/CadastroOcpAcao' exact={true} component={CadastroDeOcpAcao} />
            <Route path='/CadastroTroca' exact={true} component={CadastroTroca} />
            <Route path='/CadastroTarefasDeManutencao' exact={true} component={CadastroDeTarefasDeManutencao} />
            <Route path='/CadastroOmp' exact={true} component={CadastroOmp} />
            <Route path='/OrdensDeManutencao' exact={true} component={OrdensDeManutencao} />
            <Route path='/FinalizarOmp' exact={true} component={FinalizarOmp} />
            <Route path='/VerOmp' exact={true} component={VerOmp} />
            <Route path='/EditarProcesso' exact={true} component={EditarProcesso} />
            <Route path='/EditarEtapa' exact={true} component={EditarEtapa} />
            <Route path='/EditarParametro' exact={true} component={EditarParametro} />
            <Route path='/EditarMateriaPrima' exact={true} component={EditarMateriaPrima} />
            <Route path='/EditarTroca' exact={true} component={EditarTroca} />
            <Route path='/EditarTarefa' exact={true} component={EditaTarefasDeManutencao} />
            <Route path='/EditarOmp' exact={true} component={EditaTarefasDeManutencao} />
            <Route path='/EditarOcpAdicao' exact={true} component={EditarOcpAdicao} />
            <Route path='/EditarOcpAcao' exact={true} component={EditarOcpAcao} />
            <Route path='/TarefasDeManutencao' exact={true} component={TarefasDeManutencao} />
            <Route path='/ConfirmYourMail' exact={true} component={ConfirmMailPage} />
            <Route path='/algoDeuErrado' exact={true} component={AlgoDeuErrado} />
            <Route path='/ServidorError' exact={true} component={ServidorError} />
            <Route path='/HistoricoDeAnalise' exact={true} component={HistoricoDeAnalise} />
            <Route path='/CadastroTurno' exact={true} component={CadastroTurno} />
          </Switch>
        </>



      )
    } else if (this.props.global.userRole === "USER_ROLE") {
      return (

        <>

          <Switch>
          <Route path='/' exact={true} component={Home}/> 
            <Route path='/VoceFoiDesconectado' exact={true} component={VoceFoiDesconectado} />
            <Route path='/Home' exact={true} component={Home} />
            <Route path='/Login' exact={true} component={Login} />
            <Route path='/Registrar' exact={true} component={Registrar} />
            <Route path='/RegistroAnalise' exact={true} component={RegistroAnalise} />
            <Route path='/RegistroAnaliseMulti' exact={true} component={MultiRegistroAnalise} />
            <Route path='/OrdensDeCorrecao' exact={true} component={OrdensDeCorreção} />
            <Route path='/OMP' exact={true} component={Omp} />
            <Route path='/IndicadorDeAnalise' exact={true} component={IndicadorDeAnalise} />
            <Route path='/CadastroOcpAdicao' exact={true} component={CadastroDeOcpAdicao } />
            <Route path='/CadastroOcpLivre' exact={true} component={CadastroDeOcpLivre} />
            <Route path='/CadastroOcpAcao' exact={true} component={CadastroDeOcpAcao} />
            <Route path='/CadastroOmp' exact={true} component={CadastroOmp} />
            <Route path='/OrdensDeManutencao' exact={true} component={OrdensDeManutencao} />
            <Route path='/FinalizarOmp' exact={true} component={FinalizarOmp} />
            <Route path='/VerOmp' exact={true} component={VerOmp} />
            <Route path='/EditarOmp' exact={true} component={EditaTarefasDeManutencao} />
            <Route path='/EditarOcpAdicao' exact={true} component={EditarOcpAdicao} />
            <Route path='/EditarOcpAcao' exact={true} component={EditarOcpAcao} />
            <Route path='/TarefasDeManutencao' exact={true} component={TarefasDeManutencao} />
            <Route path='/ConfirmYourMail' exact={true} component={ConfirmMailPage} />
            <Route path='/algoDeuErrado' exact={true} component={AlgoDeuErrado} />
            <Route path='/ServidorError' exact={true} component={ServidorError} />
            <Route path='/HistoricoDeAnalise' exact={true} component={HistoricoDeAnalise} />
            
          </Switch>
        </>



      )
    } else {
      return (

        <>
          <Switch>
            <Route path='/' exact={true} component={Home} />
            <Route path='/VoceFoiDesconectado' exact={true} component={VoceFoiDesconectado} />
            <Route path='/Home' exact={true} component={Home} />
            <Route path='/Login' exact={true} component={Login} />
            <Route path='/Registrar' exact={true} component={Registrar} />
            <Route path='/ConfirmYourMail' exact={true} component={ConfirmMailPage} />
            <Route path='/ServidorError' exact={true} component={ServidorError} />
            
          </Switch>
        </>)
    }






  }

}

export default withRouter(connect(mapToStateProps.toProps, dispatchers)(App))
