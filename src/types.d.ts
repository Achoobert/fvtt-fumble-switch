import type { CheatState, CheatStrategy, DieType, PositiveDirection } from '~/constants';
import type { DieDebugInfo } from '~/cheat/strategies';

declare global {
  interface SettingConfig {
    'fumble-switch.cheatStrategy': CheatStrategy;
    'fumble-switch.positiveDirection': PositiveDirection;
    'fumble-switch.thresholdPercent': number;
    'fumble-switch.explicitMode': boolean;
    'fumble-switch.debugMode': boolean;
    'fumble-switch.positiveDirectionOverrides': Record<string, PositiveDirection>;
    'fumble-switch.nudgeValues': Record<DieType, number>;
    'fumble-switch.fixedValues': Record<DieType, { better: number; worse: number }>;
    'fumble-switch.affectedDice': Record<DieType, boolean>;
    'fumble-switch.cheatStatePlayers': CheatState;
    'fumble-switch.cheatStateGm': CheatState;
    'fumble-switch.cheatStatePlayerOverrides': Record<string, CheatState>;
    'fumble-switch.widgetPosition': { top: number; left: number };
  }

  interface FumbleSwitchDie extends foundry.dice.terms.Die {
    _fumbleSwitchCheated?: boolean;
    _fumbleSwitchDirection?: CheatState;
    _fumbleSwitchDebug?: DieDebugInfo[];
  }

  interface DsnAppearance {
    colorset: string;
    labelColor: string;
    diceColor: string;
    outlineColor: string;
    edgeColor: string;
  }

  interface FumbleSwitchRollOptions extends Roll.Options {
    fumbleSwitchCheated?: boolean;
    fumbleSwitchDirection?: CheatState;
    fumbleSwitchDebug?: DieDebugInfo[];
    appearance?: DsnAppearance;
  }
}
