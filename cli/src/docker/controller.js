import Docker from 'dockerode';
import Promise from 'bluebird';
import shell from 'shelljs';

import { DEFAULT_LEVEL, DEFAULT_REGION, DEFAULT_PORT } from '../constants';
import State from './state';
import redirect from './redirect';

class Controller {
  constructor(profile) {
    this.profile = profile;
    if(this.profile && this.profile.state) {
      this.state = new State(this.profile.state.replace(/^~/, process.env.HOME));
    }
  }

  get Docker() {
    return new Docker();
  }

  get secret() {
    return this.profile.key;
  }

  get identifier() {
    const user = this.profile.user || 'user';
    const hostname = shell.exec('hostname', { silent: true });

    let name;
    if (hostname.code !== 0) {
      name = `${user}@unknown`;
    } else {
      const host = hostname.stdout.replace(/(\r\n|\n|\r)/gm, '');
      name = `${user}@${host}`;
    }
    return name;
  }

  options() {
    const { withPortMappingKey, secret, identifier } = this;
    const { port, image, endpoint } = this.profile;
    return {
      create: {
        Image: image,
        Tty: false,
        Env: [
          `GRAIN_SECRET=${secret}`,
          `GRAIN_ENDPOINT=${endpoint}`,
          `GRAIN_IDENTIFIER=${identifier}`,
          `LISTEN_ON=${port}`,
          'SERVER_NAME=127.0.0.1',
        ],
        ExposedPorts: withPortMappingKey(port, {}),
        HostConfig: {
          PortBindings: withPortMappingKey(port, [{ HostPort: `${port}` }]),
        },
      },
      start: {},
    };
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.state.read().then((id) => {
        if (!id) {
          resolve();
        } else {
          const container = this.Docker.getContainer(id);
          if (!container) {
            resolve();
          } else {
            container.stop((stopErr) => {
              if (stopErr && stopErr.statusCode !== 304) {
                reject(stopErr);
              } else {
                container.remove((removeErr) => {
                  if (removeErr) {
                    reject(removeErr);
                  } else {
                    this.state.delete().then(() => {
                      redirect({}).teardown().then(resolve);
                    }).catch(reject);
                  }
                });
              }
            });
          }
        }
      }).catch(reject);
    });
  }

  resume() {
    return new Promise((resolve, reject) => {
      const { ip } = this.profile;
      this.state.read().then((id) => {
        if (!id) {
          reject(new Error('No existing profile to resume'));
        } else {
          const container = this.Docker.getContainer(id);
          if (!container) {
            reject(new Error('Existing state. But container not found'));
          } else {
            container.start({}, (startErr) => {
              if (startErr) {
                reject(startErr, container);
              } else {
                container.inspect((inspectErr, data) => {
                  if (inspectErr) {
                    reject(new Error('Existing state. Container started. Could not determine port.'));
                  } else {
                    const port = data.Config.Env.join(',').match(/LISTEN_ON=([0-9]+)\,/)[1];
                    const redirector = redirect({ port, ip });
                    redirector.setup().then(() => { resolve(data, container); }).catch(reject);
                  }
                });
              }
            });
          }
        }
      });
    });
  }

  start() {
    const { create, start } = this.options();
    const { port, ip } = this.profile;
    return new Promise((resolve, reject) => {
      this.Docker.createContainer(create, (createErr, container) => {
        if (createErr) {
          reject(createErr, container);
        } else {
          container.start(start, (startErr, data) => {
            if (startErr) {
              reject(startErr, container);
            } else {
              this.state.write(container.id).then(() => {
                const redirector = redirect({ port, ip });
                redirector.setup().then(() => { resolve(data, container); }).catch(reject);
              }).catch(reject);
            }
          });
        }
      });
    });
  }

  withPortMappingKey(port, value) {
    const obj = {};
    obj[`${port}/tcp`] = value;
    return obj;
  }
}

export default Controller;
