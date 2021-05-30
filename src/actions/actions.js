
export const actions = {
    loading : (data) => {return {type: 'IS_LOADING' , payload : data}},
    loadProcessos: (data) => {return { type: 'LOAD_PROCESSOS', payload : data }},
    loadEtapas: (data) =>  {return {type: 'LOAD_ETAPAS', payload : data }},
    loadParametros: (data) => {return {type : 'LOAD_PARAMETROS' , payload : data}},
    loadMateriasPrima: (data) => {return {type : 'LOAD_MATERIAS_PRIMA' , payload : data}},
    loadTrocas: (data) => {return {type : 'LOAD_TROCAS' , payload : data}},
    loadTarefasDeManutencao: (data) => {return {type : 'LOAD_TAREFAS_DE_MANUTENCAO' , payload : data}},
    loadOcps: (data) => {return {type : 'LOAD_OCPS' , payload : data}},
    loadPosition : (data) => {return {type: 'LOAD_POSITIONS' , payload : data}},
    addProcesso : (data) => {return {type: 'ADD_PROCESSO' , payload : data}},
    addEtapa : (data) => {return {type: 'ADD_ETAPA' , payload : data}},
    addOcp : (data) => {return {type: 'ADD_OCP' , payload : data}},
    aproveOcp : (data) => {return {type: 'APROVE_OCP' , payload : data}},
    reanaliseOcp : (data) => {return {type:'REANALISE_OCP' , payload : data}},
    setFilterType : (data) => {return {type:'SET_FILTER_TYPE' , payload : data}},
    showEncerradas : (data) => {return {type:'SHOW_ENCERRADAS' , payload : data}},
    setActualFilter : (data) =>  {return{type:'ACTUAL_FILTER' , payload : data}},
    removeOcp : (data) => {return {type: 'REMOVE_OCP' , payload : data}}
}

