import { isTokenExpired } from "./auth"

export const optionsLoad = async (props, forceUpdade) => {
  if ((props.global.isAuth) && (!isTokenExpired(props.global.tokenExpiration))) {
    if (forceUpdade) {
      if (props?.global?.firstReload) {
        loadOcps(props)
        loadProcessos(props)
        loadEtapas(props)
        loadParametros(props)
        loadMateriasPrima(props)
        loadTrocas(props)
        loadTarefas(props)
        loadUnidades(props)
        loadTurnos(props)
        loadOmps(props)
        loadAnaliseFields(props)
      }
      props.firstReload(false)

    }

  }



}


export const loadAnaliseFields = (props) => {
  props.loadAnaliseFields()
}
export const loadUnidades = (props) => {
  props.loadUnidades()
}

export const loadTurnos = (props) => {
  props.loadTurnos()
}

export const loadOmps = (props) => {
  props.loadOmps()
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




