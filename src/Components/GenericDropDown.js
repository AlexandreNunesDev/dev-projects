import React, { useState } from 'react'
import {Dropdown } from 'react-bootstrap'

const GenericDropDown = (props) => {

    const [toggleView, setToggle] = useState(props.display);

    return (
    <Dropdown>
        <Dropdown.Toggle style={{margin : props.margin}} variant="success" id="dropdown-linha">
            {toggleView}
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