'use strict';

import { OK } from '../../events/constants';
import Request, { Wrap } from '../../events/http';

const REGION = process.env.AWS_REGION

class Hostname extends Request {
  perform() {
    this.cb(OK, `ec2-0-0-0-0.${REGION}.compute.amazonaws.com`);
  }
}

export default Wrap(Hostname)
