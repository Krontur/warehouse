import React from 'react';

const PurchaseHistoryComponent = ({ purchaseHistory }) => {
    return (
        <div className="purchase-history">
            <h2>Historial de Compras</h2>
            <ul>
                {purchaseHistory.map(order => (
                    <li key={order.orderID}>
                        <h3>Orden ID: {order.orderID}</h3>
                        {order.items.map(item => (
                            <div key={item.entryID}>
                                <p>Entry: {item.entryID}</p>
                                <p>Datum der Buchung: {item.date}</p>                                
                                <p>Bestellnummer: {item.ordernumber}</p>
                                <p>Produkt ID: {item.productID}</p>
                                <p>EAN-Code: {item.EANCode}</p>
                                <p>Art.Nr.: {item.productNumber}</p>
                                <p>Beschreibung: {item.description}</p>
                                <p>Menge: {item.quantity}</p>
                                <p>Kostenstelle: {item.costcenter}</p>
                                <p>Auftragsnummer: {item.jobnumber}</p>
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PurchaseHistoryComponent;
