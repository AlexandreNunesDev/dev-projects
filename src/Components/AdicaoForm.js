import { Fragment, useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { useDispatch, useSelector } from 'react-redux'
import { useToasts } from 'react-toast-notifications'
import ScqApi from '../Http/ScqApi'
import Adicao from '../models/AdicaoModels'
import { updateAdicoes } from '../Reducers/adicaoReducer'





const AdicaoForm = ({ deleteAdicao, parametroId , etapa,isCorrecaoLivre }) => {

    const materiasPrima = useSelector(state => state.options.materiasPrima)
    const ocpToEdit = useSelector(state => state.ocp.ocpToEdit)
    /** @type {Array<Adicao>} */
    const adicoes = useSelector(state => state.adicaoForm.adicoes)
    const dispatcher = useDispatch()
    const [mpOptions, setMpOptions] = useState()
    const [selectedMpNome, setSelectedMpNome] = useState([])
    const [selectedMp, setSelectedMp] = useState()
    const [quantidade, setQuantidade] = useState('')
    const [correcaoDetails, setCorrecaoDetails] = useState()
    const toast = useToasts()
    const regras = useSelector(state => state.regraCorrecao.regras)



    useEffect(() => {
        parametroId && ScqApi.LoadCorrecaoDetail(parametroId).then(
            res => {
                setCorrecaoDetails(res)
            })
    }, [parametroId])


    useEffect(() => {
        const nomes = materiasPrima.map((mp, index) => {
            return mp.nome
        })
        setMpOptions(nomes)
    }, [materiasPrima])

    useEffect(() => {
        const filtered = materiasPrima.filter((mp, index) => {
            return mp.nome === selectedMpNome[0]
        })
        setSelectedMp(filtered[0])
    }, [selectedMpNome])


    const cleanForm = () => {
        setQuantidade('')
        setSelectedMpNome({})
    }


    return (
        <div hidden={!isCorrecaoLivre}>
           
            <Row >
                <Col>
                    <h4>Inserir adicoes</h4>
                </Col>

            </Row>

            <Row >
                <Col>

                    <Form.Group>

                        <Form.Label>Nome:</Form.Label>

                        <Typeahead id={"searchMp"}
                            clearButton
                            onChange={(selected) => {
                                setSelectedMpNome(selected)
                            }}
                            options={mpOptions || []} />
                    </Form.Group>
                </Col>
                <Col>

                    <Form.Group>
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control value={quantidade} type="text" onChange={event => {
                            setQuantidade(event.target.value)
                        }} ></Form.Control>
                    </Form.Group>

                </Col>

                <div style={{ marginTop: 15 }} className="align-self-center">
                    <Button onClick={() => {
                        if (selectedMp) {
                            dispatcher(updateAdicoes([...adicoes, new Adicao(null, quantidade, ocpToEdit.id, selectedMp.id, selectedMp.unidade, selectedMp.nome)]))
                            cleanForm()
                        }
                    }} >Adicionar</Button>
                </div>





            </Row>

            {adicoes.length > 0 &&
                <Table >
                    <thead>

                        <tr>
                            <th md={'auto'}>
                                <Form.Label style={{ fontWeight: 'bold' }}>Id</Form.Label>
                            </th>
                            <th md={'auto'}>
                                <Form.Label style={{ fontWeight: 'bold' }}>Materia Prima</Form.Label>
                            </th>
                            <th md={'auto'}>
                                <Form.Label style={{ fontWeight: 'bold' }}>Quantidade</Form.Label>
                            </th>
                            <th md={'auto'}>
                                <Form.Label style={{ fontWeight: 'bold' }}>Quntidade Adicionada</Form.Label>
                            </th>
                            <th md={'auto'}>
                                <Form.Label>Acao</Form.Label>
                            </th>


                        </tr>
                    </thead>
                    <tbody>

                        {adicoes.map((adicao, index) => {
                            return (
                                <tr key={index}>
                                    <td md={'auto'}>
                                        <Form.Label style={{ fontWeight: 'bold' }}>{adicao.id ? adicao.id : `Novo ${index + 1}`}</Form.Label>
                                    </td>
                                    <td md={'auto'}>
                                        <Form.Label style={{ fontWeight: 'bold' }}>{adicao.nomeMp}</Form.Label>
                                    </td>
                                    <td md={'auto'}>
                                        <Form.Label style={{ fontWeight: 'bold' }}>{`${adicao.quantidade} ${adicao.unidade} `}</Form.Label>
                                    </td>
                                    <td md={'auto'}>
                                        <Form.Label style={{ fontWeight: 'bold' }}>{`${adicao.quantidadeRealizada || 0} ${adicao.unidade} `}</Form.Label>
                                    </td>
                                    <td md={'auto'}>
                                        {!adicao.status ? <Button style={{ backgroundColor: "RED", borderColor: "RED" }} onClick={() => {
                                            deleteAdicao(adicao.id)

                                        }} >Del</Button>
                                            :
                                            <Button disabled style={{ backgroundColor: "GREEN", borderColor: "GREEN" }}>Concluido</Button>
                                        }
                                    </td>

                                </tr>)
                        })}




                    </tbody>

                </Table>}

        </div>
    )



}

export default AdicaoForm