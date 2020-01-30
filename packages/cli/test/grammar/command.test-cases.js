module.exports = [
  ['hello', 'hello', []],
  ['hello {--active}', 'hello', [{ name: 'active', optional: true, type: 'boolean', default: false, positional: false, order: 0 }]],
  ['hello {--active} {--name=Jon}', 'hello', [
    { name: 'active', optional: true, type: 'boolean', default: false, positional: false, order: 0 },
    { name: 'name', optional: true, type: 'string', default: 'Jon', positional: false, order: 1 }
  ]],
  ['hello:world', 'hello:world', []],
  ['hello:world {--active}', 'hello:world', [{ name: 'active', optional: true, type: 'boolean', default: false, positional: false, order: 0 }]],
  ['hello {--active : Only active} {--bar}', 'hello', [
    { name: 'active', optional: true, type: 'boolean', description: 'Only active', default: false, positional: false, order: 0 },
    { name: 'bar', optional: true, type: 'boolean', default: false, positional: false, order: 1 }
  ]],
  ['hello {--x|active : Only active} {--bar}', 'hello', [
    { name: 'active', optional: true, type: 'boolean', description: 'Only active', default: false, positional: false, order: 0, alias: 'x' },
    { name: 'bar', optional: true, type: 'boolean', default: false, positional: false, order: 1 }
  ]]
]
