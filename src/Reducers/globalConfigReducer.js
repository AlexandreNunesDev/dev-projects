import produce from "immer"

const initialState = {
    loadedOptions : [],
    loading : false,
    processoIdTarefaRef : '',
    firstReload : true,
    isAuth : false
}

const loadState = () => {
    return initialState;
};



  const globalConfig = produce(
    (draft, action) => {
      switch (action.type) {
        case "LOAD_POSITIONS":
            draft.loadedOptions.push(action.payload)
            break
        case "LOGIN":
            draft.isAuth = true
            break
        case "LOGOUT":
            draft.isAuth = false
            break
        case "IS_LOADING":
            draft.loading = action.payload
            break
        case "FIRST_RELOAD":
            draft.firstReload = action.payload
            break
        case "PROCESSOID_TAREFA_REF":
            draft.processoIdTarefaRef = action.payload
            break
  
    
        }
      return
    },loadState())
  
  export default globalConfig