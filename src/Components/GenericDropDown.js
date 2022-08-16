import React, { useState } from 'react'
import {Dropdown } from 'react-bootstrap'

const GenericDropDown = (props) => {

    const [toggleView, setToggle] = useState(props.display);

    return (
    <Dropdown style={{margin : 2}}>
        <Dropdown.Toggle style={{margin : props.margin}} variant="success" id="dropdown-linha">
            {toggleView || props.defaultDisplay }
        </Dropdown.Toggle>
        <Dropdown.Menu id='linhaDropDownItens'>
        {props.itens.map((item,index)=>{
        return(<Dropdown.Item  onClick={() => {
            setToggle(props.showType ? item[props.showType] : item)
            props.onChoose(item[props.returnType] || item)}} key={item.id || index}>{item[props.showType] || item}</Dropdown.Item>)})}
       </Dropdown.Menu>
    </Dropdown>
    )

}

export default GenericDropDown