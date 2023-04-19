import * as express from 'express';

import {request} from 'http';

// const location = process.argv[2];

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
