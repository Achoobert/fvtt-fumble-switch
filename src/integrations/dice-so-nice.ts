import { MODULE_ID, type CheatState } from '~/constants';

interface DsnRollStartContext {
  roll: Roll;
  user: User;
  users: string[] | null;
  blind: boolean;
}

const CHEAT_COLORS: Record<string, DsnAppearance> = {
  better: {
    colorset: 'custom',
    labelColor: '#ffffff',
    diceColor: '#27ae60',
    outlineColor: '#2ecc71',
    edgeColor: '#1e8449',
  },
  worse: {
    colorset: 'custom',
    labelColor: '#ffffff',
    diceColor: '#c0392b',
    outlineColor: '#e74c3c',
    edgeColor: '#922b21',
  },
};

function onDsnRollStart(_messageId: string, context: DsnRollStartContext): void {
  const { roll } = context;
  if (!roll) return;

  const opts = roll.options as FumbleSwitchRollOptions;
  if (!opts?.fumbleSwitchCheated) return;

  const direction = opts.fumbleSwitchDirection as CheatState;
  const colors = CHEAT_COLORS[direction];
  if (!colors) return;

  const explicitMode = game.settings!.get(MODULE_ID, 'explicitMode');
  const isGm = game.user?.isGM ?? false;

  if (!explicitMode && !isGm) return;

  (roll.options as FumbleSwitchRollOptions).appearance = colors;
}

export function initDiceSoNice(): void {
  const dsn = game.modules?.get('dice-so-nice');
  if (!dsn?.active) return;

  (Hooks.on as (hook: string, fn: typeof onDsnRollStart) => number)('diceSoNiceRollStart', onDsnRollStart);
}
