let prototype = Resource.prototype;

Object.defineProperty(prototype, 'hasEnergy', {
  get: function() {
    return this.amount > 0;
  }
});

