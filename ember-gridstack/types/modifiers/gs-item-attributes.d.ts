import type { FunctionBasedModifier } from 'ember-modifier';
import type { GridStackWidget } from 'gridstack';

export interface GsItemAttributesSignature {
  Element: HTMLElement;
  Args: { Positional: [options?: GridStackWidget] };
}

export function applyItemAttributes(
  element: HTMLElement,
  options?: GridStackWidget,
  config?: { onlyRemovals?: boolean },
): void;

declare const gsItemAttributes: FunctionBasedModifier<GsItemAttributesSignature>;
export default gsItemAttributes;
