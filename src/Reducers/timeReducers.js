import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    processoId: null,
    timeFields: []
}
const timeReducer = createSlice({
    name: 'timeReducer',
    initialState,
    reducers: {
        updateFieldTime(state, action) {
            const index = state.timeFields.findIndex(fieldTime => Number(fieldTime.index) === Number(action.payload.index))
            if (index !== -1) state.timeFields[index] = action.payload
        },
        loadFieldtime(state, action) {
            state.timeFields = action.payload
        },
        timeProcessoId(state, action) {
            state.processoId = action.payload
        },

    },
})

export const { updateFieldTime, loadFieldtime, timeProcessoId } = timeReducer.actions
export default timeReducer.reducer