import type { DieResult, StrategyContext } from './index';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function applyThreshold(results: DieResult[], context: StrategyContext): void {
  const thresholdValue = Math.ceil(context.faces * (context.thresholdPercent / 100));

  results.filter((r) => r.active).forEach((r) => {
    let shouldReroll: boolean;
    if (context.direction === 'better') {
      shouldReroll = r.result <= thresholdValue;
    } else {
      shouldReroll = r.result > context.faces - thresholdValue;
    }

    if (shouldReroll) {
      const secondRoll = randomInt(1, context.faces);
      if (context.direction === 'better') {
        r.result = Math.max(r.result, secondRoll);
      } else {
        r.result = Math.min(r.result, secondRoll);
      }
    }
  });
}
