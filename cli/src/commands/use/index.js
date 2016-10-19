import Promise from 'bluebird';
import request from 'request';

import Controller from '../../docker/controller';
import CLI from '../../cli';

class Use extends CLI {

  execute(profile, { profilesPath, statePath, image }) {
    const { cli } = this;
    return new Promise((resolve, reject) => {
      cli.spinner(`Switching profile to ${profile}..`);
      this.profiler(profilesPath, profile).then((data) => {
        this.container({ data }).then(() => {
          cli.spinner(`Switching profile to ${profile}.. done!`, true);
          resolve(profile);
        });
      }).catch(this.onError);
    });
  }

  container({ data }) {
    return new Promise((resolve, reject) => {
      const controller = new Controller(data);
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
