export const MODULE_ID = 'fumble-switch';

export const DIE_TYPES = [ 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100' ] as const;
export type DieType = typeof DIE_TYPES[number];

export type CheatState = 'off' | 'better' | 'worse';
export type CheatStrategy = 'full' | 'bias' | 'nudge' | 'threshold' | 'fixed';
export type PositiveDirection = 'higher' | 'lower';

export const DEFAULT_NUDGE_VALUES: Record<DieType, number> = {
  d4: 1,
  d6: 2,
  d8: 2,
  d10: 3,
  d12: 3,
  d20: 4,
  d100: 15,
};

export const DEFAULT_AFFECTED_DICE: Record<DieType, boolean> = {
  d4: true,
  d6: true,
  d8: true,
  d10: true,
  d12: true,
  d20: true,
  d100: true,
};

/** For Fixed strategy: exact face when cheat is better vs worse (clamped to die range). */
export const DEFAULT_FIXED_VALUES: Record<DieType, { better: number; worse: number }> = {
  d4: { better: 4, worse: 1 },
  d6: { better: 6, worse: 1 },
  d8: { better: 8, worse: 1 },
  d10: { better: 10, worse: 1 },
  d12: { better: 12, worse: 1 },
  d20: { better: 20, worse: 1 },
  d100: { better: 100, worse: 1 },
};
