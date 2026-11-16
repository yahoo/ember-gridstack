import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import * as snippets from 'test-app/utils/snippets';
import Responsive from 'test-app/components/examples/responsive';
import FillHeight from 'test-app/components/examples/fill-height';
import Nested from 'test-app/components/examples/nested';
import SaveLoad from 'test-app/components/examples/save-load';
import AddRemove from 'test-app/components/examples/add-remove';
import Locked from 'test-app/components/examples/locked';
import DataMode from 'test-app/components/examples/data-mode';
import responsiveSrc from 'test-app/components/examples/responsive.gjs?raw';
import fillHeightSrc from 'test-app/components/examples/fill-height.gjs?raw';
import nestedSrc from 'test-app/components/examples/nested.gjs?raw';
import saveLoadSrc from 'test-app/components/examples/save-load.gjs?raw';
import addRemoveSrc from 'test-app/components/examples/add-remove.gjs?raw';
import lockedSrc from 'test-app/components/examples/locked.gjs?raw';
import dataModeSrc from 'test-app/components/examples/data-mode.gjs?raw';

const MODE_DESCRIPTIONS = {
  top: 'pulls widgets up',
  float: 'widgets stay where placed',
  list: 'one column, order by position',
  compact: 'reflow to fill gaps',
};

const LOG_SIZE = 8;

const TRAFFIC = [
  { label: 'Mon', value: 42 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 51 },
  { label: 'Thu', value: 73 },
  { label: 'Fri', value: 66 },
  { label: 'Sat', value: 31 },
  { label: 'Sun', value: 27 },
];

const LATENCY = [212, 198, 205, 187, 240, 226, 190, 181, 176, 184, 172, 168];

export default class ApplicationController extends Controller {
  @tracked items = [];
  @tracked mode = 'float';
  @tracked events = [];

  snippets = snippets;
  modes = Object.keys(MODE_DESCRIPTIONS);
  modeDescriptions = MODE_DESCRIPTIONS;

  examples = [
    {
      id: 'responsive',
      title: 'Responsive columns',
      component: Responsive,
      source: responsiveSrc,
    },
    {
      id: 'fill',
      title: "cellHeight: 'fill'",
      component: FillHeight,
      source: fillHeightSrc,
    },
    {
      id: 'nested',
      title: 'Nested grid',
      component: Nested,
      source: nestedSrc,
    },
    {
      id: 'save-load',
      title: 'Save and load a layout',
      component: SaveLoad,
      source: saveLoadSrc,
    },
    {
      id: 'add-remove',
      title: 'Add and remove widgets',
      component: AddRemove,
      source: addRemoveSrc,
    },
    {
      id: 'locked',
      title: 'locked, noMove, noResize',
      component: Locked,
      source: lockedSrc,
    },
    {
      id: 'data-mode',
      title: 'Data mode (@layout, spike)',
      component: DataMode,
      source: dataModeSrc,
    },
  ];

  get modeOptions() {
    return this.modes.map((value) => ({
      value,
      selected: value === this.mode,
    }));
  }

  get modeDescription() {
    return MODE_DESCRIPTIONS[this.mode];
  }
  nextId = 1;

  deploys = [
    { service: 'api-gateway', version: 'v2.14.1', when: '4 min ago' },
    { service: 'billing', version: 'v1.9.0', when: '1 h ago' },
    { service: 'search', version: 'v3.2.7', when: '3 h ago' },
    { service: 'web', version: 'v5.0.2', when: 'yesterday' },
  ];

  services = [
    { name: 'API', uptime: '99.99%', degraded: false },
    { name: 'Auth', uptime: '99.98%', degraded: false },
    { name: 'Search', uptime: '99.71%', degraded: true },
    { name: 'Webhooks', uptime: '99.95%', degraded: false },
  ];

  get bars() {
    const max = Math.max(...TRAFFIC.map((d) => d.value));
    return TRAFFIC.map((d, i) => {
      const h = Math.round((d.value / max) * 80);
      return { ...d, x: i * 20 + 4, y: 90 - h, h };
    });
  }

  get latencyPoints() {
    const max = Math.max(...LATENCY);
    const min = Math.min(...LATENCY);
    return LATENCY.map(
      (v, i) =>
        `${Math.round((i / (LATENCY.length - 1)) * 140)},${Math.round(
          4 + ((max - v) / (max - min)) * 32,
        )}`,
    ).join(' ');
  }

  @action
  changeItems() {
    this.items = [...this.items, { id: this.nextId++ }];
  }

  @action
  removeItem(item) {
    this.items = this.items.filter((i) => i !== item);
  }

  @action
  setMode(event) {
    this.mode = event.target.value;
  }

  // args are (event, nodes[]) or (event, element) or (event, prev, node)
  @action
  log(name, event, ...args) {
    const ids = args
      .flat()
      .filter(Boolean)
      .map((x) => (x instanceof Element ? x.gridstackNode?.id : x.id))
      .filter(Boolean);
    const entry = { name, ids: [...new Set(ids)].join(', '), count: 1 };
    const [last, ...rest] = this.events;
    // drag/resize fire on every move; fold repeats into one row
    if (last && last.name === entry.name && last.ids === entry.ids) {
      const count = last.count + 1;
      this.events = [{ ...last, count, repeat: `×${count}` }, ...rest];
    } else {
      this.events = [entry, ...this.events].slice(0, LOG_SIZE);
    }
  }
}
