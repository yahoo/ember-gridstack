export const KEEP = Symbol('unstable_keep');

export default class BeforeRemove<Ctx = void> {
  private fns = new Set<(ctx: Ctx) => unknown>();

  add = (fn: (ctx: Ctx) => unknown): (() => void) => {
    this.fns.add(fn);
    return () => this.fns.delete(fn);
  };

  run(ctx: Ctx): { keep: boolean; state: unknown } {
    let state: unknown;
    let keep = false;
    this.fns.forEach((fn) => {
      const result = fn(ctx);
      if (result === KEEP) keep = true;
      else if (state === undefined) state = result;
    });
    return { keep, state };
  }
}
