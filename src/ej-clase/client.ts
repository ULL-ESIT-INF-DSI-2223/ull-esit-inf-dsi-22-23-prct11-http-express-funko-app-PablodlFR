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