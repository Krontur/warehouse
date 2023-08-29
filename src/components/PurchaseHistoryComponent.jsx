import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection, orderBy, query, updateDoc, doc } from 'firebase/firestore';

import SearchBar from './SearchBar';
import { Circles } from 'react-loader-spinner';

import '../css/PurchaseHistoryComponent.css'

const PurchaseHistoryComponent = () => {
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [searchedEntry, setSearchedEntry] = useState('');
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
  
    // Actualizar items al cambiar página
    const changePage = (newPage) => {
    setPage(newPage);
    }

    
    const handleSearch = async (searchTerm) => {
        try{
            setSearchedEntry(searchTerm);
            getPurchaseHistory();
        } catch (e) {
        console.error(e);
        }
    }

    const getPurchaseHistory = async () => {
        try {
            setLoading(true);
            let histCollection = collection(db, 'orders');
            const data = [];
            await getDocs(query(histCollection, orderBy('orderComplete'), orderBy('entryNumber', 'desc')))
                .then(snap => {
                    snap.forEach(doc => {
                        data.push(Object.assign(doc.data(), { "id": doc.id }));
                    })
                });
            let filteredProducts;
            if(searchedEntry !== '') {
                filteredProducts = data.filter(doc => {
                const searchText = searchedEntry.toLowerCase();
                // Recorre cada campo en los datos del documento y verifica si el valor está presente
                for (const key in doc) {
                    if (typeof doc[key] === 'string' && doc[key].toLowerCase().includes(searchText)) {
                        return true;  // Si se encuentra el valor en algún campo, incluye este documento en el resultado
                    }
                }
                return false;  // Si el valor no se encuentra en ningún campo, excluye este documento
            });
                setPurchaseHistory(filteredProducts);
                setLoading(false);
            } else {
                setPurchaseHistory(data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    useEffect(() => {
        getPurchaseHistory();
    }, [searchedEntry]);

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
        <SearchBar onSearch={handleSearch} placeholder={"Buchung suchen..."}/>
        <div className="purchase-history">
            <h1>Buchungshistorie</h1>
            <table className="hist-table">
                <thead>
                    <tr>
                        <th>Buchungsnummer</th>
                        <th>Datum der Buchung</th>
                        <th>Nutzer</th>
                        <th>Bestellnummer</th>
                        <th>Produkt ID</th>
                        <th>Hersteller</th>
                        <th>Beschreibung</th>
                        <th>Kostenstelle</th>
                        <th>Auftragsnummer</th>
                        <th>bestellt</th>
                        <th>erhalten</th>
                        <th></th>
                        <th>Einheit</th>
                        <th>Kommentar</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseHistory.slice(page*20, (page*20)+20).map(entry => (
                        <tr key={entry.id} style={{
                                backgroundColor: entry.orderComplete ? 'lightgreen' : '',
                                color: entry.orderComplete ? 'black' : '',
                            }}>
                            <td>{entry.entryNumber}</td>
                            <td>{entry.date}</td>
                            <td>{entry.user}</td>
                            <td>{entry.order}</td>
                            <td>{entry.productID}</td>
                            <td>{entry.producer}</td>
                            <td>{entry.description}</td>
                            <td>{entry.costcenter}</td>
                            <td>{entry.jobnumber}</td>
                            <td>{entry.quantity}</td>
                            <td>
                                {entry.received}
                            </td>
                            <td>
                                
                                <button 
                                    onClick={() => {
                                    const addProduct = prompt("Anzahl der neuen empfangenen Produkte");

                                    if(addProduct) {
                                        const newReceived = parseInt(entry.received) + parseInt(addProduct);

                                        const entryRef = doc(db, "orders", entry.id);
                                        const updatedOrder = {
                                            ...entry,
                                            orderComplete: false,
                                        }
                                        console.log(entry.quantity)
                                        if(entry.quantity >= newReceived){
                                            updatedOrder.orderComplete = true;
                                            console.log(updatedOrder);
                                        }                                        
                                        updateDoc(entryRef, {
                                            ...updatedOrder,
                                            received: newReceived,
                                        })
                                        .then(() => {
                                        getPurchaseHistory(); 
                                        });
                                    }
                                    }}
                                >
                                    +
                                </button>

                            </td>
                            <td>{entry.unit}</td>
                            <td>{entry.comment}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='navButtons'>
                <button onClick={() => changePage(page - 1)} className={page === 0 ? 'disabledButton' : 'activeButton'} disabled={page === 0}>Zurück</button>
                <button onClick={() => changePage(page + 1)} className={page >= (purchaseHistory.length / 20) - 1 ? 'disabledButton' : 'activeButton'} disabled={page >= (purchaseHistory.length / 20) - 1}>Weiter</button>
            </div>
        </div>
        </>
    );
    } 
}

export default PurchaseHistoryComponent;
