const Client = require('./Client');
const setTimeoutPromise = require('./setTimeoutPromise');

const Tantrum = {
  client: undefined,
  projectPath: undefined,
  mergeRequestId: undefined,
  jobName: undefined,
  retryCount: undefined,
  pipeline: undefined,

  init() {
    this.client = Client.create(process.env.GITLAB_PRIVATE_ACCESS_TOKEN);

    return this;
  },

  run({ projectPath, mergeRequestId, jobName, retryCount }) {
    console.log('\n\nStarting tantrum...\n\n');

    this.projectPath = projectPath;
    this.mergeRequestId = mergeRequestId;
    this.jobName = jobName;
    this.retryCount = retryCount;

    return this.client
      .getLatestMergeRequestPipeline(projectPath, mergeRequestId)
      .then(pipeline => (this.pipeline = pipeline))
      .then(pipeline =>
        this.client.getLatestJobByName(projectPath, pipeline.id, jobName),
      )
      .then(job => this.report(job));
  },

  checkJob(job) {
    console.log('Checking pipeline in 3 minutes...');

    return setTimeoutPromise(60 * 1000 * 3)
      .then(() => this.client.getJob(this.projectPath, job.id))
      .then(job => this.report(job));
  },

  report(job) {
    console.log(`The ${job.name} jobs status is currently "${job.status}".`);

    if (job.status === 'failed') return this.reportFailure();
    if (job.status == 'success' || job.status == 'canceled')
      return this.retryJob(job);

    return this.checkJob(job);
  },

  reportFailure() {
    console.log('reportFailure - TODO');
  },

  retryJob(job) {
    if (this.retryCount === 0) {
      console.log('Tantrum complete.');
      return;
    }

    return this.client.retryJob(this.projectPath, job.id).then(job => {
      this.retryCount -= 1;
      return this.checkJob(job);
    });
  },
};

module.exports = Tantrum;
