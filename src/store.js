import { createStore } from 'redux';
import {rootReducer} from './Reducers/combineReducers';


export const initialState = {
  ocps: [],
  options:{
    processos : [],
    etapas : [],
    parametros : []
  }
}


  
  

  export const reloadState = () => {
    localStorage.removeItem('state')
    
  };


  
const devTools = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_ && window.__REDUX_DEVTOOLS_EXTENSION_() : null
let store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())


export default store;
