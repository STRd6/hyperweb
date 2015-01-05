window["STRd6/hyperweb:master"]({
  "source": {
    "README.md": {
      "path": "README.md",
      "content": "hyperweb\n========\n\nPrototyping some hypercard-ish ideas.\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Hyperweb\n========\n\nExploring the magic of HyperCard.\n\nWe'll need to be able to create a new card, add buttons, scripts, interactions.\n\n    cards = []\n\n    Card = ->\n      {}\n\n    newCardButton = document.createElement \"button\"\n    newCardButton.textContent = \"New Card\"\n    newCardButton.onclick = ->\n      cards.push Card()\n      console.log cards\n\n    document.body.appendChild newCardButton\n\n    ",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var Card, cards, newCardButton;\n\n  cards = [];\n\n  Card = function() {\n    return {};\n  };\n\n  newCardButton = document.createElement(\"button\");\n\n  newCardButton.textContent = \"New Card\";\n\n  newCardButton.onclick = function() {\n    cards.push(Card());\n    return console.log(cards);\n  };\n\n  document.body.appendChild(newCardButton);\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/hyperweb",
    "homepage": null,
    "description": "Prototyping some hypercard-ish ideas.",
    "html_url": "https://github.com/STRd6/hyperweb",
    "url": "https://api.github.com/repos/STRd6/hyperweb",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});