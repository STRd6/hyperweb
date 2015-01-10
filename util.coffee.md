Util
====

    # TODO: To global or not to global ...
    global.global = global
    global.CSON = require "cson"
    global.Hamlet = require "hamlet"
    global.Observable = require "observable"
    global.say = (text) ->
      alert text

    global.Model = do ->
      oldModel = require "model"

      (I, self) ->
        self = oldModel(I, self)

        self.extend
          attrData: (name, DataModel) ->
            models = (I[name] or []).map (x) ->
              DataModel(x)

            self[name] = Observable(models)
  
            self[name].observe (newValue) ->
              I[name] = newValue.map (x) ->
                DataModel(x)

            return self

        return self

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
