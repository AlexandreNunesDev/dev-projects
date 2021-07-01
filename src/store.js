import { createStore } from 'redux';
import rootReducer from './Reducers/combineReducers';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)


  export const store = createStore(persistedReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
  export const persistor = persistStore(store)
  


