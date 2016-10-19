import Promise from 'bluebird';
import toml from 'toml';
import fs from 'fs';

import { DEFAULT_REGION, DEFAULT_LEVEL, DEFAULT_IP, DEFAULT_PORT, GRAIN_STATE_PATH, DEFAULT_DOCKER_IMAGE } from './constants';

class Profile {
  constructor(obj) {
    Object.keys.forEach((key) => { this[key] = obj[key] });
  }

  endpoint() {
    const { id, region, level } = this;
    return `${id}.execute-api.${region}.amazonaws.com/${level}`;
  }
}

class Profiler {
  constructor({ profilesPath }) {
    this.path = profilesPath.replace(/^~/, process.env.HOME);
  }

  profile(name) {
    return new Promise((resolve, reject) => {
      this.read().done((data) => {
        let profiles;
        try {
          profiles = toml.parse(data);
        } catch (e) {
          reject(new Error(`Syntax Error in "${this.path}" on line ${e.line}: ${e.message}`));
        }

        const profile = profiles[name];
        if (!profile) {
          reject(new Error(`Profile "${name}" not found.`));
        } else {
          resolve(new Profile(this.defaults(profile)));
        }
      });
    });
  }

  defaults({
    id,
    key,
    user,
    region = DEFAULT_REGION,
    level = DEFAULT_LEVEL,
    ip = DEFAULT_IP,
    port = DEFAULT_PORT,
    state = GRAIN_STATE_PATH,
    image = DEFAULT_DOCKER_IMAGE
  }) {
    return { id, key, user, region, level, ip, port, state, image };
  }

  read() {
    return Promise.fromCallback(cb => fs.readFile(this.path, 'utf8', cb));
  }
}

export default Profiler;
