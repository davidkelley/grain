import Promise from 'bluebird';
import request from 'request';

import CLI from '../../cli';

class Env extends CLI {
  execute(profile) {
    const { cli, onError } = this;
    return new Promise((resolve, reject) => {
      this.profiler(profile).then((data) => {
        this.credentials(`http://${data.endpoint}`, data.headers).then((credentials) => {
          const region = `AWS_REGION=${data.region}`
          const id = `AWS_ACCESS_KEY_ID=${credentials.AccessKeyId}`;
          const secret = `AWS_SECRET_ACCESS_KEY=${credentials.SecretAccessKey}`;
          console.log(`${region} ${id} ${secret}`);
        }).catch(reject);
      }).catch(onError);
    });
  }

  credentials(url, headers) {
    return new Promise((resolve, reject) => {
      this.role(url, headers).then((role) => {
        url = `${url}/latest/meta-data/iam/security-credentials/${role}`;
        request({ url, headers }, (err, res, body) => {
          if (err) {
            reject(res, body);
          } else {
            resolve(JSON.parse(body));
          }
        });
      });
    });
  }

  role(url, headers) {
    return new Promise((resolve, reject) => {
      url = `${url}/latest/meta-data/iam/security-credentials`;
      request({ url, headers }, (err, res, body) => {
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
