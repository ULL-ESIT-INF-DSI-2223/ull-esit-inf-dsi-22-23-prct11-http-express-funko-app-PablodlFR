# Práctica 10 - APIs asíncronas de gestión del sistema de ficheros, creación de procesos y creación de sockets de Node.js
Esta práctica consiste en la realización de una serie de ejercicios que hacen uso de las APIs asíncronas de Node.js para la gestión del sistema de ficheros (_fs_), creación de procesos (_child\_proces_) y sockets (_net_). Además se mostrará el ejercicio realizado en la hora de prácticas (PE101).
\
\
El código fuente de ambos ejercicios se encuentra organizado en diferentes directorios y se hace uso de sintaxis ES para importar/exportar las distintas entidades.
## Ejercicio de clase
El ejercicio propuesta en clase consiste en hacer uso del módulo _net_ para crear un cliente y servidor que permitan al usuario desde el cliente ejecutar comandos de Unix/Linux y obtener una respuesta.
\
\
El servidor creado es el siguiente:
```TypeScript
import * as net from 'net';
import {spawn} from 'child_process';


  net.createServer((connection) => {
    console.log('Un cliente se ha conectado.');
 
    let wholeData = '';

    connection.on('data', (data) => {
      wholeData += data;      
      const message = JSON.parse(wholeData);
      if (message.type === "command") {
        
        const command = spawn(message.command, [...message.argv]);

        command.stdout.on('data', (output) => {
          connection.write(JSON.stringify({'type': 'command', 'output': output.toString()}) + '\n');
        });

        command.stderr.on('error', (err) => {
          console.error(`stderr: ${err}`);
        })
      }
    });

    connection.on('close', () => {
      console.log('Un cliente se ha desconectado.');
    });
  }).listen(60300, () => {
    console.log('Esperando a que un cliente se conecte.');
  });
``` 
En el código mostrado previamente, creamos un servidor que muestra cuando un cliente se conecta y se desconecta. El servidor se queda a la espera de recibir un _JSON_ cuyo campo _type_ sea _command_, una vez recibe dicho mensaje se ejecuta el comando indicado gracias a la función de _child\_process_, _spawn()_ y se vuelve a enviar el resultado en un nuevo mensaje _JSON_ al cliente.
\
\
El cliente creado es el siguiente:
```TypeScript
import * as net from 'net';

const client = net.connect({port: 60300});

if (process.argv.length < 2) {
  console.log('Por favor, da un comando.');
} else {
    client.write(JSON.stringify({'type': 'command', 'command': process.argv[2], 'argv': process.argv.slice(2)}));

    client.on('data', (dataJSON) => {
      const message = JSON.parse(dataJSON.toString());
      if (message.type === 'command') {
        console.log(message.output);
        client.end();
      }
    });

    client.on('end', () => {      
      console.log("Comando enviado. Transmisión finalizada.");
    })
};
```
Primero se conecta al servidor creado previamente gracias a la función _connect()_ y posteriormente se comprueba que se ha enviado por la línea de comandos algún argumento, si es así, se crea un _JSON_ con el comando que se desea ejecutar y sus argumentos. El mensaje se envía al servidor, donde se ejecuta como comentamos anteriormente y en el cliente, dentro del evento 'data' se procesa el mensaje con la respuesta y se imprime por pantalla, posteriormente se cierra la comunicación, indicándole al usuario que todo ha ido correctamente.
\
\
A continuación veremos un ejemplo de su funcionamiento:
\
\
Servidor:
```bash
Esperando a que un cliente se conecte.
Un cliente se ha conectado.
Un cliente se ha desconectado.
```
Cliente:
```bash
$node dist/ej-clase/client.js cat -n helloworld.txt
     1  test test
     2  test
     3  test

Comando enviado. Transmisión finalizada.
```
## Ejercicios de guion
### Ejercicio 1
El primer ejercicio  debemos de comprender el siguiente código y realizar una traza mostrando el contenido de la pila de llamadas, el registro de eventos, la cola de manejadores y lo que se muestra por consola. Además de responder un par de preguntas.
```TypeScript
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```
#### Paso 1 (Ejecución del programa):
*Consola:*
```bash
$node dist/ej-guion/ejercicio-1/watchfile.js helloworld.txt
```
Como se ha especificado un archivo el cual existe, no se llegan a ejecutar los dos primeros _console.log()_ del programa.
\
\
*Pila de llamadas:*
```TypeScript
access(filename, constants.F_OK, (err) => {...});
```
*Registro de eventos de la API:*
```
Vacía
```
*Cola de manejadores:*
```
Vacía
```
#### Paso 2:
Como no se ha detectado ningún error en la función _access_, llega a la pila de llamadas el _console.log()_ que indica que se está observando el archivo pasado por parámetro.
\
\
*Pila de llamadas:*
```TypeScript
console.log(`Starting to watch file ${filename}`);
```
Se muestra dicho mensaje por consola.
\
\
*Consola:*
```bash
$node dist/ej-guion/ejercicio-1/watchfile.js helloworld.txt
Starting to watch file helloworld.txt
```
*Registro de eventos de la API:*
```
Vacía
```
*Cola de manejadores:*
```
Vacía
```
#### Paso 3:
Se llama a la función _watch_ con el nombre del archivo a observar como argumento.
\
\
*Pila de llamadas:*
```TypeScript
watch(process.argv[2]);
```
La consola sigue igual.
\
\
*Consola:*
```bash
$node dist/ej-guion/ejercicio-1/watchfile.js helloworld.txt
Starting to watch file helloworld.txt
```
Se registra los eventros relacionado a la variable _watcher_, que acabamos de asignar con la función _watch_.
\
\
*Registro de eventos de la API:*
```TypeScript
watcher.on('change'), () => {
  console.log(`File ${filename} has been modified somehow`);
}
```
*Cola de manejadores:*
```
Vacía
```
#### Paso 4:
Como no se ha realizado todavía ninguna modificación, no salta el evento registrado anteriormente y llegamos al último _console.log()_ del programa.
\
\
*Pila de llamadas:*
```TypeScript
console.log(`File ${filename} is no longer watched`);
```
Se ejecuta el _console.log()_.
\
\
*Consola:*
```bash
$node dist/ej-guion/ejercicio-1/watchfile.js helloworld.txt
Starting to watch file helloworld.txt
File helloworld.txt is no longer watched
```
*Registro de eventos de la API:*
```TypeScript
watcher.on('change'), () => {
  console.log(`File ${filename} has been modified somehow`);
}
```
*Cola de manejadores:*
```
Vacía
```
#### Paso 5 (Primera modificación del fichero):
*Registro de eventos de la API:*
```TypeScript
watcher.on('change'), () => {
  console.log(`File ${filename} has been modified somehow`);
}
```
Se activa el evento correspondiente en el registro de eventos y este se envía a la cola de manejadores.
\
\
*Cola de manejadores:*
```TypeScript
() => {
  console.log(`File ${filename} has been modified somehow`);
}
```
Como la pila de llamadas hasta este momento se encuentra vacía, pasa a ejecutar sin problemas el _console.log()_ de la cola de manejadores.
\
\
*Pila de llamadas:*
```TypeScript
console.log(`File ${filename} has been modified somehow`);
```
Se muestra dicho mensaje por consola.
\
\
*Consola:*
```bash
$node dist/ej-guion/ejercicio-1/watchfile.js helloworld.txt
Starting to watch file helloworld.txt
File helloworld.txt is no longer watched
File helloworld.txt has been modified somehow
```
#### Paso 6 (Segunda modificación del fichero):
El registro de eventos se mantiene igual, a la espera de que su activación.
\
\
*Registro de eventos de la API:*
```TypeScript
watcher.on('change'), () => {
  console.log(`File ${filename} has been modified somehow`);
}
```
Se activa el evento correspondiente en el registro de eventos y este se envía a la cola de manejadores, la cual se había vaciado tras la finalización del paso anterior.
\
\
*Cola de manejadores:*
```TypeScript
() => {
  console.log(`File ${filename} has been modified somehow`);
}
```
Como la pila de llamadas volvía a estar vacía, pasa a ejecutar sin problemas el _console.log()_ de la cola de manejadores.
\
\
*Pila de llamadas:*
```TypeScript
console.log(`File ${filename} has been modified somehow`);
```
Se muestra dicho mensaje por consola.
\
\
*Consola:*
```bash
$node dist/ej-guion/ejercicio-1/watchfile.js helloworld.txt
Starting to watch file helloworld.txt
File helloworld.txt is no longer watched
File helloworld.txt has been modified somehow
File helloworld.txt has been modified somehow
```
* **¿Qué hace la función _access_?** La función access es una función asíncrona del módulo _fs_ de Node.js, el cual acepta tres argumentos: nombre del fichero, una constante que explicaremos a continuación y un _callback_ que se ejecutará en caso de error.
* **Para qué sirve el objeto _constants_?** Son una serie de constantes del módulo _fs_ que se usan en varias de sus funciones, para comprobar el modo de acceo de un archivo. La constante utilizada en este programa es _constants.F\_OK_, utilizada en la función access para verificar si un archivo existe. También existen otras constantes para comprobar si se puede leer un archivo, escribir, o ejecutar.

