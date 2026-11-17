import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

/**
 * `{{lifecycle setup=fn update=fn teardown=fn options=@options}}`: `setup` on
 * insert, `update` whenever a named arg (e.g. `options`) changes, `teardown`
 * on destroy.
 */
export default class Lifecycle extends Modifier {
  installed = false;

  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, () => this.teardown?.());
  }

  // eslint-disable-next-line no-unused-vars
  modify(element, positional, { setup, update, teardown, ...tracked }) {
    this.teardown = teardown;
    if (this.installed) {
      update?.(element);
    } else {
      this.installed = true;
      setup?.(element);
    }
  }
}
