import React, { createContext } from 'react'
import { Client } from '@stomp/stompjs';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useHistory } from 'react-router';
import { isTokenExpired } from '../Services/auth';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { logOut, setIsConnectedSocket } from '../Reducers/globalConfigReducer';



const WebSocketContext = createContext(null)
const SOCKET_URL = 'wss://scqapi.com/gs-guide-websocket'
const SOCKET_URL_TEST = 'ws://localhost:8080/gs-guide-websocket'


export { WebSocketContext }

export default ({ children }) => {
    let socket;
    let ws;

    const dispatch = useDispatch()
    const global = useSelector(state => state.global)




    const sendMessage = (clickedReducerFunction, action, route) => {
        const message = clickedReducerFunction == null ? { type: 'action', action: action, route: route } : { type: 'function', functions: clickedReducerFunction, route: route }


        socket.publish({
            destination: '/app/dispatcher',
            body: JSON.stringify(message),
            headers: { priority: '9' },
        });

    }




    const onConnect = () => {
        if (global.isConectedSocket == null) {
            dispatch(setIsConnectedSocket(true))
            socket.subscribe("/reducer/return", (message) => {
                const bodyMsg = JSON.parse(message.body)
                if (bodyMsg.type === 'action') {
                    const actionObj = bodyMsg.action
                    dispatch(actionObj)
                } else {
                    const functionsName = bodyMsg.functions
                    functionsName.forEach(functionName => dispatchers(dispatch)[functionName]())
                }
            })
        }


    }


    const onDisconnect = () => {
        socket.deactivate()
        dispatch(logOut())
        dispatch(setIsConnectedSocket(false))
    }



    if ((global.isAuth) && (global.isConectedSocket == null)) {
       
        socket = new Client({
            brokerURL: process.env.NODE_ENV === "development" ? SOCKET_URL : SOCKET_URL_TEST,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: onConnect,
            onDisconnect: onDisconnect,
        });
        socket.activate()



    }


    ws = {
        socket: socket,
        sendMessage
    }

    return (
        <WebSocketContext.Provider value={{ ws: ws }} >
            {children}
        </WebSocketContext.Provider>
    )
}