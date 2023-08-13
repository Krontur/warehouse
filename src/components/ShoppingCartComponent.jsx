import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection, orderBy, query } from 'firebase/firestore';
import { exportToExcel, saveCartItemsToFirestore } from '../js/utils'

import '../css/ShoppingCartComponent.css';

const ShoppingCartComponent = () => {
    const [lastOrder, setLastOrder] = useState(null);
    const [cartItems, setCartItems] = useState([]);

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
            const columnOrder = ["Position", "date", "productID", "productNumber", "EANCode", "description",  "costcenter", "jobnumber", "quantity", "unit"];
            const reorderedData = data.map(row => {
                return columnOrder.reduce((obj, key) => {
                    obj[key] = row[key];
                    return obj;
                }, {});
            });
            
            setCartItems(reorderedData);
        } catch (error) {
            console.error(error);
        }
    }
    
    useEffect(() => {
            getCartItems();
    }, []);

    const handleSendClick = (cartItems, order, orderNumber) => {
        exportToExcel(cartItems, order);
        alert("Your Order has been sent to the server");
        saveCartItemsToFirestore(cartItems, orderNumber)
    };

    return (
        <div className="shopping-cart">
            <h1>Bestellung {order}</h1>
            <h2>Warenkorb <button onClick={()=> {handleSendClick(cartItems, order, orderNumber)}}>senden</button></h2>
            
            <table className="cart-table" id='cartItems'>
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>Datum der Buchung</th>
                        <th>Art.Nr.</th>
                        <th>EAN-Code</th>
                        <th>Beschreibung</th>
                        <th>Kostenstelle</th>
                        <th>Auftragsnummer</th>
                        <th>Menge</th>
                        <th>Einheit</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => (
                        <tr key={item.productID}>
                            <td>{item.Position}</td>
                            <td>{item.date}</td>
                            <td>{item.productNumber}</td>
                            <td>{item.EANCode}</td>
                            <td>{item.description}</td>
                            <td>{item.costcenter}</td>
                            <td>{item.jobnumber}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}

export default ShoppingCartComponent;
