# Sneaky Unicorn v8 — Camera/UI patch QA

## Changes
- Replaced permissive camera overscroll with strict level-bound clamping.
- Removed action-dock height from camera calculations; floating buttons no longer push the camera upward.
- Levels smaller than a viewport axis are centered symmetrically.
- JUMP/SNEAK remain the same large touch targets.
- JUMP/SNEAK render at 58% opacity at rest, 96% while pressed, and 72% for active SNEAK.
- v8 service-worker cache/version identifiers updated.

## Static checks
- JavaScript syntax: PASS (`node --check` on both script blocks).
- Camera bound model: PASS, 120 combinations across all four level dimension families,
  six representative portrait/landscape view sizes, and five player edge/center positions.
- No camera position escaped the legal world range when the map was larger than the view.
- When a map dimension was smaller than the view, centering was symmetric.

## Physical-device limit
This patch was not physically exercised on an iPhone in this tool session. The most useful real-device
check is to walk to all four edges/corners and confirm there is no large black void, then press/hold
both translucent buttons while steering with a second finger.
