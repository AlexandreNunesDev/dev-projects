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


  
  const saveState = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch (e) {
      // Ignore write errors;
    }
  };

  

  export const reloadState = () => {
    localStorage.removeItem('state')
    
  };


  
const devTools = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_ && window.__REDUX_DEVTOOLS_EXTENSION_() : null
let store = createStore(rootReducer);
store.subscribe(() => {saveState(store.getState());});

export default store;
