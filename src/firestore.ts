import secrets from "./secrets"
import firebase, {ServiceAccount} from 'firebase-admin'

let db = null;

const getClient = () => {
    if (db) return db

    firebase.initializeApp({
        credential: firebase.credential.cert(<ServiceAccount>secrets.firebase)
    });

    db = firebase.firestore();

    return db
}

export default {
    getClient
}
