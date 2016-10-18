'use strict';

import { OK, BAD_REQUEST } from '../../../constants';
import Request, { Wrap } from '../../../events/http';
import Promise from 'bluebird';
import uuid from 'uuid';
import AWS from 'aws-sdk';

const REGION = process.env.AWS_REGION;

const DELETE_API_KEY = 'deleteApiKey';

const GET_API_KEYS = 'getApiKeys';

class Delete extends Request {
  perform() {
    const { user } = this;
    if( ! user || user.length === 0) {
      this.cb(BAD_REQUEST, new Error('Missing user'));
    } else {
      this.deleteKey({ user }).then(({ value }) => {
        this.cb(OK, '');
      }).catch((err) => { this.cb(BAD_REQUEST, new Error(err.message)) });
    }
  }

  get user() {
    return this.path.user;
  }

  deleteKey({ user = this.user }) {
    return new Promise((resolve, reject) => {
      const nameQuery = `grain-${this.stage}-${user}`;
      this.gateway(GET_API_KEYS, { nameQuery, limit: 1 }).then((data) => {
        if(data.items.length !== 1) {
          reject(new Error(`No key found for "${user}"`));
        } else {
          const apiKey = data.items[0].id;
          this.gateway(DELETE_API_KEY, { apiKey }).then(resolve).catch(reject);
        }
      }).catch(reject);
    })
  }

  gateway(op, params) {
    return Promise.fromCallback(cb => new AWS.APIGateway({ region: REGION })[op](params, cb));
  }
}

export default Wrap(Delete)
