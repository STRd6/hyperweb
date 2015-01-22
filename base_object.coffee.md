Base Object
===========

    {compileTemplate, exec} = require "./util"

    templates =
      img: """
        %img(@src)
      """

    defaultTemplate = (type) ->
      if template = templates[type]
        return template
      else
        """
          %#{type}= @text
        """

The bas class for all the objects.

    module.exports = BaseObject = (I={}, self=Model(I)) ->
      self.include require("./handlers")

      # Auto-wire observables
      self.include require "./auto-wire"
      self.autoWire()

      element = null

      execScript = (env) ->
        if script = self.script?()
          code = CoffeeScript.compile(script, bare: true)

          exec code, self, env

      self.extend
        copy: ->
          BaseObject self.toJSON()

Initialize the object within its environment.

        init: (env) ->
          execScript(env)

          reload = ->
            self.clearHandlers()

            oldElement = element
            element = null

            # Re-exec script
            execScript(env)

            # Replace old element with new element
            editor.replaceElement(oldElement, self.element())

          {editor} = env
          # TODO: Is there a better way to bind these reload events?
          # Maybe the editing widget should probably be responsible for
          # triggering reloads when the element changes...
          self.script?.observe? reload
          self.template?.observe? reload

        element: ->
          return element if element

          if I.template
            # TODO: Template should execute in env context
            element = compileTemplate(self.template())(self)
          else
            if type = self.type?()
              element = compileTemplate(defaultTemplate(type))(self)
            else
              element = compileTemplate(defaultTemplate("div"))(self)

          element.$object = self

          return element

        toJSON: ->
          # TODO: There's probably room for efficiency improvements, but not for
          # simplicity improvements

          JSON.parse(JSON.stringify(I))
