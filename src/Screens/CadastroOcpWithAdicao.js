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
import { connect, useSelector } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { loadOcps } from '../Services/storeService'
import { WebSocketContext } from '../websocket/wsProvider';




const redirectAnalise = (history, analise) => {
    history.push("/RegistroAnalise", analise)
}



const CadastroDeOcpAdicao = (props) => {
    let history = useHistory();
    const [parametro, setParametro] = useState()
    const context = useContext(WebSocketContext)
    const [materiasPrima, setMateriasPrima] = useState()
    const [mpQtds, setMpQtd] = useState([])
    const [responsavel, setResponsavel] = useState('')
    const [observacao, setObservacao] = useState('')
    const [etapa, setEtapa] = useState()
    const [correcaoArray, setCorrecaoArray] = useState([])
    const [adicaoMenu, setAdicaoMenu] = useState()
    const [loading] = useState(false)
    const analiseToSave = useSelector(state => state.singleAnalise.analiseToSave)
    const parametros = useSelector(state => state.options.parametros)
    const etapas = useSelector(state => state.options.etapas)
    const materiasPrim = useSelector(state => state.options.materiasPrima)
    let unidade = ""



    useEffect(() => {
        const param = parametros.filter(param => String(param.id) === String(analiseToSave.parametroId))[0]
        const etapa = etapas.filter(etap => etap.parametrosId.includes(param.id))[0]
        const materiasPrima = etapa.mpIds.map(mpId => materiasPrim.find(mp => String(mp.id) === String(mpId)))
        param.unidade === "pH" ? unidade = "" : unidade = param.unidade
        setEtapa(etapa)
        setParametro(param)
        setMateriasPrima(materiasPrima)
    }, [])

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
        let tempoMpQtd = mpQtds
        if (Number(quantidade) > 0) {
            console.log(quantidade, mpId, unidade)

            tempoMpQtd.splice(index, 1, `${mpId}:${quantidade}:${unidade}`)

            setMpQtd(tempoMpQtd)

        } else {
            tempoMpQtd.splice(index, 1)
            setMpQtd(tempoMpQtd)
        }

    }

    const calcularCorrecaoArray = () => {
        let tempCorrecaoArray = []
        let correcaoTotal = 0
        let nominal = (parametro.pMax + parametro.pMin) / 2

        //Itero sobre todas as materias primas da Etapa do parametro que esta em analise
        materiasPrima && materiasPrima.forEach((mp => {
            //Se a formula do parametro contem o fator titulometrico da materia prima sera gerado analise com base no resultado da concentracao
            if (String(parametro.formula).includes(mp.fatorTitulometrico)) {

                let valorCorrecao = 0
                if (analiseToSave.resultado < nominal) {
                    valorCorrecao = (etapa.volume * (nominal - analiseToSave.resultado)) / 1000
                    correcaoTotal = correcaoTotal + valorCorrecao
                }
                let pairCorrecaoMp = `${mp.id}:${Math.round(valorCorrecao * 100) / 100}`
                tempCorrecaoArray = tempCorrecaoArray.concat(pairCorrecaoMp)
                setCorrecaoArray(tempCorrecaoArray)
            } else {
                //Se o fator titulometri nao contem na formula do parametro então sera considerado a proporção entrar os valores de montagem
                etapa.proportionMps.forEach((proportion) => {
                    //Pra cada iteração cria uma par de "mpId:qtd"
                    let pairCorreMp
                    // reinicia a variavel valorCorrecao para sera  calculada novamente para Materia prima
                    let valorCorrecao
                    let pair = String(proportion).split(":")
                    //Verifican se a materia prima é a mesma da do token de proporçao de montagem
                    if (String(mp.id) === String(pair[0])) {
                        //Se sim verifica se a proporcao é igual a 1.0 , o que quer dizer que so existe essa materia prima
                        valorCorrecao = (etapa.volume * (nominal - analiseToSave.resultado)) / 1000
                        valorCorrecao = valorCorrecao * pair[1]
                        pairCorreMp = `${mp.id}:${Math.round(valorCorrecao)}`
                        /*                         if (Number(pair[1] === 1.0)) {
                                                    valorCorrecao = (etapa.volume * (nominal - analise.resultado)) / 1000
                                                    //Adiciona à correcao total o valor da correcao 
                                                    correcaoTotal = correcaoTotal + valorCorrecao
                                                    pairCorreMp = `${mp.id}:${Math.round(valorCorrecao)}`
                                                } else {
                                                    valorCorrecao = correcaoTotal * pair[1]
                                                    //Adiciona à correcao total o valor da correcao 
                                                    correcaoTotal = correcaoTotal + valorCorrecao
                                                    pairCorreMp = `${mp.id}:${Math.round(valorCorrecao)}`
                                                } */

                        //Se o valor da correcao for 0 , não adiciona ao  array de Correcao
                        if (Number(valorCorrecao) > 0) {
                            tempCorrecaoArray = tempCorrecaoArray.concat(pairCorreMp)
                            setCorrecaoArray(tempCorrecaoArray)
                        }

                    }
                })


            }
        }))

    }



    const saveOcp = () => {
        const { toastManager } = props
        const fullAnaliseForm = { ...analiseToSave, responsavel: responsavel, observacao: observacao, mpQtds: mpQtds }
        ScqApi.CriarAnaliseComOcpAdicao(fullAnaliseForm, [props.loadParametros, props.loadOcps]).then((res) => { responseHandler(res, toastManager, "OrdemDeCorrecao", 'success')
        }
        );

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
                                        <Form.Label style={{ color: analiseToSave.status === "fofe" ? 'red' : 'black' }}>Resultado: {`${analiseToSave.resultado} ${unidade}`}</Form.Label>
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
                                        redirectAnalise(history, analiseToSave)
                                        redirectAnalise(history)
                                    }}>
                                        Cancelar
                                    </Button>
                                    <Button style={{ margin: 2 }} type="reset" onClick={() => {

                                        saveOcp(analiseToSave, mpQtds, responsavel, observacao, history, props, context)


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



export default withToastManager(withRouter(withMenuBar(connect(mapToStateProps.toProps, dispatchers)(CadastroDeOcpAdicao))))