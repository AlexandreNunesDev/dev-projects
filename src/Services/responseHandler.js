
import { capitalize } from '../Services/stringUtils'

export const responseHandler = (response, toastManager, type, toastType) => {

    const toastCall = 'add' in toastManager ? toastManager.add : toastManager.addToast

    if (response.error) {

        response.data.forEach(erro => {
            toastManager && toastCall(`${(capitalize(transformField(erro.field)))} : ${erro.error}`, {
                appearance: 'error', autoDismiss: true
            })
        });
        return false;
    } else {
        toastManager && toastCall(buildMsg(type, response, toastType), {
            appearance: toastType || 'success', autoDismiss: true
        })
        return true
    }
}




const transformField = field => {

    let retorno

    if (field === "mpQtds") {
        retorno = "Adicoes"
    }
    if (field === "processoId") {
        retorno = "Processo"
    }
    if (field === "etapaId") {
        retorno = "Etapa"
    }
    if (field === "pMax") {
        retorno = "Máximo Especificado"
    }
    if (field === "pMin") {
        retorno = "Mínimo Especificado"
    }
    if (field === "pMaxT") {
        retorno = "Máximo Trabalho"
    }
    if (field === "pMinT") {
        retorno = "Mínimo Trabalho"
    }
    return field

}




const buildMsg = (type, response, msgType) => {

    let textByMsgType = getTextByTostType(msgType)

    switch (type) {
        case "Processo":
            return `${type} ${response.nome} ${textByMsgType} com sucesso`
        case "Etapa":
            return `${type} ${response.nome} ${textByMsgType} com sucesso`
        case "Parametro":
            return `${type} ${response.nome} ${textByMsgType} com sucesso`
        case "MateriaPrima":
            return `${type} ${response.nome} ${textByMsgType} com sucesso`
        case "OrdemDeCorrecao":
            return `${type} ${textByMsgType} com sucesso`
        case "OrdemDeManutencao":
            return `${type} ${textByMsgType} com sucesso`
        case "Analise":
            return `${type} ${response.id} ${textByMsgType} com sucesso`
        case "Turno":
            return `${type} ${textByMsgType} com sucesso`
        case "DeleteAnalise":
            return `Analise ${textByMsgType} com sucesso`
        default:

            return 'Dado processado com sucesso'

    }
}
const getTextByTostType = (toastType) => {
    switch (toastType) {
        case "success":
            return "criado"
        case "error":
            return "cancelado"
        case "warning":
            return "deletado"
        case "info":
            return "alterado"
        default:
            return "processado"
    }
}