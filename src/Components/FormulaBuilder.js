import React, {Component } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FormulaKeyboard from './FormulaKeyboard';
import ScqApi from '../Http/ScqApi';
import {insert} from 'underscore.string'

class FormulaBuilder extends Component {
  
    
    constructor (props){
      super(props)
      this.formulaTextRef = React.createRef()
     
      this.state = {
        show : false,
        formula : '',
        parametros : [],
        parametro : {},
        materiasPrima : [],
       
      }
    }



      componentDidUpdate(prevProps) {

          this.props.etapaId && this.state.materiasPrima.length===0 && ScqApi.FindMateriaPrimaByEtapaId(this.props.etapaId).then(res => this.setState({
            materiasPrima : res
          }))
        
        
      } 

      handleClose = () => this.setState({show : false})
      handleShow = () => this.setState({formula : '',show : true})

      onFormulaChange = (event) => {
        this.setState({formula : event.target.value
        })
      } 

      onPlusClick = () => {
        this.formulaInsert("*")
      }
      onDivideClick = () => {
        this.formulaInsert('/')
      }
      onAddClick = () => {
        this.formulaInsert('+')
      }

      onMinusClick = () => {
        this.formulaInsert('-')
      }
      onViragemClick = () => {
        this.formulaInsert('[V]')
      }
      onPowClick = () =>{
        this.formulaInsert('^')
      }

      formulaInsert = (charToInsert) => {
        this.formulaTextRef.current.value = insert(this.formulaTextRef.current.value,this.formulaTextRef.current.selectionStart,charToInsert)
        this.setState({formula : this.formulaTextRef.current.value})
        this.formulaTextRef.current.focus()
      }

    


      onProcessoChoosen = (linhaId) => {
        ScqApi.ListaEtapasByProcesso(linhaId).then(res => {
          this.setState({
            etapas : res
          })
        })
      }

      onEtapaChoosen = (etapaId) => {
        ScqApi.ListaParametrosByEtapa(etapaId).then(res => {
          this.setState({
            parametros : res
          })
        })
      }

      onParametroChoosen = (parametroId) => {
        this.formulaInsert('[da' + parametroId + ']')
     
      }

      onMateriaPrimaChoosen = (materiaPrimaFator) => {
        this.formulaInsert(materiaPrimaFator)
      }

      onDeleteClick = () => {
        this.formulaTextRef.current.value = ''
      }

  
    render(){
    
    return (
      <>
        <Button variant="primary" onClick={() => this.handleShow()}>
          Abrir Editor de Formula
        </Button>
  
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Editor de Formula</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group controlId="formulaFormulaBuilder">
                    <Form.Label>Formula de Viragem: </Form.Label>
                    <Form.Control ref={this.formulaTextRef} type="text"  onChange={this.onFormulaChange}/>
                </Form.Group>
              
                <FormulaKeyboard processos={this.props.processos} etapas={this.state.etapas} parametros={this.state.parametros} meteriasPrima={this.state.materiasPrima}
                onDeleteClick={this.onDeleteClick}
                onProcessoChoosen={this.onProcessoChoosen}
                onEtapaChoosen={this.onEtapaChoosen}
                onParametroChoosen={this.onParametroChoosen}
                onMateriaPrimaChoosen={this.onMateriaPrimaChoosen}
                onPlusClick={this.onPlusClick} onMinusClick={this.onMinusClick} onAddClick={this.onAddClick} 
                onDivideClick={this.onDivideClick} onViragemClick={this.onViragemClick}
                onPowClick={this.onPowClick} 
                ></FormulaKeyboard>
            
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => {
              this.props.onClose(this.state.formula)
              this.handleClose()}}>
              Salvar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
  

  export default FormulaBuilder;