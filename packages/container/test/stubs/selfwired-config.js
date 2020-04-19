const { selfwire } = require('../../decorators')
const config = require('./config')

module.exports = selfwire(config, (app) => ({
  ...config,
  random: app.make('random')
}))
