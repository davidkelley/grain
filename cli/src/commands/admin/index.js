import Promise from 'bluebird';
import request from 'request';

import CLI from '../../cli';

class Admin extends CLI {
  execute(action, profile, user) {
    const { cli, onError } = this;
    return new Promise((resolve, reject) => {
      this.profiler(profile).then((data) => {
        if( ! this[action] || typeof(this[action]) !== 'function') {
          cli.fatal(`Unknown admin command "${action}"`)
        } else {
          this[action](`https://${data.endpoint}`, user, data.headers).then((url) => {
            if(action === 'create') {
              cli.ok(url);
            } else {
              cli.ok(`Removed user "${user}"`)
            }
          });
        }
      }).catch(onError);
    });
  }

  create(url, user, headers) {
    return new Promise((resolve, reject) => {
      request.post({
        url: `${url}/admin`,
        form: { user },
        headers: headers
      }, (err, res, body) => {
        if(err) {
          reject(res, body);
        } else {
          resolve(body);
        }
      });
    });
  }

  remove(url, user, headers) {
    return new Promise((resolve, reject) => {
      request.delete({
        url: `${url}/admin/${user}`,
        headers: headers
      }, (err, res, body) => {
        if(err) {
          reject(res, body);
        } else {
          resolve(body);
        }
      });
    });
  }

  onHttpError(res, body) {
    if (res && res.statusCode) {
      this.cli.fatal(`HTTP Error (${res.statusCode}): ${body}`);
    } else {
      this.cli.fatal('Error: Unknown Error');
    }
  }
}

export default Admin;
