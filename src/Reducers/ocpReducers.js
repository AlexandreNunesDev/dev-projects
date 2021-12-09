import produce from "immer"

const initialState = {
  ocps: [],
  filteredOcps: [],
  showEncerradas: false,
  filterType: '',
  actualFilter: '',
  ocpToEdit: {},
  ocpsView: [],
  showOcpView: false


}

const loadState = () => {
  return initialState;
};

const ocpsReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case "LOAD_OCPS":
        const maxIndexOcps = draft.ocps.length
        draft.ocps.splice(0, maxIndexOcps, ...action.payload)
        break
      case "LOAD_OCP_VIEW":
        draft.ocpsView = action.payload
        break
      case "ADD_OCP":
        draft.ocps.push(action.payload)
        break
      case "SET_FILTER_TYPE":
        draft.filterType = action.payload
        break
      case "ACTUAL_FILTER":
        draft.actualFilter = action.payload
        break
      case "APROVE_OCP":
        const indexToUpdadte = draft.ocps.findIndex(ocp => ocp.id === action.payload)
        if (indexToUpdadte !== -1) draft.ocps[indexToUpdadte].statusOCP = true
        break
      case "REANALISE_OCP":
        const indexReanalise = draft.ocps.findIndex(ocp => ocp.id === action.payload)
        if (indexReanalise !== -1) draft.ocps[indexReanalise].analiseStatus = false
        break
      case "SHOW_ENCERRADAS":
        draft.showEncerradas = action.payload
        break
      case "REMOVE_OCP":
        const indexOcps = draft.ocps.findIndex(ocp => ocp.id === action.payload)
        if (indexOcps !== -1) draft.ocps.splice(indexOcps, 1)
        break
      case "OCP_TO_EDIT":
        draft.ocpToEdit = action.payload
        break
      case "SET_OCP_VIEW":
        draft.showOcpView = action.payload
        break
      case "OCP_QTD_ADICAO":
        let ocpAdicaoIndex = draft.ocpToEdit.adicoesDto.findIndex(adicao => adicao.id === action.payload.id)
        if (ocpAdicaoIndex !== -1) draft.ocpToEdit.adicoesDto[ocpAdicaoIndex].quantidade = action.payload.quantidade
        break


    }
    return
  }, loadState()

)
export default ocpsReducer;