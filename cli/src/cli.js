import cli from 'cli';

class CLI {
  get cli() {
    return cli;
  }

  onError(err) {
    if (err) {
      if (err.statusCode) {
        cli.fatal(`Docker: (${err.statusCode}) ${err.reason}`);
      } else {
        cli.fatal(`Error: ${err.message}`);
      }
    } else {
      cli.fatal('Error: Unknown Error');
    }
  }
}

export default CLI;
