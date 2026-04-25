import {
  MODULE_ID,
  type CheatState,
  type CheatStrategy,
  type DieType,
  type PositiveDirection,
  DEFAULT_NUDGE_VALUES,
  DEFAULT_AFFECTED_DICE,
  DEFAULT_FIXED_VALUES,
} from '~/constants';

const s = () => game.settings!;

export interface CheatConfig {
  state: CheatState;
  strategy: CheatStrategy;
  thresholdPercent: number;
  explicitMode: boolean;
  debugMode: boolean;
}

export function getCheatState(): CheatState {
  const isGm = game.user?.isGM ?? false;
  if (isGm) return s().get(MODULE_ID, 'cheatStateGm') as CheatState;

  const userId = game.user?.id;
  if (userId) {
    const overrides = s().get(MODULE_ID, 'cheatStatePlayerOverrides');
    const override = overrides[userId];
    if (override && override !== 'off') return override;
  }
  return s().get(MODULE_ID, 'cheatStatePlayers') as CheatState;
}

export function getCheatConfig(): CheatConfig {
  return {
    state: getCheatState(),
    strategy: s().get(MODULE_ID, 'cheatStrategy') as CheatStrategy,
    thresholdPercent: s().get(MODULE_ID, 'thresholdPercent'),
    explicitMode: s().get(MODULE_ID, 'explicitMode') as boolean,
    debugMode: s().get(MODULE_ID, 'debugMode') as boolean,
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

function clampDieFace(dieType: DieType, value: number, fallback: number): number {
  const max = Number(dieType.slice(1));
  if (!Number.isFinite(value)) return Math.max(1, Math.min(max, fallback));
  return Math.max(1, Math.min(max, Math.round(value)));
}

export function getFixedValues(dieType: DieType): { better: number; worse: number } {
  const stored = s().get(MODULE_ID, 'fixedValues') as Partial<Record<DieType, { better?: number; worse?: number }>>;
  const def = DEFAULT_FIXED_VALUES[dieType];
  const row = stored?.[dieType];
  return {
    better: clampDieFace(dieType, row?.better ?? NaN, def.better),
    worse: clampDieFace(dieType, row?.worse ?? NaN, def.worse),
  };
}
