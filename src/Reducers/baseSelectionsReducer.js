const initialState = {
    processos : [],
    etapas : [],
    parametros : [],
    materiasPrima : [],
    tarefasDeManutencao : [],
    trocas : [],

 

}

const loadState = () => {
    try {
      const serializedState = localStorage.getItem('state');
      if(serializedState === null) {
        return initialState;
      }

      const actualState = JSON.parse(serializedState);
      if(actualState.options=== null){
        return initialState;
      } else {
        return actualState.options
      }
      
      
    } catch (e) {
      return undefined;
    }
  };

  
const optionsReducer = function (state = loadState(), action) {
    switch (action.type) {
    case "LOAD_PROCESSOS":
        state.processos = action.payload
        return state
    case "ADD_PROCESSO":
        state.processos.push(action.payload)
        return state
    case "LOAD_ETAPAS":
      state.etapas = action.payload
        return state
    case "ADD_ETAPA":
      state.etapas.push(action.payload)
        return state
    case "LOAD_PARAMETROS":
      state.parametros = action.payload
        return state
    case "LOAD_MATERIAS_PRIMA":
      state.materiasPrima = action.payload
        return state
    case "LOAD_TROCAS":
      state.trocas = action.payload
        return state
    case "LOAD_TAREFAS_DE_MANUTENCAO":
      state.tarefasDeManutencao = action.payload
        return state
    
    default :
        return state

    }
  };

  export default optionsReducer