import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import store from './store';
import WebSocketProvider, { WebSocketContext } from './websocket/wsProvider';




ReactDOM.render(
  
  <BrowserRouter>
      <ToastProvider>
        <Provider store={store}> 
          <WebSocketProvider>
            <App/>
            </WebSocketProvider>
        </Provider>
      </ToastProvider>
  </BrowserRouter>
 ,
    document.getElementById('root')
  );