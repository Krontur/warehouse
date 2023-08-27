// ProductsList.js
import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';

import { getDocs, collection, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';

import ProductForm from './ProductForm';
import SearchBar from './SearchBar';
import AddCartItemForm from './AddCartItemForm';
import { currencyFormatter } from '../js/utils';
import { Circles } from 'react-loader-spinner';

import '../css/ProductsList.css';

const ProductsList = () => {
  const [productsList, setProductsList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [searchedProduct, setSearchedProduct] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Actualizar items al cambiar página
  const changePage = (newPage) => {
  setPage(newPage);
  }
  
  const handleSearch = (searchTerm) => {
    try{
      setSearchedProduct(searchTerm);
    } catch (e) {
      console.error(e);
    }
  }
  // Get products list and store in state
  const getProductsList =  async () => {
    
    try {
      setLoading(true);
      let productCollection = collection(db, 'products');
      const q = query(productCollection, orderBy("productID", "desc"));
      const data = [];
      await getDocs(q)
        .then(snap => {
          snap.forEach(doc => {
            data.push(Object.assign(doc.data(), {"id": doc.id}));
          })
        });
      let filteredProducts;
      if(searchedProduct !== '') {
        filteredProducts = data.filter(doc => {
          const searchText = searchedProduct.toLowerCase();
          // Recorre cada campo en los datos del documento y verifica si el valor está presente
          for (const key in doc) {
              if (typeof doc[key] === 'string' && doc[key].toLowerCase().includes(searchText)) {
                  return true;  // Si se encuentra el valor en algún campo, incluye este documento en el resultado
              }
          }
          return false;  // Si el valor no se encuentra en ningún campo, excluye este documento
      });
         setProductsList(filteredProducts);
         setLoading(false);
      } else {
        setProductsList(data);
        setLoading(false)
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    getProductsList();
  }, [searchedProduct]);


  const handleClickDelete = (id) => async () => {
    try {
      if (window.confirm("Want to delete?")) {
        await deleteDoc(doc(db, 'products', id));
        getProductsList();
      }
    } catch (error) {
      console.error(error); 
    }
  }

  const handleAddClick = (product) => () => {
    setSelectedProduct(product);  // Set the selected product
    setShowModalAdd(true);
  }
  const handleEditClick = (product) => () => {
    setSelectedProduct(product);  // Set the selected product
    setShowModalEdit(true);
  }

  const handleCloseModal = () => {
    setSelectedProduct(null);
    getProductsList();
    setShowModalEdit(false);
    setShowModalAdd(false);   // Close the modal
  }

    if(loading){
      return (
      <div className='loader'>
        <h1>Loading...</h1>
        <div className='spinner'>
        <Circles
          height="80"
          width="80"
          color="#1DA1F2"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          speed={1}
        />
        </div>
      </div> );
    } else {
    return (
    <>
    <SearchBar onSearch={handleSearch} placeholder="Produkte suchen..."/>
    <div className="products-list">
      <h1>Produktliste</h1>
      <table className="product-table">
        <thead>
          <tr>
            <th>Beschreibung</th>
            <th>EAN-Code</th>
            <th>Hersteller</th>
            <th>Art.Nr.:</th>
            <th>Kurze Beschreibung</th>
            <th>Produkt ID</th>
            <th>UVP</th>
            <th className='aligncenter'>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {productsList.slice(page*20 , (page*20)+20).map(product => (
            <tr key={product.id}>
              <td>{product.description}</td>
              <td>{product.EANCode}</td>
              <td>{product.producer}</td>
              <td>{product.productNumber}</td>
              <td>{product.shortDescription}</td>
              <td>{product.productID}</td>
              <td>{product.price ? currencyFormatter(product.price) : ''}</td>
              <td className="action">
                <button onClick={handleEditClick(product)}>Bearbeiten</button>
                <button onClick={handleClickDelete(product.id)}>Löschen</button>
                <button onClick={handleAddClick(product)}>Hinzufügen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='navButtons'>
          <button onClick={() => changePage(page - 1)} className={page === 0 ? 'disabledButton' : 'activeButton'} disabled={page === 0}>Zurück</button>
          <button onClick={() => changePage(page + 1)} className={page >= (productsList.length / 20) - 1 ? 'disabledButton' : 'activeButton'} disabled={page >= (productsList.length / 20) - 1}>Weiter</button>
      </div>
    </div>

    <Modal backdrop="static" show={showModalEdit} onHide={handleCloseModal}>
      <Modal.Header>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProductForm product={selectedProduct} afterSave={handleCloseModal} />
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleCloseModal}>Schliessen</button>
      </Modal.Footer>
    </Modal>

    <Modal backdrop="static" show={showModalAdd} onHide={handleCloseModal}>
      <Modal.Header>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddCartItemForm product={selectedProduct} afterSave={handleCloseModal} />
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleCloseModal}>Schliessen</button>
      </Modal.Footer>
    </Modal>
    </>
    );  
  }
}

export default ProductsList;
