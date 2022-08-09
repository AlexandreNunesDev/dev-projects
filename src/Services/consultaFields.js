import ScqApi from "../Http/ScqApi"
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
            return ["id", "dataPlanejada", "ultimaTroca", "areaPlanejada", "areaRealizada", "etapa", "processo"]
        case "tarefa":
            return ["nome", "id", "processo", "dataPlanejada", "dataRealizada"]
        case "contador":
            return ["id", "processo", "valor", "dataInicial", "dataFinal"]
        case "materiaPrima":
            return ["id", "nome", "fornecedor", "preco", "unidade", "fatorTitulometrico"]
        case "regrasDeCorrecao":
            return ["id", "material", "parametro", "valor","etapa" , "processo", "volume"]

        default:
            return ["volume"]
    }
}

export function getOpsFromRoute(routeName, options) {
    return optionsGenerator[routeName](options)
}


let optionsGenerator = {
    processo: async function (options) {
        return options.processos.map(op => ({ ...op }))
    },
    etapa: async function (options) {
        let etapasCopy = options.etapas.map(etapaCopy => {
            let copy = { ...etapaCopy }
            copy.processo = options.processos.filter(processo => processo.id == copy.processoId)[0].nome
            return copy
        })
        return etapasCopy
    },
    parametro: async function (options) {
        let parametrosCopy = options.parametros.map(parametroCopy => {
            let copy = { ...parametroCopy }
            copy.processo = options.processos.filter(processo => processo.id == copy.processoId)[0].nome
            copy.etapa = options.etapas.filter(etapa => etapa.id == copy.etapaId)[0].nome
            return copy
        })
        return parametrosCopy
    },
    troca: async function (options) {
        let parametrosCopy = options.trocas.map(trocaCopy => {
            let copy = { ...trocaCopy }
            copy.etapa = copy.etapaNome
            copy.processo = options.processos.filter(processo => processo.id == copy.processoId)[0].nome
            return copy
        })
        return parametrosCopy
    },
    tarefa: async function (options) {
        let opsCopy = options.tarefasDeManutencao.map(tarefaCopy => {
            let copy = { ...tarefaCopy }
            copy.processo = copy.processoNome
            return copy
        })
        return opsCopy
    },
    contador: async function (options) {
        let parametrosCopy = options.contador.map(contadorCopy => {
            let copy = { ...contadorCopy }
            copy.processo = copy.processoNome
            return copy
        })
        return parametrosCopy
    },
    materiaPrima: async function (options) {
        let opsCopy = options.materiasPrima.map(materiaCopy => {
            let copy = { ...materiaCopy }
            return copy
        })
        return opsCopy
    },
    regrasDeCorrecao: async function (options) {
        let opsCopy = await ScqApi.ListarRegrasCorrecao()
        opsCopy = opsCopy.map(op => {
            op.material = op.materiaPrima.nome
            op.parametro = op.parametroDto.nome
            op.valor = op.valorUnidade
            op.etapa = op.parametroDto.etapaNome
            op.processo = options.processos.find(o => o.id == op.parametroDto.processoId).nome
            op.volume = options.etapas.find(o => o.id == op.parametroDto.etapaId).volume
            return op
        })
        return opsCopy
    },
}


export function getFormatedField(genericObject, objectKey) {
    const regexExpDate = /\d\d\d\d\-\d\d\-\d\d/gi;
    let field = genericObject[objectKey]
    if (regexExpDate.test(field)) {
        return OnlyDate(field)
    }
    return field
}


