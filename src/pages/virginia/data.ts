import type { Candle } from '@/components/CandleFlame';
import type { ServiceProvider } from '@/components/ServiceProviderRail';
import type { TimelineItem } from '@/components/Timeline';

/**
 * Verbatim memorial content for Virginia Dadirayi Chiimba (1955–2025).
 * Source: the live memorial (memoryglen.com/memorials/virginia-dadirayi-chiimba),
 * captured in digest_C_references.md §2. This is a REAL memorial — reproduce
 * faithfully, never demo-label.
 */

export const MEMORIAL_URL = 'https://memoryglen.com/memorials/virginia-dadirayi-chiimba';

export const EPITAPH = 'A loving, caring, strong, and deeply faithful mother. The heart of our family.';

/** Full biography — verbatim from the live memorial. */
export const BIOGRAPHY: string[] = [
  'Our mother, Virginia Dadirayi Chiimba, was born on 7 June 1955 in Seke, Chitungwiza. She was the firstborn of ten siblings. She later married and became a devoted mother to seven children: Ray (born 1973), Eddie (1974), Giri (1976), Dougie (1979), Taka (1981), Hamu (1985), and Nyasha (1990).',
  'To us, she was loving, caring, strong, and deeply faithful. She showed her love through the way she looked after her family, guided us, and remained present in our lives. She raised us with discipline, patience, wisdom, and faith.',
  'Our mother always had an ear to listen. Whenever we needed guidance, comfort, or someone to talk to, she gave us her time and attention. She listened without judgement and made us feel heard. Her patience and understanding brought peace to us and to many others who trusted her.',
  'She taught us to respect people, value family, work hard, and trust in God. One of the greatest lessons she gave us was to put everything before God. In times of joy, difficulty, uncertainty, or pain, she reminded us to pray and place our trust in Him.',
  'She loved reading books and the Bible, and she found joy in singing hymns. Her faith was part of her daily life. It shaped the way she lived, the way she raised us, and the way she supported those around her.',
  'Our mother was also a respected member of her community. She was known for her kindness, wisdom, patience, and willingness to listen. She touched many lives through her gentle spirit and caring nature.',
  'Virginia Dadirayi Chiimba was more than our mother. She was our guide, our source of strength, our listener, and the heart of our family. Her lessons, her faith, her voice, and her love will remain with us forever.',
  'She passed away on 19 May 2025 and was laid to rest in Seke, Zinganga. We miss her deeply, but we remain grateful for the life she lived and the love she gave us.',
  'Her memory will always live in the hearts of her children, family, friends, and community.',
];

export interface Tribute {
  name: string;
  relation: string;
  quote: string;
}

/**
 * Tributes already written by the family — preserved exactly as they were.
 * Never overwrite, never edit, never reword. These are her children's and
 * family's own sentences.
 */
export const FAMILY_TRIBUTES: Tribute[] = [
  {
    name: 'Ray',
    relation: 'Son',
    quote:
      'You were our anchor, our calm in the storm. Your love held us together through every season of life. We are who we are because of you.',
  },
  {
    name: 'Giri',
    relation: 'Son',
    quote:
      'Mum, you taught me that faith is not just words — it is how you live every day. Your patience, your prayers, and your unconditional love shaped me. I will carry your light forward.',
  },
  {
    name: 'Dougie',
    relation: 'Son',
    quote:
      'Thank you for every sacrifice, every lesson, every prayer. You gave us everything you had, and you did it with grace. We honour you always.',
  },
  {
    name: 'Hamu',
    relation: 'Son',
    quote:
      'Your voice was the first sound of comfort I ever knew. Your hands were the first to hold me with love. Rest well, our beloved mother.',
  },
  {
    name: 'Mazvita',
    relation: 'Family',
    quote:
      'You showed us what it means to be strong and gentle at the same time. Your wisdom lives in us, and your love surrounds us still.',
  },
  {
    name: 'Tyler Tinaye Gilbert Chiimba',
    relation: 'Grandson',
    quote:
      'Gogo, you were the heart of our family. Every story, every hug, every prayer you shared stays with me. I promise to live in a way that makes you proud.',
  },
  {
    name: 'Carol Chiimba',
    relation: 'Family',
    quote:
      'Your kindness knew no limits. You welcomed everyone with open arms. The world was brighter because you were in it.',
  },
];

