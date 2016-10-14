import Promise from 'bluebird';
import request from 'request';

import Controller from '../../docker/controller';
import CLI from '../../cli';
import Profiler from '../../profiler';

class Use extends CLI {

  execute(profile, { profilesPath, statePath, image }) {
    const { cli } = this;
    return new Promise((resolve, reject) => {
      cli.spinner(`Switching profile to ${profile}..`);
      this.profiler({ profilesPath, profile }).then((data) => {
        this.container({ data, image, statePath }).then(() => {
          cli.spinner(`Switching profile to ${profile}.. done!`, true);
          resolve(profile);
        });
      })
    });
  }

  profiler({ profilesPath, profile }) {
    return new Promise((resolve, reject) => {
      new Profiler({ profilesPath }).profile(profile).then((data) => {
        resolve(data);
      }).catch(this.onError)
        .catch(reject);
    });
  }

  container({ data, image, statePath }) {
    return new Promise((resolve, reject) => {
      const controller = new Controller(data, { image, statePath });
      controller.stop({}).then(() => {
        controller.start({}).then(() => {
          this.check().then(resolve).catch(reject);
        }).catch(this.onError)
          .catch(reject);
      });
    });
  }

  check() {
    const ip = 'http://169.254.169.254';
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        request(`${ip}/latest/meta-data/iam/security-credentials`, (err, res, body) => {
          if (err) {
            reject(new Error('Started but Server may be down.'));
          } else {
            resolve();
          }
        });
      }, 5000);
    })
  }

}

export default Use;
