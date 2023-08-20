// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAZIdYfRqTIXuF7b2vnldGsSLugS595-S4",
    authDomain: "warehouse-9659a.firebaseapp.com",
    projectId: "warehouse-9659a",
    storageBucket: "warehouse-9659a.appspot.com",
    messagingSenderId: "1008749761087",
    appId: "1:1008749761087:web:18639ef5eef766d40d9e8a",
    measurementId: "G-3Y9RWX8TF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
