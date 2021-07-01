import React, { useContext, useEffect, useState } from 'react'
import { Form, Container, Col, Button, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory, withRouter } from 'react-router-dom';
import ScqApi from '../Http/ScqApi';
import AdicaoComposition from '../Components/AdicaoComposition';
import AdicaopH from '../Components/AdicaopH';
import { withMenuBar } from '../Hocs/withMenuBar';
import { responseHandler } from '../Services/responseHandler';
import { withToastManager } from 'react-toast-notifications';
import { connect } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import {loadOcps} from '../Services/storeService'
import { WebSocketContext } from '../websocket/wsProvider';



const redirectOcps = (history) => {
    history.push("/OrdensDeCorrecao")
}

const redirectAnalise = (history, analise) => {
    history.push("/RegistroAnalise", analise)
}


const saveOcp = (analise, mpQtds, responsavel, observacao, history ,props,context) => {

    const fullAnaliseForm = { ...analise, responsavel: responsavel, observacao: observacao, mpQtds: mpQtds }

    ScqApi.CriarAnaliseComOcpAdicao(fullAnaliseForm).then((res) => {
        loadOcps(props)
        responseHandler(res,props, "OrdemDeCorrecao",'success',context, [props.loadParametros,props.loadOcps])
        
    }
    );



}

const CadastroDeOcp = (props) => {
    let history = useHistory();
    const [analise, setAnalise] = useState()
    const [parametro, setParametro] = useState()
    const context = useContext(WebSocketContext)
    const [materiasPrima, setMateriasPrima] = useState()
    const [mpQtds, setMpQtd] = useState([])
    const [responsavel, setResponsavel] = useState('')
    const [observacao, setObservacao] = useState('')
    const [etapa, setEtapa] = useState()
    const [correcaoArray, setCorrecaoArray] = useState([])
    const [adicaoMenu, setAdicaoMenu] = useState()
    const [loading, setLoading] = useState(false)
    let unidade = ""



    useEffect(() => {
        const analise = props.location.state
        setAnalise(analise)
        ScqApi.FindParametro(analise.parametroId).then(res => setParametro(res))


    }, [props.location.state])

    useEffect(() => {
        parametro && ScqApi.FindEtapa(parametro.etapaId).then(res => { parametro.unidade === "pH" ? unidade = "" : unidade = parametro.unidade; setEtapa(res) })

    }, [parametro])

    useEffect(() => {
        etapa && ScqApi.FindMateriaPrimaByEtapaId(etapa.id).then(res => setMateriasPrima(res))
    }, [etapa])

    useEffect(() => {
        materiasPrima && calcularCorrecaoArray()


    }, [materiasPrima])

    useEffect(() => {
        if (parametro) {
            if (String(parametro.unidade) === "pH") {
                setAdicaoMenu(<AdicaopH setMpQtd={saveMpQtd}></AdicaopH>)
            } else {
                setAdicaoMenu(<AdicaoComposition unidadeParametro={parametro.unidade} mps={materiasPrima} setMpQtd={saveMpQtd} correcaoArray={correcaoArray}></AdicaoComposition>)
            }
        }
    }, [correcaoArray, parametro])


    const saveMpQtd = (quantidade, mpId, unidade, index) => {
        console.log(quantidade, mpId, unidade)
        let tempoMpQtd = mpQtds
        tempoMpQtd.splice(index, 1, `${mpId}:${quantidade}:${unidade}`)

        setMpQtd(tempoMpQtd)

    }

    const calcularCorrecaoArray = () => {
        let tempCorrecaoArray = []
        let correcaoTotal = 0

        materiasPrima && materiasPrima.forEach((mp => {
            if (String(parametro.formula).includes(mp.fatorTitulometrico)) {
                let nominal = (parametro.pMax + parametro.pMin) / 2
                let valorCorrecao = 0
                if (analise.resultado < nominal) {
                    valorCorrecao = (etapa.volume * (nominal - analise.resultado)) / 1000
                    correcaoTotal = correcaoTotal + valorCorrecao
                }
                let pairCorrecaoMp = `${mp.id}:${Math.round(valorCorrecao * 100) / 100}`
                tempCorrecaoArray = tempCorrecaoArray.concat(pairCorrecaoMp)
                setCorrecaoArray(tempCorrecaoArray)
            } else {
                etapa.proportionMps.forEach((proportion) => {
                    let pair = String(proportion).split(":")
                    if (String(mp.id) === String(pair[0])) {
                        let pairCorreMp;
                        if (Number(pair[1] === 1.0)) {
                            let nominal = (parametro.pMax + parametro.pMin) / 2

                            let valorCorrecao = (etapa.volume * (nominal - analise.resultado)) / 1000

                            pairCorreMp = `${mp.id}:${Math.round(valorCorrecao)}`
                        } else {
                            pairCorreMp = `${mp.id}:${Math.round(correcaoTotal * pair[1] * 100) / 100}`
                        }

                        tempCorrecaoArray = tempCorrecaoArray.concat(pairCorreMp)
                        setCorrecaoArray(tempCorrecaoArray)
                    }
                })


            }
        }))

    }



    return (
        <>

            {

                loading ? <Container><Spinner animation="grow" />
                    <Form.Label>Aguarde , gerando OCP</Form.Label></Container>
                    :
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

                                        saveOcp(analise, mpQtds, responsavel, observacao, history,props,context)


                                    }}>
                                        Salvar
                        </Button>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Container>
            }


        </>
    )


}



export default withToastManager(withRouter(withMenuBar(connect(mapToStateProps.toProps,dispatchers)(CadastroDeOcp))))