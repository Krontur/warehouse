import React from 'react';
import { UserAuth } from '../context/AuthContext';

import logo from '../static/img/Leipzig-Halle_Airport_Logo.svg.svg';
import '../css/App.css'

const Home = () => {
    const {isLoggedIn, user} = UserAuth();
    return (
        <div className="App">
            <header className="App-header">
                {isLoggedIn ? <h2>Hallo, {user.displayName}</h2> : <h2>Hallo, melde dich an</h2>}
                <object data={logo} className="App-logo" alt="logo"></object>
            </header>
        </div>
    )
}

export default Home;