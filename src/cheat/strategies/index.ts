import type { CheatState, CheatStrategy, DieType, PositiveDirection } from '~/constants';
import { applyFull } from './full';
import { applyBias } from './bias';
import { applyNudge } from './nudge';
import { applyThreshold } from './threshold';
import { applyFixed } from './fixed';

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
  fixedBetter: number;
  fixedWorse: number;
}

export interface DieDebugInfo {
  dieType: DieType;
  faces: number;
  strategy: CheatStrategy;
  direction: CheatDirection;
  originalResult: number;
  finalResult: number;
  nudgeDelta?: number;
  biasSecondRoll?: number;
  thresholdValue?: number;
  thresholdReroll?: number;
  thresholdTriggered?: boolean;
  fixedTarget?: number;
}

export function resolveDirection(state: CheatState, positiveDirection: PositiveDirection): CheatDirection | null {
  if (state === 'off') return null;
  if (positiveDirection === 'lower') {
    return state === 'better' ? 'worse' : 'better';
  }
  return state;
}

export interface StrategyDebug {
  nudgeDelta?: number;
  biasSecondRoll?: number;
  thresholdValue?: number;
  thresholdReroll?: number;
  thresholdTriggered?: boolean;
  fixedTarget?: number;
}

export function applyStrategy(
  strategy: CheatStrategy,
  results: DieResult[],
  context: StrategyContext,
): StrategyDebug {
  switch (strategy) {
    case 'full':
      applyFull(results, context);
      return {};
    case 'bias':
      return applyBias(results, context);
    case 'nudge':
      return applyNudge(results, context);
    case 'threshold':
      return applyThreshold(results, context);
    case 'fixed':
      return applyFixed(results, context);
    default:
      return {};
  }
}
