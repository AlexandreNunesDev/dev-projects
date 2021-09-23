
import { combineReducers } from 'redux'
import optionsReducer from './baseSelectionsReducer'
import ocpsReducer from './ocpReducers'
import globalConfig from './globalConfigReducer'
import notificationsReducer from './notificationsReducer'
import timeReducer from './timeReducers'
import analiseReducer from './analisesReducers'



const appReducer = combineReducers({
   options :  optionsReducer,
   ocp : ocpsReducer,
   global : globalConfig,
   notification :notificationsReducer,
   timeReducer : timeReducer,
   analiseReducer : analiseReducer

  
})


const rootReducer = (state, action) => {
   // when a logout action is dispatched it will reset redux state
   if (action.type === 'LOGOUT') {
    state.options = undefined
    state.ocp = undefined
    state.global = undefined
    state.notification = undefined
   }
 
   return appReducer(state, action);
 };
 
 export default rootReducer;