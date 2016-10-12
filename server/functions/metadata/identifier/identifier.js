'use strict';

import { OK, ROLE } from '../../../constants';
import Request, { Wrap } from '../../../events/http';

class Identifier extends Request {
  perform() {
    this.cb(OK, `i-${ROLE}`);
  }
}

export default Wrap(Identifier)
