import { warn } from '@ember/debug';
import type { GridStack, GridStackNode } from 'gridstack';
import type GridStackComponent from '../components/grid-stack.gts';

export interface DepartingEntry {
  grid: GridStackComponent;
  placeholder: Comment;
  claimed?: boolean;
}

/** item element leaving a template grid -> `{ grid, placeholder, node }` */
export const departing = new Map<Element, DepartingEntry>();

/** target grid of the drop being rendered: a new item has no element to find its grid by yet */
export const activeDrop: { grid: GridStackComponent | null } = { grid: null };

export const WARN_NO_HANDLER = 'ember-gridstack.no-drop-handler';
export const WARN_NEEDS_ID = 'ember-gridstack.drop-needs-id';
export const WARN_NOT_RENDERED = 'ember-gridstack.drop-not-rendered';
export const WARN_ID_COLLISION = 'ember-gridstack.drop-id-collision';

export const hasIdCollision = (
  gridStack: GridStack | null,
  node: GridStackNode | undefined,
) =>
  Boolean(
    node?.grid &&
    node.grid !== gridStack &&
    node.id !== undefined &&
    gridStack?.engine.nodes.some((n) => n.id === node.id),
  );

export const ID_COLLISION_MESSAGE =
  'The target grid already has a widget with this id; the drop was refused.';

export const dropWarn = (message: string, id: string) =>
  warn(message, false, { id });
