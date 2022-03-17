import axios from "axios"


import { statusResponseHandler } from "../Services/statusService";
import { store } from "../store";
const URL_TEST =  "http://localhost:8080/"// https://scqapi.com/
const URL = "https://scqapi.com/"
const http = axios.create({
     baseURL: process.env.NODE_ENV === "production" ? URL : URL_TEST
     
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
    const token = store.getState().global.tokenInfo;
 
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
    LoadGastosChart: (dataInicial, dataFinal) => {
        return http.get("materiaPrima/" + dataInicial + "/" + dataFinal)

    },
    LoadAnaliseHistocial: (dataInicial, dataFinal) => {
        return http.get("analise/" + dataInicial + "/" + dataFinal)

    },

    LoadHistoricoAnaliseWithPage: (dataInicial, dataFinal,page,size) => {
        
        return http.get(`historicoAnalise?page=${page}&size=${size}`,{ params: { dataInicial,dataFinal }} ,
          )

    },

    LoadFullProcessoChart: (dataInicial, dataFinal, parametroId) => {
        return http.get("fullProcessoAnalises/" + dataInicial + "/" + dataFinal + "/" + parametroId)

    },
    LoadFullEtapaChart: (dataInicial, dataFinal, parametroId) => {
        return http.get("fullEtapaAnalises/" + dataInicial + "/" + dataFinal + "/" + parametroId)

    },
    LoadOmpChart : (fromDate,toDate) => {
        return http.get(`ompChart/${fromDate}/${toDate}`)
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
    CriarProcesso: (processo,reduxFunctions) => {
        return http.post("processo", processo, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    CriarFrequenciaAnalise: (frequencia) => {
        return http.post("frequencia", frequencia)
    },
    CriarTroca: (troca,reduxFunctions) => {
        return http.post("troca", troca,{ headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })
    },
    CriarTarefaManutencao: (tarefa,reduxFunctions) => {
        return http.post("tarefa", tarefa,{ headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

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
    EditarAnalise: (analise,reduxFunctions) => {
        return http.put("analise/" + analise.id, analise,{ headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

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
    CriarEtapa: (etapa,reduxFunctions) => {
        return http.post("etapa", etapa, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    CriarParametro: (parametro,reduxFunctions) => {
        return http.post("parametro", parametro, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    CriarMateriaPrima: (materiaPrima,reduxFunctions) => {
        return http.post("materiaPrima", materiaPrima, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    
    CriarAnalise: (analise,reduxFunctions) => {
        return http.post("analise", analise, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    CriarAnaliseComOcpAdicao: (analise,reduxFunctions) => {
        return http.post("analiseComOcpAdicao", analise, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },

    CriarAnaliseComOcpAcao: (analise,reduxFunctions) => {
        return http.post("analiseComOcpAcao", analise, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    CriarMontagem: (montagem) => {
        return http.post("montagem", montagem)

    },
    CriarAdicao: (adicao,reduxFunctions) => {
        return http.post("adicao", adicao, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    CriarAcao: (acao,reduxFunctions) => {
        return http.post("acao", acao, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    CriarTurno: (turno,reduxFunctions) => {
        return http.post("turno", turno, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    ListTurnos: () => {
        return http.get("turnos")

    },
    EditarTurno: (turno) => {
        return http.put(`turno/${turno.id}`, turno)

    },
    CriarOcp: (ocp,reduxFunctions) => {
        return http.post("ocp", ocp, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })
    },

    CriarOcpAcao: (ocp,reduxFunctions) => {
        return http.post("ocpAcao", ocp, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })
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
    FindOneOcp : (id) => {
        return http.get('fullOcp/'+id)
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
    AprovarOcp: (ocpId,reduxFunctions) => {
        return http.put("ocp/aprovar/" + ocpId,{ headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

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
    AdicaoCorrigir: (ocpId,reduxFunctions) => {
        return http.put("adicao/corrigir/" + ocpId, null,{ headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },
    AcaoCorrigir: (ocpId,reduxFunctions) => {
        return http.put("acao/corrigir/" + ocpId,null,{ headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

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

    GeatUnidades: () => {
        return http.get("unidades")

    },

    UpdateTarefaOmp: (tarefaId) => {
        return http.put("omp/tarefa/{tarefaId}")

    },

    UpdadteTrocaOmp: (trocaId) => {
        return http.put("omp/troca/{trocaId}")

    },


    GerarOmp: (ompForm,reduxFunctions) => {
        return http.post("omp", ompForm, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

    },

    FinalizarOmp: (omp,reduxFunctions ) => {
        return http.post("omp/finalizar", omp, { headers: { "reduxFunctions": reduxFunctions.map(func=> func.name) } })

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

    UpLoadAreaWithExcel : (dInicial,dFinal,form) => {
        return http.post(`uploadArea/${dInicial}/${dFinal}`, form, { headers: {"Content-Type": "multipart/form-data" } }).then((response) => { return response});
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