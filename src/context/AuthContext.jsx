import { useContext, createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    const logOut = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                setUser({});
                setIsLoggedIn(false);
            })
            .catch((error) => {
                // An error happened.
                console.log(error);
            });
    };

    const signIn = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                setUser(user);
                setIsLoggedIn(true);
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log('User', currentUser)
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={ {user, signIn, logOut, isLoggedIn} }>
      {children}
    </UserContext.Provider>
  );
};
export const UserAuth = () => {
    return useContext(UserContext);
  };
  