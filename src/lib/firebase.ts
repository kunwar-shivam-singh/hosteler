// This file serves as a barrel for standardized Firebase services.
// It redirects to the internal @/firebase library to ensure singleton instances.

import { initializeFirebase } from "@/firebase";

const services = initializeFirebase();

export const auth = services.auth;
export const db = services.firestore;
export const storage = services.storage;