/**
 * Tributes printed in the memorial booklet (Gogo Chiimba, Vol. 1, p.2) under
 * the heading "YOU WILL NEVER BE FORGOTTEN". Verbatim — a separate set from
 * FAMILY_TRIBUTES above, written for a different occasion. Both are real and
 * both are shown.
 */
export const BOOKLET_TRIBUTES: Tribute[] = [
  {
    name: 'Ray',
    relation: 'Son',
    quote:
      'My beloved mother, on earth you prayed for me; in heaven, you speak to Him for me. With endless gratitude.',
  },
  {
    name: 'Giri',
    relation: 'Child',
    quote:
      'Mai Giri, you stood with me through every storm, protecting me with love and prayers. I lost a mother and a friend, but your strength lives in me forever.',
  },
  {
    name: 'Dougie',
    relation: 'Son',
    quote:
      'Mom, you were the cornerstone of my life \u2014 my safe harbor in the many storms of my life. You gave me a shoulder when I needed one and you loved me unconditionally. You left us too soon but you live on in my and your grandchildren\u2019s hearts.',
  },
  {
    name: 'Hamu',
    relation: 'Son',
    quote:
      'Mom, my guide, my friend, our family\u2019s light. Your love shaped our lives and will never fade. Till we meet again, with love.',
  },
];

/**
 * Children who have not yet added a tribute. Rendered as a quiet, dignified
 * invitation rather than an empty gap — their place is held, not omitted.
 * Remove a name from this list when their words arrive.
 */
export const TRIBUTES_AWAITED: { name: string; relation: string }[] = [
  { name: 'Eddie', relation: 'Son' },
  { name: 'Taka', relation: 'Son' },
  { name: 'Nyasha', relation: 'Daughter' },
];

export const TRIBUTES_AWAITED_COPY =
  'A place is kept here for their words, for whenever they are ready.';

export const SCRIPTURES = [
  {
    reference: 'John 14:1-3',
    text: 'Let not your heart be troubled: ye believe in God, believe also in me. In my Father\u2019s house are many mansions: if it were not so, I would have told you. I go to prepare a place for you.',
  },
  {
    reference: '2 Timothy 4:7-8',
    text: 'I have fought a good fight, I have finished my course, I have kept the faith: Henceforth there is laid up for me a crown of righteousness, which the Lord, the righteous judge, shall give me at that day.',
  },
];

/**
 * The hymn — verbatim from the family memorial booklet (Gogo Chiimba, Vol. 1, p.1).
 *
 * CORRECTION 25 Jul 2026: previously rendered as a single line reading
 * "Mvari mubatsiri wedu…" with a paraphrased translation. "Mvari" was a
 * misspelling of "Mwari" (God). Restored to the full two stanzas as printed
 * in the booklet.
 *
 * This is the Shona setting of "O God, Our Help in Ages Past" — Isaac Watts,
 * 1719, a paraphrase of Psalm 90. Watts's English is public domain.
 */
export const HYMN = {
  shonaTitle: 'Mwari Mubatsiri Wedu',
  englishTitle: 'O God, Our Help in Ages Past',
  attribution: 'Isaac Watts, 1719 — from Psalm 90',
  /** Shona, verbatim from the booklet. */
  shona: [
    [
      'Mwari mubatsiri wedu',
      'Dakara nazvino,',
      'Mudziviriri munhamo',
      'Nebanza narini.',
      'Zvese zvisati zvasikwa',
      'Makomo nepasi',
      'Imi makanga muripo',
      'Mugari narini.',
    ],
    [
      'Kuneni misi mizhinji',
      'Inenge kanguva',
      'Senguva yemangwanani',
      'Kusati kwayedza',
      'Nhambwe dzinomburumbuka',
      'Nemisi yesezve.',
      'Zvinokanganika zvese',
      'Sekurota hope.',
    ],
  ],
  /** Watts's original English, matched stanza for stanza. */
  english: [
    [
      'O God, our help in ages past,',
      'Our hope for years to come,',
      'Our shelter from the stormy blast,',
      'And our eternal home.',
    ],
    [
      'A thousand ages in Thy sight',
      'Are like an evening gone;',
      'Short as the watch that ends the night',
      'Before the rising sun.',
    ],
  ],
};

