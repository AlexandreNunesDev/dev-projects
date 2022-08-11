
import { combineReducers } from 'redux'
import optionsReducer from './baseSelectionsReducer'
import ocpsReducer from './ocpsReducers'
import globalConfig from './globalConfigReducer'
import timeReducer from './timeReducers'
import dynamicFormsReducer from './dyanamicForms'
import ompReducer from './ompReducer'
import adicaoReducer from './adicaoReducer'
import analiseReducer from './analiseReducer'
import regrasCorrecao from './regraCorrecoes'
import consultaDinamicaReducer from './consultaDinamicaReducer'





const appReducer = combineReducers({
   options :  optionsReducer,
   ocp : ocpsReducer,
   global : globalConfig,
   timeReducer : timeReducer,
   omp : ompReducer,
   formsReducer : dynamicFormsReducer,
   adicaoForm : adicaoReducer,
   analise : analiseReducer,
   regraCorrecao : regrasCorrecao,
   consulta : consultaDinamicaReducer

})


const rootReducer = (state, action) => {
   // when a logout action is dispatched it will reset redux state
   if (action.type === 'eraseStore') {
    state.options = undefined
    state.ocp = undefined
    state.global = undefined
    state.omp = undefined
    state.formsReducer = undefined
    state.adicaoForm = undefined
    state.analise = undefined
    state.timeReducer = undefined
    state.regraCorrecao = undefined
    state.consulta = undefined
   }
 
   return appReducer(state, action);
 };
 
 export default rootReducer;