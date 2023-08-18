// NavbarComponent.js
import React, { useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../css/Navbar.css';
import { UserAuth } from '../context/AuthContext';

const NavbarComponent = () => {
const {isLoggedIn, user, logOut} = UserAuth();

useEffect(() => {
    
}, [user]);

const logoutHandler = () => {
    logOut();
};

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand href="/">Lagerverwaltung</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/products">Produkte</Nav.Link>
                        <Nav.Link href="/createproduct">neues Produkt</Nav.Link>                        
                        <Nav.Link href="/purchasehistory">Historie</Nav.Link>
                        <Nav.Link href="/shoppingcart">Warenkorb</Nav.Link>
                        <Nav.Link href="/addcartitem">neue Buchung</Nav.Link>
                        {!isLoggedIn ?
                            <Nav.Link href="/login">Anmelden</Nav.Link> : <Nav.Link onClick={() => logoutHandler()}>Abmelden</Nav.Link>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
