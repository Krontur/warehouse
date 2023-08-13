import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import '../css/ProductForm.css';
import { getHighestFieldValue } from '../js/utils';

const AddCartItemForm = ({ product, afterSave }) => {
  const [formData, setFormData] = useState({
    jobnumber: '',
    costcenter: '',
    date: '',
    Position: '',
    quantity: '',
    unit: '',
    description: '',
    EANCode: '',
    producer: '',
    productID: '',
    productNumber: '',
    shortDescription: ''
  });
  const [highestValuePosition, setHighestValuePosition] = useState(null)
  const navigate = useNavigate();
  const date = new Date();

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
    async function fetchHighestValue(){
      const value = await getHighestFieldValue('items', 'Position');
      setHighestValuePosition(value);
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
    const updatedData = { ...formData, Position: highestValuePosition+1, date: date.getDate()+"/"+ (date.getMonth()+1)+"/"+ date.getFullYear() };
    await addDoc(collection(db, "items"), updatedData);
    if (product) {
      afterSave && afterSave();
    }
    navigate("/products")
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label>Position:</label>
        <input type="number" name="Position" disabled value={(highestValuePosition+1)} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Auftragsnummer:</label>
        <input type="text" name="jobnumber" value={formData.jobnumber} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Kostenstelle:</label>
        <input type="text" name="costcenter" value={formData.costcenter} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Datum:</label>
        <input type="text" name="date" disabled value={date.getDate()+"/"+ (date.getMonth()+1)+"/"+ date.getFullYear()} />
      </div>

      <div className="form-group">
        <label>Beschreibung:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} disabled/>
      </div>
      
      <div className="form-group">
        <label>EAN-Code:</label>
        <input type="text" name="EANCode" value={formData.EANCode} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Hersteller:</label>
        <input type="text" name="producer" value={formData.producer} onChange={handleChange} disabled/>
      </div>

      <div className="form-group">
        <label>Produkt ID:</label>
        <input type="number" name="productID" value={formData.productID} onChange={handleChange} disabled/>
      </div>

      <div className="form-group">  
        <label>Art.Nr.:</label>
        <input type="text" name="productNumber" value={formData.productNumber} onChange={handleChange} disabled/>
      </div>

      <div className="form-group">
        <label>Kurze Beschreibung:</label>
        <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} disabled/>
      </div>

      <div className="form-group">
        <label>Menge:</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Einheit:</label>
        <input type="text" name="unit" value={formData.unit} onChange={handleChange} />
      </div>

      <div className="form-group">
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default AddCartItemForm;