/**
 * Poem — "Forever in our hearts", verbatim from the memorial booklet (p.4).
 *
 * NOTE: stanza 2 line 2 reads "In every thought, you we still find" — the
 * inverted word order is exactly as the family printed it and is deliberately
 * preserved. Do not "correct" it.
 */
export const POEM_TITLE = 'Forever in our hearts';

export const POEM_STANZAS: string[][] = [
  [
    'Your spirit dances through our days,',
    'In the little things, in subtle ways.',
    'A kind word, a laugh, a glance,',
    'We still feel you in every chance.',
    'Forever cherished, forever bright,',
    'Your memory shines like morning light.',
  ],
  [
    'Gone from sight but not from mind,',
    'In every thought, you we still find.',
    'Your smile, your touch, your gentle ways,',
    'Live in our hearts through all our days.',
    'Though we cannot see you anymore,',
    'Your memory opens heaven\u2019s door.',
  ],
  [
    'Though your hands we no longer hold,',
    'Your stories, your love, your heart of gold,',
    'Remain with us in every smile,',
    'In quiet moments and each mile.',
    'Memories bloom like endless flowers,',
    'Filling our days with gentle showers.',
  ],
  [
    'No shadow of time can dim your glow,',
    'No distance can make our love go.',
    'You shaped our lives, left joy behind,',
    'And in our hearts, you\u2019re intertwined.',
    'Memories of you will never sever,',
    'You live in us, now and forever.',
  ],
];

/** Closing couplet — booklet, final page. */
export const BOOKLET_EPIGRAPH = [
  'Your life was a blessing, your memory a treasure.',
  'You are loved beyond words and missed beyond measure.',
];

export const VOICE_NOTE = {
  title: 'Happy New Year — A Message from Mum',
  description:
    'A cherished voice recording of Virginia wishing her family a Happy New Year. Her voice, warmth, and love continue to reach us through this precious recording.',
};

export interface GalleryItem {
  src: string;
  caption: string;
  category: 'Family' | 'Church' | 'Seke';
}

/** 13 media placeholders — the family replaces these with real photographs. */
export const GALLERY: GalleryItem[] = [
  { src: '/virginia-gallery-1.jpg', caption: 'Sunday lunch at home — sadza, relish, and everyone together', category: 'Family' },
  { src: '/virginia-gallery-2.jpg', caption: 'Her well-worn Bible, read every morning', category: 'Church' },
  { src: '/virginia-gallery-3.jpg', caption: 'The homestead at dusk, Seke', category: 'Seke' },
  { src: '/virginia-gallery-4.jpg', caption: 'Hymn book and choir robes — she loved to sing', category: 'Church' },
  { src: '/virginia-gallery-1.jpg', caption: 'A family gathering, everyone at the table', category: 'Family' },
  { src: '/virginia-gallery-3.jpg', caption: 'Quiet evening in Zinganga', category: 'Seke' },
  { src: '/virginia-gallery-4.jpg', caption: 'Sunday service with the choir', category: 'Church' },
  { src: '/virginia-gallery-2.jpg', caption: 'Morning devotion and prayer', category: 'Church' },
  { src: '/virginia-gallery-1.jpg', caption: 'Celebrating together, as she taught us', category: 'Family' },
  { src: '/virginia-gallery-3.jpg', caption: 'The Seke hills she called home', category: 'Seke' },
  { src: '/virginia-gallery-1.jpg', caption: 'Grandchildren visiting Gogo', category: 'Family' },
  { src: '/virginia-gallery-2.jpg', caption: 'Her favourite verses, marked and treasured', category: 'Church' },
  { src: '/virginia-gallery-3.jpg', caption: 'Smoke from the kitchen fire, home at last', category: 'Seke' },
];

export const GALLERY_CAPTION =
  'A collection of precious moments captured with Virginia over the years — family gatherings, celebrations, and quiet everyday joys.';

export interface Booklet {
  title: string;
  size: string;
  href: string;
}

export const BOOKLETS: Booklet[] = [
  { title: 'Memorial Invitation', size: '872 KB', href: '/booklets/invitation1.pdf' },
  { title: 'Memorial Invitation — Extended', size: '1.5 MB', href: '/booklets/invitation2.pdf' },
  { title: 'Gogo Chiimba — Booklet Vol. 1', size: '3.0 MB', href: '/booklets/booklet1.pdf' },
  { title: 'Gogo Chiimba — Final Booklet', size: '7.0 MB', href: '/booklets/booklet2.pdf' },
];

