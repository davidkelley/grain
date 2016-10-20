import Promise from 'bluebird';
import shell from 'shelljs';

import State from './state';

class Redirect {
  constructor({ ip, host = '127.0.0.1', port }) {
    this.state = new State(`${__dirname}/grain-redirect-path.conf`);
    this.remote = ip;
    this.port = port;
    this.host = host;
  }
}

class PFCTL extends Redirect {
  setup() {
    return new Promise((resolve, reject) => {
      this.state.write(`${this.expr}\n`).then(() => {
        const { entity, remote } = this;
        const alias = shell.exec(`ifconfig ${entity} alias ${remote}`, { silent: true });
        if (alias.code !== 0) {
          reject(new Error(`Unable to alias IP: ${alias.stderr}`));
        } else {
          const redirect = shell.exec(`pfctl -F all -ef ${this.state.path}`, { silent: true });
          if (redirect.code !== 0) {
            reject(new Error(`Unable to setup IP redirect: ${redirect.stderr}`));
          } else {
            resolve();
          }
        }
      }).catch(reject).lastly(() => { this.state.delete(); });
    });
  }

  teardown() {
    return new Promise((resolve, reject) => {
      const { entity, remote } = this;
      const alias = shell.exec(`ifconfig ${entity} -alias ${remote}`, { silent: true });
      if (alias.code !== 0) {
        reject(new Error(`Unable to unalias IP: ${alias.stderr}`));
      } else {
        const teardown = shell.exec('pfctl -F all', { silent: true });
        if (teardown.code !== 0) {
          reject(new Error(`Unable to unlink IP alias: ${teardown.stderr}`));
        } else {
          resolve();
        }
      }
    });
  }

  get expr() {
    const { remote, port, host, entity } = this;
    return `rdr pass on ${entity} inet proto tcp from any to ${remote} port 80 -> ${host} port ${port}`;
  }

  get entity() {
    return 'lo0';
  }
}

export default function (...args) {
  if (shell.which('pfctl')) return new PFCTL(...args);
  throw new Error('Unsupported system');
}
