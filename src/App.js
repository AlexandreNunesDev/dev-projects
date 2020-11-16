import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom';

import CadastroEtapa from './Screens/CadastroEtapa';
import CadastroParametro from './Screens/CadastroParametro';
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
import { getUserRole,} from './Services/auth';
import Registrar from './Screens/Registrar';


class App extends React.Component {

  
  constructor(props) {
 
    super(props)
    
    this.state = {
      notificacoes: [],
      user : {}
    }
  }


  loginUser = (logedUser) => {
  
  
    const { toastManager } = this.props
    
    this.setState({user: logedUser})

    let jwtToken = logedUser.token
   
  
    if(jwtToken!==null){
      this.props.history.push("/Home")
    } else {
      toastManager.add(`Usuario não encontrado`, {
        appearance: 'error', autoDismiss: true
    })
    }
    
  }

  logOutUser = () => {
    this.setState({user: {}});
  }
 

  

 
  render() {


    if(getUserRole()==="ADMIN_ROLE"){
      return (
        <Switch>
        <Route path='/' exact={true} component={Home} />
        <Route path='/Home' exact={true} component={Home} />
        <Route path='/Login' exact={true} component={Login} />
        <Route path='/Registrar' exact={true} component={Registrar} />
        <Route path='/RegistroAnalise' exact={true} component={RegistroDeAnalise} />
        <Route path='/OrdensDeCorrecao' exact={true} component={OrdensDeCorreção} />
        <Route path='/OMP' exact={true} component={Omp} />
        <Route path='/IndicadorDeAnalise' exact={true} component={IndicadorDeAnalise} />
        <Route path='/CadastroProcesso' exact={true} component={CadastroProcesso} />
        <Route path='/CadastroEtapa' exact={true} component={CadastroEtapa} />
        <Route path='/CadastroParametro' exact={true} component={CadastroParametro} />
        <Route path='/CadastroMateriaPrima' exact={true} component={CadastroMateriaPrima} />
        <Route path='/CadastroOcpAdicao' exact={true} component={CadastroDeOcpAdicao} />
        <Route path='/CadastroOcpAcao' exact={true} component={CadastroDeOcpAcao} />
        <Route path='/CadastroTroca'   exact={true} component={CadastroTroca} />
        <Route path='/CadastroTarefasDeManutencao'  exact={true} component={CadastroDeTarefasDeManutencao} />
        <Route path='/CadastroOmp'   exact={true} component={CadastroOmp} />
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
        <Route path='/TarefasDeManutencao' exact={true} component={TarefasDeManutencao} />
        <Route path='/ConfirmYourMail' exact={true} component={ConfirmMailPage} />

      </Switch>



    )
    } else if(getUserRole()==="USER_ROLE") {
      return (
        <Switch>
        <Route path='/' exact={true} component={Home} />
        <Route path='/Home' exact={true} component={Home} />
        <Route path='/Login' exact={true} component={Login} />
        <Route path='/Registrar' exact={true} component={Registrar} />
        <Route path='/RegistroAnalise' exact={true} component={RegistroDeAnalise} />
        <Route path='/OrdensDeCorrecao' exact={true} component={OrdensDeCorreção} />
        <Route path='/OMP' exact={true} component={Omp} />
        <Route path='/IndicadorDeAnalise' exact={true} component={IndicadorDeAnalise} />
        <Route path='/CadastroOmp'   exact={true} component={CadastroOmp} />
        <Route path='/OrdensDeManutencao' exact={true} component={OrdensDeManutencao} />
        <Route path='/FinalizarOmp' exact={true} component={FinalizarOmp} />
        <Route path='/VerOmp' exact={true} component={VerOmp} />
        <Route path='/TarefasDeManutencao' exact={true} component={TarefasDeManutencao} />
        <Route path='/ConfirmYourMail' exact={true} component={ConfirmMailPage} />

      </Switch>



    )
    } else {
      return (
      <>
      <Route path='/' exact={true} component={Home} />
      <Route path='/Home' exact={true} component={Home} />
      <Route path='/Login' exact={true} component={Login} />
      <Route path='/Registrar' exact={true} component={Registrar} />
      <Route path='/ConfirmYourMail' exact={true} component={ConfirmMailPage} />

      </>)
    }

     
  
    

   
  }

}

export default withRouter(App)
