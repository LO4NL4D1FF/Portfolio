# Working rules for Claude

## Execute everything the owner asks

- Write every request the owner makes down in the request log below as soon as it arrives, including requests sent mid-task.
- Before calling any piece of work done, go back through every request and question in the log and check each one against what was delivered.
- Anything missed or only half done gets finished, and then the whole review runs again. Repeat until every item is answered exactly.
- Expect new ideas to keep coming: add them to the log, never drop them.

## Request log

| # | Request | Status |
|---|---------|--------|
| 1 | Recreate the Poki horror game "Fear Response" (poki.com/en/g/fear-response): not pixel for pixel, but realistic, with the same house idea, horror themes, strong sound and a good story. Realistic people and monsters. Runs in the browser. | Done: in LO4NL4D1FF/Hunted |
| 2 | Look at skills.sh to understand what the owner wants. | Blocked: skills.sh (and poki.com) are unreachable from the cloud container; research used web search results about the game instead |
| 3 | "Any question?" | Answered in chat |
| 4 | Remember this working rule and keep this log. | Done: this file |
| 5 | Clone LO4NL4D1FF/Hunted into the session. | Done: the game lives there |
| 6 | Make the monster half spider, half snake, half human, with six legs and four hands. Very ugly. | Done: `src/monster.js` in Hunted |
| 7 | Fix: after leaving the title or pressing Continue nothing could be pressed; only walking worked. | Done: drag-to-look and click-to-use when the page can't capture the mouse; the interaction check no longer depends on frame rate |
| 8 | Show where to go (easier, but keep some challenge). | Done: route arrow with destination and distance, a marker over the object, and a Guidance setting (always / H key / off) |
| 9 | Report: closed rooms can be entered. | Checked: closed doors block movement in testing; the missing guidance was the real gap. Waiting on the owner to say which door if it happens again |
| 10 | Make footsteps realistic; research real footsteps online. | Done: 28 CC0 recordings (Kenney, OpenGameArt) with a set per surface, never the same take twice, left/right feet, and softer crouch and heavier run steps |
| 11 | Add raindrops, a real thunderstorm and lightning, because it's too hard to see. | Done: rain around the whole house with splashes, see-through windows with running water, branching lightning bolts, bright flashes lighting the rooms, close-strike thunder, a brighter default. Real rain/thunder recordings were not reachable, so the storm audio is synthesised |
| 12 | Add the game to the portfolio with a play button, and push the game to Vercel. | Done: HUNTED card with a Play now button; the game is served by the portfolio's Vercel project at `/games/hunted/index.html`. A standalone `hunted` Vercel project was created but can't deploy until its GitHub link is connected in Vercel (the API refused production deploys) |
| 13 | Put the game on the live site loansedota.com (not a separate profile). | Done: owner approved; branch merged into master through a pull request, and Vercel publishes master to loansedota.com |
| 14 | Delete the empty `hunted` project on Vercel. | Blocked: the Vercel connector has no delete action. Owner deletes it in the dashboard: hunted project → Settings → scroll to the bottom → Delete Project |
| 15 | Fix the buttons on phone web. | Done: controls no longer overlap in portrait or landscape; the meters, objective and subtitles have their own space; the keypad has a close button and the controls hide under panels |
| 16 | Make every button round and interactive; nothing mixed together. | Done: round joystick with a spring-back knob, a large round USE button with RUN/CROUCH/LIGHT on an arc, small round menu buttons (pause, bag, music box, way) with icons, press animation and vibration, glowing on/off states, USE pulses when something can be used; menus, panels and keypad keys are rounded too |
| 17 | "Where the arrow directs me there is no way to put the fuse in; there's no fuse there." Check it, say exactly what was wrong, and fix the arrow. | Done: the fuse box was a small dark box squeezed between a shelf and a boiler and needed pixel-perfect aim (near impossible on a phone); the fuse floated in front of a drawer with no tray. The utility room is cleared, the fuse box is a big labelled panel with a blinking light, the drawer has a tray, USE now picks the closest usable thing in front of you, and the arrow follows the visible route and says "here" when you arrive |
| 18 | On a computer the mouse only turns the view while clicking and dragging; the mouse alone should turn the view. | Done: the game had switched to drag-to-look for good the first time the browser refused mouse capture (it refuses without a click, or within a second of pressing Esc). Now it shows "Click to continue" and the next click captures the mouse; drag-to-look is only for embedded frames that never allow capture. Touchscreen laptops get mouse controls, not phone controls |
| 19 | Explain how to go upstairs without the monster reaching me (she is too fast) and how to win easily. | Answered in chat. She is also easier now: she screams and waits a second before charging, runs slower than your sprint (2.8 vs 4.3), and gives up the chase sooner (3.5 s out of sight) |
| 20 | Make the lights much brighter once the fuse is in, so the torch can stay off. | Done: mains lights are 3x brighter, reach 1.5x further and flicker less, and the ambient light doubles when the power is on |
