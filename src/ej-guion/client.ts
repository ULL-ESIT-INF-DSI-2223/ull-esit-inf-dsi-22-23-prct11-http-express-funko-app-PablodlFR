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






