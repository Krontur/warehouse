// ProductForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import '../css/ProductForm.css';
import { getHighestFieldValue } from '../js/utils';

const ProductForm = ({ product, afterSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    EANCode: '',
    producer: '',
    productID: '',
    productNumber: '',
    shortDescription: ''
  });
  const [highestValueProductID, setHighestValueProductID] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
    async function fetchHighestValue(){
      const value = await getHighestFieldValue('products', 'productID');
      setHighestValueProductID(value);
    }
    fetchHighestValue();
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert productID to a number
    const updatedData = { ...formData, productID: highestValueProductID+1 };
    // If updating existing product, use its ID; otherwise, add a new product.
    if (product) {
      await updateDoc(doc(db, "products", product.id), updatedData);
      afterSave && afterSave();
    } else {
      await addDoc(collection(db, "products"), updatedData);
      navigate("/products")
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label>Description:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} />
      </div>
      
      <div className="form-group">
        <label>EANCode:</label>
        <input type="text" name="EANCode" value={formData.EANCode} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Producer:</label>
        <input type="text" name="producer" value={formData.producer} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Product ID:</label>
        <input type="number" name="productID" value={formData.productID || (highestValueProductID+1) } onChange={handleChange} disabled />
      </div>

      <div className="form-group">
        <label>Product Number:</label>
        <input type="text" name="productNumber" value={formData.productNumber} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Short Description:</label>
        <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} />
      </div>

      <div className="form-group">
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default ProductForm;
