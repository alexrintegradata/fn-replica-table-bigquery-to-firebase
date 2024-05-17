# fn-replica-table-bigquery-to-firebase

Este proyecto contiene una función de Google Cloud que replica los datos de una tabla de BigQuery en una colección de Firestore.

## Código principal

El código principal se encuentra en el archivo `index.js`. Aquí hay una descripción de lo que hace:

- Importa las bibliotecas necesarias.
- Inicializa una aplicación de Firebase y obtiene una referencia a Firestore.
- Registra una función HTTP que se activará cuando se haga una solicitud HTTP al endpoint de la función desplegada.
- Dentro de la función HTTP, extrae el nombre de la colección del cuerpo de la solicitud.
- Configura BigQuery y realiza una consulta para obtener todos los datos de la tabla correspondiente al nombre de la colección.
- Almacena los datos obtenidos en la colección correspondiente en Firestore.

## Uso

Para usar esta función, debes hacer una solicitud HTTP POST al endpoint de la función desplegada, con el nombre de la colección en el cuerpo de la solicitud.

Por ejemplo:

```json
{
    "collectionName": "nombre-de-tu-coleccion-de-bigquery"
}
