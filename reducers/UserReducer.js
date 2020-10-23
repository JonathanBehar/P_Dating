import * as TYPES from "../actions/types";

const initialState = {
    uid : "",
    email : "",
    countryCode :"",
    countryDialCode : "",
    fullname : "",
    birthdate : new Date(),
    gender : "",
    interest : [],
    photos:["","","","","",""],
    location : "",
    minAge : 18,
    maxAge :60,
    distance: 1,
    country : "",
    city : "",
    notification : true,
    plan :"free",
    expireAt : "",
    like_me : [],
    pass_me:[],
    super_like :[],
    showIntroductionModal: false,
    height : 4, 
    weight : 100, 
    relationship : 0,
    religious : 0, 
    bio : "", 
    ethnicity : 0,
    lookingfor : [],
    show_me : "couple",
    subscription_months : 0,
    boost : false,
    boostExpireAt : "",
    matched : [],
    filter_religious : [],
    filter_occupation : [],
}

export default UserReducer = (state = initialState, action) => {

    const { type, payload } = action;

    switch (type) {
        case TYPES.LOGIN_SUCCESS :
            return {
                ...state,
                ...payload
            }
        case TYPES.REGISTER_SUCCESS :
            return {
                ...state,
                uid : payload.uid
            }
        case TYPES.UDPATE_USER_STATE:
            return {
                ...state,
                ...payload
            } 
        case TYPES.UPDATE_USER_SETTING:
            const { uid, position,...user} = payload;    
            return {
                ...state,
                ...user
            }
        case TYPES.LOGOUT :
            return {
                ...initialState
            }
        default: return state;
    }

}