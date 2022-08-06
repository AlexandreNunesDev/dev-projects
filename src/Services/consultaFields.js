import { OnlyDate } from "./stringUtils"


export function getFieldsFromRoute(routeName) {
    switch (routeName) {
        case "processo":
            return ["nome", "id"]
        case "etapa":
            return ["nome", "id", "volume", "processo"]
        case "parametro":
            return ["nome", "id", "volume", "processo", "etapa"]
        case "troca":
            return ["id", "dataPlanejada", "ultimaTroca", "areaPlanejada" , "areaRealizada","etapa","processo"]
        case "tarefa":
            return ["nome", "id","processo","dataPlanejada","dataRealizada"]
        case "contador":
            return ["id","processo", "valor", "dataInicial","dataFinal"]

        default:
            return ["volume"]
    }
}

export function getOpsFromRoute(routeName, options) {
    return optionsGenerator[routeName](options)
}


let optionsGenerator = {
    processo: function (options) {
        return options.processos.map(op => ({ ...op }))
    },
    etapa: function (options) {
        let etapasCopy = options.etapas.map(etapaCopy => {
            let copy = { ...etapaCopy }
            copy.processo = options.processos.filter(processo => processo.id == copy.processoId)[0].nome
            return copy
        })
        return etapasCopy
    },
    parametro: function (options) {
        let parametrosCopy = options.parametros.map(parametroCopy => {
            let copy = { ...parametroCopy }
            copy.processo = options.processos.filter(processo => processo.id == copy.processoId)[0].nome
            copy.etapa = options.etapas.filter(etapa => etapa.id == copy.etapaId)[0].nome
            return copy
        })
        return parametrosCopy
    },
    troca: function (options) {
        let parametrosCopy = options.trocas.map(trocaCopy => {
            let copy = { ...trocaCopy }
            copy.etapa = copy.etapaNome
            copy.processo = options.processos.filter(processo => processo.id == copy.processoId)[0].nome
            return copy
        })
        return parametrosCopy
    },
    tarefa: function (options) {
        let opsCopy = options.tarefasDeManutencao.map(tarefaCopy => {
            let copy  = {...tarefaCopy}
            copy.processo = copy.processoNome
            return copy
        })
        return opsCopy
    },
    contador: function (options) {
        let parametrosCopy = options.contador.map(contadorCopy => {
            let copy = {...contadorCopy}
            copy.processo = copy.processoNome
            return copy
        })
        return parametrosCopy
    }
}


export function getFormatedField (genericObject,objectKey) {
    const regexExpDate = /\d\d\d\d\-\d\d\-\d\d/gi;
    let field = genericObject[objectKey]
    if(regexExpDate.test(field)){
        return OnlyDate(field)
    } 
    return field
}


