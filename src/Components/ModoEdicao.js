import React, { useState, useEffect } from 'react'


import {Col, Row, Button} from 'react-bootstrap'
import GenericSelect from './GenericSelect'
import ScqApi from '../Http/ScqApi'

import DeleteConfirm from './DeleteConfirm'
import { connect, useSelector } from 'react-redux'
import mapToStateProps from '../mapStateProps/mapStateToProps'
import dispatchers from '../mapDispatch/mapDispathToProps'


    const deleteSelection = (processo,etapa,parametro,materiaPrima,troca,tarefa,type,onDelete) => {
    if((processo != null) && (etapa == null) && (parametro == null) && (type === "processo")){
        return ScqApi.DeleteProcesso(processo.id).then(msg => onDelete(msg))

    }
    if((etapa != null) && (parametro == null)  && (type === "etapa")) {
        ScqApi.DeleteEtapa(etapa.id).then(msg => onDelete(msg))
        return `Etapa ${etapa.nome} da ${processo.nome} deletada com sucesso`
    }
    if((parametro !=null)  && (type === "parametro")) {
        ScqApi.DeleteParametro(parametro.id).then(msg => onDelete(msg))
        return `Parametro ${parametro.nome} da ${etapa.nome} ${processo.nome} deletado com sucesso`
    }
    if((materiaPrima != null) && type==="materiaPrima") {
        ScqApi.DeleteMateriaPrima(materiaPrima.id).then(msg => onDelete(msg))
        return `Materia Prima ${materiaPrima.nome} deletado com sucesso`
    }

    if((troca != null) && type==="troca") {
        return ScqApi.DeleteTroca(troca.id).then(msg => onDelete(msg))
        
    }

    if((tarefa != null) && type==="tarefa") {
        return ScqApi.DeleteTarefa(tarefa.id).then(msg => onDelete(msg))
        
    }
   
}

const evaluateColSequence = (props) => {
    switch (props.type) {
        case 'processo': return [1,2,3,4,5]
            
        case 'etapa' || 'troca': return [1,2,3,4,5]
        
        case 'parametro' : return [1,2,3,4,5]
        
        case 'materiaPrima' : return [2,3,4,1,5]
         
        case 'tarefa' : return [1,3,4,5,2]
          
         default :  return [1,2,3,4,5];
          
    }
}


