Auto Wire
=========

    module.exports = (I={}, self) ->
      self.autoWire = ->
        Object.keys(I).forEach (attr) ->
          unless self[attr]
            self.prop attr

      properties = {}

      self.prop = (name) ->
        properties[name] = {}

        self.attrObservable name

      self.properties = ->
        Object.keys(properties).map (key) ->
          value = self[key]
          [key, value]

      return self
