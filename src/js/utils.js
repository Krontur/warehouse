import { db } from '../config/firebase';
import { query, orderBy, limit, getDocs, collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { utils, writeFile } from 'xlsx';

export async function getHighestFieldValue(collectionName, fieldName, fieldName2) {
  
  const field = fieldName2 ? fieldName2 : fieldName;
  console.log(field);
  // Crea la consulta
  const q = query(
    collection(db, collectionName), 
    orderBy( field , 'desc'), 
    limit(1)
  );

  // Ejecuta la consulta
  const querySnapshot = await getDocs(q);

  // Si se obtuvo un resultado, retorna el valor más alto
  if (!querySnapshot.empty) {
    console.log(querySnapshot.docs[0].data()[ fieldName ] + querySnapshot.docs[0].data()[ fieldName2 ]);
    return querySnapshot.docs[0].data()[ fieldName ];
  } else {
    return null;
  }
}

export function exportToExcel(data, filename = 'data') {

  const columnOrder = ["Position", "date", "productID", "productNumber", "producer", "EANCode", "description",  "costcenter", "jobnumber", "quantity", "unit"];

  // Cambiar las cabeceras
  const newHeaders = {
    "Position": "Position",
    "date": "Datum",
    "productID": "Produkt ID",
    "productNumber": "Art.Nr.",
    "EANCode": "EAN-Code",
    "producer": "Hersteller",
    "description": "Beschreibung",
    "costcenter": "Kostenstelle",
    "jobnumber": "Auftragsnummer",
    "quantity": "Menge",
    "unit": "Einheit"
  };

  const reorderedData = data.map(row => {
    return columnOrder.reduce((obj, key) => {
        obj[newHeaders[key]] = row[key];  // Usar las nuevas cabeceras
        return obj;
    }, {});
  });

    // Creamos un libro de trabajo vacío
    const wb = utils.book_new();

    // Convertimos los datos a formato de hoja de trabajo
    const ws = utils.json_to_sheet(reorderedData);

    // Calcular el ancho máximo para cada columna basado en el contenido
    const columnWidths = Object.keys(reorderedData[0]).map(key => 
      reorderedData.reduce((max, row) => {
          if (row[key] && row[key].toString().length > max) {
              return row[key].toString().length;
          }
          return max;
      }, 10)
    );

  // Aplicar el ancho máximo a las columnas
  ws['!cols'] = columnWidths.map(w => ({ wch: w }));

    // Añadimos la hoja de trabajo al libro
    utils.book_append_sheet(wb, ws, filename);

    // Escribimos el libro en un archivo .xlsx
    writeFile(wb, `${filename}.xlsx`);
}

//función para guardar los items de cartItems en firestore dentro de orders, una vez obtenida una respuesta de firestore de que los elementos se han guardado correctamente se borran todos los items de la colección items
//cada entrada de entries obtendrá un número ordinal identificativo, es decir, el numero de entrada de esa colección. Además se almacenara el 
//numero de order, que será pasado como parametro a la función.
export async function saveCartItemsToFirestore(cartItems, orderNumber, order) {
  
  let index = await getHighestFieldValue('entries', 'entryNumber');

  //guardamos los items de cartItems en la colección orders
  cartItems.forEach(async (cartItem) => {

    const docItemRef = await doc(db, 'items', cartItem.id);
    const docEntriesRef = await collection(db, 'entries');

    //añadimos el numero de order a cada item
    cartItem.orderNumber = orderNumber;
    cartItem.order = order;

    //añadimos el numero de entrada de la colección a cada item
    index = index + 1;
    cartItem.entryNumber = index;

    //añadimos el item a la colección entries
    if(await addDoc(docEntriesRef, {...cartItem})){
      deleteDoc(docItemRef);
    };
  });
}

