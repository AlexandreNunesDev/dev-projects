
import { combineReducers } from 'redux'
import optionsReducer from './baseSelectionsReducer'
import ocpsReducer from './ocpReducers'
import globalConfig from './globalConfigReducer'
import notificationsReducer from './notificationsReducer'
import timeReducer from './timeReducers'



const appReducer = combineReducers({
   options :  optionsReducer,
   ocp : ocpsReducer,
   global : globalConfig,
   notification :notificationsReducer,
   timeReducer : timeReducer
  
})


const rootReducer = (state, action) => {
   // when a logout action is dispatched it will reset redux state
   if (action.type === 'LOGOUT') {
     state = undefined;
   }
 
   return appReducer(state, action);
 };
 
 export default rootReducer;