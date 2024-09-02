import axios from "axios";


import { statusResponseHandler } from "../Services/statusService";
import { store } from "../store";

const URL = "https://scqapi.com/"
const URL_TEST = URL /*https://localhost:8080//*/

const http = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? URL : URL_TEST
})

const respInter = http.interceptors.response.use(function (response) {

    return response.data;
}, function (error) {

    if (error.response) {
        statusResponseHandler(error.response.status, error.response.data)
        const errorObj = { error: true, data: error.response.data }
        return errorObj
    }

});

http.interceptors.request.use(async config => {
    const token = store.getState().global.tokenInfo;

    if (token != null) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});



const ScqApi = {


   
    parametroStatus: () => {
        return http.get("global/parametroStatus")
    },
    trocaStatus: () => {
        return http.get("global/trocaStatus")
    },
    ListaProcessos: () => {
        return http.get("processos")
    },
    populateRegistroDeAdicao: () => {
        return http.put("pupulateRegistroDeAdicao")
    },
    ListaEtapas: () => {
        return http.get("etapas")
    },
    ListaTrocas: () => {
        return http.get("trocas")

    },
    LoadAnaliseFields: () => {
        return http.get("/analiseFields")

    },
    LoadAnaliseChart: (dataInicial, dataFinal, parametroId) => {
        return http.get("analise/" + dataInicial + "/" + dataFinal + "/" + parametroId)

    },
    AnaliseReporte: (dataInicial, dataFinal, processoId) => {
        return http.get("reporteAnalise/" + dataInicial + "/" + dataFinal + "/" + processoId)

    },
    LoadGastosChart: (dataInicial, dataFinal) => {
        return http.get("registroDeAdicao/" + dataInicial + "/" + dataFinal)

    },
    LoadAnaliseHistocial: (dataInicial, dataFinal) => {
        return http.get("analise/" + dataInicial + "/" + dataFinal)

    },

    LoadHistoricoAnaliseWithPage: (dataInicial, dataFinal, page, size) => {
        return http.get(`historicoAnalise?page=${page}&size=${size}`, { params: { dataInicial, dataFinal } })

    },
    LoadOcpHistorico: (dataInicial, dataFinal, page, size) => {
        return http.get(`ocpsHistorico?page=${page}&size=${size}`, { params: { dataInicial, dataFinal } })

    },
    iniciarCorrecao: (id, responsavel) => {
        return http.put(`ocp/iniciar/${id}/${responsavel}`)

    },
    LoadAdicaoHistorico: (dataInicial, dataFinal, page, size) => {
        return http.get(`consultaRegistroDeAdicao?page=${page}&size=${size}`, { params: { dataInicial, dataFinal } })

    },

    LoadFullProcessoChart: (dataInicial, dataFinal, parametroId) => {
        return http.get("fullProcessoAnalises/" + dataInicial + "/" + dataFinal + "/" + parametroId)

    },
    LoadFullEtapaChart: (dataInicial, dataFinal, parametroId) => {
        return http.get("fullEtapaAnalises/" + dataInicial + "/" + dataFinal + "/" + parametroId)

    },
    LoadOmpChart: (fromDate, toDate) => {
        return http.get(`ompChart/${fromDate}/${toDate}`)
    },


    ListaParametros: () => {
        return http.get("parametros")
    },
    ListaParametrosSimple: () => {
        return http.get("parametrosSimple")
    },
    ListaMateriaPrimas: () => {
        return http.get("materiaPrimas")
    },
    ListaNotificacoes: () => {
        return http.get("notificacoes")
    },
    CriarProcesso: (processo) => {
        return http.post("processo", processo)

    },
    CriarRegrasCorrecao: (regras) => {
        return http.post("regraCorrecao", regras)

    },

    deleteRegraDeCorrecao: (id) => {
        return http.delete(`regraCorrecao/${id}`)

    },
    AtualizaRegrasCorrecao: (regras) => {
        return http.put("regraCorrecao", regras)

    },
    ListarRegrasCorrecao: () => {
        return http.get("regraCorrecao")

    },
    EncontrarUmaRegraCorrecao: (id) => {
        return http.get(`regraCorrecao/${id}`)

    },
    EncontrarUmaRegraCorrecaoPorParametro: (parametroId) => {
        return http.get(`/regraCorrecao/parametro/${parametroId}`)

    },
    DeletarCorrecao: (id) => {
        return http.delete(`regraCorrecao/${id}`)

    },
    CriarFrequenciaAnalise: (frequencia) => {
        return http.post("frequencia", frequencia)
    },
    CriarTroca: (troca) => {
        return http.post("troca", troca)
    },
    CriarTarefaManutencao: (tarefa) => {
        return http.post("tarefa", tarefa)

    },
    EditarProcesso: (processo) => {
        return http.put("processo/" + processo.id, processo)

    },
    EditarEtapa: (etapa) => {
        return http.put("/etapa/update/" + etapa.id, etapa)

    },
    EditarParametro: (parametro) => {
        return http.put("parametro/" + parametro.id, parametro)

    },
    EditarNotificacao: (id) => {
        return http.put("notificacao/" + id,)

    },
    EditarMateriaPrima: (materiaPrima) => {
        return http.put("materiaPrima/" + materiaPrima.id, materiaPrima)

    },
    EditarAnalise: (analise) => {
        return http.put("analise/" + analise.id, analise)

    },
    EditarFrequenciaAnalise: (frequencia) => {
        return http.put("frequencia/update/" + frequencia)

    },
    DeleteProcesso: (processoId) => {
        return http.delete("processo/" + processoId)

    },
    DeleteEtapa: (etapaId) => {
        return http.delete("etapa/" + etapaId)

    },
    DeleteParametro: (parametroId) => {
        return http.delete("parametro/" + parametroId)

    },
    DeleteOcp: (ocpId) => {
        return http.delete("ocp/" + ocpId)

    },
    DeleteOmp: (ompId) => {
        return http.delete("omp/" + ompId)

    },
    DeleteAnalise: (analiseId) => {
        return http.delete("analise/" + analiseId)

    },
    deleteAdicao: (id) => {
        return http.delete(`/adicao/${id}`)

    },
    UpdataAnaliseData: (analiseId, data) => {
        return http.put("analise/" + data + "/" + analiseId)

    },
    CriarEtapa: (etapa) => {
        return http.post("etapa", etapa)

    },
    CriarParametro: (parametro) => {
        return http.post("parametro", parametro)

    },
    CriarMateriaPrima: (materiaPrima) => {
        return http.post("materiaPrima", materiaPrima)

    },

    CriarAnalise: (analise) => {
        return http.post("analise", analise)

    },
    CriarAnaliseComOcpAdicao: (analise,) => {
        return http.post("analiseComOcpAdicao", analise)

    },

    CriarAnaliseComOcpAcao: (analise) => {
        return http.post("analiseComOcpAcao", analise)

    },
    CriarMontagem: (montagem) => {
        return http.post("montagem", montagem)

    },
    CriarAdicao: (adicao) => {
        return http.post("adicao", adicao)

    },
    CriarAcao: (acao) => {
        return http.post("acao", acao)

    },
    CriarTurno: (turno) => {
        return http.post("turno", turno)

    },
    ListTurnos: () => {
        return http.get("turnos")

    },
    EditarTurno: (turno) => {
        return http.put(`turno/${turno.id}`, turno)

    },
    CriarOcp: (ocp) => {
        return http.post("ocp", ocp)
    },

    CriarOcpAcao: (ocp) => {
        return http.post("ocpAcao", ocp)
    },
    ListaEtapasByProcesso: (processoId) => {
        return http.get("etapas/" + processoId)

    },
    ListaTarefasDeManutencao: () => {
        return http.get("tarefas")

    },
    ListaTarefasByProcesso: (processoId) => {
        return http.get("tarefa/find/" + processoId)

    },
    ListaParametrosByEtapa: (etapaId) => {
        return http.get("parametros/" + etapaId)

    },
    ListaOcps: () => {
        return http.get("ocpsList")

    },
    FindOneOcp: (id) => {
        return http.get('fullOcp/' + id)
    },
    FindParametro: (parametroId) => {
        return http.get("parametro/" + parametroId)

    },
    FindAnalise: (analiseId) => {
        return http.get("analise/" + analiseId)

    },
    FindTroca: (etapaId) => {
        return http.get("troca/find/" + etapaId)

    },
    EditarTroca: (troca) => {
        return http.put("troca/edit/" + troca.id, troca)

    },

    EditarOcpAdicao: (ocp) => {
        return http.put("/ocp/editarAdicao/" + ocp.id, ocp)

    },

    EditarOcpAcao: (ocp) => {
        return http.put("/ocp/editarAcao/" + ocp.id, ocp)

    },
    FindaTarefasByProcesso: (processoId) => {
        return http.get("tarefa/find/" + processoId)

    },
    FindTarefa: (tarefaId) => {
        return http.get("tarefa/" + tarefaId)

    },

    EditarTarefaDeManutencao: (tarefa) => {
        return http.put("tarefa/update/" + tarefa.id, tarefa)

    },
    AprovarOcp: (ocpId) => {
        return http.put("ocp/aprovar/" + ocpId)

    },


    LoadReanalise: (analiseId) => {
        return http.get("reanalise/" + analiseId)

    },
    LoadOmps: () => {
        return http.get("omps")

    },
    FindProcesso: (processoId) => {
        return http.get("processo/" + processoId)

    },
    FindEtapa: (etapaId) => {
        return http.get("etapa/" + etapaId)

    },
    FindMateriaPrima: (materiaPrimaId) => {
        return http.get("materiaPrima/" + materiaPrimaId)

    },
    FindMateriaPrimaByEtapaId: (etapaId) => {
        return http.get("materiaPrimaByEtapa/" + etapaId)

    },
    DeleteMateriaPrima: (materiaPrimaId) => {
        return http.delete("materiaPrima/" + materiaPrimaId)

    },
    DeleteMontagemCompose: (removedMontagemComposes) => {
        return http.put("montagem", removedMontagemComposes)

    },
    DeleteTroca: (trocaId) => {
        return http.delete("delete/troca/" + trocaId)

    },
    DeleteTarefa: (trocaId) => {
        return http.delete("tarefa/" + trocaId)

    },
    Calcular: (formula, viragem) => {
        let encoderForumula = encodeURIComponent(formula)
        const encodedUrl = "calculadora?formula=" + encoderForumula + "&viragem=" + viragem
        return http.get(encodedUrl)

    },
    AdicaoCorrigir: (adicoes) => {
        return http.put("adicao/corrigir/", adicoes)

    },
    EditarAdicao: (id,adicao) => {
        return http.put(`adicao/${id}`, adicao)

    },
    AcaoCorrigir: (ocpId) => {
        return http.put("acao/corrigir/" + ocpId, null)

    },
    LoadFullOmpDetails: (id) => {
        return http.get("omps/" + id)

    },
    LoadOmpHistorico: (id) => {
        return http.get("omps/historico/" + id)
    },
    FindMontagemByEtapaId: (etapaId) => {
        return http.get("montagens/" + etapaId)

    },
    LoadCorrecaoDetail: (parametroId) => {
        return http.get("/ocp/detail/" + parametroId)

    },

    GeatUnidades: () => {
        return http.get("unidades")

    },

    UpdateTarefaOmp: (tarefaId) => {
        return http.put("omp/tarefa/{tarefaId}")

    },

    UpdadteTrocaOmp: (trocaId) => {
        return http.put("omp/troca/{trocaId}")

    },


    GerarOmp: (ompForm) => {
        return http.post("omp", ompForm)

    },

    FinalizarOmp: (omp) => {
        return http.post("omp/finalizar", omp)

    },
    GenerateOmp: () => {
        return http.post("Cromo Duro.docx")
    },

    searchMateriaPrimaName: (searchString) => {
        return http.get("materiaPrima/search/" + searchString)

    },
    listAllContadores: (processoId) => {
        return http.get(`/listContadores/${processoId}`)

    },
    updateContador: (id, contador) => {
        return http.put(`/uploadArea/${id}`, contador)

    },
    deleteContador: (id) => {
        return http.delete(`/deleteContador/${id}`)

    },
    listOmpTrocaItens: (trocaId) => {
        return http.get(`/omp/trocas/${trocaId}`)

    },
    listOmpTarefaItens: (tarefaId) => {
        return http.get(`/omp/tarefas/${tarefaId}`)

    },
    Auth: (loginForm) => {
        return http.post("auth", loginForm)
    },

    Register: (loginForm) => {
        return http.post("user/registration", loginForm)

    },

    UploadQuantidadeProducaoWithFile: (dInicial, dFinal, form) => {
        return http.post(`uploadArea/${dInicial}/${dFinal}`, form, { headers: { "Content-Type": "multipart/form-data" } }).then((response) => { return response });
    },
    UploadQuantidadeProducaoWithForm: (dInicial, dFinal, form) => {
        return http.post(`uploadArea/${dInicial}/${dFinal}`, form).then((response) => { return response });
    },


    DownloadOcp: (ocpId) => {
        http.interceptors.response.eject(respInter);
        return http.get("downloadOcp/" + ocpId, { responseType: 'arraybuffer' }).then((response) => { return response });
    },
    DownloadOmp: (omp) => {
        http.interceptors.response.eject(respInter);
        return http.get("downloadOmp/" + omp.type + "/" + omp.id, { responseType: 'arraybuffer' }).then((response) => { return response })
    },



}

export default ScqApi