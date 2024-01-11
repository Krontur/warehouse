import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, addDoc, query, where, getDocs, doc, runTransaction } from 'firebase/firestore';
import '../css/ProductForm.css';
import { getHighestFieldValue } from '../js/utils';
import { UserAuth } from '../context/AuthContext';

const AddCartItemForm = ({ product, item, afterSave }) => {
  const [formData, setFormData] = useState({
    jobnumber: '',
    costcenter: '',
    date: '',
    user: '',
    Position: 0,
    quantity: null,
    unit: '',
    description: '',
    EANCode: '',
    producer: '',
    productID: 0,
    productNumber: '',
    shortDescription: '',
    comment: '',
    orderComplete: false,
    received: 0
  });
  const [highestValuePosition, setHighestValuePosition] = useState(null)
  const navigate = useNavigate();
  const date = new Date();

  const { user } = UserAuth();

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else if (item){
      setFormData(item);
    }

    async function fetchHighestValue(){
      const value = await getHighestFieldValue('items', 'Position');
      setHighestValuePosition(value);
    }
    fetchHighestValue();
  }, [product, item, formData.EANCode]);

  const getDocEANCode = async (EAN) => {
    const products = collection(db, "products");
    const q = query(products, where("EANCode", "==", EAN));
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }

  const handleChange = (e) => {
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
    const updatedData = { 
      ...formData,
      Position: item ? item.Position : highestValuePosition+1,
      date: date.getDate()+"/"+ (date.getMonth()+1)+"/"+ date.getFullYear(),
      user: user.displayName,
      jobnumber: formData.jobnumber || "",
      costcenter: formData.costcenter,
      description: formData.description,
      EANCode: formData.EANCode || "",
      producer: formData.producer,
      productID: formData.productID,
      productNumber: formData.productNumber,
      shortDescription: formData.shortDescription || "",
      comment: formData.comment || "",
      quantity: formData.quantity
     };
     try {
      await runTransaction(db, async (transaction) => {
        if (item) {
          const itemRef = doc(db, "items", item.id);
          const itemDoc = await transaction.get(itemRef);
          console.log(itemDoc);
          if(!itemDoc.exists()){
            throw "Document does not exist!";
          }
          transaction.update(itemRef, { ...updatedData });
          afterSave && afterSave();
        } else if (product || !item) {

          let value = await getHighestFieldValue('items', 'Position');
          setHighestValuePosition(value);

          const newDocRef = doc(collection(db, "items"));
          transaction.set(newDocRef, { ...updatedData, Position: highestValuePosition + 1 });
        }
      });
      navigate("/shoppingcart");
    } catch (error) {
      alert("Fehler beim Hinzufügen des Artikels: " + error.message + " " + error.code);
    }
  };

  return (
    <>
    <h1>neue Buchung hinzufügen</h1>
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label>Position:</label>
        <input type="number" name="Position" disabled value={ item ? item.Position : (highestValuePosition+1)} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Auftragsnummer:</label>
        <input type="text" name="jobnumber" value={formData.jobnumber} onChange={handleChange} autoFocus/>
      </div>

      <div className="form-group">
        <label>Kostenstelle:</label>
        <input type="text" name="costcenter" value={formData.costcenter} onChange={handleChange} required/>
      </div>

      <div className="form-group">
        <label>Datum:</label>
        <input type="text" name="date" disabled value={date.getDate()+"/"+ (date.getMonth()+1)+"/"+ date.getFullYear()} />
      </div>

      <div className="form-group">
        <label>Beschreibung:</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} required disabled/>
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
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required/>
      </div>

      <div className="form-group">
        <label>Einheit:</label>
        <input type="text" name="unit" value={formData.unit} onChange={handleChange} required/>
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
