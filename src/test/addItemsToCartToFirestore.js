import { db } from '../config/firebase';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { items } from '../data/itemsList';

export default function addOrdersToFirestore() {
  const batch = writeBatch(db);

  items.forEach(item => {
    const docRef = doc(collection(db, "orders"));  // Esto crea una referencia a un nuevo documento con un ID único
    batch.set(docRef, item);  // Añade el producto al batch
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

addOrdersToFirestore();