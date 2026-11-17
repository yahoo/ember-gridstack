import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
/* eslint-disable ember/no-runloop -- settled() waits for runloop timers */
import { cancel, later, next } from '@ember/runloop';
import GridStack from 'ember-gridstack/components/grid-stack';

// tests shorten the load and turn the ticking off
export const loading = { ms: 1500, tick: true };

class Shared {
  @tracked created = 0;
  @tracked keep = false;
}
const shared = new Shared();

const DATA = [4, 7, 5, 9, 6, 8, 3];

class Report extends Component {
  @tracked loaded = false;
  @tracked loadedAt = '';
  @tracked ticks = 0;
  timers = [];

  constructor() {
    super(...arguments);
    // the counter is already rendered in this pass
    next(() => shared.created++);
    const { widget } = this.args;
    this.ticks = widget.droppedFrom?.state?.ticks ?? 0;
    widget.beforeRemove(({ unstable_keep }) =>
      shared.keep
        ? (unstable_keep?.() ?? { ticks: this.ticks })
        : { ticks: this.ticks },
    );
    widget.registerSerializer(() => ({ ticks: this.ticks }));
    this.timers.push(later(this, this.done, loading.ms));
  }

  done() {
    this.loaded = true;
    this.loadedAt = new Date().toLocaleTimeString();
    this.tick();
  }

  tick() {
    if (!loading.tick || this.isDestroying) return;
    this.timers.push(
      later(
        this,
        () => {
          this.ticks++;
          this.tick();
        },
        1000,
      ),
    );
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.timers.forEach(cancel);
  }

  get bars() {
    const max = Math.max(...DATA);
    return DATA.map((v, i) => ({
      x: i * 14 + 2,
      y: 40 - (v / max) * 38,
      h: (v / max) * 38,
    }));
  }

  <template>
    <div class="widget">
      <div class="widget-label">Report</div>
      {{#if this.loaded}}
        <svg
          class="keep-chart bars"
          viewBox="0 0 100 40"
          aria-hidden="true"
        >
          {{#each this.bars as |b|}}
            <rect x={{b.x}} y={{b.y}} width="10" height={{b.h}} />
          {{/each}}
        </svg>
        <div class="widget-foot">loaded at
          {{this.loadedAt}}
          ·
          <output class="keep-ticks">{{this.ticks}}</output>
          ticks</div>
      {{else}}
        <div
          class="keep-spinner"
          role="status"
          aria-label="Loading"
        ></div>
      {{/if}}
    </div>
  </template>
}

const Note = <template>
  <div class="widget">
    <div class="widget-label">Note</div>
    <p class="widget-body">{{@props.text}}</p>
  </div>
</template>;

const LEFT = [
  { id: 'report', x: 0, y: 0, w: 2, h: 2, component: 'report' },
];

const RIGHT = [
  {
    id: 'keep-note',
    x: 0,
    y: 0,
    w: 1,
    h: 1,
    component: 'note',
    props: { text: 'Drop here' },
  },
];

const OPTIONS = {
  acceptWidgets: true,
  cellHeight: 80,
  margin: 6,
  column: 4,
  minRow: 2,
};

export default class KeepInsteadOfRebuild extends Component {
  @tracked showLeft = true;
  components = { report: Report, note: Note };
  shared = shared;

  constructor() {
    super(...arguments);
    shared.keep = false;
    shared.created = 0;
  }

  @action toggleKeep(event) {
    shared.keep = event.target.checked;
  }

  @action toggleLeft() {
    this.showLeft = !this.showLeft;
  }

  <template>
    <div class="keep-example">
      <p class="example-lead"><span class="badge">unstable</span>
        The API may change. Without keep, moving the report to the
        right grid rebuilds it and it loads again; with keep on, the
        same instance moves. Destroying the left grid afterwards
        rebuilds it in the right grid from
        <code>droppedFrom.state</code>.</p>
      <dl class="hook-legend">
        <dt><code>beforeRemove</code></dt>
        <dd>Returns
          <code>{ ticks }</code>, or
          <code>unstable_keep()</code>
          when keep is on.</dd>
        <dt><code>unstable_keep</code></dt>
        <dd>Keeps the component instance; only passed while the source
          grid is rendered.</dd>
        <dt><code>droppedFrom.state</code></dt>
        <dd>The ticks a rebuilt report starts from.</dd>
        <dt><code>registerSerializer</code></dt>
        <dd>Adds
          <code>ticks</code>
          to
          <code>props</code>
          on save.</dd>
      </dl>
      <div class="toolbar">
        <label><input
            type="checkbox"
            class="keep-toggle"
            checked={{this.shared.keep}}
            {{on "change" this.toggleKeep}}
          />
          unstable_keep</label>
        <button
          type="button"
          class="button keep-destroy"
          {{on "click" this.toggleLeft}}
        >{{if
            this.showLeft
            "Destroy left grid"
            "Restore left grid"
          }}</button>
        <output class="keep-created">created
          {{this.shared.created}}
          times</output>
      </div>
      <div class="data-mode-grids">
        <figure class="data-mode-pane">
          <figcaption>Left grid</figcaption>
          {{#if this.showLeft}}
            <GridStack
              class="data-mode-grid keep-left"
              aria-label="Left grid"
              @options={{OPTIONS}}
              @layout={{LEFT}}
              @components={{this.components}}
            />
          {{/if}}
        </figure>
        <figure class="data-mode-pane">
          <figcaption>Right grid</figcaption>
          <GridStack
            class="data-mode-grid keep-right"
            aria-label="Right grid"
            @options={{OPTIONS}}
            @layout={{RIGHT}}
            @components={{this.components}}
          />
        </figure>
      </div>
    </div>
  </template>
}
