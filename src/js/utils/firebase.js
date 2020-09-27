import firebase from 'firebase'
import firebaseConfig from './firebase-config'

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
db.settings({ timestampsInSnapshots: true})

export {auth, db}