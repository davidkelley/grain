import program from 'commander';

import Commands from './commands';
import { GRAIN_PROFILES_PATH } from './constants';

program.version('0.0.0');

program.option('-p, --profiles-path [path]', `Path to profiles file. Defaults to "${GRAIN_PROFILES_PATH}"`, GRAIN_PROFILES_PATH);

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