export const BOOKLETS_COPY =
  "Programme, invitations, and tribute booklets created to honour Virginia's life — tributes from her children, grandchildren, family, and friends; poems; scripture; and memories.";

export const RESTING_PLACE = {
  title: 'Seke, Zinganga, Zimbabwe',
  copy: 'Virginia Dadirayi Chiimba was laid to rest in Seke, Zinganga, the community she called home. Her grave stands as a quiet place of remembrance where family and friends can visit, reflect, and feel close to her enduring spirit.',
  photos: ['/virginia-grave-1.jpg', '/virginia-grave-2.jpg'],
  caption: 'Photos from Seke, Zinganga — May her soul rest in eternal peace.',
};

/** Life timeline — 6 events. */
export const LIFE_TIMELINE: TimelineItem[] = [
  {
    date: '1955',
    title: 'Born in Seke, Chitungwiza',
    body: 'Virginia Dadirayi Chiimba was born on 7 June 1955 in Seke, Chitungwiza, Zimbabwe — the firstborn of ten siblings.',
    status: 'plain',
  },
  {
    date: '1971',
    title: 'Married and Started a Family',
    body: 'She married and became a devoted mother to seven children: Ray (born 1973), Eddie (1974), Giri (1976), Dougie (1979), Taka (1981), Hamu (1985), and Nyasha (1990).',
    status: 'plain',
  },
  {
    date: '2002',
    title: 'Became a Grandmother',
    body: 'Her eldest grandchild, Chiedza, was born — the first of 18 grandchildren: Chiedza, Mike, Glen, Zee, Kudzo, Tiwi, Ethan, Caitlyn, Tyler, Ishe, Tafara, Ruvheneko, Ravi, Unathi, Anathi, Tamiranashe, Tawona, and Ivainesu.',
    status: 'plain',
  },
  {
    date: '2010',
    title: 'Community Pillar',
    body: 'A respected member of her community, known for her kindness, wisdom, patience, and willingness to listen. She touched many lives through her gentle spirit and caring nature.',
    status: 'plain',
  },
  {
    date: '2025',
    title: 'Passed Away',
    body: 'She passed away on 19 May 2025 and was laid to rest in Seke, Zinganga — the community she called home.',
    status: 'plain',
  },
  {
    date: '2025',
    title: 'Memorial Service',
    body: 'Saturday 25 October, 10:30 am — Mushore Homestead, Seke. Family and friends gathered to honour her life.',
    status: 'key',
  },
];

export interface FamilyMember {
  name: string;
  relation: string;
  birthYear?: number;
}

/**
 * The Mushore family — her parents and her nine siblings, supplied by the
 * family 25 July 2026.
 *
 * Birth years appear ONLY where the family gave them. Josephine's year and
 * both parents' years are unknown and are deliberately left blank rather than
 * estimated. Do not fill these in by inference.
 */
export interface Parent extends FamilyMember {
  /** Shona honorific used by her children and grandchildren. */
  honorific: string;
  /** Both are living. Never render them as deceased. */
  living: true;
}

/**
 * Her parents — Johannes and Juliana Mushore. BOTH ARE LIVING (confirmed by
 * the family, 25 July 2026). Nothing on this page may imply otherwise: no
 * death years, no memorial links, no past tense.
 *
 * `honorific` is how Virginia's children and grandchildren address them.
 * `relation` is their relation to Virginia herself, whose memorial this is.
 *
 * Their 72nd wedding anniversary was supplied and then withdrawn from
 * publication at the family's request. Do not reinstate it, and do not publish
 * any venue, time or address for living family members.
 */
export const PARENTS: Parent[] = [
  { name: 'Johannes Mushore', relation: 'Her father', honorific: 'Sekuru Johannes', living: true },
  { name: 'Juliana Mushore', relation: 'Her mother', honorific: 'Ambuya Juliana', living: true },
];

/**
 * Shona kinship terms, as the family uses them (confirmed by Gilbert).
 * Virginia was the firstborn, so every sister is younger than her — which is
 * why all her sisters take the same term.
 */
export const KINSHIP_NOTE =
  'In our family, Virginia\u2019s brothers are Sekuru to her children and grandchildren, and her sisters are Amaini.';

