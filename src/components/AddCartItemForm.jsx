import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
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
    shortDescription: '',
    comment: ''
  });
  const [highestValuePosition, setHighestValuePosition] = useState(null)
  const navigate = useNavigate();
  const date = new Date();

  useEffect(() => {
    console.log(formData.EANCode);
    if (product) {
      setFormData(product);
    }

    async function fetchHighestValue(){
      const value = await getHighestFieldValue('items', 'Position');
      setHighestValuePosition(value);
    }
    fetchHighestValue();
  }, [product, formData]);

  const getDocEANCode = async (EAN) => {
    const products = collection(db, "products");
    const q = query(products, where("EANCode", "==", EAN));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  const handleChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'EANCode' && value.trim() !== '') {
      getDocEANCode(value).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          setFormData(prevState => ({
            ...prevState,
            description: doc.data().description,
            producer: doc.data().producer,
            productID: doc.data().productID,
            productNumber: doc.data().productNumber,
            shortDescription: doc.data().shortDescription
          }));
        });
      });
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { ...formData, Position: highestValuePosition+1, date: date.getDate()+"/"+ (date.getMonth()+1)+"/"+ date.getFullYear() };
    await addDoc(collection(db, "items"), updatedData);
    if (product) {
      afterSave && afterSave();
      navigate("/shoppingcart")
    } else {
      navigate("/products")
    }
  };

  return (
    <>
    <h1>neue Buchung hinzufügen</h1>
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
        <label>Kommentar:</label>
        <textarea rows={6} cols={26} name="comment" value={formData.comment} onChange={handleChange} />
      </div>

      <div className="form-group">
        <button type="submit">Speichern</button>
      </div>
    </form>
    </>
  );
};

export default AddCartItemForm;
