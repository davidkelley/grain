'use strict';

import Promise from 'bluebird';
import toml from 'toml';
import fs from 'fs';

class Profiler {
  constructor({ profilesPath }) {
    this.path = profilesPath.replace(/^\~/, process.env.HOME);
  }

  profile(name) {
    return new Promise((resolve, reject) => {
      this.read().done((data) => {
        var profiles;
        try {
          profiles = toml.parse(data);
        } catch(e) {
          reject(new Error(`Syntax Error in "${this.path}" on line ${e.line}: ${e.message}`));
        }

        var profile = profiles[name]
        if( ! profile) {
          reject(new Error(`Profile "${name}" not found.`))
        } else {
          resolve(profile)
        }
      })
    });
  }

  read() {
    return Promise.fromCallback(cb => fs.readFile(this.path, 'utf8', cb));
  }
}

export default Profiler;
