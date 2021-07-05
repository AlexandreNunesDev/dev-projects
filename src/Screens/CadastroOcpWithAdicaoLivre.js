import React, { useContext, useEffect, useState } from 'react'
import { Form, Container, Col, Button,} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useHistory, withRouter } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';
import { withMenuBar } from '../Hocs/withMenuBar';
import GenericSelect from '../Components/GenericSelect'
import AdicaoFree from '../Components/AdicaoFree';
import { responseHandler } from '../Services/responseHandler';
import { withToastManager } from 'react-toast-notifications';
import { reloadState } from '../store';
import { toastOk } from '../Services/toastType';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';




const CadastroDeOcpLivre = (props) => {
  
    let analise = props.location.state
    const [parametros, setParametros] = useState([])
    const [parametro, setParametro] = useState(props.location.state?.parametroId || null)
    const context = useContext(WebSocketContext)
    const [materiasPrima] = useState()
    const [mpQtds, setMpQtd] = useState([])
    const [responsavel, setResponsavel] = useState('')
    const [observacao, setObservacao] = useState('')
    const [etapa, setEtapa] = useState(props.location.state?.etapaId || null)
    const [etapas,setEtapas] = useState([])
    const [processo,setProcesso] = useState(props.location.state?.processoId || null)
    const [processos,setProcessos] = useState([])
    const [mpNomes , setMpNome] = useState([])
    const history = useHistory()



    const saveOcp = () => {
    
        if(analise){
            ScqApi.CriarOcp({responsavel,observacao,mpQtds, parametroId : parametro ,analiseId : analise.id}).then((res) => responseHandler(res,props,"OrdemDeCorrecao",toastOk,context,[dispatchers().loadOcps]))
            history.push("/OrdensDeCorrecao")
        }
            ScqApi.CriarOcp({responsavel,observacao,mpQtds, parametroId : parametro,analiseId: null}).then((res) => responseHandler(res,props,"OrdemDeCorrecao",toastOk,context,[dispatchers().loadOcps]))
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

   

    const saveMpQtd = (quantidade,mpId,unidade,index,nome) => {


        let tempoMpQtd = mpQtds 
        let tempoMpNome = mpNomes;
        tempoMpQtd.splice(index,1,`${mpId}:${quantidade}:${unidade}`)
        tempoMpNome.splice(index,1,nome)
        setMpQtd(tempoMpQtd)
        setMpNome(tempoMpNome)
        
    }

    const removeMpQtd = (indexToRemove) => {
     
        let tempoMpQtd = mpQtds.filter((mpqtd,index) => {
            return index !== indexToRemove
        })
       
        
        setMpQtd(tempoMpQtd)
       
    }

    
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
                        <AdicaoFree setMpQtd={saveMpQtd} removeMpQtd={removeMpQtd} mpNomes={mpNomes} mpQtds={mpQtds} mpsOptions={materiasPrima}></AdicaoFree>
                            
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Responsavel: </Form.Label>
                                <Form.Control type="text" onChange={(event) => setResponsavel(event.target.value)}></Form.Control>
                            </Form.Group>
                    
                        <Form.Group as={Col}>
                            <Form.Label>Observação: </Form.Label>
                            <Form.Control type="text" placeholder={"Ex: Add. Cx. Misutra"} onChange={(event) => setObservacao(event.target.value)}></Form.Control>
                        </Form.Group>
                        </Form.Row>
                      
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