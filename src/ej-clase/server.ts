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