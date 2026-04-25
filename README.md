# Fumble Switch

A Foundry VTT V13 module that gives the GM real-time control over dice roll outcomes. Toggle cheats on or off instantly through a draggable floating widget — no one has to know.

System-agnostic. Works with any game system.

# Install
```
https://github.com/achoobert/fvtt-fumble-switch/releases/latest/download/module.json
```

## Features

- **Floating widget** with separate toggles for Players and GM rolls (better / worse / off)
- **Per-player overrides** — active players automatically appear between the Players and GM rows, so the GM can set a different cheat state for any individual player. An individual setting takes priority over the global "Players" setting; set a player to `off` to have them inherit from "Players" instead. Rows are added/removed live as players join or leave the game.
- **4 cheat strategies:**
  - **Full Control** — force max or min results
  - **Micro-managed Control** — force a particular result per user settings (useful when you need 99 instead of 100)
  - **Bias** — roll twice, keep the best or worst
  - **Nudge** — add or subtract a configurable modifier
  - **Threshold** — re-roll results in the worst/best N% of the range
- **Per-die configuration** — choose which dice are affected (d4–d100), set nudge values and positive direction overrides per die type
- **Positive direction** — set whether higher or lower rolls are "better" (globally or per die)
- **Explicit mode** — optionally notify players that a roll was influenced
- **Debug mode** — optionally whisper a per-die breakdown (original → modifier → final) to the GM for every cheated roll
- **Dice So Nice! integration** — cheated rolls show colored 3D dice (green for better, red for worse) when in explicit mode

## Configuration

Open module settings via the cog icon on the widget or through Foundry's module settings. The **Dice Settings** submenu lets you configure per-die options.

## License

MIT
