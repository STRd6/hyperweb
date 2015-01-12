Handlers
========

    module.exports = (I, self) ->
      handlers = {}

      [
        "click"
        "mousedown"
        "mouseup"
      ].forEach (type) ->
        handlers[type] = []

        self[type] = (fn) ->
          if fns = handlers[type]
            fns.push fn
          else
            handlers[type] = [fn]

      self.extend
        trigger: (method, args...) ->
          handlers[method]?.forEach (fn) ->
            fn.apply(self, args)

      return self
