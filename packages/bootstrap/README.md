[![Build Status](https://travis-ci.org/baethon/udbajs.svg?branch=master)](https://travis-ci.org/baethon/udbajs) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## @baethon/udba-bootstrap

Very basic, very minimal application bootstrap layer. Use it when you need to have a control over application set up (and later shutdown) process.

## Installation

First, install the package.

```
npm i @baethon/udba-bootstrap
```

Setup the bootstrap module (`bootstrap/index.js`)

```js
const { Bootstrap } = require('@baethon/udba-bootstrap')

module.exports = new Bootstrap(`${__dirname}/providers`)
```

Bootstrap the application in the applications main file (e.g. the express server)

```js
const bootstrap = require('./boostrap')

bootstrap.load()
    .then(() => {
        // application was bootstrapped, here you can place the main logic etc
    })
```

If your application handles `SIGTERM` signal (or other shutdown handler) you should add.

```js
process.on('SIGTERM', async () => {
    await bootstrap.shutdown()
})
```

## Providers

A _provider_ is a class that is reponsible for preparing some core parts of the application before they can be used in the app. Think of it as as a startup script.

_Provider_ can be sorts of things:

- script setting up connection with the database (e.g. Sequelize init script)

- configuration loader

- external integration set up

Providers can have a priority. It's part of their name (e.g. `1-sequelize.js`). Bootstrap will make sure to load providers in correct order, using their prority. The lower the number, the higher the priority. The default priority of the provider (in case when you missed adding it in the file name) is `99`.

### Provider example

```js
const mongoose = require('mongoose');

class MongoProvider {
  async setup () {
    const baseOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASS,
    };

    await mongoose.connect(process.env.MONGODB_URL, baseOptions)
  }

  async shutdown () {
    await mongoose.disconnect();
  }
}

module.exports = MongoProvider
```

### Loading providers

Bootstrap assumes that all providers are listed in a single directory. You can define this directory in the `Bootstrap` constructor argument. Providers of the same priority will be loaded concurrently.

Example files structure can look like this:

```
bootstrap
|- providers
  |- 1-config.js
  |- 2-mongodb.js
  |- 10-middleware.js
  |- 10-logging.js
```

## When you should use `@baethon/udba-bootstrap`

Quite often I've been working with the applications that don't use any specific framework (disclaimer: I don't consider `express` or `hapi` to be a fully fledged framework). They tend to have a single `server.js` file which tries to do many things:

- set up core modules (database, config etc)

- load the routes

- start the server instance

Usually, this _works_.

Quite often I had to add a new application layer that required similar loading process, yet without the server parts (e.g. CLI scripts). This requires extracting the _loading scripts_ to a separate module, so that it can be re-used. Quite often it's a single file, doing many things. It becomes a _blob_ which can be hard to maintain.

`@baethon/udba-bootstrap` gives a clear separation of concerns. Each provider handles the process of setting up only a single core part of the application. With the priorities one can controll the order of their initialization. Adding new startup scripts shouldn't be any problem.

## Acknowledgements

- [globby](https://github.com/sindresorhus/globby)
- [p-all](https://github.com/sindresorhus/p-all)

## Testing

```
npm test
```
