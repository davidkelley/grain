'use strict';

import { DEFAULT_LEVEL, DEFAULT_REGION, DEFAULT_PORT } from '../constants';
import State from './state';
import Redirect from './redirect';
import Docker from 'dockerode';
import Promise from 'bluebird';
import shell from 'shelljs';

class Controller {
  constructor(profile, { image, statePath }) {
    this.profile = profile;
    this.image = image;
    if(statePath) this.state = new State(statePath.replace(/^\~/, process.env.HOME));
  }

  get Docker() {
    return new Docker()
  }

  get secret() {
    return this.profile.key;
  }

  get identifier() {
    var user = this.profile.user || 'user';
    var hostname = shell.exec('hostname', { silent: true });

    if(hostname.code !== 0) {
      return `${user}@unknown`;
    } else {
      var host = hostname.stdout.replace(/(\r\n|\n|\r)/gm,"");
      return `${user}@${host}`;
    }
  }

  get endpoint() {
    let { id, region = DEFAULT_REGION, level = DEFAULT_LEVEL } = this.profile;
    return `${id}.execute-api.${region}.amazonaws.com/${level}`;
  }

  options({ port = DEFAULT_PORT }) {
    return {
      create: {
        Image: this.image,
        Tty: false,
        Env: [
          `GRAIN_SECRET=${this.secret}`,
          `GRAIN_ENDPOINT=${this.endpoint}`,
          `GRAIN_IDENTIFIER=${this.identifier}`,
          `LISTEN_ON=${port}`,
          `SERVER_NAME=127.0.0.1`
        ],
        ExposedPorts: this.withPortMappingKey(port, {}),
        HostConfig: {
          PortBindings: this.withPortMappingKey(port, [{ "HostPort": `${port}` }])
        }
      },
      start: {}
    };
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.state.read().then((id) => {
        if( ! id) {
          resolve()
        } else {
          var container = this.Docker.getContainer(id);
          if( ! container) {
            resolve()
          } else {
            container.stop((err, data) => {
              if(err && err.statusCode != 304) {
                reject(err);
              } else {
                container.remove((err, data) => {
                  if(err) {
                    reject(err);
                  } else {
                    this.state.delete().then(() => {
                      Redirect({}).teardown().then(resolve);
                    }).catch(reject);
                  }
                });
              }
            })
          }
        }
      }).catch(reject);
    });
  }

  resume() {
    return new Promise((resolve, reject) => {
      this.state.read().then((id) => {
        if( ! id) {
          reject(new Error('No existing profile to resume'));
        } else {
          var container = this.Docker.getContainer(id);
          if( ! container) {
            reject(new Error('Existing state. But container not found'));
          } else {
            container.start({}, (err, data) => {
              if(err) {
                reject(err, container);
              } else {
                container.inspect((err, data) => {
                  if(err) {
                    reject(new Error('Existing state. Container started. Could not determine port.'))
                  } else {
                    var port = data.Config.Env.join(',').match(/LISTEN_ON=([0-9]+)\,/)[1];
                    var redirect = Redirect({ port });
                    redirect.setup().then(() => { resolve(data, container) }).catch(reject);
                  }
                })
              }
            })
          }
        }
      })
    });
  }

  start({ port = DEFAULT_PORT }) {
    let { create, start } = this.options({ port });
    return new Promise((resolve, reject) => {
      this.Docker.createContainer(create, (err, container) => {
        if(err) {
          reject(container);
        } else {
          container.start(start, (err, data) => {
            if(err) {
              reject(err, container);
            } else {
              this.state.write(container.id).then(() => {
                var redirect = Redirect({ port });
                redirect.setup().then(() => { resolve(data, container) }).catch(reject);
              }).catch(reject);
            }
          })
        }
      });
    });
  }

  withPortMappingKey(port, value) {
    var obj = {};
    obj[`${port}/tcp`] = value
    return obj;
  }
}

export default Controller;
