# Práctica 11 - Peticiones HTTP, callbacks y servidores Express
Esta práctica consiste en adaptar la aplicación de registro de Funko Pops desarrollado en las últimas semanas, de forma que se implemente con un servidor HTTP escrito con Express, donde se almacenará la información de los Funko Pops como ficheros JSON. Además se mostrará el ejercicio realizado en la hora de prácticas (PE101).
\
\
El código fuente de ambos ejercicios se encuentra organizado en diferentes directorios y se hace uso de sintaxis ES para importar/exportar las distintas entidades.
## Ejercicio de clase
Este ejercicio consiste en implementar un servidor express donde pretendemos obtener información del servicio Weatherstack, siguiendo una serie de indicaciones mostradas en el enunciado.
\
\
El servidor creado es el siguiente:
```TypeScript
import * as express from 'express';
import {request} from 'http';

const app = express();

app.get('/weather', (req2, res) => {
  const location = req2.query.location;  
  const url = `http://api.weatherstack.com/current?access_key=3e3ff9f2c76c47e7389fd62e1572828e&query=${location}&units=m`;

  const req = request(url, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
  
    response.on('end', () => {
      const result = JSON.parse(data);     
      if (result.error) {
        res.status(500).send('No se ha proporcionado una localización válida.');
      } 
      else {
        res.send(result);
      }
      
    });
  });
  
  req.on('error', (error) => {
    console.log(error.message);
  });
  
  req.end();  
});

app.get('*', (_, res) => {
  res.status(404).send();
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});

```
Como podemos ver, te muestra información de la localización pasada por _query_. En caso de que esta localización no sea válida, se envía el _status_ de error 500 y un mensaje indicando que la localización no es valida. En el caso de que se intente acceder a una ruta diferente a '/weather' se devuelve un código de estado 404 y finalmente si todo ha ido correctamente, nos mostrará el JSON con la respuesta correcta de Weatherstack.
\
\
Se han realizado las pruebas pertinentes con Mocha y Chai:
```
  error test
    ✔ should return an error
    ✔ should return Canarias as Region
    ✔ should return a 404 error


  3 passing (31ms)
```
## Ejercicio de guion
En este ejercicio seguiremos usando como base la idea de la app de funkos. Consiste principalmente en implementar las 5 operaciones (añadir, modificar, eliminar, listar y mostrar) haciendo uso de las peticiones HTTP y de los servidores express.
\
\
En este informe mostraremos el funcionamiento de cada uno de los verbos HTTP y cómo se llevan a cabo las operaciones anteriormente mencionadas.
### Get
La petición get es utilizada para obtener información de un funko en concreto o para obtener la lista completa. El código desarrollado es el siguiente:
```TypeScript
app.get('/funkos', (req, res) => {
  const user = req.query.user;
  const funko = req.query.funko;

  const userPath = path.join(collectionPath + user + '/');
  const funkoPath = path.join(userPath + funko);
  if (!funko) {    
    fs.readdir(userPath, (err, items) => {   
      if (err) {
        res.status(500).send('El usuario de la colección no es válido.')
      }
      const list = [];
      items.forEach((item) => {
        fs.readFile(userPath + item, (_, data) => {
          const listItem = JSON.parse(data.toString());
          
          list.push(listItem);

          if (list.length === items.length) {
            res.send(list);
          }
        })       
      })
    })
  } else {
    fs.readFile(funkoPath, (err, data) => {   
      if (err) {
        res.status(500).send('El funko de la colección no es válido.')
      }
      res.send(JSON.parse(data.toString()));
    })
  }
});
```
Primero obtenemos las rutas donde se encuentra la colección, si en ela _query_ no se indica ningún funko en concreto, se mandará la totalidad de la colección, es decir un _list_, mientras que si se indica un funko en concreta será únicamente el json de este el que se enviará. Se han realizado las pruebas necesarias:
```
  get /funkos
    ✔ should return a user error
    ✔ should return a funko error
    ✔ should return a funko json
    ✔ should return a the whole funko list
```
### Post
La petición _post_ es utilizada para añadir un nuevo funko a la colección. El código es el siguiente:
```TypeScript
app.post('/funkos', express.json(), (req, res) => {
  const user = req.query.user;
  const funko = req.query.funko;

  const userPath = path.join(collectionPath + user + '/');
  const funkoPath = path.join(userPath + funko);

  const newFunko = JSON.stringify(req.body, null, 2);

  fs.writeFile(funkoPath, newFunko, (err) => {
    if (err) {
      res.status(500).send('No se ha podido guardar el funko correctamente.')
    }
    res.send('Funko creado correctamente.');
  })

  if (fs.existsSync(funkoPath)) {
    res.status(500).send('Ya existe ese funko en la colección');
    return;
  }
});
```
Creamos un funko a partir del _body_ introducido en _thunder client_ y escribimos el json en la ruta correspondiente, si ha funcionado todo correctamente se envía un mensaje informando al usuario, y en el caso de que ya exista dicho funko en la colección, se envía un error.
\
\
Se han realizado las pruebas correspondientes:
```
post /funkos
    ✔ should return that a funko was created
    ✔ should return that a funko already exist.
