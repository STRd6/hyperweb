Util
====

    module.exports =
      exec: (code, context, params={}) ->
        names = Object.keys(params)
        values = names.map (name) ->
          params[name]

        Function(names..., code).apply(context, values)
