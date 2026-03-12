import type { DieType } from '~/constants';
import { getCheatConfig, isDieAffected, getPositiveDirection, getNudgeValue } from './state';
import { applyStrategy, resolveDirection, type DieResult, type StrategyContext } from './strategies';

function getDieType(faces: number): DieType | null {
  const key = `d${faces}` as DieType;
  const validTypes: string[] = [ 'd4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100' ];
  return validTypes.includes(key) ? key : null;
}

function applyCheat(roll: Roll): void {
  const config = getCheatConfig();
  if (config.state === 'off') return;

  let cheated = false;

  roll.terms.forEach((term) => {
    if (!(term instanceof foundry.dice.terms.DiceTerm)) return;

    const { faces } = term;
    if (!faces) return;

    const dieType = getDieType(faces);
    if (!dieType || !isDieAffected(dieType)) return;

    const positiveDirection = getPositiveDirection(dieType);

    const direction = resolveDirection(config.state, positiveDirection);
    if (!direction) return;

    const context: StrategyContext = {
      direction,
      faces,
      nudgeValue: getNudgeValue(dieType),
      thresholdPercent: config.thresholdPercent,
    };

    applyStrategy(config.strategy, term.results as DieResult[], context);
    cheated = true;
  });

  if (cheated) {
    (roll as any)._total = (roll as any)._evaluateTotal();

    if (config.explicitMode) {
      (roll as any)._fumbleSwitchCheated = true;
      (roll as any)._fumbleSwitchDirection = config.state;
    }
  }
}

export function patchRollEvaluate(): void {
  const proto = Roll.prototype as any;
  const originalEvaluate = proto.evaluate;

  proto.evaluate = async function patchedEvaluate(this: Roll, options?: any): Promise<Roll> {
    const result = await originalEvaluate.call(this, options);
    applyCheat(result);
    return result;
  };
}
