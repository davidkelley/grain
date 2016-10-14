import Promise from 'bluebird';
import request from 'request';
import shell from 'shelljs';

import CLI from '../../cli';

const FEDERATION_URL = 'https://signin.aws.amazon.com/federation';

const CONSOLE_URL = 'https://console.aws.amazon.com/';

class Login extends CLI {
  execute(alias, page = '') {
    const { cli } = this;
    return new Promise((resolve, reject) => {
      if (!alias) {
        cli.fatal('--alias is required. Found here: https://<alias>.signin.aws.amazon.com/');
      } else {
        cli.spinner('Opening AWS console..');
        this.url('http://169.254.169.254', alias, page).then((url) => {
          const open = shell.exec(`open "${url}"`, { silent: true });
          if (open.code !== 0) {
            cli.fatal(`Unable to open URL: "${url}"`);
            reject();
          } else {
            cli.spinner('Opening AWS console.. done!', true);
            resolve();
          }
        }).catch(reject);
      }
    });
  }

  url(root, alias, page = '') {
    return new Promise((resolve, reject) => {
      this.token(root).then((token) => {
        const issuer = encodeURIComponent(`https://${alias}.signin.aws.amazon.com/`);
        const destination = encodeURIComponent(`${CONSOLE_URL}/${page}`);
        const query = `Action=login&Issuer=${issuer}&Destination=${destination}&SigninToken=${token}`;
        const url = `${FEDERATION_URL}?${query}`;
        resolve(url);
      }).catch(reject);
    }).catch(this.onHttpError);
  }

  token(root) {
    return new Promise((resolve, reject) => {
      this.credentials(root).then((keys) => {
        const encoded = encodeURIComponent(JSON.stringify(keys));
        const query = `Action=getSigninToken&Session=${encoded}`;
        request(`${FEDERATION_URL}?${query}`, (err, res, body) => {
          if (err) {
            reject(body);
          } else {
            const json = JSON.parse(body);
            resolve(json.SigninToken);
          }
        });
      });
    }).catch(this.onHttpError);
  }

  credentials(root) {
    return new Promise((resolve, reject) => {
      this.role(root).then((role) => {
        request(`${root}/latest/meta-data/iam/security-credentials/${role}`, (err, res, body) => {
          if (err) {
            reject(res, body);
          } else {
            const json = JSON.parse(body);
            resolve({
              sessionId: json.AccessKeyId,
              sessionKey: json.SecretAccessKey,
              sessionToken: json.Token,
            });
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

export default Login;
