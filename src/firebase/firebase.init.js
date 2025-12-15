// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXkbmMoWVGwpnwPi59vB6_GyN5Whe6p4M",
  authDomain: "public-issue.firebaseapp.com",
  projectId: "public-issue",
  storageBucket: "public-issue.firebasestorage.app",
  messagingSenderId: "686847196760",
  appId: "1:686847196760:web:d9635e810178715654142d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);