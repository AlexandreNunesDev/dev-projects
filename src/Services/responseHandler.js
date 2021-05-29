
import {capitalize} from '../Services/stringUtils'

export const responseHandler = (response, props, type, callBack,history) => {
    const { toastManager } = props;
    

    if(response.error){
        
        response.data.forEach(erro => {
            
            toastManager.add(`${(capitalize(transformField(erro.field)))} : ${erro.error}`, {
                appearance: 'error', autoDismiss: true, onDismiss : () => window.location.reload()
              })});
              return false;
    } else {
         
        toastManager.add(buildMsg(type,response), {
            appearance: 'success', autoDismiss: true , onDismiss : () =>callBack ? callBack(history) : window.location.reload()
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
    

    switch(type) {
        case "Processo" :
            return `${type} ${response.nome} criado com sucesso`  
        case "Etapa" :
            return `${type} ${response.nome} criado com sucesso`
        case "Parametro" :
            return `${type} ${response.nome} criado com sucesso`
        case "MateriaPrima" :
            return `${type} ${response.nome} criado com sucesso`
        case "OrdemDeCorrecao" :
            return `${type} criado com sucesso`
        case "OrdemDeManutencao" :
            return `${type} da ${response.nome} criado com sucesso`
        case "Analise" : 
            return `${type} ${response.id} criada com sucesso`
        case "DeleteAnalise" :
            return `Analise deletada com sucesso`
        default : 
            return 'Dado processado com sucesso'
        
    }
}