const ModoEdicao = (props) => {

    const [processoId, setProcesso] = useState(null)
    const [processo, setProcessoObj] = useState(null)

    const [etapas, setEtapas] = useState(null)
    const [etapaId, setEtapa] = useState(null)
    const [etapa, setEtapaObj] = useState(null)

    const [parametros, setParametros] = useState(null)
    const [parametro, setParametroObj] = useState(null)

    const [materiasPrima , setMateriasPrima] = useState(null)
    const [materiaPrima , setMateriaPrimaObj] = useState(null)

    const [tarefas , setTarefas] = useState(null)
    const [tarefa, setTarefa] = useState(null)
    
    const [troca , setTroca] = useState(null)

    const trocas = useSelector(state => state.options.trocas )

    const [showConfirm, setShowConfirm] = useState(false)

    const [confirmationDetails , setConfirmDetails] = useState()

    const [colSequence] = useState(evaluateColSequence(props))

    const loadEditableProcesso = (processoId) => {
        const processoResponse = props.processos.filter(processo => Number(processo.id) === Number(processoId))
        setProcessoObj(processoResponse[0])
        setProcesso(processoId)
       
        return processoResponse[0]
    }

    const loadEditableEtapa = (etapaId) => {
        const etapaResponse = props.etapas.filter(etapa => Number(etapa.id) === Number(etapaId))
        setEtapaObj(etapaResponse[0])
        return etapaResponse[0]
    }

    const loadEditableParametro = (parametroId) => {
        const parametroResponse = props.parametros.filter(parametro => Number(parametro.id) === Number(parametroId))
        setParametroObj(parametroResponse[0])
     
        return parametroResponse[0]
    }

    const loadEditableMateriaPrima = async (materiaPrimaId) => {
        const materiaPrimaRepsonse = await ScqApi.FindMateriaPrima(materiaPrimaId)
        setMateriaPrimaObj(materiaPrimaRepsonse)
     
        return materiaPrimaRepsonse
    }

    const loadEditableTroca = async (etapaId) => {
        
        const trocaResponse = trocas.filter(troca => {
           return troca.etapaId == etapaId
        } )
        setTroca(trocaResponse[0])
     
        return trocaResponse[0]
    }

    const loadEditableTarefa = async (tarefaId) => {
        const tarefa = await ScqApi.FindTarefa(tarefaId)
        setTarefa(tarefa)
        return tarefa
    }

    useEffect(() => {
         
            ScqApi.ListaMateriaPrimas().then(res => setMateriasPrima(res))

    },[])


  


    useEffect(() => {
        if((props.type === "etapa") || (props.type === "parametro") || (props.type === "troca")  || (props.type === "tarefa")){
        processoId && props.type !== "tarefa" && ScqApi.ListaEtapasByProcesso(processoId).then(res => setEtapas(res)) 
        processoId && ScqApi.FindaTarefasByProcesso(processoId).then(res => setTarefas(res))

    }
    }, [processoId, props.type])

    


    useEffect(() => {
        if(props.type==="parametro"){
        etapaId && ScqApi.ListaParametrosByEtapa(etapaId).then(res => setParametros(res))
    }
    }, [etapaId,props.type])

  

    

    return (
        <>
            
        
            <Row>
                <Col xl={{ order: colSequence[0]}} >
               {props.type !== "materiaPrima" && <GenericSelect returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={props.processos} onChange={(processoId) => {
                    setProcesso(processoId)
                    if(props.type=== "processo") {
                    props.getSelectedProcesso( loadEditableProcesso(processoId))
                    }else{
                    loadEditableProcesso(processoId)
                    }}}>
                </GenericSelect> }
                </Col>
                <Col xl={{ order: colSequence[1]}} >
                { etapas!=null && <GenericSelect returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} ops={etapas} onChange={async (idEtapa) => {
                    setEtapa(idEtapa)
                    if(props.type === "etapa") {
                        props.getSelectedEtapa(loadEditableEtapa(idEtapa))
                    }else if(props.type === "troca") {
                        props.getSelectedTroca( await loadEditableTroca(idEtapa))
                    } else {
                        loadEditableEtapa(idEtapa)
                    }
                    }}></GenericSelect> }
                </Col>
                <Col xl={{ order: colSequence[2]}} >
                { parametros!=null && <GenericSelect returnType={"id"} title={"Parametro"} default={"Escolha um Parametro"}  ops={parametros} onChange={(idParametro) => {
                    if(props.type === "parametro") {
                    props.getSelectedParametro(loadEditableParametro(idParametro))
        
                    } else {
                    loadEditableParametro(idParametro)
                    }
                    }}></GenericSelect> }
                </Col>
                <Col xl={{ order: colSequence[3]}}  >
               {materiasPrima!=null && props.type ==="materiaPrima" && <GenericSelect returnType={"id"} title={"Materia Prima"} default={"Escolha uma Materia Prima"} ops={materiasPrima} onChange={(materiaPrimaId) => {
                    setProcesso(materiaPrimaId)
                    if(props.type=== "materiaPrima") {
                    loadEditableMateriaPrima(materiaPrimaId).then( res => props.getSelectedMateriaPrima(res))}
                    else {
                    loadEditableMateriaPrima(materiaPrimaId)
                    }}}>
                </GenericSelect> }
                
                </Col>
                <Col xl={{ order: colSequence[4]}}  >
               {tarefas!=null && props.type ==="tarefa" && <GenericSelect returnType={"id"} title={"Tarefa de Manutenção"} default={"Escolha uma Tarefa"} ops={tarefas} onChange={(id) => {
             
                    if(props.type=== "tarefa") {
                    loadEditableTarefa(id).then( res => props.getSelectedTarefa(res))}
                    else {
                    loadEditableTarefa()
                    }}}>
                </GenericSelect> }
                
                </Col>
            </Row >
            <Row>
            <Col>
                <Button  style={{backgroundColor : "RED", border : "RED"}}  onClick={(event) => {
                    setShowConfirm(true)
                    switch (props.type) {
                        case 'processo': setConfirmDetails(processo ?  `Voce deseja deletar ${processo.nome}`: "Escolha um Processo" )
                            break;
                        case 'etapa': setConfirmDetails(etapa ?   `Voce deseja deletar etapa ${etapa?.nome} de ${processo?.nome}` : "Escolha uma etapa")
                            break;
                        case 'parametro' : setConfirmDetails(parametro ? `Voce deseja deletar ${parametro?.nome} de etapa ${etapa?.nome} de linha ${processo?.nome}` : "Escolha um parametro")
                            break;
                        case 'materiaPrima' : setConfirmDetails(materiasPrima ?  `Voce deseja deletar Materia prima ${materiasPrima?.nome}` : "Escolha uma Materia Prima" )
                            break;
                        case 'troca' : setConfirmDetails(troca ?  `Voce deseja deletar Troca da etapa ${troca?.etapaNome}` : "Escolha uma troca" )
                            break;
                        case 'tarefa' : setConfirmDetails(tarefa ?  `Voce deseja deletar Tarefa ${tarefa?.nome}` : "Escolha uma troca" )
                            break;
                         default : return 'nada foi selecionado';
                          
                    }
                }}>Deletar</Button>
            </Col>
            
            </Row>
            
            <DeleteConfirm show={showConfirm} deleteSelection={() => { deleteSelection(processo,etapa,parametro,materiaPrima,troca,tarefa,props.type, props.onDelete); setShowConfirm(!showConfirm)
            }} details={confirmationDetails} confirmCancel={() => setShowConfirm(false)} ></DeleteConfirm>
        </>
    )

}

export default connect(mapToStateProps.toProps,dispatchers)(ModoEdicao)
