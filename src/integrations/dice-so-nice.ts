import { MODULE_ID, type CheatState } from '~/constants';

type DsnHookFn = (messageId: string, context: Record<string, any>) => void;
const onDsnHook = (hook: string, fn: DsnHookFn) => (Hooks.on as (hook: string, fn: DsnHookFn) => number)(hook, fn);

interface DiceColors { colorset: string; foreground: string; background: string; outline: string; edge: string }

const CHEAT_COLORS: Record<string, DiceColors> = {
  better: {
    colorset: 'custom',
    foreground: '#ffffff',
    background: '#27ae60',
    outline: '#2ecc71',
    edge: '#1e8449',
  },
  worse: {
    colorset: 'custom',
    foreground: '#ffffff',
    background: '#c0392b',
    outline: '#e74c3c',
    edge: '#922b21',
  },
};

export function initDiceSoNice(): void {
  const dsn = (game.modules as any)?.get('dice-so-nice');
  if (!dsn?.active) return;

  onDsnHook('diceSoNiceRollStart', (messageId, context) => {
    const message = (game.messages as any)?.get(messageId);
    if (!message) return;

    const { rolls } = message;
    if (!rolls?.length) return;

    const cheatedRoll = rolls.find((r: any) => r.options?.fumbleSwitchCheated);
    if (!cheatedRoll) return;

    const direction = cheatedRoll.options.fumbleSwitchDirection as CheatState;
    const colors = CHEAT_COLORS[direction];
    if (!colors) return;

    const explicitMode = (game.settings! as any).get(MODULE_ID, 'explicitMode') as boolean;
    const isGm = game.user?.isGM ?? false;

    if (!explicitMode && !isGm) return;

    if (context.appearance) {
      Object.assign(context.appearance, colors);
    }
  });
}
