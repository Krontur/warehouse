import { db } from '../config/firebase';
import { query, orderBy, limit, getDocs, collection } from "firebase/firestore";

export async function getHighestFieldValue(collectionName, fieldName) {
  // Crea la consulta
  const q = query(
    collection(db, collectionName), 
    orderBy(fieldName, 'desc'), 
    limit(1)
  );

  // Ejecuta la consulta
  const querySnapshot = await getDocs(q);

  // Si se obtuvo un resultado, retorna el valor más alto
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data()[fieldName];
  } else {
    return null;
  }
}