```
### Delete
La petición _delete_ es utilizada para eliminar un funko de la colección. El codigo que lo implementa es el siguiente:
```TypeScript
app.delete('/funkos', (req, res) => {
  const user = req.query.user;
  const funko = req.query.funko;

  const userPath = path.join(collectionPath + user + '/');
  const funkoPath = path.join(userPath + funko);

  if (fs.existsSync(userPath) === false) {
    res.status(500).send('El usuario de la colección no es válido.')
  }

  if (fs.existsSync(funkoPath) === false) {
    res.status(500).send('El funko a eliminar no es válido.')
  }

  fs.unlink(funkoPath, (err) => {
    if (err) {
      res.status(500).send("Error elminando el funko de la colleción.");
    } else {
      res.send('Funko eliminado correctamente.')
    }
  })
}); 
```
Primero comprobamos que en el _query_ se han introducido tanto el nombre del usuario como el funko de forma correcta y en caso de que no sea así, se envía un mensaje de error. Si la ruta se ha introducido correctamente, se elimna el funko correspondiente de la colección y se envia un mensaje informando al usuario.
\
\
Se han realizado sus respectivas pruebas:
```
 delete /funkos
    ✔ should return that a funko was deleted
    ✔ should return that a error with the collection.
    ✔ should return that a error with the funko.
```
### Patch
La petición _patch_ tiene la función de modificar un funko de la colección. Su código es el siguiente:
```TypeScript
app.patch('/funkos', express.json(), (req, res) => {
  const user = req.query.user;
  const funko = req.query.funko;

  const userPath = path.join(collectionPath + user + '/');
  const funkoPath = path.join(userPath + funko);

  fs.readFile(funkoPath, (err, data) => {
    if (err) {
      res.status(404).send('No se ha encontrado el funko a modificar');
    }

    const item = JSON.parse(data.toString());

    if (req.body.id != undefined) {
      item.id = req.body.id;
    }
    if (req.body.name != undefined) {
      item.name = req.body.name;
    }
    if (req.body.description != undefined) {
      item.description = req.body.description;
    }
    if (req.body.type != undefined) {
      item.type = req.body.type;
    }
    if (req.body.genre != undefined) {
      item.genre = req.body.genre;
    }
    if (req.body.franchise != undefined) {
      item.franchise = req.body.franchise;
    }
    if (req.body.franchiseNumber != undefined) {
      item.franchiseNumber = req.body.franchiseNumber;
    }
    if (req.body.exclusive != undefined) {
      item.exclusive = req.body.exclusive;
    }
    if (req.body.specialFeatures != undefined) {
      item.specialFeatures = req.body.specialFeatures;
    }
    if (req.body.marketValue != undefined) {
      item.marketValue = req.body.marketValue;
    }

    fs.writeFile(funkoPath, JSON.stringify(item, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error al modificar el archivo.')
      }
      res.send("Funko modificado correctamente.")
    });
  });
});
```
Primero leemos el funko que se desea modificar y si se ha introducido alguno de sus atributos en el campo _body_ del thunder client, este es modificado y finalmente que vuelve a escribir en la misma ruta, enviándo un mensaje informativo al usuario.
\
\
También se han realizado sus pruebas:
```
  patch /funkos
    ✔ should return that a funko error
    ✔ should return that a funko was modified
```
## Conclusión
En esta práctica hemos podido aprender como funcionan los servidores express y las distintas peticiones HTTP, así como consolidar el uso del API asíncrono de NODE.js. Nos permite hacernos una idea del funcionamiento que tienen las páginas web que usamos a diario.
\
\
Al igual que en las prácticas anteriores se han incluido los flujos de trabajo de GitHub Actions:
* Coveralls: [![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-PablodlFR/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-PablodlFR?branch=main)
* Sonar-Cloud: [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-PablodlFR&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct11-http-express-funko-app-PablodlFR)
## Bibliografía
Para la realización de esta práctica se han consultado las siguientes fuentes bibliográficas:
* [Guion de la práctica 11](https://ull-esit-inf-dsi-2223.github.io/prct11-http-express-funko-app/)
* [Apuntes Servidores Web a través de Express](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-express.html)
* [Apuntes Peticiones HTTP y patrones callback y callback-chaining](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-http-callback-pattern.html)