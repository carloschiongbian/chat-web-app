import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCddHNi8Xab1mUtgx7qKlZIF85c-7QZafA",
  authDomain: "minutes-web-app.firebaseapp.com",
  projectId: "minutes-web-app",
  storageBucket: "minutes-web-app.appspot.com",
  messagingSenderId: "836390659952",
  appId: "1:836390659952:web:b341cef4defe44725b11b5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
