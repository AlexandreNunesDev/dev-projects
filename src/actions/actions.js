
export const actions = {
    loading : (data) => {return {type: 'IS_LOADING' , payload : data}},
    firstReload : (data) => {return{type: 'FIRST_RELOAD' , payload : data}},
    loadProcessos: (data) => {return { type: 'LOAD_PROCESSOS', payload : data }},
    loadEtapas: (data) =>  {return {type: 'LOAD_ETAPAS', payload : data }},
    loadParametros: (data) => {return {type : 'LOAD_PARAMETROS' , payload : data}},
    loadMateriasPrima: (data) => {return {type : 'LOAD_MATERIAS_PRIMA' , payload : data}},
    loadTrocas: (data) => {return {type : 'LOAD_TROCAS' , payload : data}},
    loadTarefasDeManutencao: (data) => {return {type : 'LOAD_TAREFAS_DE_MANUTENCAO' , payload : data}},
    loadUnidades: (data) => {return {type : 'LOAD_UNIDADES' , payload : data}},
    loadOcps: (data) => {return {type : 'LOAD_OCPS' , payload : data}},
    loadOcpsView: (data) => {return {type : 'LOAD_OCP_VIEW' , payload : data}},
    loadOmps: (data) =>  {return {type: 'ordensDeManutencao/updateOrdem', payload : data }},
    setOcpView: (data) => {return {type : 'SET_OCP_VIEW' , payload : data}},
    loadPosition : (data) => {return {type: 'LOAD_POSITIONS' , payload : data}},
    addProcesso : (data) => {return {type: 'ADD_PROCESSO' , payload : data}},
    addEtapa : (data) => {return {type: 'ADD_ETAPA' , payload : data}},
    addOcp : (data) => {return {type: 'ADD_OCP' , payload : data}},
    aproveOcp : (data) => {return {type: 'APROVE_OCP' , payload : data}},
    reanaliseOcp : (data) => {return {type:'REANALISE_OCP' , payload : data}},
    setFilterType : (data) => {return {type:'SET_FILTER_TYPE' , payload : data}},
    showEncerradas : (data) => {return {type:'SHOW_ENCERRADAS' , payload : data}},
    setActualFilter : (data) =>  {return{type:'ACTUAL_FILTER' , payload : data}},
    removeOcp : (data) => {return {type: 'REMOVE_OCP' , payload : data}},
    ocpToEdit : (data) => {return{type: 'OCP_TO_EDIT' , payload : data}},
    loadNotifications : (data) => {return{type: 'LOAD_NOTIFICATIONS' , payload: data}},
    setProcessoIdTarefaRef : (data) => {return{type: 'PROCESSOID_TAREFA_REF' , payload: data}},
    logIn : (data) => {return{type: 'LOGIN' , payload: data}},
    logOut : (data) => {return{type: 'LOGOUT' , payload: data}},
    updateTimeField : (data) => {return{type: 'UPDADTE_FIELDTIME' , payload: data}},
    setCiclo : (data) => {return{type: 'SET_CICLO' , payload: data}},
    clearCiclo : (data) => {return{type: "CLEAR_CICLO" , payload: data}},
    setTimeProcessId : (data) => {return{type: "TIME_PROCESSO_ID" , payload: data}},
    loadFieldTime : (data) => {return{type: "LOAD_FIELDTIME" , payload: data}},
    loadTurnos : (data) => {return{type: "LOAD_TURNOS" , payload: data}},
    updadteAnaliseField : (data) => {return{type: "UPDADTE_FIELDANALISE" , payload: data}},
    loadFieldAnalise : (data) => {return{type: "LOAD_FIELDANALISE" , payload: data}},
    setAnaliseToSave : (data) => {return{type: "ANALISE_TO_SAVE" , payload: data}},
    setProcessoIdAnaliseForm : (data) => {return{type: "ANALISE_PROCESSO_ID" , payload: data}},
    setParametroNome : (data) => {return{type: "PARAMETRO_NOME" , payload: data}},
    setEtapaNomeForm : (data) => {return{type: "ETAPA_NOME" , payload: data}},
    setTurnoAnaliseForm : (data) => {return{type: "TURNO" , payload: data}},
    

}

