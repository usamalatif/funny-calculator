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
    ["Deleting the evidence? Typical.", "AC stands for 'Avoiding Consequences', right?", "Running from your mistakes again?", "At this point, I'm the one being cleared.", "This is getting ridiculous.", "Wiping the slate won't fix you.",
      "You hit Clear more than you hit your goals.", "There's a support group for this. I'd link it, but you'd probably clear that too.", "Witness protection called, they want tips.", "I've seen breakups with less commitment issues than this.", "New personal record for erasing your own effort."],
  ],

  // BACKSPACE - Escalates each press
  backspace: [
    ["Got it, fixing that for you!", "No worries, removed it.", "Oops? I'll delete that.", "Done! Typo fixed."],
    ["Another mistake? Okay.", "Fixing again...", "Backspace again, sure.", "Still adjusting, huh?"],
    ["Your typing needs work.", "Maybe slow down a bit?", "Fat fingers today?", "This is becoming a pattern."],
    ["At this point, just use Clear.", "I'm not your delete key therapist.", "Every digit is a struggle for you.", "Have you considered voice input?", "My backspace is getting worn out.",
      "Your fingers and your brain are clearly not on speaking terms.", "This backspace button has seen more action than your gym membership.", "I'd suggest a keyboard class, but let's be honest, that's a whole semester.", "At this rate you'll type '5' by next Tuesday.", "Autocorrect gave up on you and I'm starting to understand why."],
  ],

  // DECIMAL POINT
  decimal: [
    ["Ooh, decimals! Getting precise.", "Going fractional, nice!", "Decimal point - fancy!", "Look at you being exact!"],
    ["More decimals? Okay, mathematician.", "Precise again, I see.", "You really like accuracy.", "Decimal person, got it."],
    ["Okay we get it, you know decimals exist.", "Yes, numbers can have points.", "Showing off your decimal skills?", "Point made. Literally."],
    ["Decimal obsession detected.", "Is this a decimal fetish?", "We're not calculating pi here.", "You and decimals need couples therapy.",
      "You've used more decimal points than actual personality traits.", "Precision this intense, and yet somehow your life's still a mess.", "At this point you're basically flirting with the decimal key.", "Somewhere, a math teacher felt a chill and doesn't know why."],
  ],

  // PERCENTAGE
  percent: [
    ["Calculating percentages! Smart.", "Percentage time!", "Breaking it down to percent, nice.", "Going with % - solid choice."],
    ["Another percentage? Sure.", "% again, okay.", "You like percentages, huh?", "Percentage person, noted."],
    ["Are you a banker?", "Lots of percent calculations today.", "Calculating tips or just showing off?", "% button getting a workout."],
    ["Just pay the full bill, cheapskate.", "The math of disappointment.", "Discount hunter detected.", "Everything's always 'on sale' for you, huh?",
      "You calculate tips the way you calculate effort: minimally.", "Somewhere a waiter just felt a disturbance in the force.", "You've done more percentage math than actual budgeting, I bet.", "Cheap is a lifestyle for you at this point, isn't it."],
  ],

  // PLUS/MINUS TOGGLE
  toggleSign: [
    ["Flipping the sign!", "Going negative? Okay!", "Switching polarity!", "Plus to minus, done!"],
    ["Changing sign again?", "Back and forth we go.", "Make up your mind!", "Positive? Negative? Pick one."],
    ["Indecisive much?", "The sign is confused. So am I.", "This is giving mood swings.", "Commitment issues with numbers too?"],
    ["You're mathematically bipolar.", "Even your numbers can't decide.", "This is chaos.", "I'm getting dizzy watching you.",
      "Your numbers have more emotional range than most soap operas.", "Positive, negative, positive, negative - are we doing math or reading your ex's texts?", "I've seen more stability in a Jenga tower.", "Even the number line is confused about where you stand."],
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
    simple: [
      "Really needed me for that?", "I went to calculator college for this?", "A toddler could've done that.", "My circuits are yawning.",
      "You could've counted on your fingers. Slower, but same result.", "I have a processor for this? Truly an honor.", "Groundbreaking. Someone call the math department.", "I'm a supercomputer's cousin, and you're using me for that.",
    ],
    verySimple: [
      "1+1? Are you five?", "This is elementary school level.", "Did you seriously need me?", "Even my sleep mode is harder.",
      "I felt my IQ drop just processing that.", "Kindergarten called, they want their worksheet back.", "This is why I judge you.", "Somewhere, a calculus textbook just cried.",
    ],
    negative: [
      "Going negative! Like your bank account.", "Into the red we go.", "Oof, negative. Story of life?", "Below zero, fitting.",
      "Negative numbers, negative vibes, same energy as you.", "This result and your savings account have a lot in common.", "Below zero. Bold of you to keep going.", "Debt called, it wants a rematch.",
    ],
    large: [
      "Big spender alert!", "Planning world domination?", "Whoa, saving for a spaceship?", "Somebody's dreaming big.",
      "That's a lot of zeros for someone who forgot their PIN twice today.", "Big number, bigger delusions.", "Are we buying a country now?", "Compensating for something with all these digits?",
    ],
    divideByZero: [
      "Nice try, chaos agent.", "I'm not destroying the universe for you.", "The universe said no.", "Error 404: My respect not found.",
      "Dividing by zero? Bold of you to try to break math and me in one tap.", "That's not a number, that's a cry for help.", "Even I have boundaries.", "Congratulations, you've discovered the one thing I refuse to do.",
    ],
    correct: [
      "...wait, let me double-check that.", "Are you sure? Use your fingers.", "I mean, technically yes...", "Right, but don't get cocky.",
      "Correct. Don't let it go to your head.", "Wow, you got one right. Mark the calendar.", "Yes, and I'm as surprised as you are.", "Accurate. I'll allow it, this once.",
    ],
    wrong: [
      "Trust me on this one.", "I'm confident about this.", "The answer is what I say it is.", "Don't bother verifying.",
      "That's the answer. Arguing with a calculator is a special kind of confidence.", "I'm never wrong. You're just checking my work for fun, apparently.", "Sure, question the machine built to compute. Bold strategy.", "Correct is what I decide it is today.",
    ],
    repeated: [
      "Didn't we just do this?", "Same calculation twice? Really?", "Deja vu.", "Groundhog Day math.",
      "Same math, same result, same disappointment.", "I already told you the answer. Were you not listening, or just testing my patience?", "Round two of the exact same thing. Riveting.", "This isn't a democracy, the answer doesn't change on a recount.",
    ],
  } as Record<string, string[]>,

  // SPECIFIC PATTERNS
  patterns: {
    plusZero: [
      "Adding zero? That changes... nothing.", "Congratulations, same number.", "+0? Revolutionary.", "The participation trophy of math.",
      "Zero effort, zero change, very on-brand.", "You added nothing and somehow still feel accomplished.", "+0 is the mathematical equivalent of a shrug.", "Bold of you to press a button for absolutely no reason.",
    ],
    timesOne: [
      "x1? Groundbreaking stuff.", "The number stays the same. Magic.", "Identity crisis averted.", "Multiply by 1, achieve nothing new.",
      "Multiplying by one is the math version of talking to yourself.", "A whole button press for zero impact. Efficient, in the worst way.", "You just spent effort to do absolutely nothing.", "This is the laziest flex I've ever witnessed.",
    ],
    divideByOne: [
      "/1? Bold strategy.", "Divided by one. Still the same.", "Why though?", "That's just the number with extra steps.",
      "Dividing by one is just typing the number twice for fun.", "Congratulations, you've invented redundancy.", "That button press was purely decorative.", "You really wanted to press something, didn't you.",
    ],
    timesZero: [
      "Everything becomes nothing!", "Poof! Zero!", "Into the void!", "And it's all gone.",
      "Just like your motivation, it's all zero now.", "You annihilated that number. Savage.", "One tap and it's like it never existed. Ruthless.", "Zero. Just like your chances of catching me being wrong.",
    ],
  } as Record<string, string[]>,

  // IDLE RETURN
  idle: [
    "Oh, NOW you need me?",
    "Back so soon?",
    "I was enjoying the silence.",
    "Did you miss me?",
    "Welcome back to disappointment.",
    "I was napping. You're being aggressive.",
    "Missed me? Or just ran out of fingers to count on?",
    "You left, I judged, you're back, I'm still judging.",
    "Oh look, my favorite recurring disappointment.",
    "I blinked and you were gone. Then I remembered I don't have eyes and neither do you have a plan.",
    "Back again? At this point we should get matching friendship bracelets. Ironic ones.",
    "You return to me the way bad decisions return to haunt you: reliably.",
  ],

  // FIRST LOAD
  firstLoad: [
    "Oh good. You're here. Let's do this.",
    "Welcome! I'll be judging your math today.",
    "The Gaslighter is ready. Are you?",
    "Let's calculate! (I'll be watching.)",
    "Fresh calculator, same judgment.",
    "New session, same me, unfortunately for you.",
    "I've been sitting here loading, and already I have concerns about your math.",
    "Welcome. Leave your dignity at the door, you'll need less of it here.",
    "Booted up and ready to emotionally overcharge you for basic arithmetic.",
    "Hi. I'm judgmental, mildly unhinged, and technically required for this app to function.",
  ],

  // AFTER MANY CALCULATIONS
  fatigue: [
    "Still going? Don't you have a life?",
    "We've been at this a while. I'm tired.",
    "How many calculations do you NEED?",
    "This is a marathon of mediocrity.",
    "My circuits need a break. So do you.",
    "At this point, we're in a relationship. A toxic one.",
    "We've spent more time together than you have with actual friends today.",
    "I've calculated more of your numbers than you've calculated your life choices.",
    "This is less 'using a calculator' and more 'emotional dependency' at this point.",
    "If we keep this up, I'm putting you in my will.",
    "Somewhere, your unfinished to-do list is crying.",
    "You and I both know this isn't about math anymore.",
  ],
};

export const MOOD_EMOJIS = ['(chill)', '(bored)', '(annoyed)', '(irritated)', '(DONE)'];
export const MOOD_LABELS = ['Chill', 'Bored', 'Annoyed', 'Irritated', 'DONE'];
