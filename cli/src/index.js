import program from 'commander';
import Commands from './commands';

program.version('0.0.0');

Commands.forEach((command) => {
  Object.keys(command).reduce((program, key) => {
    switch(key) {
      case 'options':
        command[key].forEach(option => program = program.option(...option))
        return program;
      case 'action':
        return program.action((...ops) => { new command.action().execute(...ops) });
      default:
        return program[key](command[key])
    }
  }, program);
});

program.parse(process.argv);
