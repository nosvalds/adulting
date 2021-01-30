const ghpages = require('gh-pages');
require('dotenv').config()

/**
 * This task pushes to the `main` branch of the configured `repo`.
 */
ghpages.publish('dist', {
    dotfiles: true,
    branch: 'main',
    repo: process.env.DEPLOYMENT_URL
  }, (err) => {
      if (err) {
        console.log(`Error deploying to ${process.env.DEPLOYMENT_URL}: ${err}`)
      }
  });