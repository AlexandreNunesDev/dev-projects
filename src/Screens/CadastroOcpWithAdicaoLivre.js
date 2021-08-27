import React, {useEffect, useState } from 'react'
import { Form, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps';
import dispatchers from '../mapDispatch/mapDispathToProps';
import AdicaoFree from '../Components/AdicaoFree';


const CadastroOcpWithAdicaoLivre = (props) => {

    const [parametro] = useState(props.location.state?.parametroId || null)
    const [materiasPrima] = useState()
    const [mpQtds, setMpQtd] = useState([])
    const [responsavel, setResponsavel] = useState('')
    const [observacao, setObservacao] = useState('')
    const [mpNomes , setMpNome] = useState([])




    const saveMpQtd = (quantidade,mpId,unidade,index,nome) => {


        let tempoMpQtd = mpQtds 
        let tempoMpNome = mpNomes;
        tempoMpQtd.splice(index,1,`${mpId}:${quantidade}:${unidade}`)
        tempoMpNome.splice(index,1,nome)
        setMpQtd(tempoMpQtd)
        setMpNome(tempoMpNome)
        
    }

    const removeMpQtd = (indexToRemove) => {
     
        let tempoMpQtd = mpQtds.filter((mpqtd,index) => {
            return index !== indexToRemove
        })
       
        
        setMpQtd(tempoMpQtd)
       
    }


    useEffect(() => {
        props.updateOcp({responsavel,observacao,mpQtds, parametroId : parametro ,analiseId : props.analise?.id , parametroId : props.parametroId})
    }, [observacao, mpQtds, responsavel])

    return (
        <>


            <AdicaoFree setMpQtd={saveMpQtd} removeMpQtd={removeMpQtd} mpNomes={mpNomes} mpQtds={mpQtds} mpsOptions={materiasPrima}></AdicaoFree>

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
  



        </>

            )


}


 export default withRouter(connect(mapToStateProps.toProps, dispatchers)(CadastroOcpWithAdicaoLivre))