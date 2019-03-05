# transient-tantrum

> Target a GitLab CI job to retry N times to find transient failures.

This CLI tool is intended to be used for MRs that include potential fixes for
transient failures on GitLab CI.

If you think you have found a fix for a transient failure, you can retry
the job a number of times to increase your confidence in the fix.
This is not a replacement for debugging. You must still understand your fix.

____

⚠️️️ **NOT TESTED AND MESSY** ⚠️️

Ultimately, it cannot do anything but `GET` Merge requests, Pipelines and Jobs, and `POST` to retry Jobs. But still, don't throw a _tantrum_ if it doesn't work. Feel free to DM me or open an issue if you want to give this a go but are having problems.

____

## Usage

1. [Create a GitLab personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#creating-a-personal-access-token)
1. Clone this repo
1. Make `./transient-tantrum` an executable
  - To achieve this, execute `chmod +x ./transient-tantrum` or `yarn setup`.
1. Execute `GITLAB_PRIVATE_ACCESS_TOKEN=YOUR_GITLAB_PRIVATE_ACCESS_TOKEN ./transient-tantrum <projectPath> <mergeRequestId> <jobName> [retryCount]`
  - `projectPath`: The namespace name and project name, separated by a slash. e.g. `gitlab-org/gitlab-ce`
  - `mergeRequestId`: The Merge request ID. e.g. `23033`
  - `jobName`: The name of the job to test for transients. e.g. `karma`
  - `retryCount`: The number of times you would like to retry the job on success. **Default: 5**

```
$ ./transient-tantrum -h
transient-tantrum <projectPath> <mergeRequestId> <jobName> [retryCount]

start a transient tantrum on a specific job for a given merge request

Positionals:
  projectPath     Path to the project containing the MR to test e.g.
                  gitlab-org/gitlab-ce.
  mergeRequestId  ID of the Merge request to test e.g. 1234.
  jobName         Name of the job to retry, e.g. karma, or "docs lint".
  retryCount      Number of times to retry the job if it succeeds   [default: 5]

Options:
  --version   Show version number                                      [boolean]
  -h, --help  Show help                                                [boolean]

Not enough non-option arguments: got 0, need at least 3
```

## Example

```
$ ./transient-tantrum gitlab-org/gitlab-ce 23033 karma 1


Starting tantrum...


Getting latest pipeline for gitlab-org/gitlab-ce!23033...
Getting pipelines for gitlab-org/gitlab-ce!23033...
Finding karma job...
Getting jobs for pipeline #36508658...
Getting jobs for pipeline #36508658...
Getting jobs for pipeline #36508658...
The karma jobs status is currently "running".
Checking pipeline in 3 minutes...
Getting job...
The karma jobs status is currently "running".
Checking pipeline in 3 minutes...
Getting job...
The karma jobs status is currently "running".
Checking pipeline in 3 minutes...
Getting job...
The karma jobs status is currently "running".
Checking pipeline in 3 minutes...
Getting job...
The karma jobs status is currently "success".
Retrying job...
Checking pipeline in 3 minutes...
Getting job...
The karma jobs status is currently "running".
Checking pipeline in 3 minutes...
Getting job...
The karma jobs status is currently "running".
Checking pipeline in 3 minutes...
Getting job...
The karma jobs status is currently "running".
Checking pipeline in 3 minutes...
Getting job...
The karma jobs status is currently "success".
Tantrum complete.
✨  Done in 1465.05s.
```