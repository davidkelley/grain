'use strict';

import { OK, ERROR } from '../../../constants';
import Request, { Wrap } from '../../../events/http';
import Promise from 'bluebird';
import moment from 'moment';
import AWS from 'aws-sdk';

const REGION = process.env.AWS_REGION

const ASSUME_ROLE = 'assumeRole';

const GET_ROLE = 'getRole';

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
    cb(OK, this.event);
    // this.iam(GET_ROLE, { RoleName: this.role }).then((data) => {
    //   var arn = data.Role.Arn;
    //   this.sts(ASSUME_ROLE, { RoleArn: arn, ...this.params }).then((data) => {
    //     cb(OK, response(data))
    //   }).catch(err => cb(ERROR, err));
    // }).catch(err => cb(ERROR, err));
  }

  iam(op, params) {
    return Promise.fromCallback(cb => new AWS.IAM({ region: REGION })[op](params, cb));
  }

  sts(op, params) {
    return Promise.fromCallback(cb => new AWS.STS({ region: REGION })[op](params, cb));
  }
}

export default Wrap(Credentials)
