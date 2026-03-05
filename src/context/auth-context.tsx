
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
    // Ensure persistence is set to local for mobile stability
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn("AuthContext: Persistence setup failed", err);
    });

    // Handle redirect results globally. 
    // This is critical for mobile browsers that might reload the app after auth.
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("AuthContext: Captured redirect result for", result.user.email);
        }
      })
      .catch((error) => {
        // Silence "missing initial state" errors as they are often false positives 
        // in storage-partitioned environments (Safari)
        if (error.code !== 'auth/no-auth-event' && error.code !== 'auth/argument-error') {
          console.warn("AuthContext: Redirect result issue handled:", error.message);
        }
      });

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
          console.error("AuthContext: Error fetching user role:", error);
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
