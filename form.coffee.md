A magic Form
============

Work in progress for creating a form for an arbitrary object's data.

    BaseObject = require "./base_object"

    template = """
      %form
        - @fields.each (field) ->
          %label
            %h2= field.key
            %textarea= field.value
    """

    module.exports = (I={}, self=BaseObject(I)) ->
      