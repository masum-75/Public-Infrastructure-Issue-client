

import React, {  useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    updateProfile, 
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init"; 



const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

   
    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

 
    const updateUserProfile = (profile) => {
        return updateProfile(auth.currentUser, profile);
    };

 
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

   
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            // Backend-er `/api/auth/token` call korar dorkar nai
            // Shudhu Firebase theke token-ti niye local storage-e rakhun
            const token = await currentUser.getIdToken();
            localStorage.setItem('access-token', token);
        } else {
            localStorage.removeItem('access-token');
        }
        setLoading(false);
    });
    return () => unsubscribe();
}, []);

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
        updateUserProfile
    };

    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;