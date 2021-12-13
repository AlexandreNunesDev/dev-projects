import produce from "immer"
import { plusDate } from "../Services/auth";

const initialState = {
    loadedOptions : [],
    loading : false,
    processoIdTarefaRef : '',
    firstReload : true,
    isAuth : false,
    tokenInfo : '',
    tokenExpiration : '',
    userRole : '',
    userName : '',
    userEnable : '',
    googlKey : 'AIzaSyAwUkhGE3_YB8cT4706OKT-xi3RpvnL014',
    portalSheetApi : 'https://sheets.googleapis.com/v4/spreadsheets/1_RVYwW2QaWfaq3Ib-SOs6jo9qbGEbqh01rHRBrS2ewY/values',
    headers : []
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
            draft.tokenInfo = action.payload.token
            draft.tokenExpiration  = plusDate()
            draft.userRole = action.payload.userRole
            draft.userName = action.payload.userName
            draft.userEnable = action.payload.userEnable
            break
        case "LOGOUT":
            draft.isAuth = false
            draft.tokenInfo = ''
            draft.userRole = ''
            draft.userName = ''
            draft.userEnable = ''
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