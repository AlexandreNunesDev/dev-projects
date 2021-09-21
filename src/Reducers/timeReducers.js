import produce from "immer"

const initialState = {
    processoId: null,
    timeFields: []
}

const loadState = () => {
    return initialState;
}


const timeReducer = produce(
    (draft, action) => {
        switch (action.type) {

            case "UPDADTE_FIELDTIME":
                const index = draft.timeFields.findIndex(fieldTime => Number(fieldTime.index) === Number(action.payload.index))
                if (index !== -1) draft.timeFields[index] = action.payload
                break
            case "LOAD_FIELDTIME":
                draft.timeFields = action.payload
                break
            case "TIME_PROCESSO_ID":
                draft.processoId = action.payload
                break
        }
        return
    }, loadState()

)
export default timeReducer;