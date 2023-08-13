import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection, orderBy, query } from 'firebase/firestore';

import '../css/PurchaseHistoryComponent.css'

const PurchaseHistoryComponent = () => {
    const [purchaseHistory, setPurchaseHistory] = useState([]);

    const getPurchaseHistory = async () => {
        try {
            let histCollection = collection(db, 'entries');
            const data = [];
            await getDocs(query(histCollection, orderBy('entryNumber')))
                .then(snap => {
                    snap.forEach(doc => {
                        data.push(Object.assign(doc.data(), { "id": doc.id }));
                    })
                });
            
                setPurchaseHistory(data);
        } catch (error) {
            console.error(error);
        }
    }
    
    useEffect(() => {
        getPurchaseHistory();
    }, []);

    return (
        <div className="purchase-history">
            <h2>Historial de Compras</h2>
            <table className="hist-table">
                <thead>
                    <tr>
                        <th>Buchungsnummer</th>
                        <th>Datum der Buchung</th>
                        <th>Bestellnummer</th>
                        <th>Produkt ID</th>
                        <th>EAN-Code</th>
                        <th>Art.Nr.</th>
                        <th>Beschreibung</th>
                        <th>Kostenstelle</th>
                        <th>Auftragsnummer</th>
                        <th>Menge</th>
                        <th>Einheit</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseHistory.map(entry => (
                        <tr key={entry.entryNumber}>
                            <td>{entry.entryNumber}</td>
                            <td>{entry.date}</td>
                            <td>{entry.orderNumber}</td>
                            <td>{entry.productID}</td>
                            <td>{entry.EANCode}</td>
                            <td>{entry.productNumber}</td>
                            <td>{entry.description}</td>
                            <td>{entry.costcenter}</td>
                            <td>{entry.jobnumber}</td>
                            <td>{entry.quantity}</td>
                            <td>{entry.unit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
}

export default PurchaseHistoryComponent;
