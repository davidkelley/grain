import Promise from 'bluebird';

import Controller from '../../docker/controller';
import CLI from '../../cli';
import Profiler from '../../profiler';

class Use extends CLI {

  execute(profile, { profilesPath, statePath, image }) {
    const { cli, onError } = this;
    return new Promise((resolve, reject) => {
      new Profiler({ profilesPath }).profile(profile).then((data) => {
        cli.spinner(`Switching profile to ${profile}..`);
        const controller = new Controller(data, { image, statePath });
        controller.stop({}).then(() => {
          controller.start({}).then(() => {
            cli.spinner(`Switching profile to ${profile}.. done!`, true);
            resolve(profile);
          }).catch(onError)
            .catch(reject);
        });
      }).catch(onError)
        .catch(reject);
    });
  }

}

export default Use;
