import { db } from '../config/firebase';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { items } from '../data/itemsList';

export default function addItemsToCartToFirestore() {
  const batch = writeBatch(db);

  items.forEach(item => {
    const docRef = doc(collection(db, "items"));  // Esto crea una referencia a un nuevo documento con un ID único
    batch.set(docRef, item);  // Añade el producto al batch
  });

  // Commit el batch
  batch.commit()
    .then(() => {
      console.log('Items añadidos exitosamente');
    })
    .catch(error => {
      console.error('Error añadiendo items: ', error);
    });
}

addItemsToCartToFirestore();