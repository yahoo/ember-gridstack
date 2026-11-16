import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import highlight from 'test-app/modifiers/highlight';

const TABS = ['preview', 'code'];

export default class ExampleCard extends Component {
  @tracked tab = 'preview';

  get isPreview() {
    return this.tab === 'preview';
  }

  get isCode() {
    return this.tab === 'code';
  }

  @action select(tab) {
    this.tab = tab;
  }

  @action onKey(event) {
    const i = TABS.indexOf(this.tab);
    const next = {
      ArrowLeft: TABS[(i + TABS.length - 1) % TABS.length],
      ArrowRight: TABS[(i + 1) % TABS.length],
      Home: TABS[0],
      End: TABS[TABS.length - 1],
    }[event.key];
    if (!next) return;
    event.preventDefault();
    this.tab = next;
    document.getElementById(`${this.args.id}-tab-${next}`)?.focus();
  }

  <template>
    <div class="example-card" id={{@id}}>
      {{! template-lint-disable no-invalid-interactive }}
      <div
        role="tablist"
        aria-label="Example view"
        class="tabs"
        {{on "keydown" this.onKey}}
      >
        <button
          type="button"
          role="tab"
          id="{{@id}}-tab-preview"
          aria-controls="{{@id}}-panel-preview"
          aria-selected={{if this.isPreview "true" "false"}}
          tabindex={{if this.isPreview "0" "-1"}}
          {{on "click" (fn this.select "preview")}}
        >Preview</button>
        <button
          type="button"
          role="tab"
          id="{{@id}}-tab-code"
          aria-controls="{{@id}}-panel-code"
          aria-selected={{if this.isCode "true" "false"}}
          tabindex={{if this.isCode "0" "-1"}}
          {{on "click" (fn this.select "code")}}
        >Code</button>
      </div>
      <div class="example-stage">
        <div
          role="tabpanel"
          id="{{@id}}-panel-preview"
          aria-labelledby="{{@id}}-tab-preview"
          class="example-preview {{unless this.isPreview 'is-hidden'}}"
          inert={{this.isCode}}
        >
          {{yield}}
        </div>
        <div
          role="tabpanel"
          id="{{@id}}-panel-code"
          aria-labelledby="{{@id}}-tab-code"
          class="example-code {{unless this.isCode 'is-hidden'}}"
          inert={{this.isPreview}}
        >
          <pre class="code" tabindex="0"><code
              {{highlight lang=@lang}}
            >{{@source}}</code></pre>
        </div>
      </div>
    </div>
  </template>
}
