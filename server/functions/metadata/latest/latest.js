'use strict';

import { OK } from '../../../constants';
import Request, { Wrap } from '../../../events/http';

class Latest extends Request {
  perform() {
    this.cb(OK, 'meta-data');
  }
}

export default Wrap(Latest)
