'use strict';

import Controller from '../../docker/controller';
import CLI from '../../cli';
import Profiler from './profiler';

class Use extends CLI {

  execute(profile, { profilesPath, statePath, image }) {
    let { cli, config, onError } = this;
    new Profiler({ profilesPath }).profile(profile).then((data) => {
      cli.spinner(`Switching profile to ${profile}..`);
      var controller = new Controller(data, { image, statePath });
      controller.stop({}).then(() => {
        return controller.start({}).then(() => {
          cli.spinner(`Switching profile to ${profile}.. done!`, true);
        });
      })
    }).catch(onError);
  }

}

export default Use;
