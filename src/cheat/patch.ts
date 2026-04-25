import type { DieType } from '~/constants';
import {
  getCheatConfig, isDieAffected, getPositiveDirection, getNudgeValue, getFixedValues,
} from './state';
import {
  applyStrategy, resolveDirection, type DieResult, type DieDebugInfo, type StrategyContext,
} from './strategies';

function getDieType(faces: number): DieType | null {
  const key = `d${faces}` as DieType;
  const validTypes: string[] = [ 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100' ];
  return validTypes.includes(key) ? key : null;
}

// Track pending cheated rolls for systems that don't attach Roll objects to chat messages
let pendingCheatedRoll = false;
let pendingDebugInfo: DieDebugInfo[] = [];

export function consumePendingCheatedRoll(): boolean {
  if (!pendingCheatedRoll) return false;
  pendingCheatedRoll = false;
  return true;
}

export function consumePendingDebugInfo(): DieDebugInfo[] {
  const info = pendingDebugInfo;
  pendingDebugInfo = [];
  return info;
}

export function patchRollEvaluate(): void {
  // Patch Die.prototype.roll to modify results BEFORE system post-processing
  const dieProto = foundry.dice.terms.Die.prototype as FumbleSwitchDie;
  const originalRoll = dieProto.roll;

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

    const originalResult = result.result;
    // Wrap single result in array for strategy functions (they mutate in place)
    const wrapper: DieResult[] = [ result as DieResult ];
    const fixed = getFixedValues(dieType);
    const context: StrategyContext = {
      direction,
      faces,
      nudgeValue: getNudgeValue(dieType),
      thresholdPercent: config.thresholdPercent,
      fixedBetter: fixed.better,
      fixedWorse: fixed.worse,
    };
    const debug = applyStrategy(config.strategy, wrapper, context);

    // Mark this die term as cheated for explicit mode detection
    this._fumbleSwitchCheated = true;
    this._fumbleSwitchDirection = config.state;

    if (config.debugMode) {
      const info: DieDebugInfo = {
        dieType,
        faces,
        strategy: config.strategy,
        direction,
        originalResult,
        finalResult: result.result,
        ...debug,
      };
      if (!this._fumbleSwitchDebug) this._fumbleSwitchDebug = [];
      this._fumbleSwitchDebug.push(info);
    }

    return result;
  };

  // Lightweight Roll.evaluate patch for explicit mode flagging
  const rollProto = Roll.prototype;
  const originalEvaluate = rollProto.evaluate;
  type EvaluatedRoll = Roll.Evaluated<Roll>;

  rollProto.evaluate = async function patchedEvaluate(this: Roll, options?: Roll.Options): Promise<EvaluatedRoll> {
    const result = await originalEvaluate.call(this, options);

    const config = getCheatConfig();
    if (!config.explicitMode && !config.debugMode) return result;

    const cheated = result.terms.some((term) => (term as FumbleSwitchDie)._fumbleSwitchCheated);
    if (!cheated) return result;

    if (config.explicitMode) {
      (result.options as FumbleSwitchRollOptions).fumbleSwitchCheated = true;
      (result.options as FumbleSwitchRollOptions).fumbleSwitchDirection = config.state;
      pendingCheatedRoll = true;
    }

    if (config.debugMode) {
      const debugInfo = result.terms.flatMap((term) => (term as FumbleSwitchDie)._fumbleSwitchDebug ?? []);
      if (debugInfo.length > 0) {
        (result.options as FumbleSwitchRollOptions).fumbleSwitchDebug = debugInfo;
        pendingDebugInfo.push(...debugInfo);
      }
    }

    return result;
  };
}
