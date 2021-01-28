import React from 'react';
import PropTypes from 'prop-types';
import { Col, Container, Form, Row } from 'react-bootstrap';
import GenericDropDown from '../Components/GenericDropDown';


export const withFilterBar = Component => {

    const withFilterBar = ({ data }) => {
        return (
            <>
                <Container >
                    <Row className="justify-content-md-center">
                        <Col>
                            <Form.Control placeholder="filtrar por..." style={{ margin: 10 }} onChange={(event) => this.setState({
                                filteredTroca: this.state.trocas.filter((troca) => {
                                    if (this.state.filterType === "Processo") {
                                        return String(troca.processoNome).includes(event.target.value)
                                    }
                                    if (this.state.filterType === "Etapa") {
                                        return String(troca.etapaNome).includes(event.target.value)
                                    }
                                    return ""

                                })
                            })}></Form.Control>
                        </Col>
                        <Col md="auto">
                            <GenericDropDown display={"Tipo"} margin={10} itens={["Processo", "Etapa"]} onChoose={(item) => this.setState({ filterType: item })} style={{ margin: 10 }}>Filtrar </GenericDropDown>
                        </Col>
                    </Row>
                </Container>
                <Component data={data} />
            </>
        )



    }
    return withFilterBar
}
