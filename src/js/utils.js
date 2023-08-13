import { db } from '../config/firebase';
import { query, orderBy, limit, getDocs, collection } from "firebase/firestore";
import { utils, writeFile } from 'xlsx';

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

export function exportToExcel(data, filename = 'data') {

  const columnOrder = ["Position", "date", "productID", "productNumber", "EANCode", "description",  "costcenter", "jobnumber", "quantity", "unit"];

  // Cambiar las cabeceras
  const newHeaders = {
    "Position": "Position",
    "date": "Datum",
    "productID": "Produkt ID",
    "productNumber": "Art.Nr.",
    "EANCode": "EAN-Code",
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
