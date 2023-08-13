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

//import { addProductsToFirestore } from './test/addProductsToFirestore';
//import { addItemsToCartToFirestore } from './test/addItemsToCartToFirestore';

import './css/App.css';

function App() {
  return (
    <Router>
        <NavbarComponent/>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={<RegisterForm/>} />
          <Route path="/products" element={<ProductsList/>} />
          <Route path='/createproduct' element={<ProductForm/>} />
          <Route path='/shoppingcart' element={<ShoppingCartComponent/>} />
          <Route path='/addcartitem' element={<AddCartItemForm/>} />
          <Route path='/purchasehistory' element={<PurchaseHistoryComponent/>} />
        </Routes>
    </Router>
  );
}

export default App;
