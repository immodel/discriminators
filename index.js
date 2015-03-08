module.exports = function() {
  this.discriminator = function(prop, types) {
    return this.use(function() {
      var model = this;
      this.on('init', function(evt) {
        var doc = evt.doc;
        var key = doc.get(prop);

        if(types.indexOf(key) !== -1) {
          var type = model.lookup(key);
          if(! (doc instanceof type)) {
            evt.doc = new type(doc.value);
          }
        }
      });
    });
  };
};