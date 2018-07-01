import { A } from '@ember/array';
import Controller from '@ember/controller';
import { get } from '@ember/object';

export default Controller.extend({
  items: A([0, 1, 2]),

  actions: {
    changeItems() {
      let items = get(this, 'items');
      items.pushObject(get(items, 'length') + 1);
    }
  }
});
