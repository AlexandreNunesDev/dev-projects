import React, { useState} from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { connect } from 'react-redux'

import dispatchers from '../mapDispatch/mapDispathToProps'
import mapToStateProps from '../mapStateProps/mapStateToProps'




const AdicaoFreeEdit = (props) => {
  

    const [quantidades , setQuantidades] = useState(props.ocp.ocpToEdit.adicoesDto.map((adicao) => adicao.quantidade))




    const commitAdicaoEdit = (index,adicao) => {

        props.updadteOcpQuantidadeAdicao({id : adicao.id, quantidade : quantidades[index]}) 

    }

    const changeQuantiadeValue = (index,event) => {
        let newQuantidades = [...quantidades]
        newQuantidades[index] = event.target.value
        setQuantidades(newQuantidades)
    }
 



    return (
        <>
          
            <Row  >
                <Col>
                    <h4>Adicoes</h4>
                </Col>

            </Row>
          
          
            {props.ocp.ocpToEdit.adicoesDto.length > 0 &&
                <Table >
                    <thead>

                        <tr>
                            <th className="align-middle" style={{ textAlign: "center" }}>
                                <Form.Label>Id Adicao</Form.Label>
                            </th>
                            <th className="align-middle" style={{ textAlign: "center" }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>Materia Prima</Form.Label>
                            </th>
                            <th colSpan={2} md={'auto'}className="align-middle" style={{ textAlign: "center" }}>
                                <Form.Label style={{ fontWeight: 'bold' }}>Quantidade</Form.Label>
                            </th>
                            
                    


                        </tr>
                    </thead>
                    <tbody>

                        {props.ocp.ocpToEdit.adicoesDto.map((adicao, index) => {
                            return (
                                <tr key={index}>
                                    <td className="align-middle" style={{ textAlign: "center" }} >
                                        <Form.Label style={{ fontWeight: 'bold' }}>{adicao.id}</Form.Label>
                                    </td>
                                    <td  className="align-middle" style={{ textAlign: "center" }}>
                                        <Form.Label style={{ fontWeight: 'bold' }}>{adicao.nomeMp}</Form.Label>
                                    </td>
                                    <td  className="align-middle" >
                                        <Form.Control key={adicao.quantidade} value={quantidades[index]} style={{ fontWeight: 'bold', textAlign: "center" }} onChange={(event => {changeQuantiadeValue(index,event)})} onBlur={() =>commitAdicaoEdit(index,adicao) }></Form.Control>
                                    </td>
                                </tr>)
                        })}




                    </tbody>

                </Table>}

        </>
    )



}

export default connect(mapToStateProps.toProps,dispatchers)(AdicaoFreeEdit)