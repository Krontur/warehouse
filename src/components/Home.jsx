import React from 'react';

import logo from '../static/img/Leipzig-Halle_Airport_Logo.svg.svg';
import '../css/App.css'

const Home = () => {
    return (
        <div className="App">
            <header className="App-header">
                <object data={logo} className="App-logo" alt="logo"></object>
            </header>
        </div>
    )
}

export default Home;