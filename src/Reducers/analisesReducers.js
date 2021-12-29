

import produce from "immer"


const initialState = {
    processoId : null,
    analiseToSave: null,
    analiseFields: []
    
}

const loadState = () => {
    return initialState;
}


const analiseReducer = produce(
    (draft, action) => {
        switch (action.type) {

            case "UPDADTE_FIELDANALISE":
                const index = draft.analiseFields.findIndex(fieldAnalise => Number(fieldAnalise.index) === Number(action.payload.index))
                if (index !== -1) draft.analiseFields[index] = action.payload
                break
            case "LOAD_FIELDANALISE":
                draft.analiseFields = action.payload
                break
            case "ANALISE_TO_SAVE":
                draft.analiseToSave = action.payload
                break
            case "ANALISE_PROCESSO_ID":
                draft.processoId = action.payload
                break

        }
        return
    }, loadState()

)
export default analiseReducer;