import { db } from '../config/firebase';
import { writeBatch, doc, collection } from 'firebase/firestore';
import { products } from '../data/products';

export default function addProductsToFirestore() {
  const batch = writeBatch(db);

  products.forEach(product => {
    const docRef = doc(collection(db, "products"));  // Esto crea una referencia a un nuevo documento con un ID único
    batch.set(docRef, product);  // Añade el producto al batch
  });

  // Commit el batch
  batch.commit()
    .then(() => {
      console.log('Productos añadidos exitosamente');
    })
    .catch(error => {
      console.error('Error añadiendo productos: ', error);
    });
}

addProductsToFirestore();
