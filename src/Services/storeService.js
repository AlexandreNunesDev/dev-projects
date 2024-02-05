import { isTokenExpired } from "./auth"

export const optionsLoad = async (props, forceUpdade) => {
  if ((props.global.isAuth) && (!isTokenExpired(props.global.tokenExpiration))) {
    if (forceUpdade) {
      props.firstReload(false)
      props.loadOcps().then(a => {
        props.loadProcessos().then(b => {
          props.loadEtapas().then(c => {
            props.loadParametros().then(d => {
              props.loadMateriasPrima(e => {
                props.loadTrocas().then(f => {
                  props.loadTarefasDeManutencao().then(g => {
                    props.loadUnidades().then(h => {
                      props.loadTurnos().then(i => {
                        props.loadOmps().then(j => {
                          props.loadAnaliseFields()
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
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




