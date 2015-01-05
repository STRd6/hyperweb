Hyperweb
========

Exploring the magic of HyperCard.

We'll need to be able to create a new card, add buttons, scripts, interactions.

    global.say = (text) ->
      alert text

    deck =
      cards: [
        objects: []
      ]

    Card = ->
      objects: []

    newCardButton =
      type: "button"
      text: "New Card"
      script: """
        @click ->
          deck.cards.push Card()
      """

    testButton =
      type: "button"
      text: "Test"
      script: """
        @click ->
          say "Hello"
      """

    nextCardButton =
      type: "button"
      text: "Next"
      script: """
        @click ->
          nextCard()
      """

    controlButtons = [newCardButton, testButton, nextCardButton]

A card is simply a JSON object. A card can therefore contain any number of
properties or sub-components.

The viewer interprets the data of the card object and presents in the HTML DOM.

    Viewer = (deck) ->
      currentCardIndex = 0
      currentCard = deck.cards[currentCardIndex]

      container = document.createElement("div")
      controls = document.createElement("controls")
      container.appendChild controls

      container.addEventListener "click", (e) ->
        # TODO: May need to handle bubbling
        if object = e.target.$object
          object.trigger("click", e)

      handlers = []

      proto =
        click: (fn) ->
          # TODO: This is dumb
          handlers.push [this, "click", fn]

        trigger: (method, args...) ->
          self = this
          handlers.forEach ([host, type, fn]) ->
            if host is self and type is method
              fn.apply(host, args)

      hydrate = (object) ->
        return object.$element if object.$element

        # Init Code from Script
        object.__proto__ = proto
        code = CoffeeScript.compile(object.script, bare: true)
        Function(code).call(object)

        # TODO: Observable bindings for content and attributes
        element = document.createElement object.type ? "div"
        element.textContent = object.text

        element.$object = object

        object.$element = element

      controlButtons.forEach (button) ->
        controls.appendChild hydrate button

      objectAdded: (object) ->
        container.appendChild hydrate object

      objectRemoved: (object) ->
        container.removeChild object.$element

      nextCard: ->
        currentCardIndex += 1
        currentCard = deck.cards[currentCardIndex]

      render: ->
        # Render each object's DOM node into the DOM
        root.objects.forEach (object) ->
          container.appendChild hydrate object
      
      container: container

    document.body.appendChild Viewer(deck).container

An editor is built into the default viewer for modifying the data of a card on
the fly.

Features
--------

Adding objects, moving them around.

Executing click handlers (play sound, go to card, etc.)

Deleting objects.

Copying objects.

Navigation (Next card, previous card, go to #, go to name)
