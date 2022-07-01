import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  trocas: [],
  tarefas: [],
  tarefasFiltered: [],
  trocasFiltered: [],
  trocasFilterType: '',
  tarefasFilterType: '',
  processoId: '',
  buildingOmp : false,
  ompsFiltered : [],
  ompToView : null

}

const cadastroOmp = createSlice({
  name: 'omp',
  initialState,
  reducers: {
    UpdateTarefasChoosed(state, action) {
      state.tarefas = action.payload
    },
    UpdateTrocasChoosed(state, action) {
      state.trocas = action.payload
    },
    UpdateTarefasFiltered(state, action) {
      state.tarefasFiltered = action.payload
    },
    UpdateTrocasFiltered(state, action) {
      state.trocasFiltered = action.payload
    },
    UpdateFilteredOmps(state, action) {
      state.ompsFiltered = action.payload
    },
    setTrocasFilterType(state, action) {
      state.trocasFilterType = action.payload
    },
    setProcessoId(state, action) {
      state.processoId = action.payload
    },
    setToEditOrdem(state, action) {
      state.toEditDeleteOrdem = action.payload
    },
    setOmpToView(state, action) {
      state.ompToView = action.payload
    },
    setBuildingOmp(state,action)  {
      state.buildingOmp = action.payload
    },
    clear(state) {
      state.tarefas = []
      state.trocas = []
      state.tarefasFiltered = []
      state.trocasFiltered = []
      state.ompsFiltered = []
      state.processoId = ''
      state.ompToView = null
      state.buildingOmp = false
    },

  },
})

export const {UpdateFilteredOmps,setBuildingOmp,setOmpToView, setToEditOrdem,updateOrdens,UpdateTarefasChoosed, setTrocasFilterType, setTarefasFilterType, UpdateTarefasFiltered, UpdateTrocasFiltered, UpdateTrocasChoosed, setProcessoId, clear } = cadastroOmp.actions
export default cadastroOmp.reducer