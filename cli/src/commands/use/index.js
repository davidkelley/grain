'use strict';

import Controller from '../../docker/controller';
import CLI from '../../cli';
import Profiler from '../../profiler';
import Promise from 'bluebird';

class Use extends CLI {

  execute(profile, { profilesPath, statePath, image }) {
    let { cli, config, onError } = this;
    return new Promise((resolve, reject) => {
      new Profiler({ profilesPath }).profile(profile).then((data) => {
        cli.spinner(`Switching profile to ${profile}..`);
        var controller = new Controller(data, { image, statePath });
        controller.stop({}).then(() => {
          return controller.start({}).then(() => {
            cli.spinner(`Switching profile to ${profile}.. done!`, true);
            resolve(profile);
          });
        })
      }).catch(onError).catch(reject);
    });
  }

}

export default Use;
