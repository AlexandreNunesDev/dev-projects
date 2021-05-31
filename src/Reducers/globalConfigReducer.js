const initialState = {
    loadedOptions : [],
    loading : false,
}

const loadState = () => {
    try {
      const serializedState = localStorage.getItem('state');
      if(serializedState === null) {
        return initialState;
      }

      const actualState = JSON.parse(serializedState);
      if(actualState.global=== null){
        return initialState;
      } else {
        return actualState.global
      }
      
      
    } catch (e) {
      return undefined;
    }
  };

  
const globalConfig = function (state = loadState(), action) {
    switch (action.type) {
    case "LOAD_POSITIONS":
        state.loadedOptions.push(action.payload)
        return state
    case "IS_LOADING":
        state.loading = action.payload
        return state
    default :
        return state

    }
  };

  export default globalConfig