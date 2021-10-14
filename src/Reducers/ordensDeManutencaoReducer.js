import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    ordens: [],
    toEditDeleteOrdem: null,
    toViewOrdem : null,

}

const ordensDeManutencao = createSlice({
    name: 'ordensDeManutencao',
    initialState,
    reducers: {
        updateOrdem(state, action) {
            state.ordens = action.payload
        },
        setToEditOrdem(state,action) {
            state.toEditDeleteOrdem = action.payload
        },
        setToViewOrdem(state,action) {
            state.toViewOrdem = action.payload
        },
        clear(state) {
            state.toEditDeleteOrdem = null
            state.toViewOrdem = null
            state.ordens = []

        },

    },
})

export const { updateOrdem,setToEditOrdem,setToViewOrdem,clear } = ordensDeManutencao.actions
export default ordensDeManutencao.reducer