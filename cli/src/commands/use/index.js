'use strict';

import CLI from '../../cli';

class Use extends CLI {
  execute() {
    this.cli.ok("USE ME!");
  }
}

export default Use;
