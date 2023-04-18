import * as net from 'net';
import * as fs from 'fs';
import { Funko } from './funko';
import chalk = require('chalk');
import * as path from 'path'

net.createServer((connection) => {
  console.log('Un cliente se ha conectado.'); 
  let wholeData = '';

  connection.on('data', (data) => {
    wholeData += data;      
    const message = JSON.parse(wholeData);
    if (message.type === "command") {        
      if (message.command === "read") {       
        const dirPath = `collections/${message.user}`;
        if (fs.existsSync(dirPath)) {
          let found = false;
          const files = fs.readdirSync(dirPath);
          files.forEach(file => {
            const filePath = `${dirPath}/${file}`;
            const data = fs.readFileSync(filePath, 'utf-8');
            const funkoJSON = JSON.parse(data);
            if (funkoJSON.id === message.id) {
              const funko = new Funko(funkoJSON.id, funkoJSON.name, funkoJSON.description, funkoJSON.type, funkoJSON.genre, funkoJSON.franchise, funkoJSON.franchiseNumber, funkoJSON.exclusive, funkoJSON.specialFeatures, funkoJSON.marketValue); 
              connection.write(JSON.stringify({'type': 'reply', 'output': funko.print()}) + '\n');  
              found = true;       
              console.log(`Se ha enviado la información del funko ${funkoJSON.id} al cliente.`);
            }                 
          });
          if (found == false) {
            connection.write(JSON.stringify({'type': 'reply', 'output': chalk.red.bold(`No existe ningún funko con el ID = ${message.id} en la colección de ${message.user}`)}) + '\n');
          }
        } else {
          connection.write(JSON.stringify({'type': 'reply', 'output': chalk.red.bold(`El usuario ${message.user} no tiene una colección`)}) + '\n');  
          return;
        }
      }
      if (message.command === "list") {
        const dirPath = `collections/${message.user}`;
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          connection.write(JSON.stringify({'type': 'reply', 'output': chalk.white.bold(`${message.user} Funko Pop collection\n----------------------------`)}) + '\n');
          let output = "";
          files.forEach(file => {
            const filePath = `${dirPath}/${file}`;
            const data = fs.readFileSync(filePath, 'utf-8');
            const funkoJSON = JSON.parse(data);        
            const funko = new Funko(funkoJSON.id, funkoJSON.name, funkoJSON.description, funkoJSON.type, funkoJSON.genre, funkoJSON.franchise, funkoJSON.franchiseNumber, funkoJSON.exclusive, funkoJSON.specialFeatures, funkoJSON.marketValue);
            output += funko.print() + '\n----------------------------\n';
          });
          connection.write(JSON.stringify({'type': 'reply', 'output': output}) + '\n');  
          console.log(`Se ha enviado la lista de los funkos de ${message.user} al cliente.`)    
        } else {
          connection.write(JSON.stringify({'type': 'reply', 'output': chalk.red.bold(`El usuario ${message.user} no tiene una colección`)}) + '\n');          
          return;
        }
      }
      if (message.command === "remove") {
        const dirPath = `collections/${message.user}`;
        if (fs.existsSync(dirPath)) {
          let found = false;
          const files = fs.readdirSync(dirPath);
          files.forEach(file => {
            const filePath = `${dirPath}/${file}`;
            const data = fs.readFileSync(filePath, 'utf-8');
            const funkoJSON = JSON.parse(data);
            if (funkoJSON.id === message.id) {
              fs.unlinkSync(filePath);
              connection.write(JSON.stringify({'type': 'reply', 'output': chalk.green.bold(`Se ha eliminado correctamente el Funko con el ID = ${message.id} en la colección de ${message.user}`)}) + '\n');
              found = true;       
            }    
          });
          if (found == false) {
            connection.write(JSON.stringify({'type': 'reply', 'output': chalk.red.bold(`No existe ningún Funko con el ID = ${message.id} en la colección de ${message.user}`)}) + '\n');
          }
        } else {
          connection.write(JSON.stringify({'type': 'reply', 'output': chalk.red.bold(`El usuario ${message.user} no tiene una colección`)}) + '\n');
          return;
        }
      }
      if (message.command === "update") {
        const dirPath = `collections/${message.user}`;
        let exist = false;
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          files.forEach(file => {
            const filePath = `${dirPath}/${file}`;
            const data = fs.readFileSync(filePath, 'utf-8');
            const funkoJSON = JSON.parse(data); 
            if (funkoJSON.id === message.id) {          
              exist = true;
              if (message.name != undefined) {   
                fs.renameSync(filePath, `${dirPath}/${message.name}.json`)         
                funkoJSON.name = message.name;
              } else {
                const fileName = path.parse(filePath).name;
                funkoJSON.name = fileName;
              }
              if (message.desc != undefined) {
                funkoJSON.desc = message.desc;
              }
              if (message.fType != undefined) {
                funkoJSON.type = message.fType;
              }
              if (message.genre != undefined) {
                funkoJSON.genre = message.genre;
              }
              if (message.franch != undefined) {
                funkoJSON.franch = message.franch;
              }
              if (message.franchnum != undefined) {
                funkoJSON.franchnum = message.franchnum;
              }
              if (message.excl != undefined) {
                funkoJSON.excl = message.excl;
              }
              if (message.spcfeat != undefined) {
                funkoJSON.spcfeat = message.spcfeat;
              }
              if (message.market != undefined) {
                funkoJSON.marketValue = message.market;
              }
              fs.writeFileSync(`${dirPath}/${funkoJSON.name}.json`, JSON.stringify(funkoJSON, null, 2));
              connection.write(JSON.stringify({'type': 'reply', 'output': chalk.green.bold(`El Funko con el ID = ${message.id} ha sido actualizado en la colección de ${message.user}`)}) + '\n');
              exist = true;
            }        
      });
      if (exist === false) {
        connection.write(JSON.stringify({'type': 'reply', 'output': chalk.red.bold(`No existe ningún funko con el ID = ${message.id} en la colección de ${message.user}`)}) + '\n');
      }  
    } else {
        connection.write(JSON.stringify({'type': 'reply', 'output': chalk.red.bold(`El usuario ${message.user} no tiene una colección`)}));
      return;
    }
      }
      if (message.command === "add") {
        const dirPath = `collections/${message.user}`;
        let exist = false;
        if (fs.existsSync(dirPath)) {
          const files = fs.readdirSync(dirPath);
          files.forEach(file => {
            const filePath = `${dirPath}/${file}`;
            const data = fs.readFileSync(filePath, 'utf-8');
            const funkoJSON = JSON.parse(data); 
            if (funkoJSON.id === message.id) {
              connection.write(JSON.stringify({'type': 'reply', 'output': chalk.red.bold(`Ya existe un Funko con el ID = ${message.id} en la colección de ${message.user}`)}) + '\n');
              exist = true;
            }
          });  
          
          if (exist === false) {
            const funkosJSON = {
              id: message.id,
              name: message.name,
              description: message.desc,
              type: message.fType,
              genre: message.genre,
              franchise: message.franch,
              franchiseNumber: message.franchnum,
              exclusive: message.excl,
              specialFeatures: message.spcfeat,
              marketValue: message.market        
            }
          fs.writeFileSync(`${dirPath}/${message.name}.json`, JSON.stringify(funkosJSON, null, 2));
          connection.write(JSON.stringify({'type': 'reply', 'output': chalk.green.bold(`Nuevo Funko con el ID = ${message.id} se ha añadido a la colección de ${message.user}`)}) + '\n');         
        }
      } else {
        connection.write(JSON.stringify({'type': 'reply', 'output': chalk.red.bold(`El usuario ${message.user} no tiene una colección`)}) + '\n');         
        return;
      }
    }
  }
});

connection.on('close', () => {
  console.log('Un cliente se ha desconectado.');
});
}).listen(60301, () => {
  console.log('Esperando a que un cliente se conecte.');
});