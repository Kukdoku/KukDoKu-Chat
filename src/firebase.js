import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAp_mTNi9iN7Uf5c6BqX123cQJABe_znJ8",
  authDomain: "kem-chho-c3607.firebaseapp.com",
  projectId: "kem-chho-c3607",
  storageBucket: "kem-chho-c3607.appspot.com",
  messagingSenderId: "113188162832",
  appId: "1:113188162832:web:4c62b3b8b461e24fbee995",
  measurementId: "G-MMV8JYW8F3",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, storage, provider };
