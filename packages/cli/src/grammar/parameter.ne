@builtin "whitespace.ne"
@builtin "string.ne"

@{%
const joinOpts = d => d.reduce(
  (carry, val) => (typeof val === 'object')
    ? { ...carry, ...val }
    : carry,
  {}
);

const v = opts => d => opts;
%}

parameter -> 
  flag alias name "=" default description {% joinOpts %}
  | flag alias name "=" array description  {% joinOpts %}
  | flag alias name description {% d => ({ ...joinOpts(d), type: 'boolean', default: false }) %}
  | name positionalFlag description {% d => ({ type: 'string', ...joinOpts(d) }) %}

flag -> "--" {% v({ optional: true }) %}

name -> word {% d => ({ name: d.join('') }) %}

positionalFlag -> 
  null
  | "?" {% v({ optional: true }) %}
  | array {% id %}

default -> dqstring {% d => ({ default: d[0], type: 'string' }) %}
  | sqstring {% d => ({ default: d[0], type: 'string' }) %}
  | word {% d => ({ default: d[0], type: 'string' }) %}
  | null {% v({ default: '', type: 'string' }) %}

array -> "*" {% v({ type: 'array', default: [] }) %}

alias -> null 
  | [a-zA-Z0-9] "|" {% d => ({ alias: d[0] }) %}

description -> null
  | _ ":" _ [^}]:* {% d => ({ description: d[3].join('').trim() })%}

word -> [a-zA-Z] [a-zA-Z0-9-]:* {% d => `${d[0]}${d[1].join('')}` %}
