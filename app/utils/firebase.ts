import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnkWWwawnP0MUtFZdI0plIPnxz13-mr8Y",
  authDomain: "chatapp-e3666.firebaseapp.com",
  projectId: "chatapp-e3666",
  storageBucket: "chatapp-e3666.appspot.com",
  messagingSenderId: "1054204552709",
  appId: "1:1054204552709:web:860723cbb3ac94f5a8de6c",
  measurementId: "G-GM3Y10T4HP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth};