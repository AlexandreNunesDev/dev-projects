import React from 'react';

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