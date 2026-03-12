import type { DieResult, StrategyContext } from './index';

export function applyNudge(results: DieResult[], context: StrategyContext): void {
  results.filter((r) => r.active).forEach((r) => {
    const delta = context.direction === 'better' ? context.nudgeValue : -context.nudgeValue;
    r.result = Math.max(1, Math.min(context.faces, r.result + delta));
  });
}
