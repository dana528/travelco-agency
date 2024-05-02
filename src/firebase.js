import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Import storage module

const firebaseConfig = {
    apiKey: "AIzaSyCc1iug5tkJRJ7InT4p6pevU1sr0u6SN-8",
    authDomain: "agency-doc-manage.firebaseapp.com",
    projectId: "agency-doc-manage",
    storageBucket: "agency-doc-manage.appspot.com",
    messagingSenderId: "764525848829",
    appId: "1:764525848829:web:7f3f5244e72e2073ac3694",
    measurementId: "G-DX7SCH15SR"
  };
  


const app = firebase.initializeApp(firebaseConfig)

// Initialize Firestore and Storage
const db = app.firestore();
const storage = app.storage();

// Export Firestore and Storage
export { db, storage };