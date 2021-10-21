import Component from '@glimmer/component';

export default class EventListener extends Component {
  constructor() {
    super(...arguments);
    this.args.init();
  }
}
