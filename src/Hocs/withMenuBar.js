import React from 'react';
import { Container } from 'react-bootstrap';

import MenuBar from '../Components/MenuBar';

export const withMenuBar = (Component) => {

   const withMenuBar = (props) => {
        return <>
    
        
        <MenuBar></MenuBar>
 
        <Component {...props}/>
   
        </>
    }
    return withMenuBar

}