# adulting

## Why

My girlfriend and I use the [Splitwise](https://secure.splitwise.com/) app to keep track of all our shared expenses. Since we pay with a shared account we don't actually use the "splitting" feature in splitwise and it takes a ton of clicks in the app to say you paid for equal shares of something. We also only use 4 main categories for our expenses.

I built this basic Vue.js app to simplify our expense tracking given the above.

## What

It's a single form that sends a POST request to the [Splitwise API](http://dev.splitwise.com/#introduction). The front end takes care of the logic that we would have to do numerous clicks in the Splitwise app to accomplish since we pay with a shared card and don't actually need to split the expenses.

To communicate with the Splitwise API securely I used the available [OAuth2](http://dev.splitwise.com/#authentication) authentication. I used [Pizzly](https://github.com/Bearer/Pizzly) to handle the complexity of OAuth2 so I didn't have to do it myself. I configured and hosted a Pizzly instance of my own on Heroku, after adding Splitwise as a supported integration in a [PR](https://github.com/Bearer/Pizzly/pull/188).

This was my first foray into Vue.js, which helped me learn for my work on [DigitalHumani](https://digitalhumani.com)'s new dashboard. I used vue-material as my UI kit.

## Env Vars

```
cp .example.env.development .env.development
cp .example.env.development .env.production
```

`VUE_APP_PIZZLY_URL=`

- URL of my Pizzly instance on Heroku

```
cp .example.env .env
```

`DESTINATION_GIT_URL=`

`SOURCE_DEPLOYMENT_DIRECTORY='dist'`

`DESTINATION_GIT_BRANCH='gh-pages'`

- Customized setup for gh-pages to push to my rented web server

## Deployment

This command builds the Vue.js app for production and then uses the gh-pages library to push the `/dist` directory to the web server I use for my personal website and projects (for environmental purposes). This could easily be hosted on GitHub pages without additional configuration for the gh-pages plugin.

```
npm run deploy
```

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
