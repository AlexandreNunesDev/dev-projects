import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  parametro : '',
  etapa : '',
  processo: '',
  regras: [],
  corrigirPara : 0,
}

const regrasCorrecao = createSlice({
  name: 'regrasCorrecao',
  initialState,
  reducers: {
    updadteParametroRegras(state, action) {
      state.parametro = action.payload
    },
    updadteEtapaRegras(state, action) {
      state.etapa = action.payload
    },
    updadteProcessoRegras(state, action) {
      state.processo = action.payload
    },
    updadtecorrigirPara(state, action) {
      state.corrigirPara = action.payload
    },
    updadteRegras(state, action) {
      state.regras = action.payload
    },
    clearCorrecao(state) {
      state.parametro = null
      state.etapa = null
      state.regras = []
      state.processo = null
      state.corrigirPara = 0
    },

  },
})

export const {updadtecorrigirPara, updadteProcessoRegras,updadteRegras, updadteParametroRegras,updadteEtapaRegras, clearCorrecao } = regrasCorrecao.actions
export default regrasCorrecao.reducer