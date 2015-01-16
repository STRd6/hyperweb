Modal
=====

Messing around with some modal BS

    modal = document.createElement "div"
    modal.id = "modal"

    modal.addEventListener (e) ->
      if e.target is this
        Modal.hide()

    document.body.appendChild modal

    {empty} = require "../util"

    module.exports = Modal =
      show: (element) ->
        empty(modal)
        modal.appendChild(element)
        modal.classList.add("active")

      hide: ->
        modal.classList.remove("active")
