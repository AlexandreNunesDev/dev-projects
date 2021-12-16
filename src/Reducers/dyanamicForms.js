import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    headers: [],
    optionsHeaders : [],
    addedHeaders : [],
    body:[],
    spreadSheetMetaData : {},
    fullFormTarget : {},
    regras : [],
    toEditHeader : [],
    isDynamicFilterOpen : false,
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
        loadOptionsHeaders(state,action) {
            state.optionsHeaders = action.payload
        },
        setChoosedHeaders(state, action) {
            state.addedHeaders = action.payload
        },
        updateBody(state, action) {
            state.body = action.payload
        },
        updateRegras(state, action) {
            state.regras = action.payload
        },
        setToEditHeader(state, action) {
            state.toEditHeader = action.payload
        },
        setDynamicOpenFilter(state,action) {
            state.isDynamicFilterOpen = !state.isDynamicFilterOpen
            state.toEditHeader = action.payload
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
            state.headers = []
            state.addedHeaders = []
            state.optionsHeaders = []
            state.toEditHeader = {}
            state.body = []
            state.regras = []
            state.spreadSheetMetaData = {}
            state.fullFormTarget = {}
            state.spreadSheetId = null
            state.formNameChoosed = null
        },

    },
})

export const {loadOptionsHeaders,updateRegras,setDynamicOpenFilter,updadteHeaders,updateBody,setFullFormTarget,setSpreadSheetId,setFormNameChoosed,setSpreadSheetMetadata,setChoosedHeaders,clear } = dynamicFormsReducer.actions
export default dynamicFormsReducer.reducer