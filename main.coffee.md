Hyperweb
========

Exploring the magic of HyperCard.

We'll need to be able to create a new card, add buttons, scripts, interactions.

    "use strict"

    deck =
      controls: require "./controls"
      objects: require "./data"

    {exec} = require "./util"

    styleElement = document.createElement "style"
    styleElement.innerHTML = require "./style"
    document.head.appendChild styleElement

Eventually these tools will be plentiful and user defined.

    getObject = (event) ->
      node = event.target

      while node
        if object = node.$object
          return object

        node = node.parentElement

A card is simply a JSON object. A card can therefore contain any number of
properties or sub-components.

The editor/viewer interprets the data of the card object and presents in the HTML DOM.

    BASE = require "./base_object"

    Editor = (I={}, self=Model(I)) ->
      element = document.createElement("div")
      controls = document.createElement("div")

      container = document.createElement("div")
      # TODO: Handle all interaction events (touchdown, touchup, etc.)
      container.addEventListener "click", (event) ->
        object = getObject(event)
        # Invoke the tool with `object` as the context and additional named arguments
        self.tool().click.call(object, {
          editor: self
          event
          object
        })
      , true # Use Capture

      element.appendChild controls
      element.appendChild container

All this init/hydrate stuff is pretty nasty...

      initObject = (object) ->
        if object.script
          code = CoffeeScript.compile(object.script, bare: true)
          exec code, object,
            editor: self

      hydrate = (object) ->
        object.__proto__ = BASE

        object

      addObject = (object) ->
        hydrate object

        # Add to objects list
        self.objects.push object

        initObject(object)
        # Add to DOM
        container.appendChild object.element

      self.extend
        addObject: addObject

        remove: (object) ->
          # Remove object from list
          self.objects.remove(object)

          # remove object element from DOM
          container.removeChild object.element

        element: element

        tool: Observable()

        toJSON: ->
          I

      # TODO: Clean up this hydrate stuff into a plain constructor function
      self.attrData "objects", hydrate
      self.objects.forEach (object) ->
        initObject(object)
        container.appendChild object.element

      self.attrData "controls", hydrate
      self.controls.forEach (object) ->
        initObject(object)
        controls.appendChild object.element

      return self

    document.body.appendChild Editor(deck).element

An editor is built into the default viewer for modifying the data of a card on
the fly.

Features
========

Tools
-----

Adding objects, moving them around, matrix transforms

Executing click handlers (play sound, go to card, etc.)

Drawing tools

Inspect objects without triggering clicks

Deleting objects

Copying objects

Input fields

Composing Objects

Cursors

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

Documentation
-------------

API Docs

Examples

Tutorials

Interactive Demos
