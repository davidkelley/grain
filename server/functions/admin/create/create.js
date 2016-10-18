'use strict';

import { CREATED, BAD_REQUEST } from '../../../constants';
import Request, { Wrap } from '../../../events/http';
import Promise from 'bluebird';
import uuid from 'uuid';
import AWS from 'aws-sdk';

const REGION = process.env.AWS_REGION;

const CREATE_API_KEY = 'createApiKey'

const PUT_OBJECT = 'putObject';

const GET_SIGNED_URL = 'getSignedUrl';

class Create extends Request {
  perform() {
    const { user } = this.body;
    if( ! user || user.length === 0) {
      this.cb(BAD_REQUEST, new Error('Missing user'));
    } else {
      this.createKey({ user }).then(({ value }) => {
        this.createProfile({ user, key: value }).then((url) => {
          this.cb(CREATED, url);
        }).catch((err) => { this.cb(BAD_REQUEST, new Error(err.message)) });
      }).catch((err) => { this.cb(BAD_REQUEST, new Error(err.message)) });
    }
  }

  get bucket() {
    return `grain-${this.accountId}-${this.stage}-${REGION}`;
  }

  createKey({ user = 'default' }) {
    return this.gateway(CREATE_API_KEY, {
      name: `grain-${this.stage}-${user}`,
      enabled: true,
      generateDistinctId: true,
      stageKeys: [{
        restApiId: this.apiId,
        stageName: this.stage
      }]
    });
  }

  createProfile({ user, key }) {
    const id = uuid.v4();
    const body = this.profileBody({ user, key, id: this.apiId, level: this.stage, region: REGION });
    const { bucket } = this;
    return new Promise((resolve, reject) => {
      const params = { Bucket: bucket, Key: id, Body: body };
      this.S3(PUT_OBJECT, params).then(() => {
        const toSign = { Bucket: bucket, Key: id, Expires: 60 };
        const url = new AWS.S3({ region: REGION }).getSignedUrl('getObject', toSign);
        resolve(url);
      }).catch(reject);
    });
  }

  profileBody(obj) {
    var lines = [`[${this.stage}]`];
    Object.keys(obj).forEach(key => lines.push(`${key}="${obj[key]}"`));
    return lines.join("\n");
  }

  S3(op, params) {
    return Promise.fromCallback(cb => new AWS.S3({ region: REGION })[op](params, cb));
  }

  gateway(op, params) {
    return Promise.fromCallback(cb => new AWS.APIGateway({ region: REGION })[op](params, cb));
  }
}

export default Wrap(Create)
