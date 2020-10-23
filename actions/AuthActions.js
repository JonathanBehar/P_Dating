import * as TYPES from "./types";

export const updateUserState = (data) => {
    return {
        type : TYPES.UDPATE_USER_STATE,
        payload : data
    }
}
export const loginSuccess = (data) => {
    return {
        type : TYPES.LOGIN_SUCCESS,
        payload : data
    }
}
export const registerSuccess = (data) => {
    return {
        type : TYPES.REGISTER_SUCCESS,
        payload : data
    }
}

export const logout = () => {
    return {
        type : TYPES.LOGOUT,
        payload : {}
    }
}


