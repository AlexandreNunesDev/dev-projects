import ScqApi from "../Http/ScqApi"
import {store} from "../store"

export const optionsLoad = async (props,forceUpdade) => {
  console.log("chamou force : " + forceUpdade)
  if (props.processos.length === 0) {
    loadProcessos(props)
  }

  if (props.etapas.length === 0) {
    loadEtapas(props)
  }
  if (props.parametros.length === 0) {
    loadParametros(props)
  }
  if (props.materiasPrima.length === 0) {
    loadMateriasPrima(props)
  }
  if (props.trocas.length === 0) {
    loadTrocas(props)
  }
  if (props.tarefasDeManutencao.length === 0) {
    loadTarefas(props)
  }
  if (props.ocp.ocps.length === 0) {
    loadOcps(props)
  }
  if (props.notifications.length === 0) {
    loadNotifications(props)
  }

  if(forceUpdade) {

    props.firstReload(false)
    loadProcessos(props)
    loadEtapas(props)
    loadParametros(props)
    loadMateriasPrima(props)
    loadTrocas(props)
    loadTarefas(props)
    loadOcps(props)
    loadNotifications(props)
  }



}

export const loadProcessos = (props,action) => {
  ScqApi.ListaProcessos().then(res => {
    if(props) {
      props.loadProcessos(res) 
     
      
    } else {
      store.dispatch(action(res))
    }
   
  

  })
}

export const loadEtapas = (props,redirect) => {
  ScqApi.ListaEtapas().then(res => {
    props.loadEtapas(res)
   

  })
}

export const loadParametros = (props,redirect) => {
  ScqApi.ListaParametros().then(res => {
    props.loadParametros(res)
   

  })
}

export const loadMateriasPrima = (props,redirect) => {
  ScqApi.ListaMateriaPrimas().then(res => {
    props.loadMateriasPrima(res)
   

  })
}


export const loadTrocas = (props,redirect) => {
  ScqApi.ListaTrocas().then(res => {
    props.loadTrocas(res)
   

  })
}

export const loadTarefas = (props,redirect) => {
  ScqApi.ListaTarefasDeManutencao().then(res => {
    props.loadTarefasDeManutencao(res)
   

  })
}


export const loadOcps = (props,action) => {
  
  ScqApi.ListaOcps().then(res => {
    if(props!=null){
     
      props.loadOcps(res)
     
    } else {
      action.payload = res
      store.dispatch(action)
    }
    
  })
}

export const loadNotifications = (props,action) => {
  
  ScqApi.ListaNotificacoes().then(res => {
    if(props!=null){
     
      props.loadNotifications(res)
     
    } else {
      action.payload = res
      store.dispatch(action)
    }
    
  })
}

