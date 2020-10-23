import { takeEvery,all, take } from "redux-saga/effects";
import * as Types from "../actions/types";
import * as AuthSaga from "./AuthSaga";
import * as MatchSaga from "./MatchSaga";
export default function *root(){

    yield all([
        takeEvery(Types.LOGIN_SUCCESS, AuthSaga.loginSuccess),
        takeEvery(Types.LOGIN_SUCCESS, MatchSaga.getInitialState),
        takeEvery(Types.REGISTER_SUCCESS, AuthSaga.registerSuccess),
        takeEvery(Types.UPDATE_USER_SETTING, MatchSaga.getMatches),
        takeEvery(Types.GET_MATCHED, MatchSaga.getMatched),
        takeEvery(Types.GET_MATCHES, MatchSaga.getMatches)
    ]);

}