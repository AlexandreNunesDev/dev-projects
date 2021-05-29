import React, { createContext } from 'react'
import { Client } from '@stomp/stompjs';
import dispatchers from '../mapDispatch/mapDispathToProps';
import store from '../store';
import * as storeService from '../Services/storeService';
import { actions } from '../actions/actions';
import { useDispatch } from 'react-redux';

const WebSocketContext = createContext(null)
const SOCKET_URL = 'wss://scqapi/gs-guide-websocket'


export { WebSocketContext }

export default ({ children }) => {
    let socket;
    let ws;
  
    const dispatch =  useDispatch()

    const sendMessage = (clickedReducerFunction,payload) => {
       
        socket.publish({
            destination: '/app/dispatcher',
            body: JSON.stringify(clickedReducerFunction.name),
            headers: { priority: '9' },
          });
       
    }


    const onConnect = () => {
        console.log("Socket Conectado")
        socket.subscribe("/reducer/return", (message) => {
            
            const bodyMsg = JSON.parse(message.body)
           
            const functionName = bodyMsg.content
            console.log(functionName)
            const action = actions[functionName]()
            storeService[functionName](null,action)
            
        })
    }

    const onDisconnect = () => {
        console.log("socket desconectado")
        socket.deactivate()
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