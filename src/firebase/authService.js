import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "./firebase.js";

const USERS_COLLECTION = "users";

function assertFirebase() {
  if (!isFirebaseConfigured || !auth || !db) {
    throw new Error(
      "Firebase is not configured. Add VITE_FIREBASE_* variables to your .env file."
    );
  }
}

/**
 * Create Firestore user doc only if it does not already exist.
 * Schema: { uid, name, email, photo, role, createdAt }
 */
export async function ensureFirestoreUser(firebaseUser) {
  assertFirebase();

  const { uid, displayName, email, photoURL } = firebaseUser;
  const userRef = doc(db, USERS_COLLECTION, uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  const userData = {
    uid,
    name: displayName || email?.split("@")[0] || "Student",
    email: email || "",
    photo: photoURL || "",
    role: "student",
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, userData);
  return { ...userData, createdAt: new Date().toISOString() };
}

export async function signInWithGoogle() {
  assertFirebase();

  const result = await signInWithPopup(auth, googleProvider);
  const firestoreUser = await ensureFirestoreUser(result.user);

  return {
    firebaseUser: result.user,
    firestoreUser,
  };
}

export async function signOutGoogle() {
  if (!auth) return;
  await firebaseSignOut(auth);
}

export function subscribeToAuthChanges(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function mapFirebaseToAppUser(firebaseUser, firestoreUser, backendUser) {
  return {
    ...backendUser,
    fullName:
      backendUser?.fullName ||
      firestoreUser?.name ||
      firebaseUser?.displayName ||
      "Student",
    email: backendUser?.email || firestoreUser?.email || firebaseUser?.email,
    imageUrl:
      backendUser?.imageUrl ||
      firestoreUser?.photo ||
      firebaseUser?.photoURL ||
      null,
    role: backendUser?.role || firestoreUser?.role || "student",
    firebaseUid: firebaseUser?.uid,
    authProvider: "google",
  };
}
