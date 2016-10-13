'use strict';

import { DEFAULT_PORT, DEFAULT_IP } from '../constants';

import Promise from 'bluebird';
import State from './state';
import shell from 'shelljs';

class Redirect {
  constructor({ remote = DEFAULT_IP, host = '127.0.0.1', port = DEFAULT_PORT }) {
    this.state = new State(`${__dirname}/grain-redirect-path.conf`);
    this.remote = remote;
    this.port = port;
    this.host = host;
  }
};

class PFCTL extends Redirect {
  setup() {
    return new Promise((resolve, reject) => {
      this.state.write(this.expr + "\n").then(() => {
        var alias = shell.exec(this.alias, { silent: true });
        if(alias.code !== 0) {
          reject(new Error(`Unable to alias IP: ${alias.stdout}`));
        } else {
          var redirect = shell.exec(`pfctl -F all -f ${this.state.path}`, { silent: true });
          if(redirect.code !== 0) {
            reject(new Error(`Unable to setup IP redirect: ${redirect.stdout}`));
          } else {
            resolve();
          }
        }
      }).catch(reject).lastly(() => { this.state.delete() });
    })
  }

  teardown() {
    return new Promise((resolve, reject) => {
      var teardown = shell.exec(`pfctl -F all`, { silent: true });
      if(teardown.code !== 0) {
        reject(new Error(`Unable to unlink IP alias: ${teardown}`));
      } else {
        resolve();
      }
    })
  }

  get alias() {
    let { entity, remote } = this;
    return `ifconfig ${entity} ${remote} alias`;
  }

  get expr() {
    let { remote, port, host, entity } = this;
    return `rdr pass on ${entity} inet proto tcp from any to ${remote} port 80 -> ${host} port ${port}`;
  }

  get entity() {
    return 'lo0';
  }
};

export default function(...args) {
  if(shell.which('pfctl')) {
    return new PFCTL(...args);
  } else {
    throw 'Unsupported system';
  }
}
