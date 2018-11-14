const axios = require('axios');

const Client = {
  client: undefined,

  create(GITLAB_PRIVATE_ACCESS_TOKEN) {
    this.client = axios.create({
      baseURL: 'https://gitlab.com/api/v4',
      headers: {
        'PRIVATE-TOKEN': GITLAB_PRIVATE_ACCESS_TOKEN,
      },
    });

    return this;
  },

  getMergeRequestPipelines(projectPath, mergeRequestId) {
    console.log(`Getting pipelines for ${projectPath}!${mergeRequestId}...`);

    const encodedProjectPath = encodeURIComponent(projectPath);

    return this.client
      .get(
        `/projects/${encodedProjectPath}/merge_requests/${mergeRequestId}/pipelines`,
      )
      .then(({ data }) => data);
  },

  getLatestMergeRequestPipeline(projectPath, mergeRequestId) {
    console.log(
      `Getting latest pipeline for ${projectPath}!${mergeRequestId}...`,
    );

    return this.getMergeRequestPipelines(projectPath, mergeRequestId).then(
      pipelines => pipelines[0],
    );
  },

  getPipelineJobs(projectPath, pipelineId, page = 1, allJobs = []) {
    console.log(`Getting jobs for pipeline #${pipelineId}...`);

    const encodedProjectPath = encodeURIComponent(projectPath);

    return this.client
      .get(`/projects/${encodedProjectPath}/pipelines/${pipelineId}/jobs`, {
        params: {
          per_page: 100,
          page,
        },
      })
      .then(({ data }) => {
        if (data.length === 0) return allJobs;

        allJobs = allJobs.concat(data);

        return this.getPipelineJobs(projectPath, pipelineId, page + 1, allJobs);
      });
  },

  getLatestJobByName(projectPath, pipelineId, jobName) {
    console.log(`Finding ${jobName} job...`);

    return this.getPipelineJobs(projectPath, pipelineId).then(jobs => {
      const filteredJobs = jobs.filter(job => job.name === jobName);

      return filteredJobs[filteredJobs.length - 1];
    });
  },

  getJob(projectPath, jobId) {
    console.log(`Getting job...`);

    const encodedProjectPath = encodeURIComponent(projectPath);

    return this.client
      .get(`/projects/${encodedProjectPath}/jobs/${jobId}`)
      .then(({ data }) => data);
  },

  retryJob(projectPath, jobId) {
    console.log(`Retrying job...`);

    const encodedProjectPath = encodeURIComponent(projectPath);

    return this.client
      .post(`/projects/${encodedProjectPath}/jobs/${jobId}/retry`)
      .then(({ data }) => data);
  },
};

module.exports = Client;
