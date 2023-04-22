import "mocha";
import { expect } from "chai";
import {request} from 'http';

describe('get /funkos', function() {
  it('should return a user error', () => {
    const url = `http://localhost:3001/funkos?user=pabo&funko=Jodie Starling.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        if (result.error) {
          expect(result).to.be.equal('El usuario de la colección no es válido.');          
        }     
      });
    });
  });
  it('should return a funko error', () => {
    const url = `http://localhost:3001/funkos?user=pablo&funko=a.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        if (result.error) {
          expect(result).to.be.equal('El funko de la colección no es válido.');          
        }     
      });
    });
  });
  it('should return a funko json', () => {
    const url = `http://localhost:3001/funkos?user=pablo&funko=Conan Edogawa.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        expect(result.id).to.be.equal(1);          
      });
    });    
  });
  it('should return a the whole funko list', () => {
    const url = `http://localhost:3001/funkos?user=pablo`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        console.log(result.length)
        expect(result.length).to.be.equal(5);  
      });
    });
  });
});

describe('post /funkos', function() {
  it('should return that a funko was created', () => {
    const url = `http://localhost:3001/funkos?user=pablo&funko=Jodie Starling.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        expect(result).to.be.equal('Funko creado correctamente.');         
           
      });
    });
  });
  it('should return that a funko already exist.', () => {
    const url = `http://localhost:3001/funkos?user=pablo&funko=Jodie Starling.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        expect(result).to.be.equal('Ya existe ese funko en la colección');         
           
      });
    });
  });
});

describe('delete /funkos', function() {
  it('should return that a funko was deleted', () => {
    const url = `http://localhost:3001/funkos?user=pablo&funko=Jodie Starling.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        expect(result).to.be.equal('Funko eliminado correctamente.');         
           
      });
    });
  });
  it('should return that a error with the collection.', () => {
    const url = `http://localhost:3001/funkos?user=error&funko=Jodie Starling.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        expect(result).to.be.equal('El usuario de la colección no es válido.');         
           
      });
    });
  });
  it('should return that a error with the funko.', () => {
    const url = `http://localhost:3001/funkos?user=pablo&funko=error.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        expect(result).to.be.equal('El funko a eliminar no es válido.');         
           
      });
    });
  });
});

describe('patch /funkos', function() {
  it('should return that a funko error', () => {
    const url = `http://localhost:3001/funkos?user=pablo&funko=Jodie Starling.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        expect(result).to.be.equal('No se ha encontrado el funko a modificar');         
           
      });
    });
  });
  it('should return that a funko was modified', () => {
    const url = `http://localhost:3001/funkos?user=pablo&funko=Jodie Starling.json`;
    request(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const result = JSON.parse(data);     
        expect(result).to.be.equal("Funko modificado correctamente.");         
           
      });
    });
  });
});