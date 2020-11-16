import React, { Fragment } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from './MenuBar';

import { withRouter } from 'react-router-dom';

class Home extends React.Component {

   



    render() {
  
               return (
                    <Fragment>
                        <header>
                            <MenuBar></MenuBar>
                        </header>
                    </Fragment>
                            
                )
     
            
       

    }

}

export default withRouter(Home)