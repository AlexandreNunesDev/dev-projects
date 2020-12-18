import React, { useState, useEffect } from 'react'


import {Col, Row, Button} from 'react-bootstrap'
import GenericSelect from '../Components/GenericSelect'
import ScqApi from '../Http/ScqApi'

import DeleteConfirm from '../Components/DeleteConfirm'


    const deleteSelection = (processo,etapa,parametro,materiaPrima,troca,type, onDelete) => {
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

    const [processos, setProcessos] = useState(null)
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

    const [showConfirm, setShowConfirm] = useState(false)

    const [confirmationDetails , setConfirmDetails] = useState()

    const [colSequence] = useState(evaluateColSequence(props))

    const loadEditableProcesso = async (processoId) => {
        const processoResponse = await ScqApi.FindProcesso(processoId)
        setProcessoObj(processoResponse)
        setProcesso(processoId)
       
        return processoResponse
    }

    const loadEditableEtapa =  async (etapaId) => {
        const etapaResponse = await ScqApi.FindEtapa(etapaId)
        setEtapaObj(etapaResponse)
        return etapaResponse
    }

    const loadEditableParametro = async (parametroId) => {
        const parametroResponse = await ScqApi.FindParametro(parametroId)
        setParametroObj(parametroResponse)
     
        return parametroResponse
    }

    const loadEditableMateriaPrima = async (materiaPrimaId) => {
        const materiaPrimaRepsonse = await ScqApi.FindMateriaPrima(materiaPrimaId)
        setMateriaPrimaObj(materiaPrimaRepsonse)
     
        return materiaPrimaRepsonse
    }

    const loadEditableTroca = async (etapaId) => {
        const trocaResponse = await ScqApi.FindTroca(etapaId)
        setTroca(trocaResponse)
     
        return trocaResponse
    }

    const loadEditableTarefa = async (tarefaId) => {
        const tarefa = await ScqApi.FindTarefa(tarefaId)
        setTarefa(tarefa)
        return tarefa
    }

    useEffect(() => {
            ScqApi.ListaProcessos().then(res => setProcessos(res))
            ScqApi.ListaMateriaPrimas().then(res => setMateriasPrima(res))

    },[props.edited])


  


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
                <Col xs={{ order: colSequence[0]}} >
               {processos!=null && props.type !== "materiaPrima" && <GenericSelect returnType={"id"} title={"Processo"} default={"Escolha um Processo"} ops={processos} onChange={(processoId) => {
                    setProcesso(processoId)
                    if(props.type=== "processo") {
                    loadEditableProcesso(processoId).then( res => props.getSelectedProcesso(res))}
                    else {
                    loadEditableProcesso(processoId)
                    }}}>
                </GenericSelect> }
                </Col>
                <Col xs={{ order: colSequence[1]}} >
                { etapas!=null && <GenericSelect returnType={"id"} title={"Etapa"} default={"Escolha uma Etapa"} ops={etapas} onChange={(idEtapa) => {
                    setEtapa(idEtapa)
                    if(props.type === "etapa") {
                    loadEditableEtapa(idEtapa).then( res => props.getSelectedEtapa(res))}
                    else if(props.type === "troca") {
                    loadEditableTroca(idEtapa).then(res => props.getSelectedTroca(res))
                    } else {
                        loadEditableEtapa(idEtapa)
                    }
                    }}></GenericSelect> }
                </Col>
                <Col xs={{ order: colSequence[2]}} >
                { parametros!=null && <GenericSelect returnType={"id"} title={"Parametro"} default={"Escolha um Parametro"}  ops={parametros} onChange={(idParametro) => {
                    if(props.type === "parametro") {
                    loadEditableParametro(idParametro).then( res => props.getSelectedParametro(res))}
                    else {
                    loadEditableParametro(idParametro)
                    }
                    }}></GenericSelect> }
                </Col>
                <Col xs={{ order: colSequence[3]}}  >
               {materiasPrima!=null && props.type ==="materiaPrima" && <GenericSelect returnType={"id"} title={"Materia Prima"} default={"Escolha uma Materia Prima"} ops={materiasPrima} onChange={(materiaPrimaId) => {
                    setProcesso(materiaPrimaId)
                    if(props.type=== "materiaPrima") {
                    loadEditableMateriaPrima(materiaPrimaId).then( res => props.getSelectedMateriaPrima(res))}
                    else {
                    loadEditableMateriaPrima(materiaPrimaId)
                    }}}>
                </GenericSelect> }
                
                </Col>
                <Col xs={{ order: colSequence[4]}}  >
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
                        case 'tarefa' : setConfirmDetails(tarefa ?  `Voce deseja deletar Tarefa ${troca?.etapaNome}` : "Escolha uma troca" )
                            break;
                         default : return 'nada foi selecionado';
                          
                    }
                }}>Deletar</Button>
            </Col>
            
            </Row>
            
            <DeleteConfirm show={showConfirm} deleteSelection={() => { deleteSelection(processo,etapa,parametro,materiaPrima,troca,props.type, props.onDelete); setShowConfirm(!showConfirm)
            }} details={confirmationDetails} confirmCancel={() => setShowConfirm(false)} ></DeleteConfirm>
        </>
    )

}

export default ModoEdicao
