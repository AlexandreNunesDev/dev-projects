
import { combineReducers } from 'redux'
import optionsReducer from './baseSelectionsReducer'
import ocpsReducer from './ocpReducers'
import globalConfig from './globalConfigReducer'
import notificationsReducer from './notificationsReducer'


export  const rootReducer = combineReducers({
   options :  optionsReducer,
   ocp : ocpsReducer,
   global : globalConfig,
   notification :notificationsReducer
  
})