import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  trocas: [],
  tarefas: [],
  tarefasFiltered: [],
  trocasFiltered: [],

}

const cadastroOmp = createSlice({
  name: 'cadastroOmp',
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
    clear(state) {
      state.tarefas = []
      state.trocas = []
      state.tarefasFiltered = []
      state.trocasFiltered = []
    },

  },
})

export const { UpdateTarefasChoosed,UpdateTarefasFiltered,UpdateTrocasFiltered, UpdateTrocasChoosed, clear } = cadastroOmp.actions
export default cadastroOmp.reducer