export interface Sibling extends FamilyMember {
  /** Birth order among the ten children, Virginia first. */
  order: number;
  deathYear?: number;
  isVirginia?: boolean;
  /** Shona kinship term used by Virginia's children — Sekuru or Amaini. */
  kinship?: string;
}

/** All ten children of Johannes and Juliana, in birth order. */
export const SIBLINGS: Sibling[] = [
  { order: 1, name: 'Virginia Dadirayi Chiimba', relation: 'Firstborn', birthYear: 1955, deathYear: 2025, isVirginia: true },
  { order: 2, name: 'George Mushore', relation: 'Her brother', kinship: 'Sekuru', birthYear: 1956 },
  { order: 3, name: 'Getrude Mushore', relation: 'Her sister', kinship: 'Amaini', birthYear: 1959 },
  { order: 4, name: 'Gerald Mushore', relation: 'Her brother', kinship: 'Sekuru', birthYear: 1960 },
  { order: 5, name: 'Joachim Mushore', relation: 'Her brother', kinship: 'Sekuru', birthYear: 1964 },
  { order: 6, name: 'Joseph Mushore', relation: 'Her brother', kinship: 'Sekuru', birthYear: 1968, deathYear: 2024 },
  // Birth year not supplied by the family — left blank deliberately.
  { order: 7, name: 'Josephine Mushore', relation: 'Her sister', kinship: 'Amaini' },
  { order: 8, name: 'Victoria Mushore', relation: 'Her sister', kinship: 'Amaini', birthYear: 1975, deathYear: 2016 },
  { order: 9, name: 'Concilica Mushore', relation: 'Her sister', kinship: 'Amaini', birthYear: 1978 },
  { order: 10, name: 'Tafadzwa Mushore', relation: 'Her brother', kinship: 'Sekuru', birthYear: 1980 },
];

export const SIBLING_COUNT = SIBLINGS.length - 1;

export const ORIGIN_FAMILY_COPY =
  'Virginia was the firstborn of ten, born to Johannes and Juliana Mushore. Her brothers and sisters are named here in birth order.';

/**
 * Her schooling, working life and early years.
 *
 * PENDING: deliberately empty. The family will supply this. Nothing is to be
 * written here from inference — the current biography says what she meant to
 * her children; what she did with her working life is not yet recorded.
 */
export const EARLY_LIFE: string[] = [];

export const CHILDREN: FamilyMember[] = [
  { name: 'Ray Chiimba', relation: 'Son', birthYear: 1973 },
  { name: 'Eddie Chiimba', relation: 'Son', birthYear: 1974 },
  { name: 'Giri Chiimba', relation: 'Son', birthYear: 1976 },
  { name: 'Dougie Chiimba', relation: 'Son', birthYear: 1979 },
  { name: 'Taka Chiimba', relation: 'Son', birthYear: 1981 },
  { name: 'Hamu Chiimba', relation: 'Son', birthYear: 1985 },
  { name: 'Nyasha Chiimba', relation: 'Daughter', birthYear: 1990 },
];

export const GRANDCHILDREN: FamilyMember[] = [
  { name: 'Chiedza', relation: 'Grandchild — eldest', birthYear: 2002 },
  { name: 'Mike', relation: 'Grandchild' },
  { name: 'Glen', relation: 'Grandchild' },
  { name: 'Zee', relation: 'Grandchild' },
  { name: 'Kudzo', relation: 'Grandchild' },
  { name: 'Tiwi', relation: 'Grandchild' },
  { name: 'Ethan', relation: 'Grandchild' },
  { name: 'Caitlyn', relation: 'Grandchild' },
  { name: 'Tyler', relation: 'Grandchild' },
  { name: 'Ishe', relation: 'Grandchild' },
  { name: 'Tafara', relation: 'Grandchild' },
  { name: 'Ruvheneko', relation: 'Grandchild' },
  { name: 'Ravi', relation: 'Grandchild' },
  { name: 'Unathi', relation: 'Grandchild' },
  { name: 'Anathi', relation: 'Grandchild' },
  { name: 'Tamiranashe', relation: 'Grandchild' },
  { name: 'Tawona', relation: 'Grandchild' },
  { name: 'Ivainesu', relation: 'Grandchild' },
];

