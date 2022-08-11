import ScqApi from "../Http/ScqApi"
import { backGroundByAnaliseStatus } from "./analiseService"
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
            return ["id", "material", "parametro", "valor", "etapa", "processo", "volume"]
        case "analise":
            return ["id", "max", "min", "etapa", "parametro", "processo", "valor"]
        case "correcao":
            return ["id", "etapa", "parametro", "processo", "motivo"]
        case "adicao":
            return ["id","material","etapa","planejado","data","realizadoEm","realizadoPor","adicionado","observacao"]
        default:
            return ["volume"]
    }
}


const farolAnalise = (analise) => {
    return backGroundByAnaliseStatus(analise.statusAnalise)
}


export function formatationRules(routeName) {
    switch (routeName) {
        case "analise":
            return [null, null, null, null, null, null, farolAnalise]
        default:
            return [null, null, null, null, null, null, null]
    }
}


export function hasDateFilter(routeName) {
    if (routeName == "analise") return true
    if (routeName == "adicao") return true
    return false
}

export function getOpsFromRoute(routeName, options, dataInicial, dataFinal, page, updateTotalPages) {
    return optionsGenerator[routeName](options, dataInicial, dataFinal, page, updateTotalPages)
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
    analise: async function (options, dataInicial, dataFinal, page, updateTotalPages) {
        if (dataInicial && dataFinal) {
            let response = await ScqApi.LoadHistoricoAnaliseWithPage(dataInicial, dataFinal, page, 15)
            updateTotalPages(response.totalPages)
            let opsCopy = response.content.map(cp => {
                let copy = { ...cp }
                copy.max = cp.pMax
                copy.min = cp.pMin
                copy.parametro = cp.nomeParametro
                copy.etapa = cp.nomeEtapa
                copy.processo = cp.nomeProcesso
                copy.valor = `${cp.resultado} ${cp.unidade}`
                return copy
            })
            return opsCopy
        }
        return []

    },
    correcao: async function (options, dataInicial, dataFinal, page, updateTotalPages) {
        if (dataInicial && dataFinal) {
            let response = await ScqApi.LoadOcpHistorico(dataInicial, dataFinal, page, 15)
            updateTotalPages(response.totalPages)
            let opsCopy = response.content.map(cp => {
                let copy = { ...cp }
                copy.max = cp.pMax
                copy.min = cp.pMin
                copy.parametro = cp.processoNome
                copy.etapa = cp.etapaNome
                copy.valor = `${cp.resultado} ${cp.unidade}`
                return copy
            })
            return opsCopy
        }
        return []
    },
    adicao: async function (options, dataInicial, dataFinal, page, updateTotalPages) {
        if (dataInicial && dataFinal) {
            let response = await ScqApi.LoadAdicaoHistorico(dataInicial, dataFinal, page, 15)
            updateTotalPages(response.totalPages)
            let opsCopy = response.content.map(cp => {
                let copy = { ...cp }
                copy.material = copy.nomeMp
                copy.adicionado = `${copy.quantidadeRealizada} ${copy.unidade}`
                copy.planejado = `${copy.quantidade} ${copy.unidade}`
                return copy
            })
            return opsCopy
        }
        return []
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


