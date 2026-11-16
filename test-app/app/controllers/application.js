import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import * as snippets from 'test-app/utils/snippets';

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
  @tracked shouldFloat = true;
  @tracked lastEvent = 'none yet';

  snippets = snippets;
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
  toggleFloat() {
    this.shouldFloat = !this.shouldFloat;
  }

  @action
  logChange(event, nodes) {
    const count = nodes?.length ?? 0;
    this.lastEvent = `change (${count} item${count === 1 ? '' : 's'})`;
  }
}
