import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn, hash, array } from '@ember/helper';
import { htmlSafe } from '@ember/template';
import { modifier } from 'ember-modifier';
import GridStack from 'ember-gridstack/components/grid-stack';
import GridStackItem from 'ember-gridstack/components/grid-stack-item';

const widgets = [
  { id: 'a', x: 0 },
  { id: 'b', x: 3 },
  { id: 'c', x: 6 },
  { id: 'd', x: 9 },
];

const presets = [
  { id: 'phone', label: 'Phone', width: '360px' },
  { id: 'tablet', label: 'Tablet', width: '720px' },
  { id: 'desktop', label: 'Desktop', width: '100%' },
];

// The column count follows the grid's own width:
// 1 column up to 500px, 6 up to 900px, otherwise 12.
export default class Responsive extends Component {
  @tracked width = 'desktop';
  @tracked columns = 12;

  get frameStyle() {
    const preset = presets.find((p) => p.id === this.width);
    return htmlSafe(`max-width: ${preset.width}`);
  }

  setWidth = (id) => (this.width = id);
  isActive = (id) => id === this.width;

  watchColumns = modifier((frame) => {
    let raf;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const grid = frame.querySelector('.grid-stack')?.gridstack;
        if (grid) this.columns = grid.getColumn();
      });
    });
    observer.observe(frame);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  });

  <template>
    <div class="toolbar">
      {{#each presets as |preset|}}
        <button
          type="button"
          class="button"
          aria-pressed={{if (this.isActive preset.id) "true" "false"}}
          {{on "click" (fn this.setWidth preset.id)}}
        >{{preset.label}}</button>
      {{/each}}
      <output class="column-count" aria-live="polite">
        {{this.columns}}
        columns
      </output>
    </div>
    <div class="resize-frame" style={{this.frameStyle}} {{this.watchColumns}}>
      <GridStack
        @options={{hash
          cellHeight=60
          margin=6
          columnOpts=(hash
            breakpoints=(array (hash w=500 c=1) (hash w=900 c=6)) columnMax=12
          )
        }}
      >
        {{#each widgets as |widget|}}
          <GridStackItem @options={{hash id=widget.id x=widget.x y=0 w=3 h=1}}>
            <div class="widget">
              <div class="widget-label">
                Widget
                {{widget.id}}
              </div>
            </div>
          </GridStackItem>
        {{/each}}
      </GridStack>
    </div>
  </template>
}
