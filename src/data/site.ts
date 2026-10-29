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

// Drawings available to MerchArt.astro.
export type MerchArtName =
  | 'bag'
  | 'yacht'
  | 'jet'
  | 'necklace'
  | 'ring'
  | 'watch'
  | 'car'
  | 'champagne'
  | 'island'
  | 'chandelier';

export interface Service {
  slug: string;
  icon: IconName;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  includes: string[];
  note: string;
  testimonial: { quote: string; who: string };
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
      'Exclusive, privacy-focused email infrastructure for individuals whose correspondence is simply too important for ordinary inboxes. Your messages are stored on hardware that has never once received a coupon, a newsletter, or a message from someone’s cousin about an opportunity.',
    includes: [
      'Inbound mail screened for tone, relevance and the sender’s net worth',
      'Messages from relatives returned unopened, with a polite note about boundaries',
      'The ability to unsubscribe from people, not merely newsletters',
      'Reply-all permanently disabled. We have seen what it does to families.',
    ],
    note: 'Typical client: a duchess who receives four emails a year, two of them condolences she did not ask for.',
    testimonial: {
      quote: 'I used to get emails from my sister. Now I get a monthly summary, and it is always the same: she is still upset.',
      who: 'A Member, Gstaad',
    },
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
      'Premium, secure database infrastructure for exceptionally distinguished clients and their equally distinguished data. Your records will never share a rack with anyone you would not seat at dinner, which, in our experience, is everyone.',
    includes: [
      'Dedicated hardware that has never stored an ordinary person’s data, and was cleaned after the delivery driver touched it',
      'Rows indexed by importance. Your ex-husband is a soft delete.',
      'Nightly backups to a vault beneath a Swiss mountain. The mountain is also a client.',
      'Query latency appropriate to your station',
    ],
    note: 'Uptime: 100%. The last engineer who discussed the alternative now hosts databases for a regional bank.',
    testimonial: {
      quote: 'I asked where my data was kept. They said, ‘Somewhere nicer than your childhood home.’ I have never felt more secure.',
      who: 'A Member since 2017, Lake Como',
    },
    image: images.serverRoom,
    imageAlt: 'A softly lit private server hall',
  },
  {
    slug: 'infrastructure',
    icon: 'globe',
    title: 'Private Infrastructure Management',
    kicker: 'Ownership',
    summary: 'Your own servers, because renting is for other people.',
    description:
      'The cloud is simply other people’s computers, and our members do not use other people’s anything. We build, house and supervise servers that belong to you alone, in climate-controlled rooms nicer than most people’s apartments, staffed by engineers who have signed more NDAs than you have.',
    includes: [
      'Dedicated servers in each of your residences, plus one on the yacht for when you are feeling nautical',
      'Hardware hand-assembled in Switzerland and burned in for a full week, the way you would want a butler trained',
      'Racks that are never shared, never rebooted in your presence and never, ever on sale',
      'A dedicated engineer on call at all hours, who answers on the first ring and calls you “sir” even when you are not one',
    ],
    note: 'Our members do not rent servers, much as they do not rent cutlery.',
    testimonial: {
      quote: 'My old provider said my data was ‘in the cloud’, alongside everyone else’s. Everyone else’s! Now it lives in the east wing, where I can visit it.',
      who: 'A Member, Monaco',
    },
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
      'Personalised cybersecurity and privacy services for individuals who believe their digital presence should be as exclusive as their physical presence. Which is to say, nobody gets in without a reason, a reference and a recent tax return.',
    includes: [
      'Continuous removal of unflattering photographs. We have never found one, but we look every day, for your peace of mind',
      'Threat modelling against paparazzi, former spouses and cousins who are next in line',
      'Two-factor authentication. The second factor is your jawline.',
      'A response team that arrives before the problem, and leaves with it',
    ],
    note: 'Your data deserves the same exclusivity as your social circle. Your social circle, frankly, could stand to be smaller.',
    testimonial: {
      quote: 'They promised to remove every unflattering photograph of me from the internet. It took eleven minutes. There were none. I could have told them that.',
      who: 'A Member since 2011, location withheld',
    },
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
      'Bespoke beauty consultation, appearance optimisation and aesthetic advisory for individuals who have already achieved extraordinary attractiveness, but refuse to accept perfection as a stopping point. Ageing is available to non-members.',
    includes: [
      'Quarterly symmetry audits, with findings delivered gently and then once more, less gently',
      'Lighting consultation for every room you may enter, including your own funeral',
      'Calibration of every mirror in your residences, so they agree with us',
      'A panel that will tell you the truth, which is that you are perfect, followed by an invoice',
    ],
    note: 'Beauty is subjective. Fortunately, our admission standards aren’t.',
    testimonial: {
      quote: 'I asked what I could improve. They said ‘nothing’. I said ‘look harder’. They found one eyelash. It was the most difficult week of my life, and I have been through a divorce. Three.',
      who: 'A Member, Saint-Tropez',
    },
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
      'Dedicated assistants trained to anticipate every need, absorb the ordinary inconveniences of existence, and provide appropriately enthusiastic admiration. They have no personal lives, which they tell us is very freeing. We have chosen to believe them.',
    includes: [
      'Needs anticipated up to seventy-two hours in advance, grudges up to a decade',
      'Management of queues, weather and any feelings you would rather not have',
      'Admiration delivered at a register of your choosing, including “stunned”',
      'A standing instruction to laugh at your jokes, sincerely, or be replaced by someone who will',
    ],
    note: 'Assistants are selected for discretion, competence and their ability to fade completely out of photographs.',
    testimonial: {
      quote: 'Pierre once asked for a day off for his mother’s surgery, and I gave it to him. I would like that on the record somewhere. Here, perhaps.',
      who: 'A Member since 2020, Mayfair',
    },
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
      'Carefully curated social companions for exclusive events, dinners, celebrations and occasions when a client’s existing friends are insufficiently interesting, attractive or alive.',
    includes: [
      'Companions vetted for wit, beauty and the ability to cry on cue at the reading of a will',
      'Briefed in advance on your achievements, in descending order of cost',
      'Available for galas, weddings and birthdays you correctly suspect no one would attend',
      'A strict non-outshining clause. Violators are reassigned to children’s birthday parties in Leeds.',
    ],
    note: 'Your friends should be as carefully selected as your investments, and as easy to liquidate.',
    testimonial: {
      quote: 'At my sixtieth, forty people told me I hadn’t aged a day. Thirty-eight of them were invoiced. The other two were my lawyers.',
      who: 'A Member, Palm Beach',
    },
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
      'Highly personalised support for clients whose time is too valuable to spend on ordinary responsibilities, which, in our experience, is all of them. Including, on occasion, the children.',
    includes: [
      'Reservations at establishments that do not take reservations, or no longer exist',
      'Management of property, travel, staff, and the staff who manage the staff’s grief',
      'Reminders for the birthdays of people you would like to appear to remember',
      'Any request, at any hour, handled without your ever learning that effort is a thing people do',
    ],
    note: 'We have never said “fully booked” to a client. We have said it to several restaurants, shortly before buying them.',
    testimonial: {
      quote: 'I said I wanted to see the Northern Lights without travelling. By Tuesday they were in my garden. I am told Norway is furious.',
      who: 'A Member since 2016, Geneva',
    },
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
      'Private email, one address, with a number in it',
      'A shared assistant, who will remember your name most of the time',
      'Two Friends for Hire per quarter, weekday lunches, no eye contact',
      'Management of one domain, ending in something like .biz',
      'Members’ lounge access, through the kitchen, after service',
    ],
    cta: 'Apply, if you must',
    smallPrint: 'If pricing is a concern, this membership may not be right for you.',
  },
  {
    id: 'basic',
    name: 'Basic ±',
    price: 25000,
    positioning: 'For the conventionally extraordinary.',
    description:
      'For individuals of considerable beauty, wealth and self-awareness. A respectable beginning, though we trust your ambitions extend further, and your inheritance arrives soon.',
    includes: [
      'Private email with unlimited aliases, for affairs both business and otherwise',
      'A dedicated database instance',
      'A personal assistant, five days a week, with no discernible weekend',
      'Friends for Hire for up to six occasions a month',
      'A quarterly beauty review, with consequences',
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
      'Everything, without exception, hesitation or conscience',
      'Dedicated infrastructure across three jurisdictions, one of which we invented for you',
      'A team of assistants, one assigned exclusively to admiration and one to agreeing with you',
      'Unlimited Friends for Hire, including a standing entourage and two mourners on retainer',
      'Continuous beauty optimisation with an on-call lighting director',
      'Reputation management across the internet, most of Europe and one Wikipedia editor',
      'A private line to our founder, who will answer, eventually, and sigh',
    ],
    cta: 'Request an invitation',
    smallPrint: 'Membership is subject to aesthetic, financial, and entirely arbitrary approval.',
    featured: true,
  },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
