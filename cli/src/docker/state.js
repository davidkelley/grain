'use strict';

import Promise from 'bluebird';
import fs from 'fs';

class State {
  constructor(path) {
    this.path = path;
  }

  delete() {
    return new Promise((resolve, reject) => {
      fs.unlink(this.path, (err) => {
        if(err && err.code !== 'ENOENT') {
          reject(err);
        } else {
          resolve();
        }
      });
    })
    return Promise.fromCallback(cb => fs.unlink(this.path, cb));
  }

  write(data) {
    var options = { encoding: 'utf8', flag: 'w', mode: 0o777 };
    return Promise.fromCallback(cb => fs.writeFile(this.path, data, options, cb));
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if(err) {
          if(err.code !== 'ENOENT') {
            reject(err);
          } else {
            resolve(null);
          }
        } else {
          resolve(data);
        }
      })
    });
  }
}

export default State;
