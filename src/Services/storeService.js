import { isTokenExpired } from "./auth"

export const optionsLoad = async (props, forceUpdade) => {
  if ((props.global.isAuth) && (!isTokenExpired(props.global.tokenExpiration))) {
    if (forceUpdade) {
      props.firstReload(false)
      loadProcessos(props)
      loadEtapas(props)
      loadParametros(props)
      loadMateriasPrima(props)
      loadTrocas(props)
      loadTarefas(props)
      loadOcps(props)
      loadNotifications(props)
      loadUnidades(props)
      loadTurnos(props)
      loadOrdensDeManutencao(props)
    }

  }



}


export const loadUnidades = (props) => {
  props.loadUnidades()
}

export const loadTurnos = (props) => {
  props.loadTurnos()
}

export const loadOrdensDeManutencao = (props) => {
  props.loadOrdensDeManutencao()
}

export const loadProcessos = (props) => {
  props.loadProcessos()
}

export const loadEtapas = (props) => {
  props.loadEtapas()
}

export const loadParametros = (props) => {
  props.loadParametros()
}

export const loadMateriasPrima = (props) => {
  props.loadMateriasPrima()
}


export const loadTrocas = (props) => {
  props.loadTrocas()
}

export const loadTarefas = (props) => {
  props.loadTarefasDeManutencao()
}


export const loadOcps = (props) => {
  props.loadOcps()
}

export const loadNotifications = (props) => {
  props.loadNotifications()
}



