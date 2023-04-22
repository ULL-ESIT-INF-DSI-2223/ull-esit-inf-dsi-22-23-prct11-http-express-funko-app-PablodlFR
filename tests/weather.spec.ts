import "mocha";
import { expect } from "chai";
import {request} from 'http';

describe('error test', () => {
  it('should return an error', () => {
    const req = request('http://localhost:3001/weather', (response) =>{
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      const result = JSON.parse(data);     
      if (result.error) {
        expect(result).to.be.equal('No se ha proporcionado una localización válida.');      
      }
    });
    });   
  });
  it('should return Canarias as Region', () => {
    const req = request('http://localhost:3001/weather?location=San Cristonal de La Laguna, Spain', (response) =>{
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      const result = JSON.parse(data);     
        expect(result.location.region).to.be.equal('Canarias');      
      
    });
    });   
  });
  it('should return a 404 error', () => {
    const req = request('http://localhost:3001/wea', (response) =>{
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      const result = JSON.parse(data);     
      expect(result.status).to.be.equal(404);  
    });
    });   
  });

});