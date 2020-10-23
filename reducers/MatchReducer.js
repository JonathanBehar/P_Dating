import * as TYPES from "../actions/types";

const initialState = {
    matches : [],
    matched : [],
    loading : false
}

export default MatchReducer  = (state = initialState, action) => {

    const { type , payload } = action;

    switch (type) {

        case TYPES.UPDATE_MATCHED_INITIAL:
            return {
                matches : payload.matches,
                matched : payload.matched,
                loading : false
            }
        case TYPES.UPDATE_MATCHES:
            return {
                ...state,
                matches : payload.matches,
                loading : false
            }
        
        case TYPES.LOGOUT :
            return {
                matches : [],
                matched : [],
                loading : false
            }
        case TYPES.MATCHED_USER :
            return {
                ...state,
                matched : [...state.matched, payload]
            }

        case TYPES.UPDATE_MATCHED:
            return {
                ...state,
                matched : payload.matched
            }

        default: return state
    }
}