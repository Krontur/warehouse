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
  const [role, setRole] = useState('user');

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

    const signIn = async (email, password) => {
      try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setUser(user);
        await localStorage.setItem('user-token',  user.getIdToken());
        setIsLoggedIn(true);
        await setRole(user.photoURL);
      } catch (error){
        console.log(error);
      }
    };

    
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const user = currentUser;
      if (user) {
        setIsLoggedIn(true);
        setRole(user.photoURL);
      } else {
        setIsLoggedIn(false);
      }
      setUser(currentUser);
      console.log('User', currentUser)
    });
    return async () => {
      await unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={ {user, signIn, logOut, isLoggedIn, role, setIsLoggedIn} }>
      {children}
    </UserContext.Provider>
  );
};
export const UserAuth = () => {
    return useContext(UserContext);
  };
  