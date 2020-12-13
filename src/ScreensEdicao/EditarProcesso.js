import React, { Fragment,useState, useEffect } from 'react'
import { Button, Form, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModoEdicao from '../Screens/ModoEdicao'
import MenuBar from '../Screens/MenuBar';
import ScqApi from '../Http/ScqApi';
import {withToastManager} from 'react-toast-notifications'
import { useHistory } from 'react-router-dom';
import {capitalize,subId} from '../Services/stringUtils'

const EditarProcesso = (props) => {

    const [id , setId] = useState()
    const [nome, setNome] = useState()
    const [isEditableSelected, setIsEditableSelected] = useState(false)
    const [edited, setEdited] = useState(false)
    const {toastManager} = props 
    const history = useHistory()
    const [processo, setProcesso] = useState()
    



    const submitForm = (event) => {
        const replaceProcesso = { id: id, nome: nome }
        ScqApi.EditarProcesso(replaceProcesso).then(res =>  responseHandler(res))
         
    }

    const responseHandler = (response) => {
        const { toastManager } = props;
        if(response.error){
            response.data.forEach(erro => {
                toastManager.add(`${subId(capitalize(erro.field))} : ${erro.error}`, {
                    appearance: 'error', autoDismiss: true
                  })});
        } else {
            toastManager.add(`Processo ${response.nome} editado com sucesso`, {
                appearance: 'success', autoDismiss: true
              })
        }
    }

  

    useEffect(() => {
        if(processo) {
            setNome(processo.nome)
            setId(processo.id)
            setIsEditableSelected(true)
        }
        
    },[processo])

    useEffect(() => {
        setId('')
        setNome('')
        setIsEditableSelected(false)
    },[edited])
       
    
  
   
    

        return (
            <Fragment>
                
                
                <header>
                    <MenuBar></MenuBar>
                </header>
                    <Container style={{ marginTop: 20 }}>
                        <h1>Editar Processo</h1>
                       
                        <Form>
                        <h4>Escolha o Processo para editar</h4>
                        <ModoEdicao edited={edited} onDelete={(deleteMessage) => {toastManager.add(`${deleteMessage}`, {appearance: 'success', autoDismiss: true,onDismiss: () => { history.push("/CadastroProcesso")}}); setEdited(!edited)}} type={"processo"} getSelectedProcesso={(processo) => setProcesso(processo)}></ModoEdicao>
                            <Form.Group style={{ marginTop: 20 }} hidden={!isEditableSelected}>
                                 <Form.Label style={{color : "RED" ,fontWeight : "bold"}} >Processo Id: {id}</Form.Label>
                            </Form.Group>
                            <Form.Group controlId="processoLinhaNome">
                                <Form.Label>Processo: </Form.Label>
                                <Form.Control value={nome} type="text" placeholder="Entre o nome do Processo" onChange={event => setNome(event.target.value)} />
                            </Form.Group>
                            <Form.Group>
                                
                               
                                <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={(event => submitForm(event))}  >Salvar</Button>
                            </Form.Group>
                        </Form>
                    </Container>
                
            </Fragment>
        )


}

export default withToastManager(EditarProcesso)