export const FUNERAL_EVENT = {
  title: 'Memorial Service',
  date: 'Saturday 25 October 2025',
  time: '10:30 – 14:00',
  venue: 'Mushore Homestead, Seke, Chitungwiza, Zimbabwe',
};

export interface ServiceVideo {
  title: string;
  thumbnail: string;
}

export const SERVICE_VIDEOS: ServiceVideo[] = [
  { title: 'Funeral Service — Part 1', thumbnail: '/virginia-gallery-4.jpg' },
  { title: 'Funeral Service — Part 2', thumbnail: '/virginia-gallery-3.jpg' },
  { title: 'Funeral Service — Part 3', thumbnail: '/virginia-gallery-2.jpg' },
];

export const VIDEOS_META = 'Recorded 25 October 2025 · Mushore Homestead, Seke';

export interface GuestbookEntry {
  title: string;
  author: string;
  date: string;
  message: string;
}

export const GUESTBOOK: GuestbookEntry[] = [
  {
    title: 'A True Matriarch',
    author: 'Tendai Chiimba',
    date: '15 January 2024',
    message:
      'Your strength and wisdom continue to guide us every day. We miss your laughter and the way you brought everyone together.',
  },
  {
    title: "Christmas at Grandma's",
    author: 'Rudo Moyo',
    date: '20 February 2024',
    message:
      'Every Christmas, the house would be filled with the smell of your special bread and the sound of gospel music. Those memories are forever treasured.',
  },
];

/** The 12 candles lit 20–23 May 2025 — names and quotes per the live memorial. */
export const CANDLES: Candle[] = [
  { name: 'Ray', message: FAMILY_TRIBUTES[0].quote, date: '20 May 2025' },
  { name: 'Giri', message: FAMILY_TRIBUTES[1].quote, date: '20 May 2025' },
  { name: 'Dougie', message: FAMILY_TRIBUTES[2].quote, date: '20 May 2025' },
  { name: 'Hamu', message: FAMILY_TRIBUTES[3].quote, date: '21 May 2025' },
  { name: 'Mazvita', message: FAMILY_TRIBUTES[4].quote, date: '21 May 2025' },
  { name: 'Tyler Tinaye Gilbert Chiimba (Grandson)', message: FAMILY_TRIBUTES[5].quote, date: '21 May 2025' },
  { name: 'Carol', message: FAMILY_TRIBUTES[6].quote, date: '22 May 2025' },
  {
    name: 'Eddie',
    message: 'Thank you for being our guiding light through every season. We will carry your love with us always.',
    date: '22 May 2025',
  },
  {
    name: 'Taka',
    message: 'Your memory is a treasure we keep in our hearts. We love you, Mum.',
    date: '22 May 2025',
  },
  {
    name: 'Nyasha',
    message: 'You were the best mother anyone could ask for. Rest in perfect peace.',
    date: '23 May 2025',
  },
  {
    name: 'Chiedza (Grandchild)',
    message: 'Gogo, your love was the foundation of our family. We will honour you in how we live.',
    date: '23 May 2025',
  },
  {
    name: 'The Chiimba Family',
    message: 'Forever in our hearts, Mama. Your light continues to guide us every single day.',
    date: '23 May 2025',
  },
];

/** Service Provider Rail — per virginia.md. */
export const PROVIDERS: ServiceProvider[] = [
  {
    name: 'Eternal Stone Tombstones',
    category: 'Tombstone Maker',
    description: 'Granite headstones and memorials, crafted and engraved in Harare.',
    contactHref: 'mailto:admin@memoryglen.com?subject=Eternal%20Stone%20Tombstones',
    tier: 'featured',
  },
  {
    name: 'Msasa Florists',
    category: 'Florist',
    description: 'Wreaths & grave flowers, Harare & surrounds.',
    tier: 'standard',
  },
  {
    name: 'Glen View Catering',
    category: 'Caterer',
    description: 'Funeral catering, Harare & Chitungwiza.',
    tier: 'standard',
  },
  {
    name: 'ClearStream Funeral Streaming',
    category: 'Livestream Services',
    phone: '+263 71 555 0143',
    tier: 'basic',
  },
  {
    name: 'Heritage Printers',
    category: 'Memorial Booklets',
    phone: '+263 71 555 0192',
    tier: 'basic',
  },
];

