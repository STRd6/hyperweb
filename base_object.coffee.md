Base Object
===========

    {compileTemplate, exec} = require "./util"

The bas class for all the objects.

    module.exports = BaseObject = (I={}, self=Model(I)) ->
      self.include require("./handlers")

      # Auto-wire observables
      self.include require "./auto-wire"
      self.autoWire()

      element = null

      self.extend
        copy: ->
          BaseObject self.toJSON()

Initialize the object within its environment.

        init: (env) ->
          if script = self.script?()
            code = CoffeeScript.compile(script, bare: true)

            exec code, self, env

        element: ->
          return element if element

          if I.template
            # TODO: Template should execute in env context
            element = compileTemplate(self.template())(self)
          else
            # TODO: Replace this with a default template, or different
            # templates for different objects (buttons, images, etc.)
            element = document.createElement self.type() ? "div"

            if text = self.text?()
              element.textContent = text

            if src = self.src?()
              element.src = src

          element.$object = self

          return element

        toJSON: ->
          # TODO: There's probably room for efficiency improvements, but not for
          # simplicity improvements

          JSON.parse(JSON.stringify(I))
