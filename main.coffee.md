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

A card is simply a JSON object. A card can therefore contain any number of
properties or sub-components.

The editor/viewer interprets the data of the card object and presents in the HTML DOM.

    Editor = (deck) ->
      container = document.createElement("div")
      container.addEventListener "click", (e) ->
        # TODO: Prevent default if we are using a tool other than the 
        # `interact` tool
        e.preventDefault() if false
        
        if object = e.target.$object
          object.trigger("click", e)
      , true

We're currently doing a jQuery-esque thing for tracking events bound to objects.
It's probably not the worst but it could be better.

Keep a list of all event handlers registered from the scripts of objects so
that when events occur we can call the methods that were registered.

      handlers =
        click: new Map

This `proto` holds all the methods that are available on objects in the deck.

Advantages are that it is lightweight, disadvantages are that it can easily be
shadowed accidentally.

Look into using {SUPER: SYSTEM}

      proto =
        click: (fn) ->
          if fns = handlers["click"].get(this)
            fns.push fn
          else
            handlers["click"].set this, [fn]

        trigger: (method, args...) ->
          if fns = handlers[method].get(this)
            host = this
            fns.forEach (fn) ->
              fn.apply(host, args)

      elementMap = new Map
      Object.defineProperty proto, "element",
        get: ->
          elementMap.get(this)
        set: (element) ->
          elementMap.set(this, element)

      hydrate = (object) ->
        return object.element if object.element

Here we initialize the object

        # Init Code from Script
        object.__proto__ = proto
        if object.script
          code = CoffeeScript.compile(object.script, bare: true)
          exec code, object,
            editor: self

        # TODO: Observable bindings for content and attributes
        # TODO: Refresh element if type changes?
        # TODO: Templates?
        if object.template
          element = compileTemplate(object.template)(object)
        else
          element = document.createElement object.type ? "div"
          element.textContent = object.text
          element.src = object.src

        element.$object = object

        object.element = element

      addObject = (object) ->
        # Add to objects list
        deck.objects.push object

        # Add to DOM
        container.appendChild hydrate object

      self =
        addObject: addObject

        remove: (object) ->
          # Remove object from list
          remove deck.objects, object
          
          # remove object element from DOM
          container.removeChild object.element

        container: container

        data: ->
          deck

      # TODO: Seems hacky...
      objects = deck.objects
      deck.objects = []
      objects.forEach addObject

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

Adding objects, moving them around

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

Self hosting of editor
----------------------

Inception
