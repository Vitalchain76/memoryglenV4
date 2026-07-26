/**
 * Terms and Privacy content.
 *
 * ⚠️ NOT LEGAL ADVICE. I am not a lawyer, and this has not been reviewed by one.
 * It is a clear, honest, plain-language starting point that covers the three
 * things the brief asked for — content ownership, family control, and data about
 * living people in family trees — plus the basics a real site needs.
 *
 * HAVE A LAWYER READ THIS BEFORE POINTING memoryglen.com AT IT. Two reasons in
 * particular:
 *
 *  1. POPIA. MemoryGlen operates from South Africa, so the Protection of
 *     Personal Information Act applies. It requires a named Information Officer
 *     registered with the Regulator, a lawful basis for processing, and a
 *     defined retention position. Placeholders are marked below.
 *  2. Living people in family trees. A memorial records the names, birth years
 *     and relationships of people who are alive and who never signed up. Under
 *     POPIA and GDPR that is personal information processed without the
 *     subject's consent. It is the single largest legal exposure this product
 *     has, and the section below is written to be honest about it rather than
 *     to hide it.
 */

export const LAST_UPDATED = '26 July 2026';

/** Marked so they are easy to find and replace before launch. */
export const OPERATOR = {
  name: 'MemoryGlen',
  contact: 'admin@memoryglen.com',
  // TODO before launch: registered company name, address, and the POPIA
  // Information Officer's name and contact.
  registeredEntity: '[registered entity — to be completed]',
  informationOfficer: '[Information Officer — to be appointed and registered]',
};

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export const TERMS: LegalSection[] = [
  {
    heading: 'What MemoryGlen is',
    paragraphs: [
      'MemoryGlen is a place to build and keep a memorial for someone who has died — their life story, photographs, recordings, and the people they belonged to. Creating a memorial is free, and visiting one is free.',
      'Some memorials on this site are demonstrations. They are clearly labelled, and the people in them are fictional.',
    ],
  },
  {
    heading: 'Who owns what you add',
    paragraphs: [
      'You keep ownership of everything you upload — words, photographs, recordings, documents. It is yours and it stays yours.',
      'By adding it, you give MemoryGlen permission to store it and to display it on the memorial according to the privacy setting that memorial has. That permission exists only so we can show your content to the people you intend to see it. We do not sell it, license it to anyone else, or use it to advertise.',
      'You are responsible for having the right to upload what you upload. If a photograph belongs to a photographer, or a recording belongs to someone else, please make sure you are allowed to share it.',
    ],
  },
  {
    heading: 'Who controls a memorial',
    paragraphs: [
      'Every memorial has a family owner: the person who created it, or whoever they have passed control to. The owner decides who may view the memorial, who may add to it, and who may edit what is already there.',
      'Families disagree, and grief makes that harder. If there is a genuine dispute about who should control a memorial, write to us and we will try to help — but we will not take sides between family members, and we may keep a memorial as it is until the family has agreed.',
      'A family owner may ask us to remove a memorial entirely. We will do it.',
    ],
  },
  {
    heading: 'Living people who appear in a memorial',
    paragraphs: [
      'A family tree names people who are alive. If you are named on one and you would rather not be, you can ask to be removed and we will remove you. You do not have to give a reason, and you do not need the family owner\u2019s agreement.',
      'If you add a living person to a family tree, please add only what they would be comfortable with — their name and their relationship. Do not add contact details, addresses, or anything private about them.',
      'Write to us at the address below and we will act on it.',
    ],
  },
  {
    heading: 'What is not allowed',
    paragraphs: ['A memorial is a serious thing. Please do not use MemoryGlen to:'],
    list: [
      'create a memorial for someone who is alive, or a fake memorial',
      'upload content you do not have the right to share',
      'harass a family, or use a memorial to continue a dispute',
      'post anything unlawful, or anything that would distress the family it belongs to',
    ],
  },
  {
    heading: 'How long a memorial lasts',
    paragraphs: [
      'A memorial is built to last, and that is the whole promise of this product. We intend to keep memorials available for as long as MemoryGlen exists.',
      'We will be honest rather than make a promise we cannot keep: if MemoryGlen ever had to close, we would give families notice and a way to download everything they have added, before anything was removed.',
    ],
  },
  {
    heading: 'Things we have to say',
    paragraphs: [
      'MemoryGlen is provided as it is. We work hard to keep it available and to keep your content safe, but we cannot guarantee the service will never be interrupted.',
      'Please keep your own copies of anything irreplaceable — a voice recording of someone you have lost should exist in more than one place, wherever that place is.',
      'These terms are governed by the law of South Africa.',
    ],
  },
];

export const PRIVACY: LegalSection[] = [
  {
    heading: 'The short version',
    paragraphs: [
      'We collect what we need to run the memorials and nothing else. We do not sell your information. We do not run advertising networks on memorial pages.',
    ],
  },
  {
    heading: 'What we collect',
    paragraphs: ['If you create an account:'],
    list: [
      'your name and email address',
      'what you add to memorials — text, photographs, recordings, documents',
      'basic technical information your browser sends, which we use to keep the site working',
    ],
  },
  {
    heading: 'Information about other people',
    paragraphs: [
      'This is the part that deserves plain speaking.',
      'A memorial contains information about someone who has died, and often about their family — including relatives who are still alive, who did not create the memorial and have not agreed to be on it.',
      'We ask families to add only a living person\u2019s name and relationship, and nothing private. If you are named on a memorial and want to be removed, write to us and we will remove you. We will not ask you to justify it and we will not require the family\u2019s permission.',
    ],
  },
  {
    heading: 'Who can see a memorial',
    paragraphs: [
      'The family owner chooses. A memorial can be open to anyone, visible only to family, or private to a few named people.',
      'A public memorial can be found by search engines and will show a preview when its link is shared. If that is not what a family wants, the setting should be changed before the link goes out.',
    ],
  },
  {
    heading: 'Who we share information with',
    paragraphs: [
      'Only the services we need to run MemoryGlen: our hosting provider, our database provider, and the services that store photographs and recordings. They process information on our instructions and may not use it for anything else.',
      'We do not sell personal information. We do not share it with advertisers.',
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      'Under South African law (POPIA) and, where it applies, the GDPR, you may ask us what we hold about you, ask us to correct it, ask us to delete it, and object to how we use it.',
      `Write to ${OPERATOR.contact} and we will respond.`,
    ],
  },
  {
    heading: 'Contact',
    paragraphs: [
      `Write to ${OPERATOR.contact}.`,
      `Information Officer: ${OPERATOR.informationOfficer}`,
    ],
  },
];
