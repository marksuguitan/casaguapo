// Editorial photography is served from Unsplash. Every image sits on a toned
// backdrop (see `.media` in global.css), so the layout holds if one fails to load.
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const images = {
  heroVilla: unsplash('1613490493576-7fde63acd811', 2400),
  modernHouse: unsplash('1600596542815-ffad4c1539a9'),
  interior: unsplash('1600210492486-724fe5c67fb0'),
  interiorTwo: unsplash('1600607687939-ce8a6c25118c'),
  resortPool: unsplash('1566073771259-6a8506099945'),
  dining: unsplash('1414235077428-338989a2e8c0'),
  restaurant: unsplash('1517248135467-4c7edcad34c4'),
  serverRoom: unsplash('1558494949-ef010cbdcc31'),
  portraitWoman: unsplash('1534528741775-53994a69daeb', 1200),
  portraitMan: unsplash('1507003211169-0a1dd7228f2d', 1200),
  portraitWomanTwo: unsplash('1494790108377-be9c29b29330', 1200),
  portraitManTwo: unsplash('1500648767791-00dcc994a43e', 1200),
  bedroom: unsplash('1505691938895-1758d7feb511'),
  hotel: unsplash('1551882547-ff40c63fe5fa'),
};

export type IconName =
  | 'mail'
  | 'database'
  | 'globe'
  | 'shield'
  | 'sparkle'
  | 'assistant'
  | 'friends'
  | 'concierge';

export interface Service {
  slug: string;
  icon: IconName;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  includes: string[];
  note: string;
  image: string;
  imageAlt: string;
}

export const technologyServices: Service[] = [
  {
    slug: 'email',
    icon: 'mail',
    title: 'Private Email Hosting',
    kicker: 'Correspondence',
    summary: 'For correspondence simply too important for ordinary inboxes.',
    description:
      'Exclusive, privacy-focused email infrastructure for individuals whose correspondence is simply too important for ordinary inboxes. Every message arrives on hardware that has never once received a coupon.',
    includes: [
      'Inbound mail screened for tone, relevance and sender attractiveness',
      'Addresses at domains no one else is permitted to pronounce',
      'The ability to unsubscribe from people, not merely newsletters',
      'Reply-all permanently disabled, for your protection',
    ],
    note: 'Typical client: a duchess who receives four emails a year, all of them essential.',
    image: images.interiorTwo,
    imageAlt: 'A quiet, sunlit private study with walnut furniture',
  },
  {
    slug: 'database',
    icon: 'database',
    title: 'Private Database Hosting',
    kicker: 'Infrastructure',
    summary: 'Distinguished infrastructure for equally distinguished data.',
    description:
      'Premium, secure database infrastructure for exceptionally distinguished clients and their equally distinguished data. Your records will never share a rack with anyone you would not seat at dinner.',
    includes: [
      'Dedicated hardware that has never stored an ordinary person’s data',
      'Rows indexed by importance rather than insertion order',
      'Nightly backups to a vault beneath a Swiss mountain we also manage',
      'Query latency appropriate to your station',
    ],
    note: 'Uptime: 100%. We do not discuss the alternative.',
    image: images.serverRoom,
    imageAlt: 'A softly lit private server hall',
  },
  {
    slug: 'domains',
    icon: 'globe',
    title: 'Domain Registration & Management',
    kicker: 'Digital identity',
    summary: 'White-glove acquisition for identities that deserve attention.',
    description:
      'White-glove domain acquisition, registration and management for people whose digital identities deserve extraordinary attention. If your name is taken, we will have a conversation with whoever took it.',
    includes: [
      'Your name, secured in every extension, and several of your rivals’',
      'Discreet, persuasive negotiation with existing owners',
      'Single-letter domains, subject to availability and further persuasion',
      'Renewals handled so you never learn the word “expired”',
    ],
    note: 'We have never lost a negotiation. We have occasionally bought the company.',
    image: images.modernHouse,
    imageAlt: 'A modern private residence at dusk',
  },
  {
    slug: 'privacy',
    icon: 'shield',
    title: 'Digital Privacy & Security',
    kicker: 'Discretion',
    summary: 'A digital presence as exclusive as your physical one.',
    description:
      'Personalised cybersecurity and privacy services for individuals who believe their digital presence should be as exclusive as their physical presence. Which is to say, almost no one should be let in.',
    includes: [
      'Continuous removal of unflattering photographs from the internet',
      'Threat modelling against paparazzi, former partners and lesser cousins',
      'Two-factor authentication, the second factor being your face',
      'A response team that arrives before you know there was a problem',
    ],
    note: 'Your data deserves the same exclusivity as your social circle.',
    image: images.bedroom,
    imageAlt: 'A secluded bedroom suite with linen and soft morning light',
  },
];

