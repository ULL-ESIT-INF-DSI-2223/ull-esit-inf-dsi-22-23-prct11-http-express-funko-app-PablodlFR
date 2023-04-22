import * as express from 'express';
import {request} from 'http';
import * as path from 'path';
import * as fs from 'fs';

const app = express();
module.exports = app;

const collectionPath = path.join('collections/');

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
    res.send('Ya existe ese funko en la colección');
    return;
  }

});

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


app.get('*', (_, res) => {
  res.status(404).send();
});

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
