import { MODULE_ID, DEFAULT_NUDGE_VALUES, DEFAULT_AFFECTED_DICE } from '~/constants';
import { FumbleSwitchSettingsMenu } from '~/ui/settings-menu';

const s = () => game.settings!;

export function registerSettings(): void {
  s().register(MODULE_ID, 'cheatStrategy', {
    name: 'FUMBLE_SWITCH.settings.cheatStrategy.name',
    hint: 'FUMBLE_SWITCH.settings.cheatStrategy.hint',
    scope: 'world',
    config: true,
    type: String,
    default: 'bias',
    choices: {
      full: 'FUMBLE_SWITCH.settings.cheatStrategy.full',
      bias: 'FUMBLE_SWITCH.settings.cheatStrategy.bias',
      nudge: 'FUMBLE_SWITCH.settings.cheatStrategy.nudge',
      threshold: 'FUMBLE_SWITCH.settings.cheatStrategy.threshold',
    },
  });

  s().register(MODULE_ID, 'positiveDirection', {
    name: 'FUMBLE_SWITCH.settings.positiveDirection.name',
    hint: 'FUMBLE_SWITCH.settings.positiveDirection.hint',
    scope: 'world',
    config: true,
    type: String,
    default: 'higher',
    choices: {
      higher: 'FUMBLE_SWITCH.settings.positiveDirection.higher',
      lower: 'FUMBLE_SWITCH.settings.positiveDirection.lower',
    },
  });

  s().register(MODULE_ID, 'thresholdPercent', {
    name: 'FUMBLE_SWITCH.settings.thresholdPercent.name',
    hint: 'FUMBLE_SWITCH.settings.thresholdPercent.hint',
    scope: 'world',
    config: true,
    type: Number,
    default: 25,
    range: {
      min: 1,
      max: 50,
      step: 1,
    },
  });

  s().register(MODULE_ID, 'explicitMode', {
    name: 'FUMBLE_SWITCH.settings.explicitMode.name',
    hint: 'FUMBLE_SWITCH.settings.explicitMode.hint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  s().registerMenu(MODULE_ID, 'diceSettingsMenu', {
    name: 'FUMBLE_SWITCH.settings.diceSettingsMenu.name',
    label: 'FUMBLE_SWITCH.settings.diceSettingsMenu.label',
    hint: 'FUMBLE_SWITCH.settings.diceSettingsMenu.hint',
    icon: 'fas fa-dice',
    type: FumbleSwitchSettingsMenu,
    restricted: true,
  });

  // Hidden settings (managed by custom menu)
  s().register(MODULE_ID, 'positiveDirectionOverrides', {
    scope: 'world',
    config: false,
    type: Object,
    default: {},
  });

  s().register(MODULE_ID, 'nudgeValues', {
    scope: 'world',
    config: false,
    type: Object,
    default: DEFAULT_NUDGE_VALUES,
  });

  s().register(MODULE_ID, 'affectedDice', {
    scope: 'world',
    config: false,
    type: Object,
    default: DEFAULT_AFFECTED_DICE,
  });

  // Widget state settings
  s().register(MODULE_ID, 'cheatStatePlayers', {
    scope: 'world',
    config: false,
    type: String,
    default: 'off',
  });

  s().register(MODULE_ID, 'cheatStateGm', {
    scope: 'world',
    config: false,
    type: String,
    default: 'off',
  });

  s().register(MODULE_ID, 'widgetPosition', {
    scope: 'client',
    config: false,
    type: Object,
    default: { top: 100, left: 100 },
  });
}
