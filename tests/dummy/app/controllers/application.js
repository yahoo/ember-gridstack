import Ember from 'ember';

const { get } = Ember;

export default Ember.Controller.extend({
  items: Ember.A([0, 1, 2]),

  actions: {
    changeItems() {
      let items = get(this, 'items');
      items.pushObject(get(items, 'length') + 1);
    }
  }
});
