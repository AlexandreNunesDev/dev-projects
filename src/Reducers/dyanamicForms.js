import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    headers: [],
    body:[],
    spreadSheetMetaData : {},
    fullFormTarget : {},
    spreadSheetId : null,
    formNameChoosed : null
}

const dynamicFormsReducer = createSlice({
    name: 'dynamicFormsReducer',
    initialState,
    reducers: {
        updadteHeaders(state, action) {
            state.headers = action.payload
        },
        updateBody(state, action) {
            state.body = action.payload
        },
        setFullFormTarget(state, action) {
            state.fullFormTarget = action.payload
        },
        setFormNameChoosed(state, action) {
            state.formNameChoosed = action.payload
        },
        setSpreadSheetMetadata (state,action) {
            state.spreadSheetMetaData = action.payload
        },
        
        setSpreadSheetId(state, action) {
            state.spreadSheetId = action.payload
        },
        clear(state) {
            state.headers = null
        },

    },
})

export const { updadteHeaders,updateBody,setFullFormTarget,setSpreadSheetId,setFormNameChoosed,setSpreadSheetMetadata,clear } = dynamicFormsReducer.actions
export default dynamicFormsReducer.reducer