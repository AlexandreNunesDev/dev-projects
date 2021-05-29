const dispatchers = (dispatch,data) => {
    return {
        loading : (data) => dispatch({type: 'IS_LOADING' , payload : data}),
        loadProcessos: (data) => dispatch({ type: 'LOAD_PROCESSOS', payload : data }),
        loadEtapas: (data) => dispatch( {type: 'LOAD_ETAPAS', payload : data }),
        loadParametros: (data) => dispatch({type : 'LOAD_PARAMETROS' , payload : data}),
        loadMateriasPrima: (data) => dispatch({type : 'LOAD_MATERIAS_PRIMA' , payload : data}),
        loadTrocas: (data) => dispatch({type : 'LOAD_TROCAS' , payload : data}),
        loadTarefasDeManutencao: (data) => dispatch({type : 'LOAD_TAREFAS_DE_MANUTENCAO' , payload : data}),
        loadOcps: (data) => dispatch({type : 'LOAD_OCPS' , payload : data}),
        loadPosition : (data) => dispatch({type: 'LOAD_POSITIONS' , payload : data}),
        addProcesso : (data) => dispatch({type: 'ADD_PROCESSO' , payload : data}),
        addEtapa : (data) => dispatch({type: 'ADD_ETAPA' , payload : data}),
        addOcp : (data) => dispatch({type: 'ADD_OCP' , payload : data}),
        aproveOcp : (data) => dispatch({type: 'APROVE_OCP' , payload : data}),
        reanaliseOcp : (data) => dispatch({type:'REANALISE_OCP' , payload : data}),
        setFilterType : (data) => dispatch({type:'SET_FILTER_TYPE' , payload : data}),
        showEncerradas : (data) => dispatch({type:'SHOW_ENCERRADAS' , payload : data}),
        setActualFilter : (data) => dispatch({type:'ACTUAL_FILTER' , payload : data}),
        removeOcp : (data) => dispatch({type: 'REMOVE_OCP' , payload : data})
       
    }
};

export default dispatchers