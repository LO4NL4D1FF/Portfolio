// All narrative content: documents, objectives, radio lines and endings.

export const NOTES = {
  dossier: {
    title: 'FRT Case File 0411',
    kind: 'file',
    body: `FEAR RESPONSE TEAM, FIELD OFFICE 3
CASE 0411: HALE HOUSE, ASHGROVE ROAD
AGENT ASSIGNED: HARRY WADE

Summary: Hale House has stood empty since the winter of 1987, when Thomas and Eleanor Hale and their infant daughter Cheryl disappeared. No bodies were recovered. The house was never sold.

Since then: 7 reported disappearances inside the property. The most recent is our own Agent Daniel Kowalski, who went in eleven days ago and has not come out. His last radio call was two words: "she's listening."

Objective: locate Agent Kowalski or his remains, establish what happened to the Hale family, and get out.

Standing orders: do not engage. Do not run unless you must. If it sees you, break line of sight and HIDE.`,
  },
  grocery: {
    title: 'Note on the kitchen counter',
    kind: 'letter',
    body: `Tom,

Cheryl was up again at 3. The same thing: she stops crying all at once and stares at the corner by the window, and she smiles. I don't like it.

The fuse for the back hall blew again. I put the spare in the kitchen drawer, the one under the knives, so you'll find it when you finally come out of that study.

The house is so cold. Please come to bed.

- E.`,
  },
  lullaby: {
    title: 'Sheet music on the piano',
    kind: 'letter',
    body: `"Hush now, Cheryl" (written by hand in the margin, E. Hale)

Hush now, little one, the candle is low,
Mother is here and she won't let you go.
Close your eyes, darling, and don't make a sound,
Mother will find you wherever you're found.

(beneath, in a different, heavier hand:)
She sings it every night now. She sings it to an empty crib.`,
  },
  kowalski: {
    title: 'Agent Kowalski\'s field notebook',
    kind: 'file',
    body: `Day 3. Radio is dead. Front door won't open from inside, not the lock, the house.

Day 5. Figured out the rules. She HEARS you. Walking is fine. Running, slamming doors, that brings her. She can't see well in the dark but a flashlight in her face? She sees that.

Day 6. Wardrobes. Closets. If she didn't watch you get in, she walks right past.

Day 7. The music. There's a music box somewhere. When it plays she stops and listens, like she's remembering something.

Day 9. Found the study key in the dead man's coat downstairs. Took it. Haven't dared go back down.

Day 11. She's outside the door. She's humming. Harry, if they send you: the answer is the girl. It was always the girl.`,
  },
  diary: {
    title: 'Eleanor Hale\'s diary',
    kind: 'diary',
    body: `October 30th, 1986
The doctor says her heart is too small. They say "weeks." Tom has not slept. He sits in the study with the books from his grandmother's trunk and he whispers to them.

November 2nd
Tom says there is a way. An old rite: a mother's love given freely can hold a child in this world. He says it costs nothing I wouldn't give anyway. I said yes. God forgive me, I said yes before he finished.

November 4th
Cheryl is well. Pink cheeks, strong lungs. The doctor cannot explain it.
But I am so cold. And I am so hungry. And sometimes when I look at her I don't see my daughter, I see something I need to hold so tight that it can't leave.

I've locked the nursery key in my jewellery box. I don't trust my hands.`,
  },
  research: {
    title: 'Thomas Hale\'s research notes',
    kind: 'diary',
    body: `On the "Hollow Mother" (from Gran's trunk, translated badly)

The rite binds the mother to the child. The child lives on what the mother gives. What the texts don't say, what I didn't read until after, is that the binding keeps going after the mother has nothing left to give.

What remains is only the wanting. It wears her face. It walks at night looking for the child. It hears everything and forgets nothing, except the song. When it hears the song it remembers it was once a woman.

If the child is carried beyond the threshold and never returns, the Mother cannot leave the house to follow. She will search it forever instead.

I have to take Cheryl away. I have to make it so she can never be found.`,
  },
  birth: {
    title: 'Birth record, framed above the crib',
    kind: 'file',
    body: `ASHGROVE COUNTY, RECORD OF LIVE BIRTH

Name of child: CHERYL ANNE HALE
Date of birth: 21 / 09 / 1986 (day / month / year)
Place of birth: Hale House, Ashgrove Road (home birth)
Mother: Eleanor May Hale
Father: Thomas James Hale

Attending physician's note: congenital heart defect. Prognosis poor.`,
  },
  thomas: {
    title: 'Thomas Hale\'s journal, study desk',
    kind: 'diary',
    body: `I have put everything that matters in the wall safe: the front door key, and the papers. Nobody leaves this house without that key, not me and not her.

The combination is the day she came back to us. Not the day she was born: the day the rite took and she opened her eyes, pink and well. Day first, then month. Eleanor wrote it down, she writes everything down. She would know it without thinking, and she will never come in here: this room smells of me.

If anyone reads this: she is not a monster. She is my wife. What she wants is Cheryl, and I made sure she can never have her.`,
  },
  chapel: {
    title: 'Scrawled on the floor of the chapel',
    kind: 'letter',
    body: `I tried to undo it.
Candles, salt, the words backwards. She came in while I was on the fourth verse.

She didn't hurt me. She put her hand on my face, so gently, and asked me where the baby was.
I didn't tell her.
I will never tell her.

Forgive me, Ellie.`,
  },
  confession: {
    title: 'Letter from St. Agnes Children\'s Home',
    kind: 'letter',
    body: `Dear Mr. Hale,

As you requested, the infant has been placed with a family out of state under a new name. In keeping with your wishes, no record connecting her to Hale House or Ashgrove County will be kept, and the family will not be told where she came from.

She is healthy and very calm. The nurses say she hums in her sleep, a little tune none of them know.

With prayers for you and your wife,
Sister M. Bernadette
St. Agnes Children's Home, 1987`,
  },
};

