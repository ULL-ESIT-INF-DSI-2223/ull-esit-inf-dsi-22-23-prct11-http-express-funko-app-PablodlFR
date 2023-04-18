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
  .help()
  .argv;