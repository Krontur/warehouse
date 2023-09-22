import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProductsList from './components/ProductsList';
import Home from './components/Home';
import NavbarComponent from './components/NavbarComponent';
import ProductForm from './components/ProductForm';
import ShoppingCartComponent from './components/ShoppingCartComponent';
import PurchaseHistoryComponent from './components/PurchaseHistoryComponent';
import AddCartItemForm from './components/AddCartItemForm';
import { AuthContextProvider } from './context/AuthContext';
import RequiredAuth from './context/RequiredAuth';

//import { addProductsToFirestore } from './test/addProductsToFirestore';
//import { addOrdersToFirestore } from './test/addOrdersToFirestore';
//import addOrderCompleteField  from './test/addOrderCompleteField.js';
//import { updateOrderItems } from './test/test';
//import { copyElementsFromEntriesToOrders } from './test/copyElementsFromEntriesToOrders.js';

import './css/App.css';

function App() {

  return (
    <AuthContextProvider>
    <Router>
        <NavbarComponent/>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={<RegisterForm/>} />
          
          <Route path="/products" element={
            <RequiredAuth>
              <ProductsList/>
            </RequiredAuth>
            } />
          <Route path='/createproduct' element={
            <RequiredAuth>
              <ProductForm/>
            </RequiredAuth>} />
          <Route path='/shoppingcart' element={
            <RequiredAuth>
              <ShoppingCartComponent/>
            </RequiredAuth>  
            } />
          <Route path='/addcartitem' element={
            <RequiredAuth>
              <AddCartItemForm/>
            </RequiredAuth>
            } />
          <Route path='/purchasehistory' element={
            <RequiredAuth>
              <PurchaseHistoryComponent/>
            </RequiredAuth>
          } />
        </Routes>
    </Router>
    </AuthContextProvider>
  );
}

export default App;
