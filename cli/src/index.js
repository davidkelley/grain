import cli from 'cli';
import commands from './commands';
cli.parse(null, ['use']);
new commands[cli.command](cli).execute();
