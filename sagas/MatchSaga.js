import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as Types from "../actions/types";
import { getMatches as getMatchesFirbase, getLikes as getLikesFirbase, getMatched as getMatchedFirbase } from "../utils/firebase";


export function* getInitialState(action) {
    const { payload } = action;
    console.warn("Get Initial State", payload);
    const { uid, minAge, maxAge, show_me, distance, plan, position, like_me,filter_religious, filter_occupation } = payload;
    const params = {
        uid : uid,
        minAge : minAge,
        maxAge : maxAge,
        show_me : show_me,
        distance : distance,
        plan : plan,
        position : position,
        filter_religious : filter_religious,
        filter_occupation : filter_occupation
    }
    const matches = yield call(getMatchesFirbase,params);
    const matched = yield call(getMatchedFirbase, uid);

    yield put({ type : Types.UPDATE_MATCHED_INITIAL, payload : {matches : matches, matched : matched}})


}
export function* getMatches(action) {
    const { payload } = action;
    const { uid, minAge, maxAge, show_me, distance, plan, position, filter_religious, filter_occupation } = payload;
    const params = {
        uid : uid,
        minAge : minAge,
        maxAge : maxAge,
        show_me : show_me,
        distance : distance,
        plan : plan,
        position : position, 
        filter_religious : filter_religious,
        filter_occupation : filter_occupation

    }
    const matches = yield call(getMatchesFirbase,params);
    yield put({ type : Types.UPDATE_MATCHES, payload :  { matches : matches}});

}


export function* getMatched(action){
    const { payload } = action;
    const { uid } = payload;
    const matched = yield call(getMatchedFirbase, uid);
    yield put({type : Types.UPDATE_MATCHED, payload : {matched : matched}});
}