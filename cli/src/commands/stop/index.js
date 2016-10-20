import CLI from '../../cli';
import Controller from '../../docker/controller';

class Stop extends CLI {
  execute(profile) {
    const { cli, onError } = this;
    cli.spinner('Stopping..');
    this.profiler(profile).then((data) => {
      new Controller(data).stop().then(() => {
        cli.spinner('Stopping.. done!', true);
      }).catch(onError);
    }).catch(onError);
  }
}

export default Stop;
