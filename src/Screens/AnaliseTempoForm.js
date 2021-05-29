import ScqApi from "../Http/ScqApi"
import React from 'react'


const { Form, Button, Col } = require("react-bootstrap")

class AnaliseTempoForm extends React.Component {

    constructor(props){
        super(props)
        this.refText = React.createRef()

        this.State = {
            tempo : '',
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
            <>
              <Form.Row>
                  <Col>
                  <Form.Label>
                     Viragem
                 </Form.Label>
                  </Col>
              </Form.Row>
            <Form.Row>
               
     
                    <Col>
                        <Form.Control type="number" ref={this.refText} placeholder={"0.00"}   onChange={(event) => this.setState({viragem : event.target.value})} />
                    </Col>
                   
      

                    <Col>
                   
                        <Button variant="primary" hidden={this.state?.isHidden} onClick={() => { this.calcular()}}>Calcular</Button>
                        <Button variant="primary" hidden={!this.state?.isHidden} onClick={() => { this.recalcular()}}>Recalcular</Button>
                    </Col>

            </Form.Row>
            </>
            
        )
    }
    
}

export default AnaliseTempoForm