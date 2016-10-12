'use strict';

import { OK } from '../../../constants';
import Request, { Wrap } from '../../../events/http';

const REGION = process.env.AWS_REGION

class Zone extends Request {
  perform() {
    this.cb(OK, `${REGION}a`);
  }
}

export default Wrap(Zone)
