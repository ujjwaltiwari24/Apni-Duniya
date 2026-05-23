import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAV1RraMlFDpBPXprQW7g77uVFzSD91tvE",
  authDomain: "apni-duniya-9bd5e.firebaseapp.com",
  projectId: "apni-duniya-9bd5e",
  storageBucket: "apni-duniya-9bd5e.firebasestorage.app",
  messagingSenderId: "365813920846",
  appId: "1:365813920846:web:3c9c4208953626a22d7f1f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider =
  new GoogleAuthProvider();

export const db =
  getFirestore(app);