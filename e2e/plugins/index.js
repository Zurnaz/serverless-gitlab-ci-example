// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

/* eslint-disable import/no-extraneous-dependencies, global-require, arrow-body-style */

const parameters = require("../../stack.json");
module.exports = (on, config) => {
  config.defaultCommandTimeout = 10000;
  config.baseUrl = parameters.ServiceEndpoint;
  config.supportFile = "e2e/support/index.js";
  config.integrationFolder = "e2e/specs";
  config.video = false;
  config.videosFolder = "e2e/videos";
  config.screenshotsFolder = "e2e/screenshots";
  // return config
  return config;
};
