

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
import useAxiosSecure from '../../hooks/useAxios'; 


const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

  
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
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);

            if (currentUser) {
                
                const userInfo = { email: currentUser.email };
                axiosSecure.post('/api/auth/token', userInfo)
                    .then(res => {
                        if (res.data.token) {
                            localStorage.setItem('access-token', res.data.token);
                            setLoading(false);
                        }
                    })
                    .catch(error => {
                        console.error("Token generation failed:", error);
                        setLoading(false);
                    });
            } else {
                
                localStorage.removeItem('access-token');
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [axiosSecure]);

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