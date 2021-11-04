import React, { useEffect, useState} from 'react'
import {Form} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { connect } from 'react-redux';



const UnidadeSelect = (props) =>{

    const [options, setOptions] = useState()
    const diasemana = ["Segunda","Terça","Quarta","Quinta","Sexta","Sabado","Domingo"]
    const frequenciaAnalise = ["Minuto","Hora","Dia","Mes"]
    const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
    const parametros = props.unidades 
    const adicao = ["Kg","Lts","ml","gr"]
    
    

    
        useEffect(() => {
            if(props.type === "diasemana"){
                setOptions(diasemana)
            }
            if(props.type === "meses") {
                setOptions(meses)
            } 
            if(props.type === "parametros") {
                setOptions(parametros)
            }
            if(props.type === "adicao") {
                setOptions(adicao)
            }
            if(props.type === "frequenciaAnalise"){
                setOptions(frequenciaAnalise)
            }
        }, [])
        
    
    
    return ( 
        
        <Form.Group>
            <Form.Label>{props.title}</Form.Label>
            <Form.Control as="select"  onChange={(event) => {props.onChange(event.target.value)}}>
            <option unselectable="on" >-- {props.default} --</option>
            {options && options.map((option,index) => {
                if(option === props.selection) {
                    return <option key={index} selected={true} value={option}>{option}</option>
                }else {
                    return <option key={index} value={option}>{option}</option>
                }
                
            }) }
            </Form.Control>
        </Form.Group>
    )   


}


export default  connect(mapToStateProps.toProps, dispatchers)(UnidadeSelect)