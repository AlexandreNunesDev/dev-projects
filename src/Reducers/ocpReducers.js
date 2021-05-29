import produce from "immer"

const initialState = {
  ocps: [],
  filteredOcps : [],
  showEncerradas : false,
  filterType : '',
  actualFilter : '',
 

}

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return initialState;
    }
    const actualState = JSON.parse(serializedState);
    return actualState.ocp;
  } catch (e) {
    return null;
  }
};


const ocpsReducer = produce(
  (draft, action) => {
    switch (action.type) {
      case "LOAD_OCPS":
        const maxIndexOcps = draft.ocps.length
        draft.ocps.splice(0,maxIndexOcps,...action.payload)
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
        if (indexOcps !== -1) draft.splice(indexOcps, 1)
       
     
        
       
    }
    return
  },loadState()
  
)
export default ocpsReducer;