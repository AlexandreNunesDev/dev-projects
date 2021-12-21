import { plusDate } from "../Services/auth";
import { createSlice } from '@reduxjs/toolkit'

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

const globalConfig = createSlice({
  name: 'globalConfig',
  initialState,
  reducers: {
    loadPositions(state, action) {
      state.loadedOptions.push(action.payload)
    },
    logIn(state, action) {
        state.isAuth = true
        state.tokenInfo = action.payload.token
        state.tokenExpiration  = plusDate()
        state.userRole = action.payload.userRole
        state.userName = action.payload.userName
        state.userEnable = action.payload.userEnable
    },
    logOut(state, action) {
        state.isAuth = false
        state.tokenInfo = ''
        state.userRole = ''
        state.userName = ''
        state.userEnable = ''
    },
    setProcessoTarefaRef(state,action) {
        state.processoIdTarefaRef = action.payload
    }
  },
})

export const { loadPositions,logIn,logOut, setProcessoTarefaRef } = globalConfig.actions
export default globalConfig.reducer