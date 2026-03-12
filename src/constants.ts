export const MODULE_ID = 'fumble-switch';

export const DIE_TYPES = [ 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100' ] as const;
export type DieType = typeof DIE_TYPES[number];

export type CheatState = 'off' | 'better' | 'worse';
export type CheatStrategy = 'full' | 'bias' | 'nudge' | 'threshold';
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
