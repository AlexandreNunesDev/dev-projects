import React from 'react';

import MenuBar from '../Components/MenuBar';

export const withMenuBar = (Component) => {

   const withMenuBar = (props) => {
        return <>
        <header>
            <MenuBar></MenuBar>
        </header>
        <Component {...props}/>
        </>
    }
    return withMenuBar

}