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

/** Tributes from her children and family — verbatim. */
export const TRIBUTES: Tribute[] = [
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

export const HYMN = {
  shona: 'Mvari mubatsiri wedu, tichava nemi nguva dzose.',
  translation: '(God our helper, we will be with You always.)',
};

/** Poem — "Forever in Our Hearts" (verbatim, 9 lines). */
export const POEM_LINES = [
  'Though you have journeyed beyond our sight,',
  'Your love remains our guiding light.',
  'In every prayer, in every song,',
  'Your spirit walks with us along.',
  'The lessons taught, the stories shared,',
  'The way you showed us that you cared —',
  'These gifts of love will never part,',
  'For you live forever in our hearts.',
  'Rest in peace, Virginia Dadirayi Chiimba. Your memory is our blessing.',
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
  { name: 'Ray', message: TRIBUTES[0].quote, date: '20 May 2025' },
  { name: 'Giri', message: TRIBUTES[1].quote, date: '20 May 2025' },
  { name: 'Dougie', message: TRIBUTES[2].quote, date: '20 May 2025' },
  { name: 'Hamu', message: TRIBUTES[3].quote, date: '21 May 2025' },
  { name: 'Mazvita', message: TRIBUTES[4].quote, date: '21 May 2025' },
  { name: 'Tyler Tinaye Gilbert Chiimba (Grandson)', message: TRIBUTES[5].quote, date: '21 May 2025' },
  { name: 'Carol', message: TRIBUTES[6].quote, date: '22 May 2025' },
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
