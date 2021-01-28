import { BsArrowClockwise, BsReverseBackspaceReverse } from 'react-icons/bs';
import {capitalize,subId} from '../Services/stringUtils'

export const responseHandler = (response, props, type) => {
    const { toastManager } = props;
    
    if(response.error){
        
        response.data.forEach(erro => {
            
            toastManager.add(`${(capitalize(transformField(erro.field)))} : ${erro.error}`, {
                appearance: 'error', autoDismiss: true, onDismiss : () => window.location.reload()
              })});
    } else {
        toastManager.add(buildMsg(type,response), {
            appearance: 'success', autoDismiss: true , onDismiss : () => window.location.reload()
          })
    }
}






const transformField = field => {

    let retorno

    if(field=="mpQtds") {
        retorno = "Adicoes"
    }
    if(field=="processoId") {
        retorno = "Processo"
    }
    if(field=="etapaId") {
        retorno = "Etapa"
    }
    if(field=="pMax") {
        retorno = "Máximo Especificado"
    }
    if(field=="pMin") {
        retorno = "Mínimo Especificado"
    }
    if(field=="pMaxT") {
        retorno = "Máximo Trabalho"
    }
    if(field=="pMinT") {
        retorno = "Mínimo Trabalho"
    }
    if(retorno == null) {
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
            return `${type} da ${response.etapa.nome} criado com sucesso`
        case "OrdemDeManutencao" :
            return `${type} da ${response.nome} criado com sucesso`
        
    }
}