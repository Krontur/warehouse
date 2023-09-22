import { db } from '../config/firebase';
import { writeBatch, getDocs, doc, collection } from 'firebase/firestore';

export default  async function copyElementsFromEntriesToOrders(){

    
    const batch = writeBatch(db);
    const colEntriesRef = collection(db, "entries");
    const entries = await getDocs(colEntriesRef);
  
    // Iteramos cada documento
    entries.forEach(entry => {
  
        const colOrdersRef = doc(collection(db, "orders"));  // Esto crea una referencia a un nuevo documento con un ID único
        batch.set(colOrdersRef, entry.data());
        console.log(entry.data())  // Añade el producto al batch
        
    console.log(entry);
    });
    // Commit el batch
    batch.commit()
        .then(() => {
        console.log('Orders añadidos exitosamente');
    })
    .catch(error => {
        console.error('Error añadiendo order: ', error);
    });

  }

copyElementsFromEntriesToOrders();