
import { combineReducers } from 'redux'
import optionsReducer from './baseSelectionsReducer'
import ocpsReducer from './ocpsReducers'
import globalConfig from './globalConfigReducer'
import notificationsReducer from './notificationsReducer'
import timeReducer from './timeReducers'
import analiseReducer from './analisesReducers'
import ordensDeManutencaoReducer from './ordensDeManutencaoReducer'
import dynamicFormsReducer from './dyanamicForms'
import ompReducer from './ompReducer'
import singleAnaliseReducer from './singleAnaliseReducer'
import adicaoReducer from './adicaoReducer'





const appReducer = combineReducers({
   options :  optionsReducer,
   ocp : ocpsReducer,
   global : globalConfig,
   notification :notificationsReducer,
   timeReducer : timeReducer,
   analiseReducer : analiseReducer,
   cadastroOmpReducer : ompReducer,
   ordensDeManutencao : ordensDeManutencaoReducer,
   formsReducer : dynamicFormsReducer,
   singleAnalise : singleAnaliseReducer,
   adicaoForm : adicaoReducer

})


const rootReducer = (state, action) => {
   // when a logout action is dispatched it will reset redux state
   if (action.type === 'eraseStore') {
    state.options = undefined
    state.ocp = undefined
    state.global = undefined
    state.notification = undefined
    state.cadastroOmpReducer = undefined
    state.formsReducer = undefined
    state.adicaoForm = undefined
   }
 
   return appReducer(state, action);
 };
 
 export default rootReducer;