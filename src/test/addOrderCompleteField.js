import { db } from '../config/firebase';
import { writeBatch, doc, collection, getDocs, where } from 'firebase/firestore';

export default async function addOrderCompleteField() {
    const batch = writeBatch(db);
    const colRef = collection(db, "orders");
    const orders = await getDocs(colRef);

    orders.forEach((item) => {
        const docRef = doc(colRef, item.id);
        const { quantity, received } = item.data();
        console.log(received);
        let orderComplete;
        if(received){
            orderComplete = quantity <= received;
        } else {
            orderComplete = false;
        }

        batch.update(docRef, { "orderComplete": orderComplete, "received": received ? received : 0 });

        console.log(orderComplete ? "true" : "false");
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

addOrderCompleteField();