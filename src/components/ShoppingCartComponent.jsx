import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { Modal } from 'react-bootstrap';
import { getDocs, collection, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { getHighestFieldValue, exportToExcel, saveCartItemsToFirestore } from '../js/utils'

import '../css/ShoppingCartComponent.css';
import AddCartItemForm from './AddCartItemForm';

import { UserAuth } from '../context/AuthContext';

const ShoppingCartComponent = () => {
    const [lastOrder, setLastOrder] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [showModalEdit, setShowModalEdit] = useState(false);
    const navigate = useNavigate();
    const {role, isLoggedIn} = UserAuth();

    //setLastOrder(getHighestFieldValue('orders', 'orderNumber'))

    const date = new Date();
    const orderNumber = lastOrder+1;
    const order = "TE"+(orderNumber)+"_"+date.getFullYear();

    const getCartItems = async () => {
        try {
            let cartCollection = collection(db, 'items');
            const data = [];
            await getDocs(query(cartCollection, orderBy('Position')))
                .then(snap => {
                    snap.forEach(doc => {
                        data.push(Object.assign(doc.data(), { "id": doc.id }));
                    })
                });
            const columnOrder = ["Position", "date", "user", "order", "orderNumber", "productID", "productNumber", "EANCode", "producer", "description",  "costcenter", "jobnumber", "quantity", "unit", "id", "comment"];
            const reorderedData = data.map(row => {
                return columnOrder.reduce((obj, key) => {
                    obj[key] = row[key];
                    return obj;
                }, {});
            });
            setCartItems(reorderedData);
        
            setLastOrder( await getHighestFieldValue('orders', 'orderNumber', 'entryNumber'));
        } catch (error) {
            console.error(error);
        }
    }
    
    useEffect(() => {
            getCartItems();
    }, [lastOrder]);

    const handleSendClick = (cartItems, order, orderNumber) => {
        exportToExcel(cartItems, order);
        alert("Die Bestellung wird im Server gespeichert.");
        saveCartItemsToFirestore(cartItems, orderNumber, order);
        navigate("/purchasehistory");
    };

    const handleClickDelete = (id) => async () => {
        try {
          if (window.confirm("Endgültig löschen?")) {
            await deleteDoc(doc(db, 'items', id));
            getCartItems();
          }
        } catch (error) {
          console.error(error); 
        }
      }
      const handleEditClick = (item) => () => {
        setSelectedItem(item);  // Set the selected product
        setShowModalEdit(true);
      }
    
    
    const handleCloseModal = () => {
        setSelectedItem(null);
        getCartItems();
        setShowModalEdit(false); // Close the modal
    }

    return (
        <>
        <div className="shopping-cart">
            <h1>Bestellung {order}</h1>
            { isLoggedIn && role !=='admin' ? <h2>Warenkorb</h2> : <h2>Warenkorb <button onClick={()=> {handleSendClick(cartItems, order, orderNumber)}}>SENDEN</button></h2>}
            
            <table className="cart-table" id='cartItems'>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Datum der Buchung</th>
                        <th>Benutzer</th>
                        <th>EAN-Code</th>
                        <th>Art.Nr.</th>
                        <th>Hersteller</th>
                        <th>Beschreibung</th>
                        <th>Kostenstelle</th>
                        <th>Auftragsnummer</th>
                        <th>Menge</th>
                        <th>Einheit</th>
                        <th>Kommentar</th>
                        <th className='aligncenter'>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.productID}>
                            <td>{item.Position}</td>
                            <td>{item.date}</td>
                            <td>{item.user}</td>
                            <td>{item.EANCode}</td>
                            <td>{item.productNumber}</td>
                            <td>{item.producer}</td>
                            <td>{item.description}</td>
                            <td>{item.costcenter}</td>
                            <td>{item.jobnumber}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                            <td>{item.comment}</td>
                            <td className="action">
                                <button onClick={handleEditClick(item)}>Bearbeiten</button>
                                <button onClick={handleClickDelete(item.id)}>Löschen</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

            
        <Modal backdrop="static" show={showModalEdit} onHide={handleCloseModal}>
            <Modal.Header>
                <Modal.Title>Artikel bearbeiten</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddCartItemForm product={selectedItem} afterSave={handleCloseModal} />
            </Modal.Body>
            <Modal.Footer>
                <button onClick={handleCloseModal}>Schliessen</button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default ShoppingCartComponent;
