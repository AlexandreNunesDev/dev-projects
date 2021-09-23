import React, { useContext, useEffect, useState } from 'react'
import { Form, Container, Col, Button,} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useHistory, withRouter } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';
import { withMenuBar } from '../Hocs/withMenuBar';
import GenericSelect from '../Components/GenericSelect'
import { responseHandler } from '../Services/responseHandler';
import { withToastManager } from 'react-toast-notifications';
import { toastOk } from '../Services/toastType';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';
import CadastroOcpWithAcaoLivre from './CadastroOcpWithAcaoLivre';
import CadastroOcpWithAdicaoLivre from './CadastroOcpWithAdicaoLivre';




const CadastroDeOcpLivre = (props) => {
  

    const [parametros, setParametros] = useState([])
    const [parametro, setParametro] = useState()
    const context = useContext(WebSocketContext)
  
    const [etapa, setEtapa] = useState()
    const [etapas,setEtapas] = useState([])
    const [processo,setProcesso] = useState()
    const [processos,setProcessos] = useState([])
    const [newOcp, setOcp] = useState([])
    const history = useHistory()
    let menuType = null;


    const saveOcp = () => {
        if(menuType==="Adicao") {
            ScqApi.CriarOcp(newOcp).then((res) => responseHandler(res,props,"OrdemDeCorrecao",toastOk,context,[dispatchers().loadOcps]))
        } else {
            ScqApi.CriarOcpAcao(newOcp).then((res) => responseHandler(res,props,"OrdemDeCorrecao",toastOk,context,[dispatchers().loadOcps]))
        }
            history.push("/OrdensDeCorrecao")
        }

    useEffect(() => {
        ScqApi.ListaProcessos().then(res => setProcessos(res))
    }, [])

    useEffect(() => {
        processo  && ScqApi.ListaEtapasByProcesso(processo).then(res => setEtapas(res))
      }, [processo])

    useEffect(() => {
        etapa && ScqApi.ListaParametrosByEtapa(etapa).then(res => setParametros(res))
    }, [etapa])
 

    const buildOcpMenu = () => {    
        if(parametro && parametros) {
            const actualParam = parametros.filter(param => Number(param.id) === Number(parametro))
            menuType = actualParam[0].menuType
           return  actualParam[0].menuType === "Adicao" ? <CadastroOcpWithAdicaoLivre parametroId={parametro} updateOcp={setOcp}></CadastroOcpWithAdicaoLivre> :  <CadastroOcpWithAcaoLivre parametroId={parametro} updateOcp={setOcp}></CadastroOcpWithAcaoLivre>
        } 
    }

    let cadastroOcpMenu = buildOcpMenu()

    
    return (
        <>
                    <Container style={{ marginTop: 20 }}>
                    <h1>Cadastro de Ordem de Correção Livre</h1>
                    <Form style={{ marginTop: 20 }}>
                    
                    <Form.Row>
                            <Col>
                                <GenericSelect selection={processo} displayType={"nome"} returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={processos} onChange={setProcesso}></GenericSelect>
                            </Col>
                            <Col>
                                <GenericSelect selection={etapa} displayType={"nome"} returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} ops={etapas} onChange={setEtapa}  ></GenericSelect>
                            </Col>
                            <Col>
                                <GenericSelect selection={parametro} displayType={"nome"} returnType={"id"} title={"Parametro"} default={"Escolha um Parametro"} ops={parametros} onChange={setParametro} ></GenericSelect>
                            </Col>
                        </Form.Row>
                        {cadastroOcpMenu}
                       
                        <Form.Row>
                        <Form.Group >
                            <Button style={{ margin: 2 }} onClick={() => {

                            }}>
                                Cancelar
                            </Button>
                            <Button style={{ margin: 2 }} type="reset" onClick={() => saveOcp()}>
                                Salvar
                            </Button>
                        </Form.Group>
                    </Form.Row>
                    </Form>
                        
                </Container>
            
           

        </>
    )


}



export default withRouter(withMenuBar(withToastManager(CadastroDeOcpLivre)))