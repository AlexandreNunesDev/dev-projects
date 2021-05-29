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


  

let store = createStore(rootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
store.subscribe(() => {saveState(store.getState());});

export default store;