import produce from "immer"

const initialState = {
  processos : [],
  etapas : [],
  parametros : [],
  materiasPrima : [],
  tarefasDeManutencao : [],
  trocas : [],
  unidades : [],
  turnos : []



}
const loadState = () => {
  return initialState;
};;


const optionsReducer = produce(
  (draft, action) => {
    switch (action.type) {

    case "LOAD_PROCESSOS":
        const maxProcessoIndex = draft.processos.length
        draft.processos.splice(0,maxProcessoIndex,...action.payload)
        break
    case "ADD_PROCESSO":
        draft.processos.push(action.payload)
        break
    case "LOAD_ETAPAS":
      const maxEtapaIndex = draft.etapas.length
        draft.etapas.splice(0,maxEtapaIndex,...action.payload)
        break
    case "ADD_ETAPA":
        draft.etapas.push(action.payload)
    case "LOAD_PARAMETROS":
      const maxParametrosIndex = draft.parametros.length
      draft.parametros.splice(0,maxParametrosIndex,...action.payload)
      break
    case "LOAD_MATERIAS_PRIMA":
      const maxMateriasPrimaIndex = draft.materiasPrima.length
      draft.materiasPrima.splice(0,maxMateriasPrimaIndex,...action.payload)
      break
    case "LOAD_TROCAS":
      const maxTrocasIndex = draft.trocas.length
      draft.trocas.splice(0,maxTrocasIndex,...action.payload)
      break
    case "LOAD_TAREFAS_DE_MANUTENCAO":
      const maxTarefasDeManutencaoIndex = draft.tarefasDeManutencao.length
      draft.tarefasDeManutencao.splice(0,maxTarefasDeManutencaoIndex,...action.payload)
      break
    case "LOAD_UNIDADES":
      const maxUnidades = draft.unidades.length
      draft.unidades.splice(0,maxUnidades,...action.payload)
      break
    case "LOAD_TURNOS":
      const maxTurnos = draft.turnos.length
      draft.turnos.splice(0,maxTurnos,...action.payload)
      break
    }
    return
  },loadState()
  
)
export default optionsReducer;