import program from 'commander';

import Commands from './commands';

program.version('0.0.0');

Commands.forEach((command) => {
  Object.keys(command).reduce((control, key) => {
    switch (key) {
      case 'options':
        let step;
        command[key].forEach(option => { step = control.option(...option); });
        return step;
      case 'action':
        return control.action((...ops) => { new command.action().execute(...ops); });
      default:
        return control[key](command[key]);
    }
  }, program);
});

program.parse(process.argv);
