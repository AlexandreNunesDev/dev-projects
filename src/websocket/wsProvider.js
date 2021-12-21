import React, { createContext } from 'react'
import { Client } from '@stomp/stompjs';
import { useDispatch, useStore } from 'react-redux';
import { useHistory } from 'react-router';
import { isTokenExpired } from '../Services/auth';
import dispatchers from '../mapDispatch/mapDispathToProps';



const WebSocketContext = createContext(null)
const SOCKET_URL = 'wss://scqapi.com/gs-guide-websocket'
const SOCKET_URL_TEST = 'wss://scqapi.com/gs-guide-websocket'


export { WebSocketContext }

export default ({ children }) => {
    let socket;
    let ws;
  
    const dispatch =  useDispatch()
    const store = useStore()
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
        
   
       
        socket.subscribe("/reducer/return", (message) => {
            
            if((store.getState().global.isAuth) &&  (isTokenExpired(store.getState().global.tokenExpiration))){
                history.push("/VoceFoiDesconectado")
            } else {
                const bodyMsg = JSON.parse(message.body)
            
                if(bodyMsg.type === 'action'){
                    const actionObj = bodyMsg.action
                    dispatch(actionObj)
                  
                } else {
                    const functionName = bodyMsg.function
                    dispatchers(dispatch)[functionName]()
                   
                }
            }
           
           
            
        })
    }

  

    const onDisconnect = () => {
        console.log("socket desconectado")
        socket.deactivate()
        dispatchers(dispatch).setLogOut()
    }



    if (socket == null) {
        socket =  new Client({
            brokerURL: process.env.NODE_ENV === "production" ? SOCKET_URL : SOCKET_URL_TEST,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: onConnect,
            onDisconnect: onDisconnect,
         
            
          });
          if(store.getState().global.isAuth) {
            socket.activate()  
          }
         
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