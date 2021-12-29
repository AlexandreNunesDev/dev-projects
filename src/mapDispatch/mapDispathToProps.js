import { actions } from "../actions/actions";
import ScqApi from "../Http/ScqApi";

const dispatchers = (dispatch) => {
    return {
        loading : (data) => dispatch({type: 'IS_LOADING' , payload : data}),
        firstReload : (data) => dispatch({type: 'FIRST_RELOAD' , payload : data}),
        loadProcessos: () => ScqApi.ListaProcessos().then(data =>  dispatch(actions.loadProcessos(data))),
        loadOrdensDeManutencao : () =>  ScqApi.LoadOmps().then(data => dispatch(actions.loadOmps(data))),
        loadEtapas: () => ScqApi.ListaEtapas().then(data => dispatch(actions.loadEtapas(data))),
        loadParametros: () => ScqApi.ListaParametros().then(data => dispatch(actions.loadParametros(data))),
        loadMateriasPrima: () => ScqApi.ListaMateriaPrimas().then(data => dispatch(actions.loadMateriasPrima(data))),
        loadTrocas: () => ScqApi.ListaTrocas().then(data => dispatch(actions.loadTrocas(data))),
        loadTarefasDeManutencao: () => ScqApi.ListaTarefasDeManutencao().then(data => dispatch(actions.loadTarefasDeManutencao(data))) ,
        loadUnidades: () => ScqApi.GeatUnidades().then(data => dispatch(actions.loadUnidades(data))) ,
        loadOcps: () => ScqApi.ListaOcps().then(data => dispatch(actions.loadOcps(data))) ,
        loadTurnos: () => ScqApi.ListTurnos().then(data => dispatch(actions.loadTurnos(data))) ,
        loadOcpView: data => dispatch(actions.loadOcpsView(data)) ,
        showOcpView: data => dispatch(actions.setOcpView(data)) ,
        loadPosition : (data) => dispatch({type: 'LOAD_POSITIONS' , payload : data}),
        addProcesso : (data) => dispatch({type: 'ADD_PROCESSO' , payload : data}),
        addEtapa : (data) => dispatch({type: 'ADD_ETAPA' , payload : data}),
        addOcp : (data) => dispatch({type: 'ADD_OCP' , payload : data}),
        aproveOcp : (data) => dispatch(actions.aproveOcp(data)),
        reanaliseOcp : (data) => dispatch({type:'REANALISE_OCP' , payload : data}),
        setFilterType : (data) => dispatch({type:'SET_FILTER_TYPE' , payload : data}),
        showEncerradas : (data) => dispatch({type:'SHOW_ENCERRADAS' , payload : data}),
        setActualFilter : (data) => dispatch({type:'ACTUAL_FILTER' , payload : data}),
        removeOcp : (data) => dispatch({type: 'REMOVE_OCP' , payload : data}),
        ocpToEdit : (data) => dispatch({type: 'OCP_TO_EDIT' , payload : data}),
        updadteOcpQuantidadeAdicao : (data) => dispatch({type: 'OCP_QTD_ADICAO' , payload : data}),
        loadNotifications : () => ScqApi.ListaNotificacoes().then(data => dispatch(actions.loadNotifications(data))),
        setProcessoIdTarefaRef : (data) => dispatch(actions.setProcessoIdTarefaRef(data)),
        setLogIn : (data) => dispatch(actions.logIn(data)),
        setLogOut : (data) => dispatch(actions.logOut(data)),
        updateTimeField : (data) => dispatch(actions.updateTimeField(data)),
        setCiclo : (data) => dispatch(actions.setCiclo(data)),
        setTimeProcessoId : (data) => dispatch(actions.setTimeProcessId(data)),
        loadFieldTime : () => dispatch(actions.loadFieldTime),
        updadteAnaliseField : () => dispatch(actions.updadteAnaliseField),
        loadFieldAnalise : () => dispatch(actions.loadFieldAnalise),
        setAnaliseToSave: () => dispatch(actions.setAnaliseToSave),
        setSingleAnalise : (data) => dispatch({type : "analiseReducer/setAnaliseToSave", payload : data}),
        setAnaliseProcessoId: () => dispatch(actions.setProcessoIdAnaliseForm),

       
    }
};

export default dispatchers