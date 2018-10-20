import secrets from "./secrets"
import firebase, { ServiceAccount } from "firebase-admin"

let db = null

const getClient = () => {
    if (db) return db

    firebase.initializeApp({
        credential: firebase.credential.cert(<ServiceAccount>secrets.firebase),
    })

    db = firebase.firestore()

    try {
        db.settings({
            timestampsInSnapshots: true,
        })
    } catch (e) {
        console.log("Can not set firestore settings")
    }

    return db
}

export default {
    getClient,
}
