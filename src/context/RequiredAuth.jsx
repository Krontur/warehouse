import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { UserAuth } from './AuthContext';




const RequiredAuth = ({children}) => {

    const {isLoggedIn, setIsLoggedIn} = UserAuth();

    const checkUserToken = () => {
        const userToken = localStorage.getItem('user-token');
        console.log(userToken)
        if (!userToken || userToken === 'undefined') {
            setIsLoggedIn(false);
            return (
                <Navigate to="/login" />
            );
        }
        setIsLoggedIn(true);
        return children;
    }
    useEffect(() => {
            checkUserToken();
        }, [isLoggedIn]);
    
    return (
        <>
            {checkUserToken()}
        </>
    );
}

export default RequiredAuth;