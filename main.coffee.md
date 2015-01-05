Hyperweb
========

Exploring the magic of HyperCard.

We'll need to be able to create a new card, add buttons, scripts, interactions.

    cards = []

    Card = ->
      {}

    newCardButton = document.createElement "button"
    newCardButton.textContent = "New Card"
    newCardButton.onclick = ->
      cards.push Card()
      console.log cards

    document.body.appendChild newCardButton

    