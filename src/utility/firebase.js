import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6szvLEp_-PUoPTGk9C1Kea2OrYeVmGrM",
  authDomain: "tranos-819f7.firebaseapp.com",
  databaseURL: "https://tranos-819f7-default-rtdb.firebaseio.com",
  projectId: "tranos-819f7",
  storageBucket: "tranos-819f7.appspot.com",
  messagingSenderId: "260969473008",
  appId: "1:260969473008:web:98d88a54af3781bfa2b335",
  measurementId: "G-RZNHPZ8SMZ",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);