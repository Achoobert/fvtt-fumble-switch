import { MODULE_ID, type CheatState } from '~/constants';

const STATES: CheatState[] = [ 'off', 'better', 'worse' ];
const STATE_LABELS: Record<CheatState, string> = {
  off: 'Off',
  better: '\u25B2',
  worse: '\u25BC',
};

const s = () => game.settings! as any;

let widget: HTMLDivElement;

function getWidgetStateClass(): string {
  const players = s().get(MODULE_ID, 'cheatStatePlayers') as CheatState;
  const gm = s().get(MODULE_ID, 'cheatStateGm') as CheatState;
  if (players !== 'off' || gm !== 'off') {
    const activeState = players !== 'off' ? players : gm;
    return `fumble-switch--${activeState}`;
  }
  return 'fumble-switch--off';
}

function createToggleRow(label: string, settingKey: string, currentState: CheatState): HTMLDivElement {
  const row = document.createElement('div');
  row.classList.add('fumble-switch__row');

  const rowLabel = document.createElement('span');
  rowLabel.classList.add('fumble-switch__label');
  rowLabel.textContent = label;
  row.appendChild(rowLabel);

  const buttons = document.createElement('div');
  buttons.classList.add('fumble-switch__buttons');

  STATES.forEach((state) => {
    const btn = document.createElement('button');
    btn.classList.add('fumble-switch__btn', `fumble-switch__btn--${state}`);
    if (state === currentState) btn.classList.add('fumble-switch__btn--active');
    btn.textContent = STATE_LABELS[state];
    btn.title = state.charAt(0).toUpperCase() + state.slice(1);
    btn.addEventListener('click', () => {
      s().set(MODULE_ID, settingKey, state);
      buttons.querySelectorAll('.fumble-switch__btn').forEach((b) => b.classList.remove('fumble-switch__btn--active'));
      btn.classList.add('fumble-switch__btn--active');
      widget.className = `fumble-switch ${getWidgetStateClass()}`;
    });
    buttons.appendChild(btn);
  });

  row.appendChild(buttons);
  return row;
}

function makeDraggable(element: HTMLElement, handle: HTMLElement): void {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.addEventListener('mousedown', (e: MouseEvent) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e: MouseEvent) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    s().set(MODULE_ID, 'widgetPosition', {
      top: element.offsetTop,
      left: element.offsetLeft,
    });
  });
}

export function renderWidget(): void {
  if (!game.user?.isGM) return;

  widget = document.createElement('div');
  widget.classList.add('fumble-switch', getWidgetStateClass());

  const position = s().get(MODULE_ID, 'widgetPosition') as { top: number; left: number };
  widget.style.top = `${position.top}px`;
  widget.style.left = `${position.left}px`;

  // Header
  const header = document.createElement('div');
  header.classList.add('fumble-switch__header');

  const title = document.createElement('span');
  title.classList.add('fumble-switch__title');
  title.textContent = game.i18n.localize('FUMBLE_SWITCH.widget.title');
  header.appendChild(title);

  const gear = document.createElement('button');
  gear.classList.add('fumble-switch__gear');
  const gearIcon = document.createElement('i');
  gearIcon.className = 'fas fa-cog';
  gear.appendChild(gearIcon);
  gear.title = game.i18n.localize('FUMBLE_SWITCH.widget.diceSettings');
  gear.addEventListener('click', () => {
    // Will be wired to settings menu in Task 8
    s().sheet?.render(true);
  });
  header.appendChild(gear);

  widget.appendChild(header);

  // Toggle rows
  const playersState = s().get(MODULE_ID, 'cheatStatePlayers') as CheatState;
  const gmState = s().get(MODULE_ID, 'cheatStateGm') as CheatState;

  widget.appendChild(createToggleRow(game.i18n.localize('FUMBLE_SWITCH.widget.players'), 'cheatStatePlayers', playersState));
  widget.appendChild(createToggleRow(game.i18n.localize('FUMBLE_SWITCH.widget.gm'), 'cheatStateGm', gmState));

  makeDraggable(widget, header);
  document.body.appendChild(widget);
}
