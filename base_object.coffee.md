Base Object
===========

    {compileTemplate} = require "./util"

The bas class for all the objects.

    module.exports = BaseObject = (I={}, self=Model(I)) ->
      self.include require("./handlers")

      self.attrObservable "src", "script"

      # Auto-wire observables
      self.include require "./auto-wire"
      self.autoWire()

      element = null

      self.extend
        copy: ->
          BaseObject self.toJSON()

        element: ->
          return element if element

          if I.template
            element = compileTemplate(self.template())(self)
          else
            # TODO: Default to enabling observables?
            element = document.createElement self.type() ? "div"
            element.textContent = self.text()
            element.src = self.src()

          element.$object = self

          return element

        toJSON: ->
          # TODO: There's probably room for efficiency improvements, but not for
          # simplicity improvements

          JSON.parse(JSON.stringify(I))
