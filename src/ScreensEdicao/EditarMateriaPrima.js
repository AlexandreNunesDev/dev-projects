import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Container, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {withMenuBar} from '../Hocs/withMenuBar';
import ScqApi from '../Http/ScqApi';
import ModoEdicao from '../Components/ModoEdicao'
import { withToastManager } from 'react-toast-notifications';
import UnidadeSelect from '../Components/UnidadeSelect';
import { responseHandler } from '../Services/responseHandler';
import { toastInfo } from '../Services/toastType';
import dispatchers from '../mapDispatch/mapDispathToProps';
import { WebSocketContext } from '../websocket/wsProvider';

const EditarMateriaPrima = (props) => {

    const [materiaPrima, setMateriaPrima] = useState()
    const context = useContext(WebSocketContext)
    const [nome, setNome] = useState()
    const [fornecedor, setFornecedor] = useState()
    const [fatorTitulometrico, setFatorTitulometrico] = useState()
    const [preco, setPreco] = useState()
    const [unidade, setUnidade] = useState()


 
    useEffect(() => {
        if (materiaPrima) {
            setNome(materiaPrima.nome)
            setFornecedor(materiaPrima.fornecedor)
            setFatorTitulometrico(materiaPrima.fatorTitulometrico)
            setUnidade(materiaPrima.unidade)
            setPreco(materiaPrima.preco)
        }
    }, [materiaPrima])


    const salvarMateriaPrima = () => {

        if (fatorTitulometrico === '' || fatorTitulometrico === null) {
            setFatorTitulometrico(1)
        }

        const newMateriaPrima = { id: materiaPrima.id, nome: nome, fornecedor: fornecedor, fatorTitulometrico: fatorTitulometrico, preco: preco, unidade: unidade }
        ScqApi.EditarMateriaPrima(newMateriaPrima).then(res => responseHandler(res, props,"Materia Prima",toastInfo,context, [dispatchers().loadMateriasPrima,dispatchers().loadEtapas,dispatchers().loadTrocas,dispatchers().loadOcps]))
    }

    return (
        <>
    

            <Container style={{ marginTop: 20 }}>
                <h1>Cadastro de Matéria Prima</h1>
                <Form>
                    <h4>Escolha a Materia Prima para editar</h4>
                    <ModoEdicao type={"materiaPrima"} getSelectedMateriaPrima={(materiaPrima) => setMateriaPrima(materiaPrima)}></ModoEdicao>
                    {materiaPrima && <Form.Group style={{ marginTop: 20 }} >
                        <Form.Label style={{ color: "RED", fontWeight: "bold" }} >Materia Prima Id: {materiaPrima.id}</Form.Label>
                    </Form.Group>}
                    <Form.Row>
                        <Form.Group as={Col} controlId="nomeMateriaPrimaForm">
                            <Form.Label>Nome Matéria Prima: </Form.Label>
                            <Form.Control type="text" placeholder="Nome da Matéria Prima" value={nome} onChange={(event) => setNome(event.target.value)} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="fornecedorMateriaPrimaForm">
                            <Form.Label>Fornecedor: </Form.Label>
                            <Form.Control type="text" placeholder="Nome do Fornecedor" value={fornecedor} onChange={(event) => setFornecedor(event.target.value)} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="fatorMateriaPrimaForm">
                            <Form.Label>Preco: </Form.Label>
                            <Form.Control type="text" placeholder={"R$ 0,00"} value={preco} onChange={(event) => setPreco(event.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="fatorMateriaPrimaForm">
                            <Form.Label>Fator Titulométrico: </Form.Label>
                            <Form.Control type="text" placeholder="Fator Titulometrico" value={fatorTitulometrico} onChange={(event) => setFatorTitulometrico(event.target.value)} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="fatorMateriaPrimaForm">
                            <UnidadeSelect selection={unidade} default={"Escolha uma Unidade"} type={"adicao"} title={"Unidade Mp"} onChange={(unidade) => setUnidade(unidade)}></UnidadeSelect>
                        </Form.Group>
                    </Form.Row>


                    <Form.Group>

                        <Button style={{ margin: 2 }} variant="primary" type="reset" onClick={() => salvarMateriaPrima()}>Salvar</Button>
                    </Form.Group>
                </Form>
            </Container>

        </>
    )


}

export default withToastManager(withMenuBar(EditarMateriaPrima))