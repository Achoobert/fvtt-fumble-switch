import {
  MODULE_ID, DIE_TYPES, DEFAULT_NUDGE_VALUES, DEFAULT_AFFECTED_DICE, type DieType, type PositiveDirection,
} from '~/constants';

const s = () => game.settings! as any;

export class FumbleSwitchSettingsMenu extends foundry.appv1.api.FormApplication {
  public static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'fumble-switch-settings-menu',
      title: game.i18n!.localize('FUMBLE_SWITCH.settingsMenu.title'),
      template: `modules/${MODULE_ID}/templates/settings-menu.hbs`,
      width: 480,
      closeOnSubmit: true,
    });
  }

  public getData() {
    const nudgeValues = s().get(MODULE_ID, 'nudgeValues') as Record<DieType, number>;
    const affectedDice = s().get(MODULE_ID, 'affectedDice') as Record<DieType, boolean>;
    const positiveDirection = s().get(MODULE_ID, 'positiveDirection') as PositiveDirection;
    const overrides = s().get(MODULE_ID, 'positiveDirectionOverrides') as Record<string, PositiveDirection>;

    const dice = DIE_TYPES.map((die) => ({
      die,
      nudgeValue: nudgeValues[die] ?? DEFAULT_NUDGE_VALUES[die],
      affected: affectedDice[die] ?? DEFAULT_AFFECTED_DICE[die],
      direction: overrides[die] ?? positiveDirection,
      isOverridden: die in overrides,
    }));

    return { dice, globalDirection: positiveDirection };
  }

  public async _updateObject(_event: Event, formData: Record<string, unknown>) {
    const nudgeValues: Record<string, number> = {};
    const affectedDice: Record<string, boolean> = {};
    const overrides: Record<string, PositiveDirection> = {};
    const globalDirection = s().get(MODULE_ID, 'positiveDirection') as PositiveDirection;

    DIE_TYPES.forEach((die) => {
      nudgeValues[die] = Number(formData[`nudge-${die}`]) || DEFAULT_NUDGE_VALUES[die];
      affectedDice[die] = Boolean(formData[`affected-${die}`]);
      const dir = formData[`direction-${die}`] as PositiveDirection;
      if (dir && dir !== globalDirection) {
        overrides[die] = dir;
      }
    });

    await s().set(MODULE_ID, 'nudgeValues', nudgeValues);
    await s().set(MODULE_ID, 'affectedDice', affectedDice);
    await s().set(MODULE_ID, 'positiveDirectionOverrides', overrides);
  }
}
