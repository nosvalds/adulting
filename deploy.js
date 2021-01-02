const ghpages = require('gh-pages');

/**
 * This task pushes to the `main` branch of the configured `repo`.
 */
ghpages.publish('dist', {
    dotfiles: true,
    branch: 'main',
    repo: 'ssh://nikolaso@nikolaso.com:22007/home/nikolaso/adulting'
  }, (err) => {
      if (err) {
        console.log("Error deploying to adulting.nikolaso.com " + err)
      }
  });