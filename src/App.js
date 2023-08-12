import './css/App.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProductsList from './components/ProductsList';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import ProductForm from './components/ProductForm';

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
        </Routes>
    </Router>
  );
}

export default App;
