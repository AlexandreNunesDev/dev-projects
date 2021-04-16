import axios from "axios"


import { getToken, logout } from "../Services/auth"
import { statusResponseHandler } from "../Services/statusService";
// "http://localhost:8080/" 
const http = axios.create({
     baseURL: "https://scqapi.com/"
    
})

const respInter = http.interceptors.response.use(function (response) {
    
    return response.data;
  }, function (error) {
   
    if(error.response){
       statusResponseHandler(error.response.status, error.response.data)
        const errorObj = {error : true, data : error.response.data}
        return errorObj
    }
   
  });

http.interceptors.request.use(async config => {
    const token = getToken();
 
    if (token!=null) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});



const ScqApi = {

    
    ListaProcessos: () => {
        return http.get("processos")
    },
    ListaEtapas: () => {
        return http.get("etapas")
    },
    ListaTrocas: () => {
        return http.get("trocas")

    },
    LoadAnaliseChart: (dataInicial, dataFinal, parametroId) => {
        return http.get("analise/" + dataInicial + "/" + dataFinal + "/" + parametroId)

    },

    LoadFullProcessoChart: (dataInicial, dataFinal, parametroId) => {
        return http.get("fullProcessoAnalises/" + dataInicial + "/" + dataFinal + "/" + parametroId)

    },
    LoadFullEtapaChart: (dataInicial, dataFinal, parametroId) => {
        return http.get("fullEtapaAnalises/" + dataInicial + "/" + dataFinal + "/" + parametroId)

    },

   
    ListaParametros: () => {
        return http.get("parametros")
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
    UpdataAnaliseData: (analiseId,data) => {
        return http.put("analise/"+data+"/"+ analiseId)

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
    CriarAnaliseComOcpAdicao: (analise) => {
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
    CriarOcp: (ocp) => {
        return http.post("ocp", ocp)
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
        return http.put("troca/edit/" + troca.id,troca)

    },

    EditarOcpAdicao: (ocp) => {
        return http.put("/ocp/editarAdicao/" + ocp.id,ocp)

    },

    EditarOcpAcao: (ocp) => {
        return http.put("/ocp/editarAcao/" + ocp.id,ocp)

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
    Calcular: (formula, viragem) => {
        const encodedUrl = encodeURI("calculadora?formula=" + formula + "&viragem=" + viragem)
        return http.get(encodedUrl)

    },
    AdicaoCorrigir: (ocpId) => {
        return http.put("adicao/corrigir/" + ocpId)

    },
    AcaoCorrigir: (ocpId) => {
        return http.put("acao/corrigir/" + ocpId)

    },
    LoadFullOmpDetails: (omp) => {
        return http.get("omps/" + omp.id)

    },
    LoadOmpHistorico: (omp) => {
        return http.get("omps/historico/" + omp.id)
    },
    FindMontagemByEtapaId: (etapaId) => {
        return http.get("montagens/" + etapaId)

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
    Auth: (loginForm) => {   
        return http.post("auth",loginForm)
    },

    Register: (loginForm) => {
        
        return http.post("user/registration", loginForm)

    },

    DownloadOcp : (ocpId) => {
        http.interceptors.response.eject(respInter);
        return http.get("downloadOcp/" + ocpId, { responseType: 'arraybuffer' }).then((response) => { return response});
    },
    DownloadOmp : (omp) => {
        http.interceptors.response.eject(respInter);
        return http.get("downloadOmp/"+omp.type+"/"+omp.id, { responseType: 'arraybuffer' }).then((response) => { return response})
    },
    


}

export default ScqApi