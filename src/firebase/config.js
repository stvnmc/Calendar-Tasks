import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVwmbLqAE-4UvMaZ5t9j4CdLU-IjZF290",
  authDomain: "calendario-taks.firebaseapp.com",
  projectId: "calendario-taks",
  storageBucket: "calendario-taks.appspot.com",
  messagingSenderId: "169120470742",
  appId: "1:169120470742:web:e30e1239ee27f959cfdb77",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const dbAuth = getAuth(app);
