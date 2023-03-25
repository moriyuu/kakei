import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const credential = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "");
const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({ credential: cert(credential) }, "admin");

const auth = getAuth(app);

export const verifyIdToken = (idToken: string) =>
  auth.verifyIdToken(idToken).catch((err) => null);
