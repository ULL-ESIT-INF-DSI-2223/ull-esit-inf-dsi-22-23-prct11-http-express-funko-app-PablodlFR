import {readFile} from 'fs';
import {spawn} from 'child_process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

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
  .help()
  .argv;