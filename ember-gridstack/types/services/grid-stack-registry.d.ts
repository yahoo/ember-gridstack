import Service from '@ember/service';
import type { GridStack } from 'gridstack';
import type GridStackComponent from '../components/grid-stack';
import type GridStackLayoutComponent from '../components/grid-stack-layout';

type GridApi = GridStackComponent | GridStackLayoutComponent;

export default class GridStackRegistry extends Service {
  /** The yielded grid API for an element inside a grid, or a GridStack instance. */
  find(target: Element | GridStack | null | undefined): GridApi | undefined;
  /** The yielded grid API of the `<GridStack @name>` with this name. */
  get(name: string): GridApi | undefined;
  registerName(name: string, grid: GridApi): void;
  unregisterName(name: string, grid: GridApi): void;
  registerGrid(id: string, grid: GridStackComponent): void;
  findGridComponent(element: Element): GridStackComponent | undefined;
  unregisterGridComponent(id: string): void;
}
