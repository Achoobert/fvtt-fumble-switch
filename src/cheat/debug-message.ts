import type { DieDebugInfo } from './strategies';

function formatSigned(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

function formatModifier(info: DieDebugInfo): string {
  const t = (key: string, data?: Record<string, string>) => game.i18n!.format(key, data);

  switch (info.strategy) {
    case 'full':
      return t('FUMBLE_SWITCH.debug.modifier.full', {
        direction: info.direction,
        value: String(info.finalResult),
      });
    case 'bias':
      return t('FUMBLE_SWITCH.debug.modifier.bias', {
        second: String(info.biasSecondRoll ?? '?'),
      });
    case 'nudge':
      return t('FUMBLE_SWITCH.debug.modifier.nudge', {
        delta: formatSigned(info.nudgeDelta ?? 0),
      });
    case 'threshold':
      if (!info.thresholdTriggered) {
        return t('FUMBLE_SWITCH.debug.modifier.thresholdSkipped', {
          threshold: String(info.thresholdValue ?? '?'),
        });
      }
      return t('FUMBLE_SWITCH.debug.modifier.threshold', {
        threshold: String(info.thresholdValue ?? '?'),
        reroll: String(info.thresholdReroll ?? '?'),
      });
    case 'fixed':
      return t('FUMBLE_SWITCH.debug.modifier.fixed', {
        target: String(info.fixedTarget ?? info.finalResult),
      });
    default:
      return '';
  }
}

export function renderDebugMessage(entries: DieDebugInfo[]): string {
  const title = game.i18n!.localize('FUMBLE_SWITCH.debug.title');
  const rows = entries.map((info) => {
    const modifier = formatModifier(info);
    const { dieType, originalResult, finalResult } = info;
    return `<li><strong>${dieType}</strong>: ${originalResult} → [${modifier}] → <strong>${finalResult}</strong></li>`;
  }).join('');
  return `<div class="fumble-switch-debug"><strong>${title}</strong><ul>${rows}</ul></div>`;
}