### Ejercicio 2
En este ejercicio debemos desarrollar una aplicación que nos permita obtener información sobre el número de líneas, palabras o caracteres de un fichero de texto, además de una combinación de ellos. Para esto haremos uso nuevamente del paquete _yargs_ para gestionar el paso de parámetros por la línea de comandos.
\
\
Se nos pide hacer el ejercicio de dos formas distintas, es por ello que se ha dividido cada uno de los casos en ficheros distintos. En el primer caso debemos de usar el método _pipe_ para redirigir las salidas de los comandos, mientras que de la segunda forma, no se utilizará este método, sino que se llevará a cavo con eventos y sus respectivos manejadores. Todo esto se hará programando defensivamente, para así controlar los errores.
#### Caso 1. Haciendo uso del método pipe.
El código es el siguiente:
```TypeScript
yargs(hideBin(process.argv))
/**
 * Command wc, to count the number of words, lines and characters from a text file.
 * Options:
 *    - l -> lines.
 *    - w -> words.
 *    - m -> characters.
 */
  .boolean(['l', 'w', 'm'])
  .command('wc', 'word count of a text file', {
    file: {
      description: 'the file\'s name',
      type: 'string',
      demandOption: true
    }
  }, (argv) => {
    readFile(argv.file, (err) => {
      if (err) {
        console.log(`No existe el fichero ${argv.file}`)
      }

      if (argv.l) {     
        const wcl = spawn('wc', ['-l', argv.file]);     
        const cut = spawn('cut', ['-d', ' ', '-f', '1']); 

        wcl.stdout.pipe(cut.stdin);
        cut.stdout.pipe(process.stdout);
      }

      if (argv.w) {        
        const wcw = spawn('wc', ['-w', argv.file]);     
        const cut = spawn('cut', ['-d', ' ', '-f', '1']); 

        wcw.stdout.pipe(cut.stdin);
        cut.stdout.pipe(process.stdout);
      }

      if (argv.m) {
        const wcm = spawn('wc', ['-m', argv.file]);     
        const cut = spawn('cut', ['-d', ' ', '-f', '1']); 

        wcm.stdout.pipe(cut.stdin);
        cut.stdout.pipe(process.stdout);
      }

      if (argv.l === undefined && argv.w === undefined && argv.m === undefined) {
        console.log('No ha utilizado ninguna de las opciones posibles (--l, --w, --m)');
      }
    })
  })
```
Como podemos observar en el código anterior se declaran de forma _booleana_ las 3 opciones posibles y en el comando _wc_ declaramos una opción obligatoria que es _file_, para indicar el fichero que se desea analizar.
\
\
Una vez introducido el comando por consola, se comprueba si dicho fichero existe, controlando así los errores, tal y como se pedía en el enunciado. Dependiendo de los argumentos pasados en la línea de comando se mostrará una opción u otra, en todos los casos, primero se ejecuta el comando _wc_ con la opción pertinente, gracias a la función _spawn()_, posteriormente haciendo uso de _pipe()_ pasamos la salida de _wc_ a la entrada del comando _cut_, para así obtener solo el número deseado, obviando el nombre del fichero. Finalmente, se envía la salida del comando _cut_ por la salida estándar, haciendo uso una vez más de _pipe()_. También se tiene en cuenta el caso de que el usuario no introduzca ninguna de las posibles opciones en el comando, en dicho caso saltará un mensaje indicado al usuario las posibles opciones a utilizar.
\
\
Ejemplos de uso:
```bash
$node dist/ej-guion/ejercicio-2/ej-2-pipe wc --file helloworld.txt --l
3
$node dist/ej-guion/ejercicio-2/ej-2-pipe wc --file helloworld.txt --w
4
$node dist/ej-guion/ejercicio-2/ej-2-pipe wc --file helloworld.txt --m
20
$node dist/ej-guion/ejercicio-2/ej-2-pipe wc --file helloworld.txt --l --w --m
3
4
20
$node dist/ej-guion/ejercicio-2/ej-2-pipe wc --file helloworld.txt
No ha utilizado ninguna de las opciones posibles (--l, --w, --m)
```
#### Caso 2. Sin hacer uso del método pipe.
El programa es el siguiente:
```TypeScript
yargs(hideBin(process.argv))
/**
 * Command wc, to count the number of words, lines and characters from a text file.
 * Options:
 *    - l -> lines.
 *    - w -> words.
 *    - m -> characters.
 */
  .boolean(['l', 'w', 'm'])
  .command('wc', 'word count of a text file', {
    file: {
      description: 'the file\'s name',
      type: 'string',
      demandOption: true
    }
  }, (argv) => {
    readFile(argv.file, (err) => {
      if (err) {
        console.log(`No existe el fichero ${argv.file}`)
      }

      const wc = spawn('wc', [argv.file]);

      let wcOutput = '';
      wc.stdout.on('data', (data) => wcOutput += data);

      wc.on('close', () => {
        const wcOutputArray = wcOutput.split(" ");        
        if (argv.l) {
          console.log(`El fichero ${argv.file} tiene ${wcOutputArray[1]} líneas.`);
        }
        if (argv.w) {
          console.log(`El fichero ${argv.file} tiene ${wcOutputArray[3]} palabras.`);
        }
        if (argv.m) {
          console.log(`El fichero ${argv.file} tiene ${wcOutputArray[4]} caracteres.`);
        }
        if (argv.l === undefined && argv.w === undefined && argv.m === undefined) {
          console.log('No ha utilizado ninguna de las opciones posibles (--l, --w, --m)');
        }
      });

      wc.on('error', (err) => {
        console.error('Error al ejecutar el comando', err);
      });
    })
  })
```
En esta ocasión no utilizamos el método pipe(), lo primero es ejecutar el comando _wc_ con el método _spawn()_ y guardar dichos datos en una variable, por si no llegaran todos a la vez, tal y como vimos en el aula haciendo uso del evento 'data'. A continuación, le damos forma a esos datos una vez se hayan terminado de obtener, gracias al método 'close', imprimiendo por pantalla solo aquella información solicitada por el usuario. Con este programa, vemos claramente la diferencia de usar eventos y sus manejadores, con los _pipe()_ del primer programa. En cuanto al control de errores, se repiten los comentados en el anterior ejercicio y además se añade un evento 'error', que salta cuando se produzca un error durante la ejecución del comando.
\
\
Ejemplos de uso:
```bash
$node dist/ej-guion/ejercicio-2/ej-2-nopipe wc --file helloworld.txt --l
El fichero helloworld.txt tiene 3 líneas.
$node dist/ej-guion/ejercicio-2/ej-2-nopipe wc --file helloworld.txt --w
El fichero helloworld.txt tiene 4 palabras.
$node dist/ej-guion/ejercicio-2/ej-2-nopipe wc --file helloworld.txt --m
El fichero helloworld.txt tiene 20 caracteres.
$node dist/ej-guion/ejercicio-2/ej-2-pipe wc --file helloworld.txt --l --w
El fichero helloworld.txt tiene 3 líneas.
El fichero helloworld.txt tiene 4 palabras.
$node dist/ej-guion/ejercicio-2/ej-2-pipe wc --file helloworld.txt
No ha utilizado ninguna de las opciones posibles (--l, --w, --m)
```
### Ejercicio 3 - Cliente y servidor para la aplicación de registro de Funko Pops 
Este ejercicio consiste en adaptar la aplicación de registro de Funko Pops realizada en la práctica anterior como un cliente y servidor, haciendo uso del módulo _net_ de Node.js.
\
\
En este informe entraremos a comentar la adaptación de la aplicación realizada en la práctica 9 a un cliente y servidor.
\
\
El servidor es el siguiente:
```TypeScript
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
```
Es la parte del código donde se crea el servidor y se encuentra escuchando un puerto (60301) a la espera de la conexión de un cliente. El funcionamiento es el sigueinte: se espera a que el cliente se conecte enviado un mensaje JSON, el cual el servidor recoge y analiza, dependiendo del campo _command_ del JSON enviado por le cliente se efectua una acción un otra, siendo estas las comentadas en la práctica 9. En cada uno de los casos se recoge la espuesta en un nuevo JSON de tipo _reply_, que será lo que muestre el cliente. Depende del comando se envía una cosa u otra, por ejemplo en el comando _read_ se le envía a la consola del cliente la información del Funko que haya seleccionado.
\
\
En relación al cliente, el código es el siguiente:
```TypeScript
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import * as net from 'net';

const client = net.connect({port: 60301});

yargs(hideBin(process.argv))
/**
 * Command add, to add a Funko to a user list.
 */
  .command('add', 'Adds a funko', {
    id: {
      description: 'Funko ID',
      type: 'number',
      demandOption: true
    },
    user: {
      description: 'User',
      type: 'string',
      demandOption: true
    },
    name: {
      description: 'Funko Name',
      type: 'string',
      demandOption: true
    },
    desc: {
      description: 'Funko description',
      type: 'string',
      demandOption: true
    },
    type: {
      description: 'Funko type',
      type: 'string',
      demandOption: true
    },
    genre: {
      description: 'Genre of the funko series',
      type: 'string',
      demandOption: true
    },
    franch: {
      description: 'Funko franchise',
      type: 'string',
      demandOption: true
    },
    franchnum: {
      description: 'Funko franchise number',
      type: 'number',
      demandOption: true
    },
    excl: {
      description: 'Is a exclusive funko?',
      type: 'boolean',
      demandOption: true
    },
    spcfeat: {
      description: 'Funko special features',
      type: 'string',
      demandOption: true
    },
    market: {
      description: 'Funko market value',
      type: 'number',
      demandOption: true
    }

  }, (argv) => {

    client.write(JSON.stringify({'type': 'command', 'command': 'add', 'user': argv.user, 'id': argv.id, 'name': argv.name, 'desc': argv.desc, 'fType': argv.type, 'genre': argv.genre, 'franch': argv.franch, 'franchnum': argv.franchnum, 'excl': argv.excl, 'spcfeat': argv.spcfeat, 'market': argv.market}));

    client.on('data', (dataJSON) => {
      const message = JSON.parse(dataJSON.toString());
      if (message.type === 'reply') {
        console.log(message.output);       
      }
    });        
  })
  
  /**
   * Command update, to update a Funko from a user list.
   */
  .command('update', 'update a funko', {
    id: {
      description: 'Funko ID',
      type: 'number',
      demandOption: true
    },
    user: {
      description: 'User',
      type: 'string',
      demandOption: true
    },
    name: {
      description: 'Funko Name',
      type: 'string',
      demandOption: false
    },
    desc: {
      description: 'Funko description',
      type: 'string',
      demandOption: false
    },
    type: {
      description: 'Funko type',
      type: 'string',
      demandOption: false
    },
    genre: {
      description: 'Genre of the funko series',
      type: 'string',
      demandOption: false
    },
    franch: {
      description: 'Funko franchise',
      type: 'string',
      demandOption: false
    },
    franchnum: {
      description: 'Funko franchise number',
      type: 'number',
      demandOption: false
    },
    excl: {
      description: 'Is a exclusive funko?',
      type: 'boolean',
      demandOption: false
    },
    spcfeat: {
      description: 'Funko special features',
      type: 'string',
      demandOption: false
    },
    market: {
      description: 'Funko market value',
      type: 'number',
      demandOption: false
    }

  }, (argv) => {

    client.write(JSON.stringify({'type': 'command', 'command': 'update', 'user': argv.user, 'id': argv.id, 'desc': argv.desc, 'fType': argv.type, 'genre': argv.genre, 'franch': argv.franch, 'franchnum': argv.franchnum, 'excl': argv.excl, 'spcfeat': argv.spcfeat, 'market': argv.market}));

    client.on('data', (dataJSON) => {
      const message = JSON.parse(dataJSON.toString());
      if (message.type === 'reply') {
        console.log(message.output);       
      }
    });    
  })

  /**
   * Command remove, to remove a Funko from a list.
   */
    .command('remove', 'Remove a funko from the collection', {
      id: {
        description: 'Funko ID',
        type: 'number',
        demandOption: true
      },
      user: {
        description: 'User',
        type: 'string',
        demandOption: true
      }
  }, (argv) => {
    client.write(JSON.stringify({'type': 'command', 'command': 'remove', 'user': argv.user, 'id': argv.id}));

    client.on('data', (dataJSON) => {
      const message = JSON.parse(dataJSON.toString());
      if (message.type === 'reply') {
        console.log(message.output);       
      }
    });
  })


  /**
   * Commando list, to list the whole Funko's collection from a user.
   */
  .command('list', 'List a funko collection', {
    user: {
      description: 'User',
      type: 'string',
      demandOption: true
    }
  }, (argv) => {
    client.write(JSON.stringify({'type': 'command', 'command': 'list', 'user': argv.user, 'id': argv.id}));

    client.on('data', (dataJSON) => {
      const message = JSON.parse(dataJSON.toString());
      if (message.type === 'reply') {
        console.log(message.output);       
      }
    });
  })

  /**
   * Command read, to read a concret Funko from a user collection.
   */
  .command('read', 'Show a concrete funko from the collection', {
    id: {
      description: 'Funko ID',
      type: 'number',
      demandOption: true
    },
    user: {
      description: 'User',
      type: 'string',
      demandOption: true
    }
  }, (argv) => {    
    client.write(JSON.stringify({'type': 'command', 'command': 'read', 'user': argv.user, 'id': argv.id}));

    client.on('data', (dataJSON) => {
      const message = JSON.parse(dataJSON.toString());
      if (message.type === 'reply') {
        console.log(message.output);            
      }
    });
  })
  .help()
  .argv;
```
En el cliente es donde se encuentra toda el procesamiento de los comandos gracias a _yargs_. Primero se conecta al servidor del mismo puerto (60301) y dependiendo del comando que use el usuario se envía un tipo de mensaje JSON u otro al servidor, que cómo vimos antes, el servidor procesa la petición y crea un mensaje de vuelta, el cual es motrado por la consola del cliente, gracias al evento 'data'.
\
\
A continuación mostraremos como ejemplo del funcionamiento tanto del cliente como del servidor mostrado anteriormente la ejecución del comando _read_:
\
\
Servidor:
```Bash
Esperando a que un cliente se conecte.
Un cliente se ha conectado.
Se ha enviado la información del funko 1 al cliente.
Un cliente se ha desconectado.
```
Cliente:
```Bash
$node dist/ej-guion/ejercicio-3/client.js read --user pablo --id 1
ID: 1
Name: Conan Edogawa
Description: Classic Conan Edogawa 1996
Type: Pop!
Genre: Anime
Franchise: Detective Conan
Franchise Number: 1
Exclusive: true
Special Features: No tiene ninguna característica especial
Market Value: 100€
```
## Conclusión
Esta en la primera práctica en la que hacemos uso de la API asíncrona de Node.js, lo que nos ha permitido comprender otra forma de llevar a cabo las aplicaciones, primero comprendiendo del funcionamiento de la pila de llamadas, registro de eventos y cola de manejadores en el primer ejercicios. Después en el segundo observamos la diferencia de usar las _pipes_ y los eventos y por último en el tercero hemos creado un sistema cliente-servidor adaptando nuestra aplicación de Funkos de la práctica, haciendo uso de sockets del módulo _net_.
\
\
Al igual que en las prácticas anteriores se han incluido los flujos de trabajo de GitHub Actions:
* Tests: [![Tests](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-PablodlFR/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-PablodlFR/actions/workflows/node.js.yml)
* Coveralls: [![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-PablodlFR/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-PablodlFR?branch=main)
* Sonar-Cloud: [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-PablodlFR&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct10-fs-proc-sockets-funko-app-PablodlFR)
## Bibliografía
Para la realización de esta práctica se han consultado las siguientes fuentes bibliográficas:
* [Guion de la práctica 10](https://ull-esit-inf-dsi-2223.github.io/prct10-fs-proc-sockets-funko-app/)
* [Yargs](https://www.npmjs.com/package/yargs)
* [Chalk](https://www.npmjs.com/package/chalk)
* [Events](https://nodejs.org/docs/latest-v19.x/api/events.html)
* [fs](https://nodejs.org/docs/latest-v19.x/api/fs.html)
* [child_process](https://nodejs.org/docs/latest-v19.x/api/child_process.html)
* [net](https://nodejs.org/docs/latest-v19.x/api/net.html)