/** True on the anniversary of her passing (19 May) — the memorial keeps Dusk. */
export function isAnniversaryToday(): boolean {
  const now = new Date();
  return now.getMonth() === 4 && now.getDate() === 19;
}


/* ---------- The Journey — from the family's own record ---------- */

/**
 * The final journey, May–October 2025, taken from the family WhatsApp
 * coordinating group.
 *
 * RULES FOR THIS SECTION — do not relax them:
 *  - Every line here comes from the family's record. Nothing is inferred.
 *  - No emotional colour has been added. The events carry their own weight.
 *  - Names are the family's real names. WhatsApp handles (South Ray, Giri,
 *    Para bellum) are deliberately not published.
 *  - The photograph album link is NOT published. The gallery holds many living
 *    relatives at a private gathering, and a public page would make it findable
 *    by anyone. The album is noted as existing; the link stays with the family.
 *  - There is a gap between 19 May and early October 2025 that the record does
 *    not cover. It is left as a gap, not filled.
 */

export interface JourneyPerson {
  name: string;
  role: string;
}

export const COORDINATING_TEAM: JourneyPerson[] = [
  { name: 'Rev Chinyowa', role: 'Methodist Revival Church (MRC)' },
  { name: 'Sekuru Robson', role: 'Master of Ceremonies' },
  { name: 'Sekuru Joachim Mushore', role: 'Her brother' },
  { name: 'Raymond', role: 'Her son' },
  { name: 'Gilbert', role: 'Her son' },
  { name: 'Douglas', role: 'Her son' },
  { name: 'Hamu', role: 'Her son' },
];

/** Order of service, 25 October 2025. */
export const UNVEILING_PROGRAMME: { time?: string; item: string; who?: string }[] = [
  { time: '10:00 \u2013 10:30', item: 'Opening prayer', who: 'Rev Chinyowa' },
  { item: 'Introduction', who: 'Family representative' },
  { item: 'Testimonies', who: 'Parents and siblings, children, grandchildren, friends' },
  { item: 'Biography reading' },
  { item: 'Church service', who: 'Sermon, approximately 30 minutes' },
  { item: 'Relocation to the graveside' },
  { item: 'Unveiling of the tombstone', who: 'Rev Chinyowa' },
  { item: 'Vote of thanks' },
  { item: 'Lunch' },
];

export interface JourneyStage {
  id: string;
  stage: number;
  label: string;
  date: string;
  body: string[];
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'passing',
    stage: 1,
    label: 'Her Passing',
    date: '19 May 2025',
    body: ['Virginia Dadirayi Chiimba passed away.'],
  },
  {
    id: 'coordination',
    stage: 2,
    label: 'Family Coordination and Planning',
    date: 'Early October 2025',
    body: [
      'The family formed the Virginia Chiimba Memorial Coordinating Team to plan her memorial service and the unveiling of her tombstone.',
      'The service would be held at Mushore Homestead in Seke \u2014 her own family\u2019s homestead, and the home of her brother, Sekuru Joachim Mushore.',
    ],
  },
  {
    id: 'tombstone',
    stage: 3,
    label: 'Tombstone Preparation',
    date: '14 \u2013 24 October 2025',
    body: [
      'The tombstone \u2014 the dombo \u2014 was completed on 14 and 15 October and prepared for the unveiling. It remained covered until the ceremony.',
      'From 18 to 24 October the family worked through the detail of the programme: the speakers, the order of service, and the timing of the day.',
    ],
  },
  {
    id: 'unveiling',
    stage: 4,
    label: 'Memorial Service and Tombstone Unveiling',
    date: 'Saturday 25 October 2025',
    body: ['Mushore Homestead, Seke, Chitungwiza.'],
  },
  {
    id: 'after',
    stage: 5,
    label: 'After the Service',
    date: '26 \u2013 30 October 2025',
    body: [
      'On 26 October the family gave thanks for a service well held.',
      'On 30 October a professional photograph album of the memorial service was shared within the family.',
    ],
  },
  {
    id: 'remembrance',
    stage: 6,
    label: 'Ongoing Remembrance',
    date: 'Every year',
    body: [
      'Her family gathers to remember her on the anniversary of her passing, 19 May, and on her birthday, 7 June.',
      'On 19 May each year this memorial keeps Dusk.',
    ],
  },
];
