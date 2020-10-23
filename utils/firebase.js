import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { distance as calculateDistance } from "./index"


async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
    }
}

async function saveTokenToDatabase(token) {
    // Assume user is already signed in
    const userId = auth().currentUser.uid;
    // Add the token to the users datastore
    await firestore()
        .collection('users')
        .doc(userId)
        .update({
            pushTokens: firestore.FieldValue.arrayUnion(token),
        });
}

export async function savePushNotificationToken() {

    await requestUserPermission();
    messaging()
        .getToken()
        .then(token => {
            return saveTokenToDatabase(token);
        });

    return messaging().onTokenRefresh(token => {
        saveTokenToDatabase(token);
    });
}

export async function getMatches(params) {

    var users = [];
    var boostedUsers = [];
    console.warn(params);
    const { uid, show_me, minAge, maxAge, distance, position, filter_religious, filter_occupation} = params;
    const collection = firestore().collection("users");
    var query = collection.where("age", ">=", minAge).where("age", "<", maxAge);
    if(filter_religious.length != 0 && filter_religious.lengh != undefined){
        filter_religious.forEach( index => {
            query.where("religious", "==", filter_religious[index]);
        })        
    }
    if(filter_occupation.length != 0 && filter_occupation.length != undefined){
        filter_occupation.forEach(index => {
            query.where("occupation", "==", filter_occupation[index]);
        })        
    }
    const querySnaps = await query.get()
    querySnaps.forEach(doc => {
        var temp = doc.data();
        const upos = position;
        const rpos = temp.position;
        var dist = 0;
        if (position != "" && position != undefined) {
            dist = calculateDistance(upos.lat, rpos.lat, upos.lng, rpos.lng);
        }
        if (temp.uid != uid &&
            !temp.like_me.find((a) => a == uid) &&
            !temp.pass_me.find((a) => a == uid) &&
            dist < distance) {
            if (show_me == "both" || temp.gender == show_me) {
                temp.dist = dist;
                if (temp.boost == true) boostedUsers.push(temp)
                else users.push(temp);
            }
        }
    });

    boostedUsers.sort(function (a, b) {
        return a.dist < b.dist;
    });
    users.sort(function (a, b) {
        return a.dist < b.dist;
    })

    return [...boostedUsers, ...users];
}

export async function getLikes(uids) {
    var likes = [];
    if (uids.length == 0) return likes;
    const snapshots = await firestore().collection("users").where("uid", "in", uids).get();
    snapshots.docs.map(async (doc) => {
        const data = doc.data();
        likes.push(data);
    });
    return likes;
}

export async function getMatched(uid) {
    var matched = [];
    const snapshots = await firestore().collection("users").where("matched", "array-contains", uid).get();
    snapshots.docs.map(async (doc) => {
        const data = doc.data();
        if(data != undefined) matched.push(data);
    });
    return matched;
}