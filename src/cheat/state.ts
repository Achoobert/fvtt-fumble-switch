import {
  MODULE_ID,
  type CheatState,
  type CheatStrategy,
  type DieType,
  type PositiveDirection,
  DEFAULT_NUDGE_VALUES,
  DEFAULT_AFFECTED_DICE,
} from '~/constants';

const s = () => game.settings!;

export interface CheatConfig {
  state: CheatState;
  strategy: CheatStrategy;
  thresholdPercent: number;
  explicitMode: boolean;
}

export function getCheatState(): CheatState {
  const isGm = game.user?.isGM ?? false;
  const key = isGm ? 'cheatStateGm' : 'cheatStatePlayers';
  return s().get(MODULE_ID, key) as CheatState;
}

export function getCheatConfig(): CheatConfig {
  return {
    state: getCheatState(),
    strategy: s().get(MODULE_ID, 'cheatStrategy') as CheatStrategy,
    thresholdPercent: s().get(MODULE_ID, 'thresholdPercent'),
    explicitMode: s().get(MODULE_ID, 'explicitMode') as boolean,
  };
}

export function isDieAffected(dieType: DieType): boolean {
  const affected = s().get(MODULE_ID, 'affectedDice');
  return affected[dieType] ?? DEFAULT_AFFECTED_DICE[dieType] ?? true;
}

export function getPositiveDirection(dieType: DieType): PositiveDirection {
  const overrides = s().get(MODULE_ID, 'positiveDirectionOverrides');
  if (overrides[dieType]) return overrides[dieType];
  return s().get(MODULE_ID, 'positiveDirection') as PositiveDirection;
}

export function getNudgeValue(dieType: DieType): number {
  const values = s().get(MODULE_ID, 'nudgeValues');
  return values[dieType] ?? DEFAULT_NUDGE_VALUES[dieType] ?? 2;
}
