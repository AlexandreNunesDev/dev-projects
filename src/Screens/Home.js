import React, { Fragment } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import { withMenuBar } from '../Hocs/withMenuBar';

class Home extends React.Component {

   

    


    render() {
  
               return (
                <Fragment>

                </Fragment>
                            
                )
     
            
       

    }

}

export default withRouter(withMenuBar(Home))