Base Object
===========

    {compileTemplate} = require "./util"

The prototype for all the objects.

We're currently doing a jQuery-esque thing for tracking events bound to objects.
It's probably not the worst but it could be better.

Keep a list of all event handlers registered from the scripts of objects so
that when events occur we can call the methods that were registered.

    handlers = {}

This `proto` holds all the methods that are available on objects in the deck.

Advantages are that it is lightweight, disadvantages are that it can easily be
shadowed accidentally.

Look into using {SUPER: SYSTEM}

    proto =
      copy: ->
        # TODO: may need to formalize calling constructor on resulting data
        # instead of relying on someone else to call it

        # TODO: There's probably room for efficiency improvements, but not for
        # simplicity improvements
        JSON.parse(JSON.stringify(this))

      trigger: (method, args...) ->
        if fns = handlers[method].get(this)
          host = this
          fns.forEach (fn) ->
            fn.apply(host, args)

    ["click", "mousedown", "mouseup"].forEach (type) ->
      handlers[type] = new Map

      proto[type] = (fn) ->
        if fns = handlers[type].get(this)
          fns.push fn
        else
          handlers[type].set this, [fn]

    elementMap = new Map
    Object.defineProperty proto, "element",
      get: ->
        if element = elementMap.get(this)
          return element

        if @template
          element = compileTemplate(@template)(this)
        else
          # TODO: Default to enabling observables?
          element = document.createElement @type ? "div"
          element.textContent = @text
          element.src = @src

        element.$object = this

        @element = element
      set: (element) ->
        elementMap.set(this, element)

    module.exports = proto
