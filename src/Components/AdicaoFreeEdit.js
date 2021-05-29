import React, { useState, useEffect } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import AdicaoEditDiaolog from '../Components/AdicaoEditDialog'




const AdicaoFreeEdit = (props) => {

    const [ocp] = useState(props.ocp)
    const [isEditing, setIsEditing] = useState(false)
    const [editingAdicao,setEditingAdicao] = useState()

    const openOcpEdit = (adicao,index) => {
        
        setEditingAdicao([adicao,index])
        
    }

    useEffect(() => {
        setIsEditing(true)
    },[editingAdicao])

  






    return (
        <>
           {editingAdicao && <AdicaoEditDiaolog show={isEditing} setAdicao={(quantidade,index) => props.updateAdicao(quantidade,index)} adicao={editingAdicao} handleClose={setIsEditing}></AdicaoEditDiaolog>}
            <Row  >
                <Col>
                    <h4>Adicoes</h4>
                </Col>

            </Row>
          
          
            {props.mpQtds.length > 0 &&
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

                        {ocp.adicoesDto.map((adicao, index) => {
                            return (
                                <tr key={index}>
                                    <td className="align-middle" style={{ textAlign: "center" }} >
                                        <Form.Label style={{ fontWeight: 'bold' }}>{adicao.id}</Form.Label>
                                    </td>
                                    <td  className="align-middle" style={{ textAlign: "center" }}>
                                        <Form.Label style={{ fontWeight: 'bold' }}>{adicao.nomeMp}</Form.Label>
                                    </td>
                                    <td  className="align-middle" style={{ textAlign: "center" }} >
                                        <Form.Label  style={{ fontWeight: 'bold' }}>{adicao.quantidade}</Form.Label>
                                    </td>
                                    <td  className="align-middle" style={{ textAlign: "center" }} >
                                        <Button style={{ fontWeight: 'bold' }} onClick={()=> openOcpEdit(adicao,index)} >Editar</Button>
                                    </td>
                               

                                </tr>)
                        })}




                    </tbody>

                </Table>}

        </>
    )



}

export default AdicaoFreeEdit