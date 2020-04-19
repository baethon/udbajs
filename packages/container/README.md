[![Build Status](https://travis-ci.org/baethon/udbajs.svg?branch=master)](https://travis-ci.org/baethon/udbajs) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## @baethon/udba-container

Simple dependancy injection container.

## Installation

First, install the package.

```
npm i @baethon/udba-container
```

Setup the container in your application.

```js
const { Container } = require('@baethon/udba-container')

module.exports = new Container({
    root: __dirname
})
```

By default the `root` option will point to the current working directory (`process.cwd()`).

## Usage

### Binding values

```js
const { Container } = require('@baethon/udba-container')

const container = new Container()
container.bind('random', Math.random)

console.log(container.make('random')) // random number
console.log(container.make('random')) // another, different random number
```

The conainer accepts any value to be bound with the given name. When you pass a `function` it will be used to resolve the actual value.

## Singletons

```js
const { Container } = require('@baethon/udba-container')

const container = new Container()
container.singleton('random', Math.random)

console.log(container.make('random')) // random number
console.log(container.make('random')) // same random number, 
                                      // generated in previous call
```

## Auto resolving

Container supports auto resolving of local files. To resolve a local file you need to give a path to it prefixed with `~`. Container will use the `root` path (passed in options) to resolve the path to the file and then it will load it and resolve the value.

```js
const { Container } = require('@baethon/udba-container')

const container = new Container({ root: __dirname })

console.log(container.make('~src/module'))
```

## Decorators

The package provides decorator functions that can be used with auto resolving

### Selfwire

Allows to define a custom binding function used during the resolving of the module.

```js
const { selfwire } = require('@baethon/udba-container/decorators')

class Test {
    constructor (random) {
        this.random = random
    }
}

module.exports = selfwire(Test, app => {
    return new Test(app.make('random'))
})
```

### Inject

Allows to define dependencies that should be resolved by the container and injected in the constructor.

```js
const { inject } = require('@baethon/udba-container/decorators')

class Test {
    constructor (random) {
        this.random = random
    }
}

module.exports = inject(Test, ['random'])
```

## Testing

```
npm test
```


