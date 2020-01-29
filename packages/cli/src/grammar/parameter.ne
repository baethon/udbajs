@builtin "whitespace.ne"
@builtin "string.ne"

@{%
const joinOpts = d => d.reduce(
  (carry, val) => (typeof val === 'object')
    ? { ...carry, ...val }
    : carry,
  {}
);
const always = opts => _ => opts;
const p = (...args) => (value) => args.reduce((carry, fn) => fn(carry), value)
const rightMerge = (data) => d => ({ ...d, ...data })
const leftMerge = (data) => d => ({ ...data, ...d })
%}

parameter -> 
  flag alias name "=" default description {% joinOpts %}
  | flag alias name "=" array description  {% joinOpts %}
  | flag alias name description {% p(joinOpts, rightMerge({ type: 'boolean', default: false })) %}
  | name positionalFlag description {% p(joinOpts, leftMerge({ type: 'string', positional: true })) %}

flag -> "--" {% always({ optional: true, positional: false }) %}

name -> word {% d => ({ name: d.join('') }) %}

positionalFlag -> 
  null
  | "?" {% always({ optional: true }) %}
  | array {% id %}

default -> dqstring {% d => ({ default: d[0], type: 'string' }) %}
  | sqstring {% d => ({ default: d[0], type: 'string' }) %}
  | word {% d => ({ default: d[0], type: 'string' }) %}
  | null {% always({ default: '', type: 'string' }) %}

array -> "*" {% always({ type: 'array', default: [] }) %}

alias -> null 
  | [a-zA-Z0-9] "|" {% d => ({ alias: d[0] }) %}

description -> null
  | _ ":" _ [^}]:* {% d => ({ description: d[3].join('').trim() })%}

word -> [a-zA-Z] [a-zA-Z0-9-]:* {% d => `${d[0]}${d[1].join('')}` %}
