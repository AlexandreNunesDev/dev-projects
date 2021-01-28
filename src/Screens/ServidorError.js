import React, {useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { withMenuBar } from '../Hocs/withMenuBar';
import Home from './Home';


const ServidorError = (props) => {

    const [redirect , setRedirect] = useState(true)

    
    

    return ( 
  
        redirect ?
            <Container>
                <h2>Problema com o servidor , tente novamente mais tarde</h2>
            </Container> 
        :
            <Redirect to={Home} ></Redirect>
   

    )
}

export default withMenuBar(ServidorError)