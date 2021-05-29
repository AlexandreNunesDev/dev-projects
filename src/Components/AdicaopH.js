import React, { useState, useEffect } from 'react'
import { Form, Table } from 'react-bootstrap'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { Typeahead } from 'react-bootstrap-typeahead'
import ScqApi from '../Http/ScqApi'


const AdicaopH = (props) => {


    const[materiasPrima, setMateriasPrima] = useState([])
    const[mpOptions,setMateriasPrimaOptions] = useState([])
    const[selectedMp, setSelectedMp] = useState()


    useEffect(()=>{
            ScqApi.ListaMateriaPrimas().then(response => setMateriasPrima(response))
           
    },[])

    useEffect(() => {
        materiasPrima && setMateriasPrimaOptions(materiasPrima.map((mp) => {
            return mp.nome
        }))
    },[materiasPrima])

  
    const selectedMpHandler = (selectedMpNome) => {
        const filtered = materiasPrima.filter((mp,index) => {
            return mp.nome === selectedMpNome[0]
        })
        setSelectedMp(filtered[0])
    }





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
                <tbody>
                    <tr>
                        <td md={'auto'}>
                            <Typeahead
    	                        
                                id={"searchMp"}
                                onChange={(selected) => {
                                    selectedMpHandler(selected)
                                }}
                                
                                options={mpOptions}
                                
                            />

                        </td>
                        <td md={'auto'}>
                            <Form.Control  type="text" onChange={event => {
                                if(selectedMp){
                                    props.setMpQtd(event.target.value,selectedMp.id,selectedMp.unidade)
                                }
                                
                            }} ></Form.Control>
                        </td>
                    </tr>
                </tbody>



            </Table>
        </>
    )



}

export default AdicaopH