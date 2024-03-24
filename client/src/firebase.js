// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  apiKey:"AIzaSyA9W9IZiynRsYFpj7UcX-JCPCOjebA9ohQ",
  authDomain: "realestate-8e9e2.firebaseapp.com",
  projectId: "realestate-8e9e2",
  storageBucket: "realestate-8e9e2.appspot.com",
  messagingSenderId: "18255849489",
  appId: "1:18255849489:web:cdb5848637146fd57ca9b0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);