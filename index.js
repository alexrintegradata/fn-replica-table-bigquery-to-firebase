const functions = require('@google-cloud/functions-framework');
const admin = require('firebase-admin');
const { BigQuery, BigQueryTimestamp, BigQueryDate } = require('@google-cloud/bigquery');
//import { getFirestore } from 'firebase-admin/firestore';
const { getFirestore } = require('firebase-admin/firestore');

// Register an HTTP function with the Functions Framework that will be executed
// when you make an HTTP request to the deployed function's endpoint.

const firebaseApp = admin.initializeApp();
const db = getFirestore(firebaseApp, "appbbss") ;// base de datos de firebase



functions.http('helloGET', async (req, res) => {
    try {

      const { collectionName } = req.body; // Assuming the parameter is sent in the request body
        
      if (!collectionName) {
          res.status(400).send('Falta recibir nombre de la coleccion como parametro');
          return;
      }

        // Configurar BigQuery
        const bigquery = new BigQuery();
      
        // Realizar consulta a BigQuery1
        const query = `SELECT * FROM \`nicanor-dev.bd_cla_cierre.${collectionName}\``;
        //const query = `SELECT * FROM nicanor-dev.bd_cla_cierre.vw_tmp_carga_firebase`;
        const [rows] = await bigquery.query(query);
    
        // Almacenar datos en Firebase
        //const db = admin.firestore();
        const collectionRef = db.collection(collectionName);
        await Promise.all(
          rows.map(async (row) => {
            //console.log('row: ', row);
            //console.log('row: ', transformarPayload(row));
            //await collectionRef.add(row);
             // Transformar los campos de fecha a Timestamp de Firestore
            const transformedRow = transformarPayload(row);
            console.log('transformedRow: ', transformedRow);
            // Agregar los datos transformados a Firestore
            await collectionRef.add(transformedRow);

          })
        );
        res.status(200).send(`Datos movidos exitosamente a Firebase para la colección: ${collectionName}.`);
        
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error al mover datos.');
      }

  res.send('Hello World!');
});


function transformarPayload(payload) {
  const transformedPayload = {};

  for (const campo in payload) {
    if (payload.hasOwnProperty(campo)) {
      //console.log ("campo:", campo);
      //transformedPayload[campo]= 'retorno';
      //console.log ("transformarCampo:", transformarCampo(payload[campo]));
      transformedPayload[campo] = transformarCampo(payload[campo]);
    }
  }

  return transformedPayload;
}


function transformarCampo(valor) {
  //if (typeof BigQueryTimestamp !== 'undefined') {
    // Verificar si row.fecha_creacion es una instancia de BigQueryTimestamp
    if (valor instanceof BigQueryTimestamp) {
      // Procesar la fecha
      //const fechaCreacionJS = '01-01-2023';//valor.toDate();
      fechaCreacionJS= admin.firestore.Timestamp.fromDate(new Date(valor.value));

      //console.log('SI es una instancia de BigQueryTimestamp.', new Date(fechaCreacionJS.value));
      return fechaCreacionJS;
    }else if (valor instanceof BigQueryDate) {
      // Procesar la fecha
      //const fechaCreacionJS = '01-01-2023';//valor.toDate();
      fechaCreacionJS= admin.firestore.Timestamp.fromDate(new Date(valor.value));
      //console.log('SI es una instancia de BigQueryDate.', new Date(fechaCreacionJS.value));
       return fechaCreacionJS;
    } 
    
    
    else {
      //console.log('NO es una instancia de BigQueryTimestamp.');
      return valor;
    }
  //} else {
   // console.log('BigQueryTimestamp no está definido en este entorno.');
   
  }
  
  /*if (valor instanceof Date) {
    // Convertir BigQueryDate a Timestamp
    console.log('entro en bigquery.Timestamp');
    return True //admin.firestore.Timestamp.fromDate(new Date(valor.value));
    
  } else if (valor instanceof BigQuery.timestamp) {
    // Convertir BigQueryTimestamp a Timestamp
    console.log('entro en bigquery.date');
    return true //admin.firestore.Timestamp.fromMillis(valor.value.getTime());
  } else {
    console.log('entro en defecto');
    return valor;
  }*/



// Función para transformar un campo según su tipo
/*
function transformarCampo(valor) {
  if (valor instanceof BigQuery.date) {
    // Convertir BigQueryDate a Timestamp
    console.log('entro en bigquery.date');
    return Timestamp.fromDate(new Date(valor.value));
  } else if (valor instanceof BigQuery.timestamp) {
    // Convertir BigQueryTimestamp a Timestamp
    console.log('entro en bigquery.timestamp')
    return Timestamp.fromMillis(valor.value.getTime());
    
  } else {
    console.log('entro en defecto');
    return valor;
  }
}
*/

/*
const functions = require('@google-cloud/functions-framework');
const {BigQuery} = require('@google-cloud/bigquery');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');


initializeApp();

const db = getFirestore();

const admin = require('firebase-admin');

functions.http('helloGET', async (req, res) => {
  try {
    const collectionName = req.body.collectionName;

    if (!collectionName) {
      return res.status(400).send('Collection name is missing in the request body.');
    }

    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();

    const resultArray = [];

    snapshot.forEach(doc => {
      resultArray.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.status(200).json(resultArray);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }

      //res.send('hola mundo!');
});
*/
//gcloud functions deploy hello-node-function  --gen2  --runtime=nodejs20  --region=us-west1 --source=.  --entry-point=helloGET --trigger-http  --allow-unauthenticated