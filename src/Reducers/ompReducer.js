import produce from "immer"

const initialState = {
  choosedTrocasId: [],
  choosedTarefasId: [],
}

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return initialState;
    }
    const actualState = JSON.parse(serializedState);
    return actualState.omp;
  } catch (e) {
    return null;
  }
};


const ompReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case "ADD_CHOOSED_TAREFA":
        draft.omp.choosedTarefasId.push(action.payload)
        break
      case "ADD_CHOOSED_TROCA":
        draft.omp.choosedTrocasId.push(action.payload)
        break
      case "REMOVE_CHOOSED_TAREFA":
        const tarefaIndexToRemove = draft.omp.choosedTarefasId.findIndex(id => id === action.payload)
        if (tarefaIndexToRemove !== -1) draft.choosedTarefasId.splice(tarefaIndexToRemove, 1)
        break
      case "REMOVE_CHOOSED_TROCA":
        const trocaIndexToRemove = draft.omp.choosedTrocasId.findIndex(id => id === action.payload)
        if (trocaIndexToRemove !== -1) draft.choosedTrocasId.splice(trocaIndexToRemove, 1)
        break
    


    }
    return
  }, loadState()

)
export default ocpsReducer;