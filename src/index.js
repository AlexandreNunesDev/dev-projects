import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import {store} from './store';
import {persistor} from './store';
import WebSocketProvider from './websocket/wsProvider';
import { PersistGate } from 'redux-persist/integration/react'




ReactDOM.render(
  
  <BrowserRouter >
      <ToastProvider>
        <Provider store={store}> 
        <PersistGate loading={null} persistor={persistor}>
          <WebSocketProvider>
            <App/>
            </WebSocketProvider>
            </PersistGate>
        </Provider>
      </ToastProvider>
  </BrowserRouter>
 ,
    document.getElementById('root')
  );