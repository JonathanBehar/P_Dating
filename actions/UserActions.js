import * as TYPES from "./types";

// export const get_matches = (data) => {
//     return {
//         type : TYPES.GET_MATCHES,
//         payload : data
//     }
// }
export const updateUserSetting = (data) => {
    return {
        type : TYPES.UPDATE_USER_SETTING,
        payload : data
    }
}

export const matchedUser = ( data ) => {
    return {
        type : TYPES.MATCHED_USER,
        payload : data
    }
}


export const getMatched = (data) => {
    return {
        type : TYPES.GET_MATCHED,
        payload : data
    }
}

export const getMatches = (data) => {
    return {
        type : TYPES.GET_MATCHES,
        payload: data
    }
}