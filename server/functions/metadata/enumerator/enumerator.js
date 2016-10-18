'use strict';

import { OK, PATH } from '../../../constants';
import Request, { Wrap } from '../../../events/http';
import Promise from 'bluebird';
import AWS from 'aws-sdk';

const REGION = process.env.AWS_REGION;

const LIST_ROLES = 'listRoles';

class Enumerator extends Request {
  perform() {
    let { cb, stage } = this;
    this.iam(LIST_ROLES, { PathPrefix: `${PATH}/${REGION}/${stage}` }).then((data) => {
      cb(OK, data.Roles.map(r => r.RoleName).join("\n"));
    });
  }

  iam(op, params) {
    return Promise.fromCallback(cb => new AWS.IAM({ region: REGION })[op](params, cb));
  }
}

export default Wrap(Enumerator)
