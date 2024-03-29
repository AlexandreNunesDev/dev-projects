import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    analises: [],
    filteredAnaliseHistorico : [],
    filteredAnalises : [],
    dataInicioHistorico: '',
    dataFimHistorico: '',
    historicoPage: 1,
    totalPages : 0,
    processoId: '',
    etapaNome: '',
    frequencia : '',
    turno: '',
    parametroNome: '',
    analiseToSave: null,
    analiseToGenerateOcp : null,
    analiseFields: [],
    filtroProcesso: '',
    filtroEtapa: '',
    filtroParametro: '',
    ordensToView : [],

}

const analiseReducer = createSlice({
    name: 'analise',
    initialState,
    reducers: {
        updateAnalises(state, action) {
            state.analises = action.payload
        },
        updateOrdensToView(state, action) {
            state.ordensToView = action.payload
        },
        updateFilteredAnalises(state, action) {
            state.filteredAnalises = action.payload
        },
        updateProcessoId(state, action) {
            state.processoId = action.payload
        },
        updadteEtapaNome(state, action) {
            state.etapaNome = action.payload
        },
        updateTurno(state, action) {
            state.turno = action.payload
        },
        updateParametroNome(state, action) {
            state.parametroNome = action.payload
        },
        updateAnaliseToSave(state, action) {
            state.analiseToSave = action.payload
        },
        updateAnaliseFields(state, action) {
            state.analiseFields = action.payload
        },
        updateAnaliseToGenerateOcp(state, action) {
            state.analiseToGenerateOcp = action.payload
        },
        updateHistoricoDataInicial(state, action) {
            state.dataInicioHistorico = action.payload
        },
        updateHistoricoDataFinal(state, action) {
            state.dataFimHistorico = action.payload
        },
        updateFiltroProcesso(state, action) {
            state.filtroProcesso = action.payload
        },
        updateFiltroEtapa(state, action) {
            state.filtroEtapa = action.payload
        },
        updateFiltroParametro(state, action) {
            state.filtroParametro = action.payload
        },
        updatePage(state, action) {
            state.filtroParametro = action.payload
        },
        updateTotalPages(state, action) {
            state.filtroParametro = action.payload
        },
        updateFrequencia(state,action) {
            state.frequencia = action.payload
        },
        updateFilterdAnaliseHistorico(state,action) {
            state.filteredAnaliseHistorico = action.payload
        },
        updateAnaliseField(state,action) {
            let analiseField = action.payload
            let indexToUpdate = state.analiseFields.findIndex(af => af.parametroId == analiseField.parametroId)
            state.analiseFields[indexToUpdate] = analiseField
        },
        clear(state) {
            state.analises = []
            state.filteredAnalises = []
            state.filteredAnaliseHistorico = []
            state.dataInicioHistorico =  ''
            state.dataFimHistorico =  ''
            state.processoId = ''
            state.etapaNome = ''
            state.turno = ''
            state.parametroNome = ''
            state.analiseToSave = null
            state.analiseFields = []
            state.filtroProcesso = ''
            state.filtroEtapa = ''
            state.filtroParametro = ''
            state.totalPages = 0
            state.historicoPage = 0
            state.frequencia = ''
        },

    },
})

export const {updateFilterdAnaliseHistorico,updateFrequencia,updateOrdensToView,updateAnaliseToGenerateOcp,updateTotalPages,updatePage,updateFilteredAnalises,updateFiltroProcesso,updateFiltroEtapa,updateFiltroParametro, updateHistoricoDataInicial, updateHistoricoDataFinal, updateAnalises, updateProcessoId, updadteEtapaNome, updateTurno, updateParametroNome, updateAnaliseToSave, updateAnaliseFields,updateAnaliseField, clear } = analiseReducer.actions
export default analiseReducer.reducer