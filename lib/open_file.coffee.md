Open File
=========

    Modal = require "./modal"

    hideModal = (x) ->
      Modal.hide()
      x

    module.exports = (accept) ->
      new Promise (resolve, reject) ->
        Modal.show readerInput
          callback: resolve
          errback: reject
          accept: accept
      .then hideModal, (e) ->
        Modal.hide()
        throw e

    readerInput = ({callback, errback, encoding, accept}) ->
      encoding ?= "UTF-8"

      input = document.createElement('input')
      input.type = "file"
      input.setAttribute "accept", accept

      input.onchange = ->
        reader = new FileReader()

        file = input.files[0]

        reader.onload = (evt) ->
          try
            data = JSON.parse evt.target.result
            callback data
          catch e
            errback e

        reader.readAsText(file, encoding)

      return input
