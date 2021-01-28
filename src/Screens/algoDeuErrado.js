import React, {useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { withMenuBar } from '../Hocs/withMenuBar';
import Home from './Home';


const AlgoDeuErrado = (props) => {

    const [redirect , setRedirect] = useState(true)

    
    

    return ( 
  
        redirect ?
            <Container>
                <h2>Algo deu Errado!</h2>
            </Container> 
        :
            <Redirect to={Home} ></Redirect>
   

    )
}

export default withMenuBar(AlgoDeuErrado)