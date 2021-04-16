import ScqApi from "../Http/ScqApi"
import React from 'react'
import NumberFormat from "react-number-format"

const { Form, Button, Col } = require("react-bootstrap")

class TitulaForm extends React.Component {

    constructor(props){
        super(props)
        this.refText = React.createRef()

        this.State = {
            viragem : '',
            isHidden : false,
            
        }
        
    }


    calcular = () => {
        ScqApi.Calcular(this.props.formula, this.state.viragem).then(res => {
            this.props.onCalculaResultado(res)
            this.setState({
                isHidden : true
            })
            this.refText.current.value = res

        })
    }

    recalcular = () => {
        this.refText.current.value = ''
        this.setState({
            isHidden : false
        })
        
    }

    render() {
        return (
            <Form.Row>
                <Form.Group as={Col} >
                    <Form.Control type="text" ref={this.refText} placeholder={"0.00"}  allowedDecimalSeparators={["."]} onChange={(event) => this.setState({viragem : event.target.value})} />
                </Form.Group>
                <Form.Group as={Col} >
                    <Button variant="primary" hidden={this.state?.isHidden} onClick={() => { this.calcular()}}>Calcular</Button>
                    <Button variant="primary" hidden={!this.state?.isHidden} onClick={() => { this.recalcular()}}>Recalcular</Button>
                </Form.Group>
            </Form.Row>
        )
    }
    
}

export default TitulaForm