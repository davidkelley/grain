import Promise from 'bluebird';
import request from 'request';

import CLI from '../../cli';

class Env extends CLI {
  execute(profile, region, { profilesPath }) {
    const { cli, credentials, onError } = this;
    return new Promise((resolve, reject) => {
      if(!region) {
        reject(new Error('You must specify an AWS region.'))
      } else {
        this.profiler(profilesPath, profile).then((data) => {
          credentials(`http://${data.ip}`).then((credentials) => {
            const region = `AWS_REGION=${region}`
            const id = `AWS_ACCESS_KEY_ID=${credentials.AccessKeyId}`;
            const secret = `AWS_SECRET_ACCESS_KEY=${credentials.SecretAccessKey}`;
            console.log(`${region} ${id} ${secret}`);
          }).catch(reject);
        }).catch(onError);
      }
    });
  }

  credentials(root) {
    return new Promise((resolve, reject) => {
      this.role(root).then((role) => {
        request(`${root}/latest/meta-data/iam/security-credentials/${role}`, (err, res, body) => {
          if (err) {
            reject(res, body);
          } else {
            resolve(JSON.parse(body));
          }
        });
      });
    });
  }

  role(root) {
    return new Promise((resolve, reject) => {
      request(`${root}/latest/meta-data/iam/security-credentials`, (err, res, body) => {
        if (err) {
          reject(res, body);
        } else {
          resolve(body);
        }
      });
    }).catch(this.onHttpError);
  }

  onHttpError(res, body) {
    if (res && res.statusCode) {
      this.cli.fatal(`HTTP Error (${res.statusCode}): ${body}`);
    } else {
      this.cli.fatal('Error: Unknown Error');
    }
  }
}

export default Env;
