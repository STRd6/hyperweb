Hyperweb
========

Exploring the magic of HyperCard.

We'll need to be able to create a new card, add buttons, scripts, interactions.

    deck =
      cards: [
        objects: []
      ]

    Card = ->
      objects: []

    controlButtons = require "./data"

    {compileTemplate, exec} = require "./util"

A card is simply a JSON object. A card can therefore contain any number of
properties or sub-components.

The editor/viewer interprets the data of the card object and presents in the HTML DOM.

    Editor = (deck) ->
      currentCardIndex = 0
      currentCard = deck.cards[currentCardIndex]

      container = document.createElement("div")
      container.addEventListener "click", (e) ->
        # TODO: May need to handle bubbling
        if object = e.target.$object
          object.trigger("click", e)

We're currently doing a jQuery-esque thing for tracking events bound to objects.
It's probably not the worst but it could be better.

Keep a list of all event handlers registered from the scripts of objects so
that when events occur we can call the methods that were registered.

      handlers = []

This `proto` holds all the methods that are available on objects in the deck.

Advantages are that it is lightweight, disadvantages are that it can easily be
shadowed accidentally.

Look into using {SUPER: SYSTEM}

      proto =
        click: (fn) ->
          handlers.push [this, "click", fn]

        trigger: (method, args...) ->
          self = this
          handlers.forEach ([host, type, fn]) ->
            if host is self and type is method
              fn.apply(host, args)

      hydrate = (object) ->
        return object.$element if object.$element

Here we initialize the object

        # Init Code from Script
        if object.script
          object.__proto__ = proto
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

        object.$element = element

      addObject = (object) ->
        container.appendChild hydrate object

      self =
        addObject: addObject

        objectRemoved: (object) ->
          container.removeChild object.$element

        nextCard: ->
          currentCardIndex += 1
          currentCard = deck.cards[currentCardIndex]

        newCard: (data={}) ->
          deck.cards.push Card data

        container: container

      controlButtons.forEach addObject

      return self

    editor = Editor(deck)

    global.say = (text) ->
      alert text

    document.body.appendChild editor.container

An editor is built into the default viewer for modifying the data of a card on
the fly.

Features
--------

Adding objects, moving them around.

Executing click handlers (play sound, go to card, etc.)

Deleting objects.

Copying objects.

Input fields.

Binding inputs to properties.

Navigation (Next card, previous card, go to #, go to name)

Self hosting of editor
