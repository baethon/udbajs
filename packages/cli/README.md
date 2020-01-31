## @baethon/udba-cli

Minimalistic CLI interface built on top of [yargs](http://yargs.js.org/). It allows building CLI applications inside an existing app.

## Installation

First, install the package:

```
npm i @baethon/udba-cli
```

Then create your CLI binary (`./cli`; ideally, in the root folder):

```js
#!/usr/bin/env node

const { Runtime } = require('@baethon/udba-cli')

const app = new Runtime()

app.load(`${__dirname}/commands/**/*.js`)  
    .then(() => app.run(process.argv.slice(2)))  
    .then(() => app.exit())  
    .catch((error) => {    
        console.warn(error.message)    
        app.exit(1)  
    })
```

Add executable permissions:

```
chmod +x ./cli
```

### Creating the first command

Create (`commands/hello-world.command.js`):

```js
const { Command } = require('@baethon/udba-cli')

class HelloWorld extends Command {    
    static get signature () {
        return 'hello {--who=World}'
    }

    static get description () {
        return 'Say hello to someone'
    }

    handle ({ who }) {
        console.log(`Hello ${who}!`)
    }
}
```

Execute it:

```
./cli hello --who=Jon
```

## Signatures

The command declarations are very different as in `yargs`. The core of the command's definition is _signature_. The package parses it and creates a valid `yargs` command.

The signature syntax is based on the syntax of [Laravel Artisan commands](https://laravel.com/docs/6.x/artisan#defining-input-expectations). All defined parameters can be: `string`, `array` (of `string`), or a `boolean`.

### Positional parameters

- required parameter: `{paramName}`

- optional parameter: `{paramName?}`

- optional parameter with default value: `{paramName="Some value"}`

- array parameter: `{paramName*}`

### Flags

All flags are optional.

- boolean parameter (default value: `false`): `{--paramName}`

- string parameter (default value: `''` [empty string]): `{--paramName=}`

- string parameter (default value: `'Some value`'): `{--paramName="Some value"}`

- array parameter (default value: `[]`): `{--paramName=*}`

- flag alias: `{--p|paramName}`

## Loading commands

You can add a single command using the `add()` method.

```js
const HelloWorld = require('./commands/hello-world.command.js')

app.add(HelloWorld)
```

You can also load all commands using glob patterns.

```js
app.load([`${__dirname}/commands/*.js`, `other/path/*.js`])
```

The `load()` method returns a Promise. Make sure to wait until it resolves. `load()` is compatible with [globby](https://github.com/sindresorhus/globby) API.

The `Runtime` accepts only classes that extend the `Command` class.

## Command handler

The `handle()` method is responsible for executing the command. As a first argument, it receives the parameters parsed by `yargs` (note, that there will be more values then defined in the _signature_). `handle()` can return a Promise. If this happens, the runtime waits for its fulfillment.

## Calling commands programmatically

It's possible to run selected commands from your application. This requires having an additional step (in the application) which sets up the runtime:

```js
const { Runtime } = require('@baethon/udba-cli')

const app = new Runtime()
app.load(`${__dirname}/commands/**/*.js`)

module.exports = app
```

Calling the command:

```js
const cliApp = require('./cli-runtime.js')

cliApp.call('hello --who=Jon')
```

Please mind that the runtime setup example is simplified. The app should wait for the `load()` method to finish.

## Acknowledgements

- [globby](https://github.com/sindresorhus/globby)

- [yargs](http://yargs.js.org/)

- [nearley](https://github.com/kach/nearley)

## Testing

```
npm test
```
