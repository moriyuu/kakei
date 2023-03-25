import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import store from "../utils/store";

const firebaseConfig = {
  apiKey: "AIzaSyCWiP2RbjMBOLSZPnpSkx_NcX2GWFQ-wQk",
  authDomain: "kakei-358821.firebaseapp.com",
  projectId: "kakei-358821",
  storageBucket: "kakei-358821.appspot.com",
  messagingSenderId: "854381936521",
  appId: "1:854381936521:web:babe27e7cc26f73660eb58",
  measurementId: "G-WZHFN58ZSZ",
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signIn = () => signInWithRedirect(auth, provider);

export const getIdToken = async () => {
  if (!auth.currentUser) {
    const idToken = store?.load<string>("idToken");
    return idToken;
  }
  return auth.currentUser.getIdToken();
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const signOut = () => {
  fbSignOut(auth);
  store?.remove("idToken");
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const idToken = await user.getIdToken();
    store?.save("idToken", idToken);
  } else {
    signOut();
  }
});
