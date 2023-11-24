// ProductForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, updateDoc, collection, addDoc, runTransaction } from 'firebase/firestore';
import '../css/ProductForm.css';
import { getHighestFieldValue } from '../js/utils';

const ProductForm = ({ product, afterSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    EANCode: '',
    producer: '',
    productID: 0,
    productNumber: '',
    shortDescription: '',
    price: ''
  });
  const [highestValueProductID, setHighestValueProductID] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
    async function fetchHighestValue(){
      let value = await getHighestFieldValue('products', 'productID');
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
    const updatedData = { ...formData };
    // If updating existing product, use its ID; otherwise, add a new product.
    if (product) {
      await updateDoc(doc(db, "products", product.id), updatedData);
      afterSave && afterSave();
    } else {
          // Añadir un nuevo producto
          try {
            await runTransaction(db, async (transaction) => {
                // Aquí, necesitas una referencia al documento que mantiene el valor más alto de productID
                let value = await getHighestFieldValue('products', 'productID');
                setHighestValueProductID(value);

                let newProductID;
                if (!highestValueProductID) {
                    newProductID = 1; // Si no existe, comienza con 1
                } else {
                    newProductID = highestValueProductID + 1; // Incrementa el último productID conocido
                }

                // Aquí añades el nuevo producto
                const newProductRef = doc(collection(db, "products"));
                transaction.set(newProductRef, { ...updatedData, productID: newProductID });
            });
            navigate("/products");
        } catch (error) {
            console.error("Transaction failed: ", error);
            // Manejar errores o reintentar la transacción aquí
            alert("Fehler beim Hinzufügen des Produkts: " + error.message);
        }
    }
  };

  return (
    <>
    <h1>neues Produkt hinzufügen</h1>
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label>Beschreibung:</label>
        <textarea rows = "5" cols="100" wrap='soft' name="description" value={formData.description} onChange={handleChange} autoFocus/>
      </div>
      
      <div className="form-group">
        <label>EAN-Code:</label>
        <input type="text" name="EANCode" value={formData.EANCode} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Hersteller:</label>
        <input type="text" name="producer" value={formData.producer} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Produkt ID:</label>
        <input type="number" name="productID" value={afterSave ? formData.productID : (highestValueProductID+1) } onChange={handleChange} disabled />
      </div>

      <div className="form-group">
        <label>Art.Nr.:</label>
        <input type="text" name="productNumber" value={formData.productNumber} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Kurze Beschreibung:</label>
        <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>UVP des Produkts</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} />
      </div>

      <div className="form-group">
        <button type="submit">Speichern</button>
      </div>
    </form>
    </>
  );
};

export default ProductForm;
