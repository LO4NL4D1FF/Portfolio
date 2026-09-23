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
