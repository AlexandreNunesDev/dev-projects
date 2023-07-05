import ScqApi from "../Http/ScqApi"
import { backGroundByAnaliseStatus } from "./analiseService"
import { DateAndTime, OnlyDate } from "./stringUtils"


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
            return ["nome", "id", "processo", "dataPlanejada", "dataRealizada", "areaPlanejada", "areaRealizada"]
        case "contador":
            return ["id", "processo", "valor", "dataInicial", "dataFinal"]
        case "materiaPrima":
            return ["id", "nome", "fornecedor", "preco", "unidade", "fatorTitulometrico"]
        case "regrasDeCorrecao":
            return ["id", "material", "parametro", "valor", "etapa", "processo", "volume"]
        case "analise":
            return ["id", "max", "min", "etapa", "data","parametro", "processo", "valor","analista","observacaoAnalise"]
        case "correcao":
            return ["id","processo","etapa","analiseId","motivo","dataAbertura"]
        case "adicao":
            return ["id","processo","etapa","responsavel","é troca" ,"quantidade","materiaPrima" ,"tipo"]
        default:
            return ["volume"]
    }
}

/* private Long id;
    private String processoNome;
    private String etapaNome;
    private String motivo;

    private String responsavel;
    private boolean statusOCP;
    private boolean statusCorrecao;
    private String observacao;
    private String parametroNome;
    private String unidade;
    private Double pMax;
    private Double pMin;
    private String dataAbertura;

    private List<AdicaoDTO> adicoesDto;

    private Double volumeEtapa;

    private Long analiseId;
    private Boolean analiseStatus;
 */

const farolAnalise = (analise) => {
    return backGroundByAnaliseStatus(analise.statusAnalise)
}


export function formatationRules(routeName) {
    switch (routeName) {
        case "analise":
            return [null, null, null, null, null, null,null,null,  null,farolAnalise]
        default:
            return [null, null, null, null, null, null, null]
    }
}


export function hasDateFilter(routeName) {
    if (routeName == "analise") return true
    if (routeName == "adicao") return true
    if (routeName == "correcao") return true
    return false
}

export function getOpsFromRoute(routeName, options, dataInicial, dataFinal, page, updateTotalPages,numeroDeDados) {
    return optionsGenerator[routeName](options, dataInicial, dataFinal, page, updateTotalPages,numeroDeDados)
}


let optionsGenerator = {
    processo: async function (options) {
        let processos  =  await ScqApi.ListaProcessos()
        return processos.map(op => ({ ...op }))
    },
    etapa: async function (options) {
        let etapas = await ScqApi.ListaEtapas()
        let etapasCopy = etapas.map(etapaCopy => {
            let copy = { ...etapaCopy }
            copy.processo = options.processos.filter(processo => processo.id == copy.processoId)[0].nome
            return copy
        })
        return etapasCopy
    },
    parametro: async function (options) {
        let parametros = await ScqApi.ListaParametros()
        let parametrosCopy = parametros.map(parametroCopy => {
            let copy = { ...parametroCopy }
            copy.processo = options.processos.filter(processo => processo.id == copy.processoId)[0].nome
            copy.etapa = options.etapas.filter(etapa => etapa.id == copy.etapaId)[0].nome
            return copy
        })
        return parametrosCopy
    },
    troca: async function (options) {
        let trocas = await ScqApi.ListaTrocas()
        let parametrosCopy = trocas.map(trocaCopy => {
            let copy = { ...trocaCopy }
            copy.etapa = copy.etapaNome
            copy.processo = options.processos.filter(processo => processo.id == copy.processoId)[0].nome
            return copy
        })
        return parametrosCopy
    },
    tarefa: async function (options) {
        let tarefasDeManutencao = await ScqApi.ListaTarefasDeManutencao()
        let opsCopy = tarefasDeManutencao.map(tarefaCopy => {
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
        let materiasPrima = await ScqApi.ListaMateriaPrimas()
        let opsCopy = materiasPrima.map(materiaCopy => {
            let copy = { ...materiaCopy }
            return copy
        })
        return opsCopy
    },
    analise: async function (options, dataInicial, dataFinal, page, updateTotalPages,numeroDeDados) {
        if (dataInicial && dataFinal) {
            let response = await ScqApi.LoadHistoricoAnaliseWithPage(dataInicial, dataFinal, page, numeroDeDados)
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
    correcao: async function (options, dataInicial, dataFinal, page, updateTotalPages,numeroDeDados) {
        if (dataInicial && dataFinal) {
            let response = await ScqApi.LoadOcpHistorico(dataInicial, dataFinal, page, numeroDeDados)
            updateTotalPages(response.totalPages)
            let opsCopy = response.content.map(cp => {
                let copy = { ...cp }
                copy.processo = cp.processoNome
                copy.etapa = cp.etapaNome
                copy.min = cp.pMax
                copy.max = cp.pMin
                return copy
                
            })
            return opsCopy
        }
        return []
    },
    adicao: async function (options, dataInicial, dataFinal, page, updateTotalPages,numeroDeDados) {
        if (dataInicial && dataFinal) {
            let response = await ScqApi.LoadAdicaoHistorico(dataInicial, dataFinal, page, numeroDeDados)
            updateTotalPages(response.totalPages)
            let opsCopy = response.map(cp => {
                let copy = { ...cp }
                copy.processo = cp.processoNome
                copy.etapa = cp.etapaNome
                copy.tipo = cp.isOmp ? "Troca" : "Correcao"
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
    const regExDateAndTime = /\d\d\d\d\-\d\d\-\d\d\T\d\d:\d\d:\d\d/gi 
    let field = genericObject[objectKey]
    
   
    if (regExDateAndTime.test(field)) {
        return DateAndTime(field)
    }
    if (regexExpDate.test(field)) {
        return OnlyDate(field)
    }
    return field
}


