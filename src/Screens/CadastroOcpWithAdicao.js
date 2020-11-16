import React, { useEffect, useState } from 'react'
import { Form, Container, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuBar from './MenuBar';
import { useHistory, withRouter } from 'react-router-dom';

import ScqApi from '../Http/ScqApi';

import fileSaver from "file-saver"
import AdicaoComposition from '../Components/AdicaoComposition';
import AdicaopH from '../Components/AdicaopH';



const redirectOcps = (history) => {
    history.push("/OrdensDeCorrecao")
}

const redirectAnalise = (history, analise) => {
    history.push("/RegistroAnalise", analise)
}

const downloadOcp = (fileName,history) => {
    ScqApi.DownloadOcp(fileName).then(file => fileSaver.saveAs(file,fileName)).then(() => redirectOcps(history))
    
    
}


const saveOcp = (analise, mpQtds, responsavel, observacao, history) => {
    if(analise.ocpId){
        ScqApi.EditarAnalise(analise).then(res => {
            const newOcp = { id: analise.ocpId, responsavel: responsavel, observacao: observacao, statusCorrecao: false, statusocp: false, analiseId: res.id }
            ScqApi.CriarOcp(newOcp).then(ocp => {
                let newAdicoes = []
                
                        mpQtds.forEach((pairMpQtd)=>{
                        let token = pairMpQtd.split(":")
                        newAdicoes = newAdicoes.concat({ id: null, quantidade: token[1], materiaPrimaId: token[0], ordemId: ocp.id,unidade :token[2] })
                    })
                    ScqApi.CriarAdicao(newAdicoes).then(res => downloadOcp(res,history) )
                })
               
               
            })
    } else {
        ScqApi.CriarAnalise(analise).then(res => {
            const newOcp = { id: null, responsavel: responsavel, observacao: observacao, statusCorrecao: false, statusocp: false, analiseId: res.id }
            ScqApi.CriarOcp(newOcp).then(ocp => {
                let newAdicoes = []
 
                        mpQtds.forEach((pairMpQtd)=>{
                        let token = pairMpQtd.split(":")
                        newAdicoes = newAdicoes.concat({ id: null, quantidade: token[1], materiaPrimaId: token[0], ordemId: ocp.id,unidade :token[2] })
                    })
                    ScqApi.CriarAdicao(newAdicoes).then(res => downloadOcp(res,history) )
                })
               
               
            })
    }
   

}

const CadastroDeOcp = (props) => {
    let history = useHistory();
    const [analise, setAnalise] = useState()
    const [parametro, setParametro] = useState()
   
    const [materiasPrima, setMateriasPrima] = useState()
    const [mpQtds, setMpQtd] = useState([])
    const [responsavel, setResponsavel] = useState('')
    const [observacao, setObservacao] = useState('')
    const [etapa, setEtapa] = useState()
    const [correcaoArray , setCorrecaoArray] = useState([])
    const [adicaoMenu, setAdicaoMenu] = useState()
    let unidade = ""



    useEffect(() => {
        const analise = props.location.state
        setAnalise(analise)
        ScqApi.FindParametro(analise.parametroId).then(res => setParametro(res))


    }, [props.location.state])

    useEffect(() => {
        parametro && ScqApi.FindEtapa(parametro.etapaId).then(res => {parametro.unidade === "pH" ? unidade = "" : unidade = parametro.unidade; setEtapa(res)})

    }, [parametro])

    useEffect(() => {
        etapa && ScqApi.FindMateriaPrimaByEtapaId(etapa.id).then(res => setMateriasPrima(res))
    }, [etapa])

    useEffect(() => {
        materiasPrima && calcularCorrecaoArray()
        
       
    },[materiasPrima])

   useEffect(() => {
    if(parametro){
        if(String(parametro.unidade)==="pH"){
            setAdicaoMenu(<AdicaopH materiasPrima={materiasPrima} setMpQtd={saveMpQtd}></AdicaopH>)
        } else {
            setAdicaoMenu(<AdicaoComposition mps={materiasPrima} setMpQtd={saveMpQtd} correcaoArray={correcaoArray}></AdicaoComposition>)
        }
    }
   },[correcaoArray])


    const saveMpQtd = (quantidade,mpId,unidade,index) => {
        console.log(quantidade,mpId,unidade)
        let tempoMpQtd = mpQtds 
        tempoMpQtd.splice(index,1,`${mpId}:${quantidade}:${unidade}`)
        
        setMpQtd(tempoMpQtd)
     
    }

    const calcularCorrecaoArray = () => {
        let tempCorrecaoArray = []
        let correcaoTotal = 0
        materiasPrima && materiasPrima.forEach((mp => {
            if(String(parametro.formula).includes(mp.fatorTitulometrico)){
                let nominal = (parametro.pMax + parametro.pMin) / 2
                let valorCorrecao = 0
                if(analise.resultado<nominal) {
                   valorCorrecao = (etapa.volume * (nominal - analise.resultado))/1000
                   correcaoTotal = correcaoTotal + valorCorrecao
                } 
                let pairCorrecaoMp = `${mp.id}:${Math.round(valorCorrecao * 100) /100 }`
                tempCorrecaoArray = tempCorrecaoArray.concat(pairCorrecaoMp)
                  setCorrecaoArray(tempCorrecaoArray)
            } else {
                 etapa.proportionMps.forEach((proportion)=> {
                    let pair = String(proportion).split(":")
                    if(String(mp.id) === String(pair[0])){
                        let pairCorreMp = `${mp.id}:${Math.round(correcaoTotal * pair[1]  * 100) /100 }`
                        tempCorrecaoArray = tempCorrecaoArray.concat(pairCorreMp)
                         setCorrecaoArray(tempCorrecaoArray)
                    }
                })

                
            }
        }))
        
    }



    return (
        <>
            <header>
                <MenuBar></MenuBar>
            </header>

            <Container style={{ marginTop: 20 }}>
                <h1>Cadastro de Ordem de Correção</h1>
                <Form style={{ marginTop: 20 }}>
                    {parametro &&
                        <Form.Row>
                            {etapa &&
                                <Form.Group xs={3} as={Col}>
                                    <Form.Label>Etapa : {etapa.nome}</Form.Label>
                                </Form.Group>
                            }
                            <Form.Group xs={3} as={Col} >
                                <Form.Label>Parametro : {`${parametro.nome}`}</Form.Label>
                            </Form.Group>

                            <Form.Group xs={2} as={Col}>
                                <Form.Label>Faixa Mininima : {`${parametro.pMin} ${unidade}`}</Form.Label>
                            </Form.Group>
                            <Form.Group xs={2} as={Col} >
                                <Form.Label>Faixa Máxima : {`${parametro.pMax} ${unidade}`}</Form.Label>
                            </Form.Group>
                            <Form.Group xs={2} as={Col} >
                                <Form.Label style={{ color: analise.status === "fofe" ? 'red' : 'black' }}>Resultado: {`${analise.resultado} ${unidade}`}</Form.Label>
                            </Form.Group>

                        </Form.Row>
                    }
                      {adicaoMenu && adicaoMenu}
                        
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
                                redirectAnalise(history, analise)
                                redirectAnalise(history)
                            }}>
                                Cancelar
                    </Button>
                            <Button style={{ margin: 2 }} type="reset" onClick={() => {
                                saveOcp(analise, mpQtds, responsavel, observacao, history)

                            }}>
                                Salvar
                    </Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Container>

        </>
    )


}



export default withRouter(CadastroDeOcp)