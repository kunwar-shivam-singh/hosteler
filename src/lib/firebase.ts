import { initializeFirebase } from "@/firebase";

// Standardize Firebase service initialization to prevent multiple app instances
const services = initializeFirebase();

export const auth = services.auth;
export const db = services.firestore;
export const storage = services.storage;
export const firebaseApp = services.firebaseApp;
