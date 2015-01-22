Hyperweb
========

Exploring the magic of HyperCard.

We'll need to be able to create a new card, add buttons, scripts, interactions.

    "use strict"

    deck =
      controls: require "./controls"
      objects: require "./data"

    {empty} = require "./util"

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

    BaseObject = require "./base_object"

    Editor = (I={}, self=Model(I)) ->
      element = document.createElement("div")
      controls = document.createElement("div")

      container = document.createElement("div")
      # TODO: Unified touch/click interface
      ["click", "mousedown", "mousemove", "mouseup"].forEach (name) ->
        container.addEventListener name, (event) ->
          object = getObject(event)
          # Invoke the tool with `object` as the context and additional named arguments
          self.tool()[name]?.call(object, {
            editor: self
            event
            object
          })
        , true # Use Capture

      element.appendChild controls
      element.appendChild container

      initObject = (object) ->
        object.init
          editor: self
          require: require # TODO: This may have require path implications!
          PACKAGE: PACKAGE # This also may have implications because it is the editor package, not the app package

      self.extend
        addObject: (object) ->
          self.objects.push object
          initObject(object)
          container.appendChild object.element()

        addObjectFromData: (data) ->
          self.addObject BaseObject data

        addControl: (control) ->
          self.controls.push control
          initObject(control)
          controls.appendChild control.element()

        addControlFromData: (data) ->
          self.addControl BaseObject data

        init: ->
          self.objects.forEach (object) ->
            initObject(object)
            container.appendChild object.element()

          self.controls.forEach (object) ->
            initObject(object)
            controls.appendChild object.element()

        remove: (object) ->
          if self.objects().include object
            # remove object element from DOM        
            container.removeChild object.element()

            # Remove object from list
            self.objects.remove(object)

        replaceElement: (oldElement, newElement) ->
          container.insertBefore newElement, oldElement.nextSibling
          container.removeChild oldElement

        element: element

        tool: Observable()

        toJSON: ->
          I

        load: (data) ->
          empty controls
          empty container

          self.objects data.objects.map (x) ->
            BaseObject x
          self.controls data.controls.map (x) ->
            BaseObject x

          self.init()

      self.attrModels "controls", BaseObject
      self.attrModels "objects", BaseObject

      self.init()

      return self

    editor = Editor(deck)
    document.body.appendChild editor.element

    module.exports = editor

An editor is built into the default viewer for modifying the data of a card on
the fly.

Features
========

Tools
-----

[X] Adding objects

[X] Executing click handlers

[X] Inspect objects without triggering clicks

[X] Deleting objects

[X] Copying objects

[ ] Live Edit Objects

[ ] Input fields

[ ] Moving objects / Matrix transforms

[ ] Drag and drop templates to create objects

[ ] Composing Objects

[ ] Drawing tools

[ ] Cursors

Actions
-------

[X] Save

[X] Load

[X] Reload

Binding inputs/outputs to properties
----------------------------

[X] An object count that stays up to date

Navigation
----------

[ ] Next card, previous card, go to #, go to name

[X] Save objects as JSON for easy sharing

Self hosting of editor
----------------------

[ ] Inception

[X] Save entire app/editor as an .html file

Documentation
-------------

Consistent naming and mental model

API Docs

Examples

Tutorials

Interactive Demos
