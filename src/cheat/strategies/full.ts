import type { DieResult, StrategyContext } from './index';

export function applyFull(results: DieResult[], context: StrategyContext): void {
  results.filter((r) => r.active).forEach((r) => {
    r.result = context.direction === 'better' ? context.faces : 1;
  });
}
