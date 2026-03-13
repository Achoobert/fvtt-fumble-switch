import type { DieType } from '~/constants';
import { getCheatConfig, isDieAffected, getPositiveDirection, getNudgeValue } from './state';
import { applyStrategy, resolveDirection, type DieResult, type StrategyContext } from './strategies';

function getDieType(faces: number): DieType | null {
  const key = `d${faces}` as DieType;
  const validTypes: string[] = [ 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100' ];
  return validTypes.includes(key) ? key : null;
}

export function patchRollEvaluate(): void {
  // Patch Die.prototype.roll to modify results BEFORE system post-processing
  const dieProto = foundry.dice.terms.Die.prototype as FumbleSwitchDie;
  const originalRoll = dieProto.roll.bind(dieProto);

  type DieEvalOptions = Partial<foundry.dice.terms.DiceTerm.EvaluationOptions>;
  type DieRollResult = foundry.dice.terms.DiceTerm.Result;

  dieProto.roll = async function patchedRoll(this: FumbleSwitchDie, options?: DieEvalOptions): Promise<DieRollResult> {
    const result = await originalRoll.call(this, options);

    const config = getCheatConfig();
    if (config.state === 'off') return result;

    const { faces } = this;
    if (!faces) return result;

    const dieType = getDieType(faces);
    if (!dieType || !isDieAffected(dieType)) return result;

    const positiveDirection = getPositiveDirection(dieType);
    const direction = resolveDirection(config.state, positiveDirection);
    if (!direction) return result;

    const context: StrategyContext = {
      direction,
      faces,
      nudgeValue: getNudgeValue(dieType),
      thresholdPercent: config.thresholdPercent,
    };

    // Wrap single result in array for strategy functions (they mutate in place)
    const wrapper: DieResult[] = [ result as DieResult ];
    applyStrategy(config.strategy, wrapper, context);

    // Mark this die term as cheated for explicit mode detection
    this._fumbleSwitchCheated = true;
    this._fumbleSwitchDirection = config.state;

    return result;
  };

  // Lightweight Roll.evaluate patch for explicit mode flagging
  const rollProto = Roll.prototype;
  const originalEvaluate = rollProto.evaluate.bind(rollProto);
  type EvaluatedRoll = Roll.Evaluated<Roll>;

  rollProto.evaluate = async function patchedEvaluate(this: Roll, options?: Roll.Options): Promise<EvaluatedRoll> {
    const result = await originalEvaluate.call(this, options);

    const config = getCheatConfig();
    if (!config.explicitMode) return result;

    const cheated = result.terms.some((term) => (term as FumbleSwitchDie)._fumbleSwitchCheated);
    if (cheated) {
      (result.options as FumbleSwitchRollOptions).fumbleSwitchCheated = true;
      (result.options as FumbleSwitchRollOptions).fumbleSwitchDirection = config.state;
    }

    return result;
  };
}
