const ghpages = require('gh-pages');
require('dotenv').config()

/**
 * This task pushes to the `main` branch of the configured `repo`.
 */
ghpages.publish(process.env.DEPLOYMENT_DIRECTORY, {
    dotfiles: true,
    branch: process.env.SOURCE_BRANCH,
    repo: process.env.DEPLOYMENT_URL
  }, (err) => {
      if (err) {
        console.log(`Error deploying to ${process.env.DEPLOYMENT_URL}: ${err}`)
      }
  });