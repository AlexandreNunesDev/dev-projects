
import {capitalize} from '../Services/stringUtils'

export const responseHandler = (response, props, type, callBack,history,context,func,act,toastType) => {
    const { toastManager } = props;
    

    if(response.error){
        
        response.data.forEach(erro => {
            
           toastManager && toastManager.add(`${(capitalize(transformField(erro.field)))} : ${erro.error}`, {
                appearance: 'error', autoDismiss: true
              })});
              return false;
    } else {
       context && context.ws.sendMessage(func,act,history)
       toastManager && toastManager.add(buildMsg(type,response,toastType), {
            appearance: toastType ||'success', autoDismiss: true
          })
          return true
    }
}






const transformField = field => {

    let retorno

    if(field==="mpQtds") {
        retorno = "Adicoes"
    }
    if(field==="processoId") {
        retorno = "Processo"
    }
    if(field==="etapaId") {
        retorno = "Etapa"
    }
    if(field==="pMax") {
        retorno = "Máximo Especificado"
    }
    if(field==="pMin") {
        retorno = "Mínimo Especificado"
    }
    if(field==="pMaxT") {
        retorno = "Máximo Trabalho"
    }
    if(field==="pMinT") {
        retorno = "Mínimo Trabalho"
    }
    if(retorno === null) {
        return field
    } else {
        return retorno
    }
    
}




const buildMsg = (type,response,msgType) => {
    
let textByMsgType =  getTextByTostType(msgType)
    switch(type) {
        case "Processo" :
            return `${type} ${response.nome} ${textByMsgType} com sucesso`  
        case "Etapa" :
            return `${type} ${response.nome} ${textByMsgType} com sucesso`
        case "Parametro" :
            return `${type} ${response.nome} ${textByMsgType} com sucesso`
        case "MateriaPrima" :
            return `${type} ${response.nome} ${textByMsgType} com sucesso`
        case "OrdemDeCorrecao" :
            return `${type} ${textByMsgType} com sucesso`
        case "OrdemDeManutencao" :
            return `${type} da ${response.nome} ${textByMsgType} com sucesso`
        case "Analise" : 
            return `${type} ${response.id} ${textByMsgType} com sucesso`
        case "DeleteAnalise" :
            return `Analise ${textByMsgType} com sucesso`
        default : 
            return 'Dado processado com sucesso'
        
    }
}
const getTextByTostType = (toastType) => {
    switch(toastType) {
        case "success" :
            return  "driado"
        case "error" :
            return  "cancelado"
        case "warning" :
            return  "deletado"
        case "info" :
            return  "alterado"
        default : 
            return "processado"
    }
}