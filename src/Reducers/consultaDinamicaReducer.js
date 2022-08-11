import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    ops: [],
    filteredOps : [],
    dataInicial: '',
    dataFinal: '',
    historicoPage: 0,
    totalPages : 0,
    fields: [],
    fieldValues: [],
    numeroDeDados : 15,
    actualConsultaPage : ""
   

}

const consultaDinamica = createSlice({
    name: 'consultaDinamica',
    initialState,
    reducers: {
        updateOps(state, action) {
            state.ops = action.payload
        },
        updateFilteredOps(state, action) {
            state.filteredOps = action.payload
        },
        updateDataInicial(state, action) {
            state.dataInicial = action.payload
        },
        updateDataFinal(state, action) {
            state.dataFinal = action.payload
        },
        updatePage(state, action) {
            state.historicoPage = action.payload
        },
        updateTotalPages(state, action) {
            state.totalPages = action.payload
        },
        updateFields(state,action) {
            state.fields = action.payload
        },
        updadteFieldsValues(state,action) {
            state.fieldValues = action.payload
        },
        updateNumeroDeDados(state,action) {
            state.numeroDeDados = action.payload
        },
        updateActualConsultaPage(state,action) {
            state.actualConsultaPage = action.payload
        },
        clear(state) {
            state.fields = []
            state.filteredOps = []
            state.historicoPage = 0
            state.ops = []
            state.totalPages = 0
            state.numeroDeDados = 15
        },

    },
})

export const {updateActualConsultaPage,updadteFieldsValues,updateNumeroDeDados,updateFields,updateDataFinal,updateDataInicial,updateOps,updatePage,updateTotalPages,updateFilteredOps, clear } = consultaDinamica.actions
export default consultaDinamica.reducer