import produce from "immer"

const initialState = {
    loadedOptions : [],
    loading : false,
    processoIdTarefaRef : ''
}

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return initialState;
    }
    const actualState = JSON.parse(serializedState);
    return actualState.global;
  } catch (e) {
    return null;
  }
};



  const globalConfig = produce(
    (draft, action) => {
      switch (action.type) {
        case "LOAD_POSITIONS":
            draft.loadedOptions.push(action.payload)
            break
        case "IS_LOADING":
            draft.loading = action.payload
            break
        case "PROCESSOID_TAREFA_REF":
            draft.processoIdTarefaRef = action.payload
            break
  
    
        }
      return
    },loadState())
  
  export default globalConfig