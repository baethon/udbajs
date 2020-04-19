const always = value => _ => value

const startsWith = search => string => string.startsWith(search)

const identity = value => value

const map = fn => array => array.map(fn)

const otherwise = always(true)

const tap = fn => value => {
  fn(value)
  return value
}

module.exports = {
  always, startsWith, identity, map, otherwise, tap
}
