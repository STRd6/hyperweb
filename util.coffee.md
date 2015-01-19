Util
====

    require "cornerstone"

    require "./lib/coffee-script"

    # TODO: To global or not to global ...
    global.global = global
    global.CSON = require "cson"
    global.Hamlet = require "hamlet"
    global.say = (text) ->
      alert text

    module.exports =
      exec: (code, context, params={}) ->
        names = Object.keys(params)
        values = names.map (name) ->
          params[name]

        Function(names..., code).apply(context, values)

      compileTemplate: (source) ->
        code = Hamlet.Compiler.compile source,
          compiler: CoffeeScript
          runtime: "Hamlet"
          exports: false

        Function("Hamlet", "return " + code)(Hamlet)

      empty: (node) ->
        while child = node.lastChild
          node.removeChild child
