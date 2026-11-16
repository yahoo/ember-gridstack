import Service from '@ember/service';
import type GridStackComponent from '../components/grid-stack';

/** @deprecated grids are found through their element; use `grid.Item`. */
export default class GridStackRegistry extends Service {
  registerGrid(id: string, grid: GridStackComponent): void;
  findGridComponent(element: Element): GridStackComponent | undefined;
  unregisterGridComponent(id: string): void;
}
