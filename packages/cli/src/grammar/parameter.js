// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dqstring$ebnf$1", "dstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sqstring$ebnf$1", "sstrchar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": ["btstring$ebnf$1", /[^`]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": function(d) { return JSON.parse("\""+d.join("")+"\""); }},
    {"name": "sstrchar$string$1", "symbols": [{"literal":"\\"}, {"literal":"'"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sstrchar", "symbols": ["sstrchar$string$1"], "postprocess": function(d) {return "'"; }},
    {"name": "strescape", "symbols": [/["\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "parameter", "symbols": ["flag", "alias", "name", {"literal":"="}, "default", "description"], "postprocess": joinOpts},
    {"name": "parameter", "symbols": ["flag", "alias", "name", {"literal":"="}, "array", "description"], "postprocess": joinOpts},
    {"name": "parameter", "symbols": ["flag", "alias", "name", "description"], "postprocess": p(joinOpts, rightMerge({ type: 'boolean', default: false }))},
    {"name": "parameter", "symbols": ["name", "positionalFlag", "description"], "postprocess": p(joinOpts, leftMerge({ type: 'string', positional: true }))},
    {"name": "flag$string$1", "symbols": [{"literal":"-"}, {"literal":"-"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "flag", "symbols": ["flag$string$1"], "postprocess": always({ optional: true, positional: false })},
    {"name": "name", "symbols": ["word"], "postprocess": d => ({ name: d.join('') })},
    {"name": "positionalFlag", "symbols": []},
    {"name": "positionalFlag", "symbols": [{"literal":"?"}], "postprocess": always({ optional: true })},
    {"name": "positionalFlag", "symbols": ["array"], "postprocess": id},
    {"name": "default", "symbols": ["dqstring"], "postprocess": d => ({ default: d[0], type: 'string' })},
    {"name": "default", "symbols": ["sqstring"], "postprocess": d => ({ default: d[0], type: 'string' })},
    {"name": "default", "symbols": ["word"], "postprocess": d => ({ default: d[0], type: 'string' })},
    {"name": "default", "symbols": [], "postprocess": always({ default: '', type: 'string' })},
    {"name": "array", "symbols": [{"literal":"*"}], "postprocess": always({ type: 'array', default: [] })},
    {"name": "alias", "symbols": []},
    {"name": "alias", "symbols": [/[a-zA-Z0-9]/, {"literal":"|"}], "postprocess": d => ({ alias: d[0] })},
    {"name": "description", "symbols": []},
    {"name": "description$ebnf$1", "symbols": []},
    {"name": "description$ebnf$1", "symbols": ["description$ebnf$1", /[^}]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "description", "symbols": ["_", {"literal":":"}, "_", "description$ebnf$1"], "postprocess": d => ({ description: d[3].join('').trim() })},
    {"name": "word$ebnf$1", "symbols": []},
    {"name": "word$ebnf$1", "symbols": ["word$ebnf$1", /[a-zA-Z0-9-]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "word", "symbols": [/[a-zA-Z]/, "word$ebnf$1"], "postprocess": d => `${d[0]}${d[1].join('')}`}
]
  , ParserStart: "parameter"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
