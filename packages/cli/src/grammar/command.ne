@builtin "whitespace.ne"
@include "./parameter.ne"

command -> commandName __ commandParameter:* {% d => ([d[0], d[2]]) %}
  | commandName {% d => ([d[0], []]) %}
commandParameter -> "{" _ parameter _ "}" _ {% d => d[2] %}
commandName -> word {% id %}
  | word ":" commandName {% d => `${d[0]}:${d[2]}` %}
