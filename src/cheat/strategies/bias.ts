import type { DieResult, StrategyContext } from './index';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isBetter(a: number, b: number, direction: 'better' | 'worse'): boolean {
  return direction === 'better' ? a >= b : a <= b;
}

export function applyBias(results: DieResult[], context: StrategyContext): void {
  results.filter((r) => r.active).forEach((r) => {
    const secondRoll = randomInt(1, context.faces);
    if (isBetter(secondRoll, r.result, context.direction)) {
      r.result = secondRoll;
    }
  });
}
