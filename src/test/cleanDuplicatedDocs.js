import { db } from '../config/firebase';
import { query, getDocs, writeBatch, doc, collection, where, orderBy } from 'firebase/firestore';




export default async function addOrderCompleteField(){
  // 1. Obtener docs ordenados por entryNumber
  const querySnapshot = await getDocs(collection(db, "orders"));
  
  // Mapear entryNumbers
  const entryNumbersMap = {};
  querySnapshot.forEach(doc => {
    const entryNumber = doc.data().entryNumber;
    entryNumbersMap[entryNumber] = true; 
  });
  
  // Obtener keys unicos
  const uniqueEntryNumbers = Object.keys(entryNumbersMap);

  let filteredDocs;

  // Iterar sobre entryNumbers únicos
  uniqueEntryNumbers.forEach(entryNumber => {

    const q = query(
      collection(db, "orders"),
      where("entryNumber", "==", entryNumber), 
      where("orderComplete", ">=", false)
    );
    
    filteredDocs = getDocs(q);
  });

  // 5. Actualizar cada doc
  //const batch = writeBatch(db);

  //filteredDocs.forEach(doc => {
    //const docRef = doc(collection(db, "orders")); 
    
    // Lógica para calcular orderComplete
    
    //batch.update(docRef, item); 
  //});

  //batch.commit();

}
