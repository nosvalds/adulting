const ghpages = require('gh-pages');
require('dotenv').config()

/**
 * This task pushes to the `main` branch of the configured `repo`.
 */
console.log(typeof process.env.DESTINATION_GIT_URL)
console.log(typeof process.env.SOURCE_DEPLOYMENT_DIRECTORY)
console.log(typeof process.env.DESTINATION_GIT_BRANCH)

ghpages.publish(process.env.SOURCE_DEPLOYMENT_DIRECTORY, {
    dotfiles: true,
    branch: process.env.DESTINATION_GIT_BRANCH,
    repo: process.env.DESTINATION_GIT_URL
  }, (err) => {
      if (err) {
        console.log(`Error deploying to ${process.env.DESTINATION_GIT_URL}: ${err}`)
      }
    });