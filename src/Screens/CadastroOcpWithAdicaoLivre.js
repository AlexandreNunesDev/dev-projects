import React, { useEffect, useState } from 'react'
import { Form, Container, Col, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory, withRouter } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';
import AdicaoComposition from '../Components/AdicaoComposition';
import AdicaopH from '../Components/AdicaopH';
import { withMenuBar } from '../Hocs/withMenuBar';
import GenericSelect from '../Components/GenericSelect'
import AdicaoFree from '../Components/AdicaoFree';
import { responseHandler } from '../Services/responseHandler';
import { withToastManager } from 'react-toast-notifications';




const CadastroDeOcpLivre = (props) => {
    let history = useHistory();
    const [parametros, setParametros] = useState([])
    const [parametro, setParametro] = useState()
   
    const [materiasPrima, setMateriasPrima] = useState()
    const [mpQtds, setMpQtd] = useState([])
    const [responsavel, setResponsavel] = useState('')
    const [observacao, setObservacao] = useState('')
    const [etapa, setEtapa] = useState()
    const [etapas,setEtapas] = useState([])
    const [processo,setProcesso] = useState()
    const [processos,setProcessos] = useState([])
    const [mpNomes , setMpNome] = useState([])

    let unidade = ""

    const saveOcp = () => {
        ScqApi.CriarOcp({responsavel,observacao,mpQtds, parametroId : parametro}).then((res) => responseHandler(res,props,"Ordem de Correcao"))
    }

    useEffect(() => {
      ScqApi.ListaProcessos().then(res => setProcessos(res))

    }, [])

    useEffect(() => {
        processo && ScqApi.ListaEtapasByProcesso(processo).then(res => setEtapas(res))
        
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
        
        console.log(tempoMpQtd)
    }

    const removeMpQtd = (indexToRemove) => {
     
        let tempoMpQtd = mpQtds.filter((mpqtd,index) => {
            return index != indexToRemove
        })
       
        
        setMpQtd(tempoMpQtd)
       
        console.log(mpQtds)
    }

    
    return (
        <>
                    <Container style={{ marginTop: 20 }}>
                    <h1>Cadastro de Ordem de Correção Livre</h1>
                    <Form style={{ marginTop: 20 }}>
                    
                    <Form.Row>
                            <Col>
                                <GenericSelect displayType={"nome"} returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={processos} onChange={setProcesso} selection={processo?.id}></GenericSelect>
                            </Col>
                            <Col>
                                <GenericSelect displayType={"nome"} returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} ops={etapas} onChange={setEtapa} selection={etapa?.id} ></GenericSelect>
                            </Col>
                            <Col>
                                <GenericSelect displayType={"nome"} returnType={"id"} title={"Parametro"} default={"Escolha um Parametro"} ops={parametros} onChange={setParametro} selection={parametro?.id} ></GenericSelect>
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