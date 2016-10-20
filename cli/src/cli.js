import cli from 'cli';

import Profiler from './profiler';

class CLI {
  get cli() {
    return cli;
  }

  constructor(options) {
    this.options = options;
    this.profilesPath = this.options.parent.profilesPath;
  }

  profiler(profile) {
    const { profilesPath } = this;
    return new Profiler({ profilesPath }).profile(profile);
  }

  onError(err) {
    if (err) {
      if (err.statusCode) {
        cli.fatal(`Docker: (${err.statusCode}) ${err.reason}`);
      } else {
        cli.fatal(`Error: ${err.message}`);
      }
    } else {
      cli.fatal('Error: Unknown Error');
    }
  }
}

export default CLI;
