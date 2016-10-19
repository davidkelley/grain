import CLI from '../../cli';
import Controller from '../../docker/controller';

class Resume extends CLI {
  execute(profile, { profilesPath }) {
    const { cli, onError } = this;
    cli.spinner('Resuming..');
    this.profiler(profilesPath, profile).then((data) => {
      new Controller(data).resume().then(() => {
        cli.spinner('Resuming.. done!', true);
      }).catch(onError);
    }).catch(onError);
  }
}

export default Resume;
