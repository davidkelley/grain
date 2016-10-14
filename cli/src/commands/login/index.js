'use strict';

import CLI from '../../cli';
import Controller from '../../docker/controller';
import Promise from 'bluebird';
import request from 'request';
import shell from 'shelljs';

const FEDERATION_URL = 'https://signin.aws.amazon.com/federation';

const CONSOLE_URL = 'https://console.aws.amazon.com/';

class Login extends CLI {
  execute(alias, page = '') {
    let { cli } = this;
    if( ! alias) {
      cli.fatal('--alias is required. Found here: https://<alias>.signin.aws.amazon.com/');
    } else {
      return new Promise((resolve, reject) => {
        cli.spinner('Opening AWS console..');
        this.url(`http://169.254.169.254`, alias, page).then((url) => {
          var open = shell.exec(`open "${url}"`, { silent: true });
          if(open.code !== 0) {
            cli.fatal(`Unable to open URL: "${url}"`);
            reject();
          } else {
            cli.spinner('Opening AWS console.. done!', true);
            resolve();
          }
        }).catch(reject);
      });
    }
  }

  url(root, alias, page = '') {
    return new Promise((resolve, reject) => {
      this.token(root).then((token) => {
        var issuer = encodeURIComponent(`https://${alias}.signin.aws.amazon.com/`);
        var destination = encodeURIComponent(`${CONSOLE_URL}/${page}`);
        var query = `Action=login&Issuer=${issuer}&Destination=${destination}&SigninToken=${token}`
        var url = `${FEDERATION_URL}?${query}`;
        resolve(url);
      });
    }).catch(this.onHttpError);
  }

  token(root) {
    return new Promise((resolve, reject) => {
      this.credentials(root).then((keys) => {
        var encoded = encodeURIComponent(JSON.stringify(keys));
        var query = `Action=getSigninToken&Session=${encoded}`;
        request(`${FEDERATION_URL}?${query}`, (err, res, body) => {
          if(err) {
            reject(body);
          } else {
            var json = JSON.parse(body);
            resolve(json.SigninToken);
          }
        })
      });
    }).catch(this.onHttpError);
  }

  credentials(root) {
    return new Promise((resolve, reject) => {
      this.role(root).then((role) => {
        request(`${root}/latest/meta-data/iam/security-credentials/${role}`, (err, res, body) => {
          if(err) {
            reject(res, body);
          } else {
            var json = JSON.parse(body);
            resolve({
              sessionId: json.AccessKeyId,
              sessionKey: json.SecretAccessKey,
              sessionToken: json.Token
            })
          }
        });
      });
    });
  }

  role(root) {
    return new Promise((resolve, reject) => {
      request(`${root}/latest/meta-data/iam/security-credentials`, (err, res, body) => {
        if(err) {
          reject(res, body);
        } else {
          resolve(body)
        }
      });
    }).catch(this.onHttpError);
  }

  onHttpError(res, body) {
    if(res && res.statusCode) {
      cli.fatal(`HTTP Error (${res.statusCode}): ${body}`);
    } else {
      cli.fatal(`Error: Unknown Error`);
    }
  }
}

export default Login;
