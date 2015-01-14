Auto Wire
=========

    module.exports = (I={}, self) ->
      self.autoWire = ->
        Object.keys(I).forEach (attr) ->
          unless self[attr]
            self.attrObservable attr

      return self
