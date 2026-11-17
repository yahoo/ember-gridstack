import { warn } from '@ember/debug';

/** item element leaving a template grid -> `{ grid, placeholder, node }` */
export const departing = new Map();

/** item id arriving in a template grid -> `{ grid, state }` (read as `item.droppedFrom`) */
export const incoming = new Map();

export const WARN_NO_HANDLER = 'ember-gridstack.no-drop-handler';
export const WARN_NEEDS_ID = 'ember-gridstack.drop-needs-id';
export const WARN_NOT_RENDERED = 'ember-gridstack.drop-not-rendered';

export const dropWarn = (message, id) => warn(message, false, { id });
