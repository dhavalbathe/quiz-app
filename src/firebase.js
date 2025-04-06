// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; // Add this import


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPsrVH-BR1oKTqk7sRdiuucrpBmMzEJbs",
  authDomain: "quiz-app-pvpit.firebaseapp.com",
  projectId: "quiz-app-pvpit",
  storageBucket: "quiz-app-pvpit.firebasestorage.app",
  messagingSenderId: "692159575166",
  appId: "1:692159575166:web:e24fc33bbdba03cfe7542f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
export { auth, db };
