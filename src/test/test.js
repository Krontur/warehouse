import { db } from '../config/firebase';
import { collection, query, where, getDocs, updateDoc, doc, deleteField } from "firebase/firestore";

export async function updateOrderItems() {

  const ordersCollection = collection(db, 'orders');

  const q = query(ordersCollection, where('orderNumber', '==', 10));
  
  const querySnapshot = await getDocs(q);

  for (const orderDoc of querySnapshot.docs) {

    const order = orderDoc.data();
    
    const updates = {
      orderComplete: false,
      received: 0
    };
    
    const orderDocRef = doc(db, 'orders', orderDoc.id);

    await updateDoc(orderDocRef, {
        ...updates,
        Position: deleteField(),
        EANCode: deleteField()
    }); 
  }

}
