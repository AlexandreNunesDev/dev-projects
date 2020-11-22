import axios from "axios"
import { getToken } from "../Services/auth"


const http = axios.create({
    baseURL: "https://scqapi-env-1.eba-yk7mty23.us-east-2.elasticbeanstalk.com:5000/"
    
})

http.interceptors.request.use(async config => {
    const token = getToken();
 
    if (token!=null) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


const ScqApi = {
    ListaProcessos: () => {
        return http.get("processos").then(res => res.data)
    },
    ListaEtapas: () => {
        return http.get("etapas").then(console.log("deu certo"))
    },
    ListaTrocas: () => {
        return http.get("trocas").then(res => res.data)

    },
    LoadAnaliseChart: (dataInicial, dataFinal, parametroId) => {
        return http.get("analise/" + dataInicial + "/" + dataFinal + "/" + parametroId).then(res => res.data)

    },
    ListaParametros: () => {
        return http.get("parametros").then(res => res.data)
    },
    ListaMateriaPrimas: () => {
        return http.get("materiaPrimas").then(res => res.data)
    },
    ListaNotificacoes: () => {
        return http.get("notificacoes").then(res => res.data)
    },
    CriarProcesso: (processo) => {
        return http.post("processo", processo).then(res => res.data)

    },
    CriarFrequenciaAnalise: (frequencia) => {
        return http.post("frequencia", frequencia).then(res => res.data)
    },
    CriarTroca: (troca) => {
        return http.post("troca", troca).then(res => res.data)
    },
    CriarTarefaManutencao: (tarefa) => {
        return http.post("tarefa", tarefa).then(res => res.data)

    },
    EditarProcesso: (processo) => {
        return http.put("processo/" + processo.id, processo).then(res => res.data)

    },
    EditarEtapa: (etapa) => {
        return http.put("etapa/" + etapa.id, etapa).then(res => res.data)

    },
    EditarParametro: (parametro) => {
        return http.put("parametro/" + parametro.id, parametro).then(res => res.data)

    },
    EditarNotificacao: (id) => {
        return http.put("notificacao/" + id,).then(res => res.data)

    },
    EditarMateriaPrima: (materiaPrima) => {
        return http.put("materiaPrima/" + materiaPrima.id, materiaPrima).then(res => res.data)

    },
    EditarAnalise: (analise) => {
        return http.put("analise/" + analise.id, analise).then(res => res.data)

    },
    EditarFrequenciaAnalise: (frequencia) => {
        return http.put("frequencia/update/" + frequencia.id).then(res => res.data)

    },
    DeleteProcesso: (processoId) => {
        return http.delete("processo/" + processoId.id).then(res => res.data)

    },
    DeleteEtapa: (etapaId) => {
        return http.delete("etapa/" + etapaId.id).then(res => res.data)

    },
    DeleteParametro: (parametroId) => {
        return http.delete("parametro/" + parametroId.id).then(res => res.data)

    },
    DeleteOcp: (ocpId) => {
        return http.delete("parametro/" + ocpId).then(res => res.data)

    },
    DeleteOmp: (ompId) => {
        return http.delete("omp/" + ompId).then(res => res.data)

    },
    CriarEtapa: (etapa) => {
        return http.post("etapa", etapa).then(res => res.data)

    },
    CriarParametro: (parametro) => {
        return http.post("parametro", parametro).then(res => res.data)

    },
    CriarMateriaPrima: (materiaPrima) => {
        return http.post("materiaPrima", materiaPrima).then(res => res.data)

    },
    CriarAnalise: (analise) => {
        return http.post("analise", analise).then(res => res.data)

    },
    CriarMontagem: (montagem) => {
        return http.post("montagem", montagem).then(res => res.data)

    },
    CriarAdicao: (adicao) => {
        return http.post("adicao", adicao).then(res => res.data)

    },
    CriarAcao: (acao) => {
        return http.post("acao", acao).then(res => res.data)

    },
    CriarOcp: (ocp) => {
        return http.post("ocp", ocp).then(res => res.data)

    },
    ListaEtapasByProcesso: (processoId) => {
        return http.get("etapas/" + processoId).then(res => res.data)

    },
    ListaTarefasDeManutencao: () => {
        return http.get("tarefas").then(res => res.data)

    },
    ListaTarefasByProcesso: (processoId) => {
        return http.get("tarefa/find/" + processoId).then(res => res.data)

    },
    ListaParametrosByEtapa: (etapaId) => {
        return http.get("parametros/" + etapaId).then(res => res.data)

    },
    ListaOcps: () => {
        return http.get("ocpsList").then(res => res.data)

    },
    FindParametro: (parametroId) => {
        return http.get("parametro/" + parametroId).then(res => res.data)

    },
    FindAnalise: (analiseId) => {
        return http.get("analise/" + analiseId).then(res => res.data)

    },
    FindTroca: (etapaId) => {
        return http.get("troca/find/" + etapaId).then(res => res.data)

    },
    EditarTroca: (troca) => {
        return http.put("troca/edit/" + troca.id).then(res => res.data)

    },
    FindaTarefasByProcesso: (processoId) => {
        return http.get("tarefa/find/" + processoId.id).then(res => res.data)

    },
    FindTarefa: (tarefaId) => {
        return http.get("tarefa/" + tarefaId).then(res => res.data)

    },

    EditarTarefaDeManutencao: (tarefa) => {
        return http.put("tarefa/update/" + tarefa.id, tarefa).then(res => res.data)

    },
    AprovarOcp: (ocpId) => {
        return http.put("ocp/aprovar/" + ocpId).then(res => res.data)

    },


    LoadReanalise: (analiseId) => {
        return http.get("reanalise/" + analiseId).then(res => res.data)

    },
    LoadOmps: () => {
        return http.get("omps").then(res => res.data)

    },
    FindProcesso: (processoId) => {
        return http.get("processo/" + processoId).then(res => res.data)

    },
    FindEtapa: (etapaId) => {
        return http.get("etapa/" + etapaId).then(res => res.data)

    },
    FindMateriaPrima: (materiaPrimaId) => {
        return http.get("materiaPrima/" + materiaPrimaId).then(res => res.data)

    },
    FindMateriaPrimaByEtapaId: (etapaId) => {
        return http.get("materiaPrimaByEtapa/" + etapaId).then(res => res.data)

    },
    DeleteAnalise: (analiseId) => {
        return http.delete("analise/" + analiseId).then(res => res.data)

    },
    DeleteMateriaPrima: (materiaPrimaId) => {
        return http.delete("materiaPrima/" + materiaPrimaId).then(res => res.data)

    },
    DeleteMontagemCompose: (removedMontagemComposes) => {
        return http.delete("montagem", removedMontagemComposes).then(res => res.data)

    },
    DeleteTroca: (trocaId) => {
        return http.delete("delete/troca/" + trocaId).then(res => res.data)

    },
    Calcular: (formula, viragem) => {
        const encodedUrl = encodeURI("calculadora?formula=" + formula + "&viragem=" + viragem)
        return http.get(encodedUrl).then(res => res.data)

    },
    AdicaoCorrigir: (ocpId) => {
        return http.put("adicao/corrigir/" + ocpId).then(res => res.data)

    },
    AcaoCorrigir: (ocpId) => {
        return http.put("acao/corrigir/" + ocpId).then(res => res.data)

    },
    LoadFullOmpDetails: (omp) => {
        return http.get("omps/" + omp.id).then(res => res.data)

    },
    LoadOmpHistorico: (omp) => {
        return http.get("omps/historico/" + omp.id).then(res => res.data)

    },
    FindMontagemByEtapaId: (etapaId) => {
        return http.get("montagens/" + etapaId).then(res => res.data)

    },


    GerarOmp: (ompForm) => {
        return http.post("generateOmp", ompForm).then(res => res.data)

    },
    GerarOmpTarefas: (ompForm) => {
        return http.post("generateOmpTarefas", ompForm).then(res => res.data)

    },
    FinalizarOmp: (omp) => {
        return http.post("omp/finalizar", omp).then(res => res.data)

    },
    GenerateOmp: () => {
        return http.post("Cromo Duro.docx").then(res => res.data)
    },

    searchMateriaPrimaName: (searchString) => {
        return http.get("materiaPrima/search/" + searchString).then(res => res.data)

    },
    Auth: (loginForm) => {   
        return http.post("auth",loginForm).then(res => res.data)
    },

    Register: (loginForm) => {
        
        return http.post("user/registration", loginForm).then(res => res.data)

    },
    DownloadOcp : (fileName) => {
       return http.get("downloadOcp/" + fileName, { responseType: 'arraybuffer' }).then((response) => { return new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });});
    },
    DownloadOmp : (fileName) => {
        return http.get("download/"+fileName, { responseType: 'arraybuffer' }).then((response) => { return new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });})
      }

}

export default ScqApi