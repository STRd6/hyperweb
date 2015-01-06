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
        object.__proto__ = proto
        code = CoffeeScript.compile(object.script, bare: true)
        Function(code).call(object)

        # TODO: Observable bindings for content and attributes
        # TODO: Refresh element if type changes?
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

    viewer = Viewer(deck)

    # TODO: What to do about all these globals?
    global.Card = Card
    global.say = (text) ->
      alert text
    global.deck = deck
    global.nextCard = viewer.nextCard

    document.body.appendChild viewer.container

An editor is built into the default viewer for modifying the data of a card on
the fly.

Features
--------

Adding objects, moving them around.

Executing click handlers (play sound, go to card, etc.)

Deleting objects.

Copying objects.

Navigation (Next card, previous card, go to #, go to name)
