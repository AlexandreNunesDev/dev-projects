import React from 'react'
import {Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


/* */


const GenericSelect = (props) => {


            return ( 
                <Form.Group >
                    <Form.Label hidden={props.noLabel}>{props.title}</Form.Label>
                    <Form.Control as="select" onChange={(event) => {props.onChange(event.target.value)}}>
                    <option unselectable="on" key={0}>-- {props.default ? props.default : "Seleciona uma Opção"} --</option>
                    {props.ops && props.ops.map((op,index) =>{
                        
                        if(Number(op.id || op) === Number(props?.selection)) {
                            if(props.title === "Parametro"){
                                return  <option selected={true} value={op[props.returnType] || op} key={op.id || index}>{op.nome || op} {op.analiseHoje && "-ok-"}</option>
                            } else {
                                return  <option selected={true} value={op[props.returnType] || op} key={op.id || index}>{op.nome || op} </option>
                            }
                           
                        } else {
                            if(props.title === "Parametro") {
                                return <option value={op[props.returnType] || op} key={op.id || index} >{typeof op !== "object" ? op : op[props.displayType] || op.nome} {op.analiseHoje && "-ok-"}</option>
                            } else {
                                return <option value={op[props.returnType] || op} key={op.id || index}>{typeof op !== "object" ? op : op[props.displayType] || op.nome} </option>
                            }
                            
                        }})
                    }
                    </Form.Control>
                </Form.Group>
            )   
    
       
    }


export default GenericSelect