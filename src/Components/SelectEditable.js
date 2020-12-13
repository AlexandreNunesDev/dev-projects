import React, { useState, useEffect, useRef } from 'react'
import { Form } from 'react-bootstrap'


const SelectEditable = (props) => {

    const [inputType, setInputType] = useState('select');
    const [value, setValue] = useState();
    const [options] = useState(props.ops)
    const textRef = useRef()
    const selectRef = useRef()
    const {getValue} = props
 
    

    useEffect(() => {
        if(inputType==="text") {
            textRef.current.focus()
        } else {
            selectRef.current.focus()
        }
        
        
    }, [inputType])

    useEffect(() => {
        
        async function update () {
            getValue(value)
        }
        update()
    },[value,getValue])

         if(inputType==="text") {
             return(
            <Form.Control ref={textRef} type={"text"} value={value} onChange={(event) => {setValue(event.target.value); props.getValue(value)}} onBlur={() => {if(!options.includes(value)) {options.push(value)}  setInputType("select")}}>
              
            </Form.Control>
             )
         } else {
            return (
            <Form.Control ref={selectRef} as={"select"} value={value} onDoubleClick={(event) => setInputType("text")} onChange={(event) =>  {setValue(event.target.value)}} onBlur={() => setInputType("select")} >
              <option unselectable="on">-- {props.default} --</option>
                    {options && options.map((op,index) =>{
                        if(op === props.value) {
                            return  <option selected={true} value={op} key={index}>{op}</option>
                        } else {
                            return <option  value={op} key={index}>{op}</option>}})
                    }
            </Form.Control>
            )
         }
   
        





}

export default SelectEditable