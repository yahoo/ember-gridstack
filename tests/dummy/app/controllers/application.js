import { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Controller {
  items = A([0, 1, 2])

  @tracked
  num = 0

  @action
  onChange() {
    this.num = this.num + 1;
  }

  @action
  changeItems() {
    const { items } = this;
    items.pushObject(items.length + 1);
  }
}
