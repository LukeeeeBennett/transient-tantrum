const Cli = require('./src/Cli');

const GITLAB_PRIVATE_ACCESS_TOKEN = process.env;

Cli.init(GITLAB_PRIVATE_ACCESS_TOKEN);
