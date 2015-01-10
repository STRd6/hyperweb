Util
====

    # TODO: To global or not to global ...
    global.CSON = require "cson"
    global.Hamlet = require "hamlet"
    global.Model = require "model"
    global.Observable = require "observable"

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

      remove: (array, object) ->
        if (index = array.indexOf(object) >= 0)
          array.splice(index, 1)