export const NOTE_ORDER = ['dossier', 'grocery', 'lullaby', 'kowalski', 'diary', 'research', 'birth', 'thomas', 'chapel', 'confession'];

export const ITEMS = {
  fuse: { name: 'Ceramic fuse', desc: 'A spare 30-amp fuse. The fuse box is in the utility room.' },
  studyKey: { name: 'Study key', desc: 'A heavy brass key, tagged "T.H. STUDY".' },
  nurseryKey: { name: 'Nursery key', desc: 'A small silver key with a pink ribbon.' },
  musicBox: { name: 'Music box', desc: 'Cheryl\'s music box. Press Q to wind it: the Mother stops to listen.' },
  frontKey: { name: 'Front door key', desc: 'The key to the front door. Get out.' },
  battery: { name: 'Batteries', desc: 'Press R to swap the flashlight batteries.' },
};

export const OBJECTIVES = {
  enter: 'Enter Hale House',
  explore: 'Find another way out of the house',
  power: 'Restore the power: the fuse box is in the utility room',
  fuseFound: 'Put the fuse in the fuse box (utility room, west end of the hall)',
  phone: 'Answer the telephone in the foyer',
  survive: 'Find Agent Kowalski. Something is hunting you: stay quiet',
  study: 'Search the study (ground floor, east)',
  nursery: 'Find the nursery key',
  nurseryOpen: 'Open the nursery',
  safe: 'Open the wall safe in the study',
  escape: 'ESCAPE through the front door',
};

export const RADIO = {
  intro: [
    ['HQ', 'Wade, this is Control. We have you at the Hale property. Signal is bad out there.'],
    ['HQ', 'Kowalski went in through the front. Find him. Don\'t be a hero.'],
  ],
  locked: [
    ['HARRY', 'The door... it locked itself. Control? Control, do you copy?'],
    ['HQ', '...kkkhhh... Wade... interference... find... another way...'],
  ],
  power: [['HARRY', 'Power\'s back. Some of it anyway.']],
  phoneAnswer: [
    ['VOICE', 'Where is she?'],
    ['VOICE', 'Where is my baby?'],
    ['VOICE', 'I can hear you breathing.'],
  ],
  afterPhone: [['HARRY', 'Okay. Okay. Stay quiet. Find Kowalski.']],
  kowalski: [['HARRY', 'Danny... God. I\'m sorry, Danny.']],
  safe: [['HARRY', 'The front door key. Time to leave.'], ['VOICE', 'You were in his room. You smell like HIM.']],
  mirror: [['HARRY', '...where is who?']],
};

export const ENDINGS = {
  escape: {
    title: 'CASE 0411: CLOSED',
    body: `Harry Wade walked out of Hale House at 4:12 in the morning. He did not look back at the upstairs windows, although he could hear, very clearly, a woman humming behind the glass.

His report was three pages long. Most of it was classified. The last line read: "Recommend the property be sealed. Whatever lives there is not dangerous as long as no one gives it a reason to search."

Hale House was boarded up that spring. The humming, according to the neighbours, never stopped.`,
  },
  truth: {
    title: 'CASE 0411: THE TRUTH',
    body: `Harry Wade walked out of Hale House at 4:12 in the morning with every page the Hales left behind.

He drove home in the grey light and let himself in quietly. His wife was already awake, standing by the nursery window with their newborn son, rocking him and humming.

It was a tune Harry knew now. Hush now, little one, the candle is low.

"Where did you learn that?" he asked.

Cheryl smiled at him. "I don't know. I've always known it. I was adopted, remember? St. Agnes. They said I hummed it before I could talk."

Forty miles away, in an empty house on Ashgrove Road, the humming stopped.

And the front door opened.`,
  },
};
