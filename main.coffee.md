Hyperweb
========

Exploring the magic of HyperCard.

We'll need to be able to create a new card, add buttons, scripts, interactions.

    deck =
      objects: require "./data"

    {compileTemplate, exec, remove} = require "./util"

    styleElement = document.createElement "style"
    styleElement.innerHTML = require "./style"
    document.head.appendChild styleElement

Eventually these tools will be plentiful and user defined.

    interactTool =
      click: (e) ->
        if object = e.target.$object
          object.trigger("click", e)

A card is simply a JSON object. A card can therefore contain any number of
properties or sub-components.

The editor/viewer interprets the data of the card object and presents in the HTML DOM.

    BASE = require "./base_object"

    Editor = (I={}, self=Model(I)) ->
      container = document.createElement("div")
      container.addEventListener "click", (e) ->
        # Proxy events to tool
        self.tool().click(e)
      , true

All this init/hydrate stuff is pretty nasty...

      initObject = (object) ->
        if object.script
          code = CoffeeScript.compile(object.script, bare: true)
          exec code, object,
            editor: self

        # TODO: Observable bindings for content and attributes
        # TODO: Refresh element if type changes?
        if object.template
          element = compileTemplate(object.template)(object)
        else
          element = document.createElement object.type ? "div"
          element.textContent = object.text
          element.src = object.src

        element.$object = object

        object.element = element

        # Add to DOM
        container.appendChild object.element

      hydrate = (object) ->
        object.__proto__ = BASE

        object

      addObject = (object) ->
        hydrate object

        # Add to objects list
        self.objects.push object

        initObject(object)

      self.extend
        addObject: addObject

        remove: (object) ->
          # Remove object from list
          self.objects.remove(object)

          # remove object element from DOM
          container.removeChild object.element

        container: container

        tool: Observable interactTool

        toJSON: ->
          I

      # TODO: Clean up this hydrate stuff into a plain constructor function
      self.attrModels "objects", hydrate
      self.objects.forEach initObject

      return self

    editor = Editor(deck)

    global.say = (text) ->
      alert text

    document.body.appendChild editor.container

An editor is built into the default viewer for modifying the data of a card on
the fly.

Features
========

Tools
-----

Adding objects, moving them around, matrix transforms

Executing click handlers (play sound, go to card, etc.)

Inspect objects without triggering clicks

Deleting objects

Copying objects

Input fields

Composing Objects

Binding inputs/outputs to properties
----------------------------
An object count that stays up to date

Navigation
----------

Next card, previous card, go to #, go to name

Save and restore state

Save objects in a library for later use

Self hosting of editor
----------------------

Inception
