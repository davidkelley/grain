import Admin from './admin';
import Use from './use';
import Resume from './resume';
import Stop from './stop';
import Login from './login';
import Env from './env';

export default [
  {
    command: 'admin <action> <profile> <user>',
    description: 'Creates a new user for use this profile',
    action: Admin
  },
  {
    command: 'stop <profile>',
    description: 'Stops grain and tidies up profile resources',
    action: Stop,
  },
  {
    command: 'resume <profile>',
    description: 'Resumes a previously configured profile',
    action: Resume,
  },
  {
    command: 'env <profile>',
    description: 'Enables the quick export of AWS credentials to the current shell. Example: "$ export `grain env development`"',
    action: Env
  },
  {
    command: 'login <profile> <alias> [page]',
    description: 'Logs the active profile role into an AWS Account console for an alias, opening at an optional page.',
    action: Login,
  },
  {
    command: 'use <profile>',
    description: 'Switch EC2 Metadata Profile',
    action: Use,
  },
];
