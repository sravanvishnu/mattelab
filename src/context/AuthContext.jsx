import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

const APPROVED_ORGANIZER_EMAILS = [
  "nayankeshav29@gmail.com"
].map(e => e.toLowerCase());

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserProfile(userSnap.data());
          } else {
            const newProfile = {
              name: user.displayName || "Maker",
              email: user.email || "",
              role: APPROVED_ORGANIZER_EMAILS.includes(user.email?.toLowerCase()) ? "organizer" : "student",
              createdAt: serverTimestamp()
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setUserProfile({
            name: user.displayName || "Maker",
            email: user.email || "",
            role: "student"
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error("Login popup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const isAdmin = Boolean(
    currentUser && (
      userProfile?.role === 'admin' ||
      userProfile?.role === 'organizer' ||
      (currentUser.email && APPROVED_ORGANIZER_EMAILS.includes(currentUser.email.toLowerCase()))
    )
  );

  const isOrganizer = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        isOrganizer,
        loading,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
