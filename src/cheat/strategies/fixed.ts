import type { DieResult, StrategyContext, StrategyDebug } from './index';

export function applyFixed(results: DieResult[], context: StrategyContext): StrategyDebug {
  const raw = context.direction === 'better' ? context.fixedBetter : context.fixedWorse;
  const clamped = Math.max(1, Math.min(context.faces, raw));
  results.filter((r) => r.active).forEach((r) => {
    r.result = clamped;
  });
  return { fixedTarget: clamped };
}
