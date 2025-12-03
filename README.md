# Warehouse Orders Dashboard

Warehouse Orders Dashboard es una aplicación web construida con React que digitaliza el flujo de compras internas de un almacén: catálogo de productos, alta de pedidos, seguimiento de entregas y exportación a Excel, todo respaldado por Firebase.


## Características principales

- **Autenticación Firebase** con persistencia de sesión y control de roles para restringir funcionalidades sensibles.
- **Catálogo de productos** conectado a Firestore, con búsqueda libre, paginación y edición en ventanas modales.
- **Carrito de compras** que permite generar pedidos desde los productos, guardar cada movimiento y exportar la orden a Excel (`xlsx`).
- **Historial de pedidos** con filtros, actualización de cantidades recibidas y resaltado automático de entregas completas.
- **Integración completa con Firestore** para colecciones `products`, `items` y `orders`, incluyendo utilidades para migraciones y scripts de soporte.
- **Interfaz responsiva** construida con React Bootstrap y estilos propios para mantener una experiencia consistente.

## Stack tecnológico

- React 18 + React Router 6
- Firebase Authentication & Cloud Firestore
- React Bootstrap y react-icons
- `xlsx` para exportación a Excel
- `react-loader-spinner` para estados de carga

## Requisitos previos

- Node.js >= 16 (se recomienda la LTS vigente) y npm.
- Proyecto de Firebase con Authentication habilitado (correo/contraseña) y una base Firestore con las colecciones necesarias.

## Configuración inicial

1. Clona el repositorio y entra en la carpeta del proyecto.
2. Instala las dependencias:

	```bash
	npm install
	```

3. Crea un archivo `.env.local` en la raíz con las credenciales de tu proyecto Firebase:

	```bash
	REACT_APP_FIREBASE_API_KEY=...
	REACT_APP_FIREBASE_AUTH_DOMAIN=...
	REACT_APP_FIREBASE_DATABASE_URL=...
	REACT_APP_FIREBASE_PROJECT_ID=...
	REACT_APP_FIREBASE_STORAGE_BUCKET=...
	REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
	REACT_APP_FIREBASE_APP_ID=...
	REACT_APP_FIREBASE_MEASUREMENT_ID=...
	```

4. (Opcional) Utiliza los scripts de la carpeta `test/` para poblar datos iniciales en Firestore. Ejecuta cada script con Node después de configurar las variables de entorno:

	```bash
	node src/test/addProductsToFirestore.js
	```

## Scripts disponibles

- `npm start` – levanta el servidor de desarrollo en `http://localhost:3000`.
- `npm test` – ejecuta la suite de pruebas en modo interactivo (Create React App).
- `npm run build` – genera la build optimizada para producción.

## Flujo funcional

1. **Acceso**: los usuarios se autentican con Firebase. Para exponer funcionalidades de administración debes asignar el rol adecuado.
2. **Gestión de catálogo**: `ProductsList` muestra los productos almacenados en Firestore, permite buscarlos, editarlos y añadirlos al carrito.
3. **Carrito y pedidos**: `ShoppingCartComponent` consolida los ítems pendientes, genera un número de orden único, exporta a Excel y persiste la orden en Firestore.
4. **Historial y recepción**: `PurchaseHistoryComponent` lista las órdenes, habilita filtros y actualiza cantidades recibidas para completar la entrega.

## Estructura del proyecto

```
src/
  components/        # Componentes de UI (catálogo, carrito, historial, formularios)
  context/           # Contexto de autenticación y guardas de ruta
  config/            # Inicialización de Firebase
  css/               # Hojas de estilos por componente
  js/utils.js        # utilidades Firestore, exportación a Excel, formateadores
  data/              # Datos de apoyo y ficheros CSV/JSON
  test/              # Scripts Node para poblar o migrar colecciones
```

## Buenas prácticas y recomendaciones

- Habilita reglas de seguridad en Firestore acorde a los roles que maneje la aplicación.
- Revisa los estilos de los modales (`warehouse-modal`) si personalizas la UI; evita sobrescribir clases globales de Bootstrap.
- Antes de desplegar, ejecuta `npm run build` y valida la build en un host estático o en Firebase Hosting.

