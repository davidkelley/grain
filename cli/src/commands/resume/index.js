'use strict';

import CLI from '../../cli';
import Controller from '../../docker/controller';

class Resume extends CLI {
  execute({ statePath }) {
    let { cli, config, onError } = this;
    cli.spinner(`Resuming..`);
    new Controller(null, { statePath }).resume().then(() => {
      cli.spinner(`Resuming.. done!`, true);
    }).catch(onError);
  }
}

export default Resume;
