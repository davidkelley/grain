import Promise from 'bluebird';
import request from 'request';

import Controller from '../../docker/controller';
import CLI from '../../cli';

class Use extends CLI {

  execute(profile) {
    const { cli } = this;
    return new Promise((resolve, reject) => {
      cli.spinner(`Switching profile to ${profile}..`);
      this.profiler(profile).then((data) => {
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
      controller.stop().then(() => {
        controller.start().then(() => {
          const { ip } = data;
          const url = `http://${ip}`;
          this.check({ url }).then(resolve).catch(reject);
        }).catch(this.onError)
          .catch(reject);
      });
    });
  }

  check({ url }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        request(`${url}/latest/meta-data/iam/security-credentials`, (err, res, body) => {
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
