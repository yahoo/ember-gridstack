import Modifier from 'ember-modifier';
import type Owner from '@ember/owner';
import type { ArgsFor } from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

type Hook = (element: HTMLElement) => void;

interface LifecycleSignature {
  Element: HTMLElement;
  Args: {
    Named: {
      setup?: Hook;
      update?: Hook;
      teardown?: () => void;
      [tracked: string]: unknown;
    };
  };
}

/**
 * `{{lifecycle setup=fn update=fn teardown=fn options=@options}}`: `setup` on
 * insert, `update` whenever a named arg (e.g. `options`) changes, `teardown`
 * on destroy.
 */
export default class Lifecycle extends Modifier<LifecycleSignature> {
  installed = false;
  teardown?: () => void;

  constructor(owner: Owner, args: ArgsFor<LifecycleSignature>) {
    super(owner, args);
    registerDestructor(this, () => this.teardown?.());
  }

  modify(
    element: HTMLElement,
    _positional: [],
    {
      setup,
      update,
      teardown,
      // read only so the modifier re-runs when the other args change
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ...tracked
    }: LifecycleSignature['Args']['Named'],
  ) {
    this.teardown = teardown;
    if (this.installed) {
      update?.(element);
    } else {
      this.installed = true;
      setup?.(element);
    }
  }
}
