import React from 'react'
import { Form,  Table } from 'react-bootstrap'




const AdicaoComposition = (props) => {

    return (
        <>
            <h4>Adicoes</h4>
            
            <Table >
                <thead>
                    <tr>
                        <th md={'auto'}>
                            <Form.Label style={{ fontWeight: 'bold' }}>Materia Prima</Form.Label>
                        </th>
                        <th md={'auto'}>
                            <Form.Label style={{ fontWeight: 'bold' }}>Quantidade</Form.Label>
                        </th>
                    </tr>
                </thead>
                {props.mps?.map((mp, index) => {
                    const correcaoArray = props.correcaoArray
                    let actualPair = []
                    let actualCorrection = 0;
                    correcaoArray.forEach((pair) => {
                       actualPair = String(pair).split(":")
                       if(String(actualPair[0])===String(mp.id)){
                        actualCorrection = actualPair[1]
                       }
                    })
                    return (
                        <tbody key={index}>
                            <tr>
                                <td md={'auto'}>
                                    <Form.Label>{mp.nome}</Form.Label>
                                </td>
                                <td md={'auto'}>
                                    <Form.Control type="text" placeholder={`Correcao Surgerida ${props.unidadeParametro == "%" ? actualCorrection*10 : actualCorrection} ${mp.unidade}`} onChange={event => props.setMpQtd(event.target.value,mp.id,mp.unidade,index)}></Form.Control>
                                </td>
                            </tr>
                        </tbody>

                    )
                })}
            </Table>
        </>
    )



}

export default AdicaoComposition