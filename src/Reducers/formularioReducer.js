
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    targetForm : '',
    formularios : []

}

const formularios = createSlice({
  name: 'formularios',
  initialState,
  reducers: {
    updateFormularios(state, action) {
      state.formularios = action.payload
    },
    clear(state) {
      state.formularios = []
      state.targetForm = ''
     
    },

  },
})

export const { updateFormularios,clear } = formularios.actions
export default formularios.reducer