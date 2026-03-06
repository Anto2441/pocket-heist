import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "pocket-heist-ad",
  appId: "1:128773076116:web:0d09136bf6f83ef8e87081",
  storageBucket: "pocket-heist-ad.firebasestorage.app",
  apiKey: "AIzaSyBHcH3Fz5fvA9rFlxGL5OiBY18ur2WQRzE",
  authDomain: "pocket-heist-ad.firebaseapp.com",
  messagingSenderId: "128773076116",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
