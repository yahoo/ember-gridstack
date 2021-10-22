import { A } from '@ember/array';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import config from 'dummy/config/environment';
import { tracked } from '@glimmer/tracking';
export default class extends Controller {
  rootURL = config.rootURL;

  items = A();

  @tracked
  shouldFloat = true;

  @action
  changeItems() {
    const { items } = this;
    items.pushObject({ id: items.length });
  }

  @action
  removeItem(item) {
    const { items } = this;
    items.removeObject(item);
  }

  @action
  toggleFloat() {
    this.shouldFloat = !this.shouldFloat;
  }
}
