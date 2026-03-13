import '~/ui/widget.scss';
import { MODULE_ID } from '~/constants';
import { registerSettings } from '~/settings';
import { patchRollEvaluate } from '~/cheat/patch';
import { renderWidget } from '~/ui/widget';
import { initDiceSoNice } from '~/integrations/dice-so-nice';

Hooks.once('init', () => {
  registerSettings();
  patchRollEvaluate();
});

Hooks.once('ready', () => {
  renderWidget();
  initDiceSoNice();
});

Hooks.on('createChatMessage', (message: ChatMessage) => {
  if (!game.user?.isGM) return;
  const explicitMode = game.settings.get(MODULE_ID, 'explicitMode');
  if (!explicitMode) return;

  const { rolls } = message;
  if (!rolls?.length) return;

  const cheatedRoll = rolls.find((r) => (r.options as FumbleSwitchRollOptions)?.fumbleSwitchCheated);
  if (!cheatedRoll) return;

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  ChatMessage.create({
    content: `<em>${game.i18n.localize('FUMBLE_SWITCH.explicit.message')}</em>`,
    speaker: { alias: game.i18n.localize('FUMBLE_SWITCH.explicit.speaker') },
  });
});
