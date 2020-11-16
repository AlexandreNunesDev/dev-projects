import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import 'bootstrap/dist/css/bootstrap.min.css';




ReactDOM.render(
  <BrowserRouter forceRefresh={true}>
    
      <ToastProvider>
          <App/>
      </ToastProvider>
  </BrowserRouter>,
    document.getElementById('root')
  );