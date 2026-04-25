import {
  MODULE_ID,
  DIE_TYPES,
  DEFAULT_NUDGE_VALUES,
  DEFAULT_AFFECTED_DICE,
  DEFAULT_FIXED_VALUES,
  type DieType,
  type PositiveDirection,
} from '~/constants';

function clampDieFace(die: DieType, value: number, fallback: number): number {
  const max = Number(die.slice(1));
  if (!Number.isFinite(value)) return Math.max(1, Math.min(max, fallback));
  return Math.max(1, Math.min(max, Math.round(value)));
}

const s = () => game.settings!;

export class FumbleSwitchSettingsMenu extends foundry.appv1.api.FormApplication {
  public static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'fumble-switch-settings-menu',
      title: game.i18n!.localize('FUMBLE_SWITCH.settingsMenu.title'),
      template: `modules/${MODULE_ID}/templates/settings-menu.hbs`,
      width: 640,
      closeOnSubmit: true,
    });
  }

  public getData() {
    const nudgeValues = s().get(MODULE_ID, 'nudgeValues');
    const fixedValues = s().get(MODULE_ID, 'fixedValues') as Partial<
      Record<DieType, { better?: number; worse?: number }>
    >;
    const affectedDice = s().get(MODULE_ID, 'affectedDice');
    const positiveDirection = s().get(MODULE_ID, 'positiveDirection');
    const overrides = s().get(MODULE_ID, 'positiveDirectionOverrides');

    const dice = DIE_TYPES.map((die) => {
      const defFixed = DEFAULT_FIXED_VALUES[die];
      const rowFixed = fixedValues[die];
      return {
        die,
        nudgeValue: nudgeValues[die] ?? DEFAULT_NUDGE_VALUES[die],
        fixedBetter: clampDieFace(die, rowFixed?.better ?? NaN, defFixed.better),
        fixedWorse: clampDieFace(die, rowFixed?.worse ?? NaN, defFixed.worse),
        affected: affectedDice[die] ?? DEFAULT_AFFECTED_DICE[die],
        direction: overrides[die] ?? positiveDirection,
        isOverridden: die in overrides,
      };
    });

    return { dice, globalDirection: positiveDirection };
  }

  public async _updateObject(_event: Event, formData: Record<string, unknown>) {
    const nudgeValues: Record<string, number> = {};
    const fixedValues: Record<string, { better: number; worse: number }> = {};
    const affectedDice: Record<string, boolean> = {};
    const overrides: Record<string, PositiveDirection> = {};
    const globalDirection = s().get(MODULE_ID, 'positiveDirection') as PositiveDirection;

    DIE_TYPES.forEach((die) => {
      const raw = Number(formData[`nudge-${die}`]);
      nudgeValues[die] = Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_NUDGE_VALUES[die];
      const defFixed = DEFAULT_FIXED_VALUES[die];
      fixedValues[die] = {
        better: clampDieFace(die, Number(formData[`fixedBetter-${die}`]), defFixed.better),
        worse: clampDieFace(die, Number(formData[`fixedWorse-${die}`]), defFixed.worse),
      };
      affectedDice[die] = Boolean(formData[`affected-${die}`]);
      const dir = formData[`direction-${die}`] as PositiveDirection;
      if (dir && dir !== globalDirection) {
        overrides[die] = dir;
      }
    });

    await s().set(MODULE_ID, 'nudgeValues', nudgeValues);
    await s().set(MODULE_ID, 'fixedValues', fixedValues);
    await s().set(MODULE_ID, 'affectedDice', affectedDice);
    await s().set(MODULE_ID, 'positiveDirectionOverrides', overrides);
  }
}
