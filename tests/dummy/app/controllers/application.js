import { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class extends Controller {
  items = A([0, 1, 2]);

  @action
  changeItems() {
    const { items } = this;
    items.pushObject(items.length + 1);
  }
}
