import React, { createContext } from 'react'
import { Client } from '@stomp/stompjs';
import dispatchers from '../mapDispatch/mapDispathToProps';
import store from '../store';
import * as storeService from '../Services/storeService';
import { actions } from '../actions/actions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { logout } from '../Services/auth';

const WebSocketContext = createContext(null)
const SOCKET_URL = 'wss://scqapi.com/gs-guide-websocket'
const SOCKET_URL_TEST = 'ws://localhost:8080/gs-guide-websocket'


export { WebSocketContext }

export default ({ children }) => {
    let socket;
    let ws;
  
    const dispatch =  useDispatch()
    const history = useHistory()

    const sendMessage = (clickedReducerFunction,action,route) => {
        const message = clickedReducerFunction == null ? {type : 'action' , action : action,route : route } :  {type: 'function',function : clickedReducerFunction.name, route : route}
   
     
        socket.publish({
            destination: '/app/dispatcher',
            body: JSON.stringify(message),
            headers: { priority: '9' },
          });
          
    }


    const onConnect = () => {
        console.log("Socket Conectado")
        socket.subscribe("/reducer/return", (message) => {
            
            const bodyMsg = JSON.parse(message.body)
            
            
            console.log(bodyMsg)
            if(bodyMsg.type == 'action'){
                const actionObj = bodyMsg.action
                dispatch(actionObj)
                bodyMsg.route && history.push("/"+bodyMsg.route);
            } else {
                const functionName = bodyMsg.function
                const action = actions[functionName]()
                storeService[functionName](null,action)
                bodyMsg.route && history.push("/"+bodyMsg.route);
            }
           
            
        })
    }

    const onDisconnect = () => {
        console.log("socket desconectado")
        socket.deactivate()
        logout()
    }

    if (socket == null) {
        socket =  new Client({
            brokerURL: SOCKET_URL,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: onConnect,
            onDisconnect: onDisconnect
          });
          socket.activate()  
    }


    ws = {
        socket: socket,
        sendMessage
    }

    return (
        <WebSocketContext.Provider value={{ws : ws}} >
            {children}
        </WebSocketContext.Provider>
    )
}