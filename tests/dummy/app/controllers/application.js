import Ember from 'ember';

export default Ember.Controller.extend({
  items: Ember.A([1, 2, 3]),

  actions: {
    changeItems() {
      this.get('items').pushObject(4);
    }
  }
});
