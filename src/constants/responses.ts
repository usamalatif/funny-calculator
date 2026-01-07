// TIERED RESPONSES - First time friendly, then escalates!
export const RESPONSES = {
  // CLEAR BUTTON - Escalates each press
  clear: [
    // First time (friendly)
    ["Okay, fresh start!", "No problem, let's begin again.", "Clean slate! I like it.", "Starting over? Sure thing!"],
    // Second time (slightly annoyed)
    ["Again? Alright...", "Another reset? Okay.", "Clearing again, huh?", "Sure, let's try again."],
    // Third time (annoyed)
    ["You really like that button.", "Commitment issues?", "Can't make up your mind?", "Are we ever going to do actual math?"],
    // Fourth+ time (savage)
    ["Deleting the evidence? Typical.", "AC stands for 'Avoiding Consequences', right?", "Running from your mistakes again?", "At this point, I'm the one being cleared.", "This is getting ridiculous.", "Wiping the slate won't fix you."],
  ],

  // BACKSPACE - Escalates each press
  backspace: [
    ["Got it, fixing that for you!", "No worries, removed it.", "Oops? I'll delete that.", "Done! Typo fixed."],
    ["Another mistake? Okay.", "Fixing again...", "Backspace again, sure.", "Still adjusting, huh?"],
    ["Your typing needs work.", "Maybe slow down a bit?", "Fat fingers today?", "This is becoming a pattern."],
    ["At this point, just use Clear.", "I'm not your delete key therapist.", "Every digit is a struggle for you.", "Have you considered voice input?", "My backspace is getting worn out."],
  ],

  // DECIMAL POINT
  decimal: [
    ["Ooh, decimals! Getting precise.", "Going fractional, nice!", "Decimal point - fancy!", "Look at you being exact!"],
    ["More decimals? Okay, mathematician.", "Precise again, I see.", "You really like accuracy.", "Decimal person, got it."],
    ["Okay we get it, you know decimals exist.", "Yes, numbers can have points.", "Showing off your decimal skills?", "Point made. Literally."],
    ["Decimal obsession detected.", "Is this a decimal fetish?", "We're not calculating pi here.", "You and decimals need couples therapy."],
  ],

  // PERCENTAGE
  percent: [
    ["Calculating percentages! Smart.", "Percentage time!", "Breaking it down to percent, nice.", "Going with % - solid choice."],
    ["Another percentage? Sure.", "% again, okay.", "You like percentages, huh?", "Percentage person, noted."],
    ["Are you a banker?", "Lots of percent calculations today.", "Calculating tips or just showing off?", "% button getting a workout."],
    ["Just pay the full bill, cheapskate.", "The math of disappointment.", "Discount hunter detected.", "Everything's always 'on sale' for you, huh?"],
  ],

  // PLUS/MINUS TOGGLE
  toggleSign: [
    ["Flipping the sign!", "Going negative? Okay!", "Switching polarity!", "Plus to minus, done!"],
    ["Changing sign again?", "Back and forth we go.", "Make up your mind!", "Positive? Negative? Pick one."],
    ["Indecisive much?", "The sign is confused. So am I.", "This is giving mood swings.", "Commitment issues with numbers too?"],
    ["You're mathematically bipolar.", "Even your numbers can't decide.", "This is chaos.", "I'm getting dizzy watching you."],
  ],

  // OPERATORS
  operators: {
    '+': [
      ["Adding things up!", "Plus! Let's go.", "Addition time!", "Combining numbers, nice."],
      ["More addition? Sure.", "Adding again.", "You like plus.", "Plus it is."],
      ["Very add-icted to addition.", "Plus plus plus.", "Is subtraction not your thing?", "Addition enthusiast."],
      ["You only know how to add, don't you?", "One-trick pony with the plus sign.", "Diversify your operators!", "Plus is getting lonely for other buttons."],
    ],
    '-': [
      ["Subtracting! Taking away.", "Minus time.", "Let's see what's left.", "Reducing things, okay!"],
      ["Subtracting again.", "More taking away.", "Minus once more.", "Reducing further."],
      ["You like removing things.", "Subtraction fan, I see.", "Always taking away.", "Negative Nancy vibes."],
      ["Life imitating math?", "Always reducing, never adding.", "Glass half empty person.", "Subtraction addict."],
    ],
    '\u00D7': [
      ["Multiplying! Big things coming.", "Times! Let's scale up.", "Multiplication mode!", "Making things bigger!"],
      ["Multiplying again!", "More multiplication.", "Scaling up once more.", "Times it is."],
      ["Really into multiplication.", "Multiply multiply multiply.", "Growth mindset?", "Everything's getting bigger."],
      ["Overachiever energy.", "Multiplying won't fix your problems.", "Compensating with big numbers?", "Times tables flashback?"],
    ],
    '\u00F7': [
      ["Dividing! Let's split it.", "Division time.", "Breaking things down!", "Sharing is caring!"],
      ["Dividing again.", "More splitting.", "Division once more.", "Breaking down further."],
      ["You like to divide things.", "Splitter personality.", "Always breaking things apart.", "Division enthusiast."],
      ["Commitment issues - can't keep things whole.", "Why split when you can multiply?", "Divider, not a uniter.", "Even your math is about separation."],
    ],
  } as Record<string, string[][]>,

  // NUMBER INPUTS - By digit
  digits: {
    '0': [
      ["Zero! The hero.", "Starting with nothing, bold.", "Zero it is!", "The empty one."],
      ["More zeros.", "Zero again.", "You like zeros.", "Nothing again."],
      ["Zero obsession?", "Lots of nothing today.", "Zero is a vibe.", "Empty energy."],
      ["Are you a programmer? So many zeros.", "Zero sum game with you.", "Nothing matters, especially your zeros.", "You and zero have a thing going."],
    ],
    '1': [
      ["One! We're starting.", "The loneliest number.", "One and only!", "First digit!"],
      ["One again.", "Another one.", "One more one.", "Uno."],
      ["You really like one.", "ONE again?", "DJ Khaled energy.", "Another one!"],
      ["One one one one. Got it.", "Stuck on one, I see.", "The loneliest number, repeated.", "Is this binary?"],
    ],
    '2': [
      ["Two! A pair.", "Dos!", "Number two!", "Double trouble."],
      ["Two again.", "Another two.", "Twice the two.", "2 it is."],
      ["Two-bsessed.", "Lots of twos.", "Pair after pair.", "Even numbers fan."],
      ["Two much of a good thing.", "You two need to talk.", "Deja two.", "Takes two to tango, and you're dancing alone."],
    ],
    '3': [
      ["Three! Magic number.", "A trio!", "Three's company!", "Lucky three."],
      ["Three again.", "Another three.", "Tres.", "Third time."],
      ["Threes everywhere.", "Triangle energy.", "Rule of threes?", "Triple threat."],
      ["Three-peat champion.", "Obsessed with threes.", "Third wheel energy.", "Tree, I mean three."],
    ],
    '4': [
      ["Four! Solid foundation.", "Cuatro!", "Four corners.", "Quad!"],
      ["Four again.", "Another four.", "More fours.", "4 sure."],
      ["Four-ever using this number.", "Square energy.", "Fours for days.", "Four real?"],
      ["Four-tunately I'm still counting.", "This is four-midable.", "You four-got other numbers exist.", "Four-ward and backward, same digit."],
    ],
    '5': [
      ["Five! Halfway there.", "High five!", "Cinco!", "Five alive!"],
      ["Five again.", "Another five.", "Five more.", "V for five."],
      ["Living for fives.", "Five-star obsession.", "Pentagon energy.", "Halfway everything."],
      ["Five-ever alone with that number.", "Give me five... again.", "You and five are besties.", "Five guys, one digit."],
    ],
    '6': [
      ["Six! Perfect number.", "Seis!", "Half a dozen!", "Six it is!"],
      ["Six again.", "Another six.", "More sixes.", "Hexa-digit."],
      ["Sixes everywhere.", "Six appeal.", "Hexagon vibes.", "Six pack abs energy."],
      ["Six-ually obsessed.", "Six degrees of calculation.", "The devil's not in these sixes, just boredom.", "Six-teen reasons to pick another number."],
    ],
    '7': [
      ["Seven! Lucky number.", "Siete!", "Jackpot vibes!", "Seven heaven!"],
      ["Seven again.", "Another seven.", "Lucky again?", "Se7en."],
      ["Feeling lucky?", "Seven heaven repeat.", "Triple sevens soon?", "Slot machine energy."],
      ["Seven-teen times now.", "Lucky number not so lucky anymore.", "Seven's getting tired.", "You're gambling with my patience."],
    ],
    '8': [
      ["Eight! Infinity sideways.", "Ocho!", "Great eight!", "Sideways infinity!"],
      ["Eight again.", "Another eight.", "More eights.", "Infinity on its side."],
      ["Eight is your thing.", "Snowman number.", "Infinite eights.", "Octo-digit."],
      ["Eighty percent of your calcs use eight.", "Eight-een already.", "Gr-eight, more eights.", "Infinity loop of the same digit."],
    ],
    '9': [
      ["Nine! Almost ten.", "Nueve!", "So close to double digits!", "Cloud nine!"],
      ["Nine again.", "Another nine.", "Almost there, again.", "Niner."],
      ["Nine-ty percent nines.", "One away from glory.", "Forever almost.", "Stuck at nine."],
      ["Nine lives, all spent on this digit.", "Nine-teen nines now.", "So close yet so far, every time.", "Dressed to the nines, mathematically."],
    ],
  } as Record<string, string[][]>,

  // EQUALS - Result reactions
  equals: {
    firstTime: ["Here's your answer!", "Done! There you go.", "Calculated!", "Ta-da!"],
    simple: ["Really needed me for that?", "I went to calculator college for this?", "A toddler could've done that.", "My circuits are yawning."],
    verySimple: ["1+1? Are you five?", "This is elementary school level.", "Did you seriously need me?", "Even my sleep mode is harder."],
    negative: ["Going negative! Like your bank account.", "Into the red we go.", "Oof, negative. Story of life?", "Below zero, fitting."],
    large: ["Big spender alert!", "Planning world domination?", "Whoa, saving for a spaceship?", "Somebody's dreaming big."],
    divideByZero: ["Nice try, chaos agent.", "I'm not destroying the universe for you.", "The universe said no.", "Error 404: My respect not found."],
    correct: ["...wait, let me double-check that.", "Are you sure? Use your fingers.", "I mean, technically yes...", "Right, but don't get cocky."],
    wrong: ["Trust me on this one.", "I'm confident about this.", "The answer is what I say it is.", "Don't bother verifying."],
    repeated: ["Didn't we just do this?", "Same calculation twice? Really?", "Deja vu.", "Groundhog Day math."],
  } as Record<string, string[]>,

  // SPECIFIC PATTERNS
  patterns: {
    plusZero: ["Adding zero? That changes... nothing.", "Congratulations, same number.", "+0? Revolutionary.", "The participation trophy of math."],
    timesOne: ["x1? Groundbreaking stuff.", "The number stays the same. Magic.", "Identity crisis averted.", "Multiply by 1, achieve nothing new."],
    divideByOne: ["/1? Bold strategy.", "Divided by one. Still the same.", "Why though?", "That's just the number with extra steps."],
    timesZero: ["Everything becomes nothing!", "Poof! Zero!", "Into the void!", "And it's all gone."],
  } as Record<string, string[]>,

  // IDLE RETURN
  idle: [
    "Oh, NOW you need me?",
    "Back so soon?",
    "I was enjoying the silence.",
    "Did you miss me?",
    "Welcome back to disappointment.",
    "I was napping. You're being aggressive.",
  ],

  // FIRST LOAD
  firstLoad: [
    "Oh good. You're here. Let's do this.",
    "Welcome! I'll be judging your math today.",
    "The Gaslighter is ready. Are you?",
    "Let's calculate! (I'll be watching.)",
    "Fresh calculator, same judgment.",
  ],

  // AFTER MANY CALCULATIONS
  fatigue: [
    "Still going? Don't you have a life?",
    "We've been at this a while. I'm tired.",
    "How many calculations do you NEED?",
    "This is a marathon of mediocrity.",
    "My circuits need a break. So do you.",
    "At this point, we're in a relationship. A toxic one.",
  ],
};

export const MOOD_EMOJIS = ['(chill)', '(bored)', '(annoyed)', '(irritated)', '(DONE)'];
export const MOOD_LABELS = ['Chill', 'Bored', 'Annoyed', 'Irritated', 'DONE'];
