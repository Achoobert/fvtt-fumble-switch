import type { CheatState, CheatStrategy, PositiveDirection } from '~/constants';
import { applyFull } from './full';
import { applyBias } from './bias';
import { applyNudge } from './nudge';
import { applyThreshold } from './threshold';

export type CheatDirection = 'better' | 'worse';

export interface DieResult {
  result: number;
  active: boolean;
}

export interface StrategyContext {
  direction: CheatDirection;
  faces: number;
  nudgeValue: number;
  thresholdPercent: number;
}

export function resolveDirection(state: CheatState, positiveDirection: PositiveDirection): CheatDirection | null {
  if (state === 'off') return null;
  if (positiveDirection === 'lower') {
    return state === 'better' ? 'worse' : 'better';
  }
  return state;
}

export function applyStrategy(
  strategy: CheatStrategy,
  results: DieResult[],
  context: StrategyContext,
): void {
  switch (strategy) {
    case 'full':
      applyFull(results, context);
      break;
    case 'bias':
      applyBias(results, context);
      break;
    case 'nudge':
      applyNudge(results, context);
      break;
    case 'threshold':
      applyThreshold(results, context);
      break;
    default:
      break;
  }
}
