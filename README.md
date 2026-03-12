# Fumble Switch

A Foundry VTT V13 module that gives the GM real-time control over dice roll outcomes. Toggle cheats on or off instantly through a draggable floating widget — no one has to know.

System-agnostic. Works with any game system.

## Features

- **Floating widget** with separate toggles for Players and GM rolls (better / worse / off)
- **4 cheat strategies:**
  - **Full Control** — force max or min results
  - **Bias** — roll twice, keep the best or worst
  - **Nudge** — add or subtract a configurable modifier
  - **Threshold** — re-roll results in the worst/best N% of the range
- **Per-die configuration** — choose which dice are affected (d4–d100), set nudge values and positive direction overrides per die type
- **Positive direction** — set whether higher or lower rolls are "better" (globally or per die)
- **Explicit mode** — optionally notify players that a roll was influenced
- **Dice So Nice! integration** — cheated rolls show colored 3D dice (green for better, red for worse) when in explicit mode

## Installation

Paste the manifest URL into Foundry's module installer:

```
https://github.com/rklos/fvtt-fumble-switch/releases/latest/download/module.json
```

## Configuration

Open module settings via the cog icon on the widget or through Foundry's module settings. The **Dice Settings** submenu lets you configure per-die options.

## License

MIT
