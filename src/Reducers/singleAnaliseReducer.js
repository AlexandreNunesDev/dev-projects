import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    analiseToSave : { id: '', analista: '', resultado: '', status: '', parametroId: '', ocpId: null, observacaoAnalise: '' }

}

const analiseReducer = createSlice({
    name: 'analiseReducer',
    initialState,
    reducers: {
        setAnaliseToSave(state, action) {
            state.analiseToSave = action.payload
        },
        clear(state,action) {
            state.analiseToSave = { id: '', analista: '', resultado: '', status: '', parametroId: '', ocpId: null, observacaoAnalise: '' }
        },


    },
})

export const { setAnaliseToSave,clear} = analiseReducer.actions
export default analiseReducer.reducer

