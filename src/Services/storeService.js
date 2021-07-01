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
 props.loadProcessos()
}

export const loadEtapas = (props,redirect) => {
    props.loadEtapas()
}

export const loadParametros = (props) => {
  props.loadParametros()
}

export const loadMateriasPrima = (props,redirect) => {
    props.loadMateriasPrima()
}


export const loadTrocas = (props,redirect) => {
    props.loadTrocas()
}

export const loadTarefas = (props,redirect) => {
    props.loadTarefasDeManutencao()
}


export const loadOcps = (props,action) => {
  props.loadOcps()
}

export const loadNotifications = (props,action) => {
  props.loadNotifications()
}



