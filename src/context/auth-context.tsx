
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  getRedirectResult, 
  setPersistence, 
  browserLocalPersistence 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase";

export type UserRole = "tenant" | "owner" | "admin" | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  userName: string | null;
  isProfileComplete: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  userName: null,
  isProfileComplete: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { auth, firestore: db } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) return;

    // 1. Force Local Persistence
    setPersistence(auth, browserLocalPersistence).catch(console.error);

    // 2. Silently handle redirect results for mobile stability
    getRedirectResult(auth).catch(() => {
      // Ignore "missing initial state" errors common in redirects
    });

    // 3. Monitor Authentication State
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role as UserRole);
            setUserName(userData.name || null);
            setIsProfileComplete(true);
          } else {
            setRole(null);
            setUserName(firebaseUser.displayName || null);
            setIsProfileComplete(false);
          }
        } catch (error) {
          console.error("AuthContext: Error fetching user profile:", error);
          setIsProfileComplete(false);
        }
      } else {
        setUser(null);
        setRole(null);
        setUserName(null);
        setIsProfileComplete(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ user, role, loading, userName, isProfileComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
