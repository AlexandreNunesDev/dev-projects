import React from 'react'
import {Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


/* */


const GenericSelect = ({noLabel, title, onChange, ops,selection, returnType ,displayType }, props) => {


            return ( 
                <Form.Group >
                    <Form.Label hidden={noLabel}>{title}</Form.Label>
                    <Form.Control as="select" onChange={(event) => {onChange(event.target.value)}}>
                    <option unselectable="on" key={0}>-- {props.default ? props.default : "Seleciona uma Opção"} --</option>
                    {ops && ops.map((op,index) =>{
                        
                        if(Number(op.id || op) === Number(selection)) {
                            if(title === "Parametro"){
                                return  <option selected={true} value={op[returnType] || op} key={op.id || index}>{op.nome || op} {op.analiseHoje && "-ok-"}</option>
                            } else {
                                return  <option selected={true} value={op[returnType] || op} key={op.id || index}>{op.nome || op} </option>
                            }
                           
                        } else {
                            if(title === "Parametro") {
                                return <option value={op[returnType] || op} key={op.id || index} >{typeof op !== "object" ? op : op[displayType] || op.nome} {op.analiseHoje && "-ok-"}</option>
                            } else {
                                return <option value={op[returnType] || op} key={op.id || index}>{typeof op !== "object" ? op : op[displayType] || op.nome} </option>
                            }
                            
                        }})
                    }
                    </Form.Control>
                </Form.Group>
            )   
    
       
    }


export default GenericSelect