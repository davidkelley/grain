

import CLI from '../../cli';
import Controller from '../../docker/controller';

class Stop extends CLI {
  execute({ statePath }) {
    const { cli, onError } = this;
    cli.spinner('Stopping..');
    new Controller(null, { statePath }).stop().then(() => {
      cli.spinner('Stopping.. done!', true);
    }).catch(onError);
  }
}

export default Stop;
