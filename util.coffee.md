Util
====

    require "cornerstone"

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

        Function("Hamlet", "return " + code)(Hamlet)
