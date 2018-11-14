const Yargs = require('yargs');
const Tantrum = require('./Tantrum');

const Cli = {
  tantrum: undefined,
  GITLAB_PRIVATE_ACCESS_TOKEN: undefined,

  init(GITLAB_PRIVATE_ACCESS_TOKEN) {
    this.tantrum = Tantrum.init(GITLAB_PRIVATE_ACCESS_TOKEN);

    this.configureYargs().argv;
  },

  setupPositionalYargs(yargs) {
    return yargs
      .positional('projectPath', {
        describe:
          'Path to the project containing the MR to test e.g. gitlab-org/gitlab-ce.',
      })
      .positional('mergeRequestId', {
        describe: 'ID of the Merge request to test e.g. 1234.',
      })
      .positional('jobName', {
        describe: 'Name of the job to retry, e.g. karma, or "docs lint".',
      })
      .positional('retryCount', {
        describe: 'Number of times to retry the job if it succeeds',
        default: 5,
      });
  },

  configureYargs() {
    return Yargs.command(
      '* <projectPath> <mergeRequestId> <jobName> [retryCount]',
      'start a transient tantrum on a specific job for a given merge request',
      yargs => this.setupPositionalYargs(yargs),
      argv => this.tantrum.run(argv),
    ).alias('h', 'help');
  },
};

module.exports = Cli;
