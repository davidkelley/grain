'use strict';

import { OK, ERROR } from '../../events/constants';
import Request, { Wrap } from '../../events/http';
import Promise from 'bluebird';
import moment from 'moment';
import AWS from 'aws-sdk';

const REGION = process.env.AWS_REGION

class Credentials extends Request {
  get identifier() {
    return this.headers['X-Session-Identifier'];
  }

  get role() {
    return this.path.role;
  }

  get params() {
    return {
      RoleSessionName: this.identifier
    }
  }

  response(data) {
    let { AccessKeyId, SecretAccessKey, Expiration } = data.Credentials;
    return {
      Code: "Success",
      LastUpdated: moment.utc().toISOString(),
      Type: "AWS-HMAC",
      Token: data.SessionToken,
      Expiration: moment(Expiration).toISOString(),
      AccessKeyId,
      SecretAccessKey
    }
  }

  perform() {
    let { cb, response } = this;
    this.iam('getRole', { RoleName: this.role }).then((data) => {
      var arn = data.Role.Arn;
      this.sts('assumeRole', { RoleArn: arn, ...this.params }).then((data) => {
        cb(OK, response(data))
      }).catch(err => cb(ERROR, err));
    }).catch(err => cb(ERROR, err));
  }

  iam(op, params) {
    return Promise.fromCallback(cb => new AWS.IAM({ region: REGION })[op](params, cb));
  }

  sts(op, params) {
    return Promise.fromCallback(cb => new AWS.STS({ region: REGION })[op](params, cb));
  }
}

export default Wrap(Credentials)
