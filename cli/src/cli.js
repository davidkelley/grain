import cli from 'cli';

import Profiler from './profiler';

class CLI {
  get cli() {
    return cli;
  }

  profiler(profilesPath, profile) {
    return new Promise((resolve, reject) => {
      new Profiler({ profilesPath }).profile(profile).then((data) => {
        resolve(data);
      }).catch(this.onError)
        .catch(reject);
    });
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