export const lifestyleServices: Service[] = [
  {
    slug: 'beauty',
    icon: 'sparkle',
    title: 'Beauty Enhancement & Optimization',
    kicker: 'Aesthetic stewardship',
    summary: 'For those who refuse to accept perfection as a stopping point.',
    description:
      'Bespoke beauty consultation, appearance optimisation and aesthetic advisory for individuals who have already achieved extraordinary attractiveness, but refuse to accept perfection as a stopping point.',
    includes: [
      'Quarterly symmetry audits, reported in confidence',
      'Lighting consultation for every room you may enter',
      'Calibration of all mirrors in your residences',
      'An advisory panel that will tell you the truth, which is that you are perfect, followed by a plan',
    ],
    note: 'Beauty is subjective. Fortunately, our admission standards aren’t.',
    image: images.portraitWoman,
    imageAlt: 'An editorial portrait in soft natural light',
  },
  {
    slug: 'assistants',
    icon: 'assistant',
    title: 'Private Personal Assistants',
    kicker: 'Anticipation',
    summary: 'Every need anticipated. Every achievement appropriately admired.',
    description:
      'Dedicated assistants trained to anticipate every need, manage the ordinary inconveniences of existence, and provide appropriately enthusiastic admiration, calibrated to your preferences and reviewed monthly.',
    includes: [
      'Needs anticipated up to seventy-two hours in advance',
      'Management of queues, weather and minor inconvenience',
      'Admiration delivered at a register of your choosing',
      'A standing instruction to laugh, sincerely, at your jokes',
    ],
    note: 'Assistants are selected for discretion, competence and a pleasing profile in the background of photographs.',
    image: images.portraitMan,
    imageAlt: 'An editorial portrait of a composed gentleman',
  },
  {
    slug: 'friends',
    icon: 'friends',
    title: 'Friends for Hire',
    kicker: 'Companionship',
    summary: 'For occasions when your existing friends are simply insufficient.',
    description:
      'Carefully curated social companions for exclusive events, dinners, celebrations and occasions when a client’s existing friends are insufficiently interesting, attractive or available.',
    includes: [
      'Companions vetted for wit, beauty and impeccable laughter timing',
      'Briefed in advance on your achievements, in order of importance',
      'Available for galas, weddings, and birthdays you suspect no one will attend',
      'A strict, contractually binding non-outshining clause',
    ],
    note: 'Your friends should be as carefully selected as your investments.',
    image: images.dining,
    imageAlt: 'An elegant candlelit dinner table',
  },
  {
    slug: 'concierge',
    icon: 'concierge',
    title: 'Lifestyle Concierge',
    kicker: 'Time, returned',
    summary: 'Because your time is too valuable for ordinary responsibilities.',
    description:
      'Highly personalised support for clients whose time is too valuable to spend on ordinary responsibilities, which, in our experience, is all of them.',
    includes: [
      'Reservations at establishments that do not take reservations',
      'Management of property, travel, staff and the staff who manage the staff',
      'Reminders for the birthdays of people you would like to appear to remember',
      'Any request, at any hour, handled without visible effort',
    ],
    note: 'We have never said the words “fully booked” to a client. We have said them to restaurants.',
    image: images.resortPool,
    imageAlt: 'A private resort pool overlooking the sea',
  },
];

export interface Tier {
  id: string;
  name: string;
  price: number;
  positioning: string;
  description: string;
  includes: string[];
  cta: string;
  smallPrint?: string;
  featured?: boolean;
}

export const tiers: Tier[] = [
  {
    id: 'basic-people-only',
    name: 'Basic People Only',
    price: 10000,
    positioning: 'Our entry-level membership. For those still experiencing financial limitations.',
    description:
      'Our most economically accessible offering. We strongly discourage applying unless absolutely necessary. Financial struggles are understandable, but deeply unfortunate.',
    includes: [
      'Private email, one address, modestly named',
      'A shared assistant, weekdays and with notice',
      'Two Friends for Hire per quarter, weekday dinners only',
      'Management of one domain of reasonable length',
      'Members’ lounge access, by the side entrance',
    ],
    cta: 'Apply, if you must',
    smallPrint: 'If pricing is a concern, this membership may not be right for you.',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 15000,
    positioning: 'For the conventionally extraordinary.',
    description:
      'For individuals of considerable beauty, wealth and self-awareness. A respectable beginning, though we trust your ambitions extend further.',
    includes: [
      'Private email with unlimited aliases',
      'A dedicated database instance',
      'A personal assistant, five days a week',
      'Friends for Hire for up to six occasions a month',
      'A quarterly beauty review',
      'Priority reservations at establishments of moderate difficulty',
    ],
    cta: 'Request an invitation',
  },
  {
    id: 'ultra',
    name: 'Ultra-Super Beautiful People',
    price: 50000,
    positioning:
      'Reserved for individuals whose beauty and importance transcend conventional measurement.',
    description:
      'An uncompromising experience for the truly exceptional. Because being extraordinarily beautiful is a responsibility, and responsibilities require infrastructure.',
    includes: [
      'Everything, without exception or hesitation',
      'Dedicated infrastructure across three discreet jurisdictions',
      'A team of assistants, one assigned exclusively to admiration',
      'Unlimited Friends for Hire, including a standing entourage',
      'Continuous beauty optimisation with an on-call lighting director',
      'Reputation management across the internet and most of Europe',
      'A private line to our founder, who will answer, eventually',
    ],
    cta: 'Request an invitation',
    smallPrint: 'Membership is subject to aesthetic, financial, and entirely arbitrary approval.',
    featured: true,
  },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
