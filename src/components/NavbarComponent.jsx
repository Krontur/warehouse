// NavbarComponent.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import '../css/Navbar.css';

const NavbarComponent = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand href="/">Lagerverwaltung</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="/">Inicio</Nav.Link>
                        <Nav.Link href="#about">Acerca de</Nav.Link>
                        <Nav.Link href="/products">Productos</Nav.Link>
                        <Nav.Link href="/createproduct">Crear producto</Nav.Link>                        
                        <Nav.Link href="/purchasehistory">Historial de pedidos</Nav.Link>
                        <Nav.Link href="/shoppingcart">Carrito de la compra</Nav.Link>
                        <Nav.Link href="/addcartitem">Añadir al carrito</Nav.Link>
                        <Nav.Link href="#contact">Contacto</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
