const functions = require("firebase-functions");
const { firestore } = require('firebase-admin');
const moment = require('moment');

exports.updateBoostsStatus = functions.pubsub.schedule('every 1 minutes').onRun( async (context) => {
    // await firestore().collection("history").add({data:JSON.stringify(context)});

    const boostsSnaps = await firestore().collection("users").where("boost", "==", true).get();

    boostsSnaps.docs.map(async (doc) => {
        let user = doc.data();
        const expireAt = user.boostExpireAt;
        const diff = moment(expireAt.toDate()).diff(new Date(), "seconds");
        if(diff <= 0){
            await firestore().collection("users").doc(user.uid).update({
                boost : false,
                boostExpireAt : ""
            })
        }

    })


    return null;
})
