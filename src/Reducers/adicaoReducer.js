import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  adicoes: [],
}

const adicaoReducer = createSlice({
  name: 'adicaoReducer',
  initialState,
  reducers: {
    updateAdicoes(state, action) {
      state.adicoes = action.payload
    },
    clear(state) {
      state.adicoes = []
    },

  },
})

export const { updateAdicoes, clear } = adicaoReducer.actions
export default adicaoReducer.reducer