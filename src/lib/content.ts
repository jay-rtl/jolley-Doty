export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  volume?: number;
  cover?: string;
  coverWidth?: number;
  coverHeight?: number;
  authors: string[];
  description: string;
  genre?: string;
  formats: string[];
  retailerUrl?: string;
  ingramUrl?: string;
  sampleUrl?: string;
  reviews: { quote: string; attribution: string }[];
  directSale?: {
    price: number;
    currency: string;
    stripePriceId?: string;
    paypalProductId?: string;
    shippingRateId?: string;
  };
};
export const books: Book[] = [
  {
    slug: 'the-child-of-humanity-last-savior',
    title: 'The Child of Humanity',
    subtitle: 'Last Savior',
    volume: 1,
    cover: '/images/book-one.webp',
    coverWidth: 600,
    coverHeight: 906,
    authors: ['Jalleh Doty', 'Pari Adli'],
    description:
      'Last Savior is the first book in The Child of Humanity series by Jalleh Doty and Pari Adli. Begin the series here, followed by The Journey and Final Awakening. A full synopsis will be added when approved by the authors.',
    formats: ['Paperback'],
    reviews: [],
  },
  {
    slug: 'the-child-of-humanity-the-journey',
    title: 'The Child of Humanity',
    subtitle: 'The Journey',
    volume: 2,
    cover: '/images/book-two.webp',
    coverWidth: 920,
    coverHeight: 1394,
    authors: ['Jalleh Doty', 'Pari Adli'],
    description:
      'The second volume in The Child of Humanity series, by Jalleh Doty and Pari Adli. Full synopsis and edition details will be added when confirmed by the authors.',
    formats: ['Paperback'],
    reviews: [],
  },
  {
    slug: 'the-child-of-humanity-final-awakening',
    title: 'The Child of Humanity',
    subtitle: 'Final Awakening',
    volume: 3,
    cover: '/images/book-three.webp',
    coverWidth: 920,
    coverHeight: 1481,
    authors: ['Jalleh Doty', 'Pari Adli'],
    genre: 'Speculative fiction',
    description:
      'The story continues from a different perspective. Friends are made, unlikely allies emerge, and others remain in the shadows. In a dystopian landscape, a humanitarian explores the powers of the mind—and the possibility of saving humanity from itself.',
    formats: ['Paperback'],
    reviews: [],
  },
  {
    slug: 'poetry-and-satire-for-the-avant-garde',
    title: 'Poetry and Satire for the Avant-Garde',
    subtitle: 'A standalone collection',
    authors: ['Jalleh Doty'],
    description:
      'An earlier publication by Jalleh Doty. The official cover, full description, edition details and purchase options are awaiting confirmation.',
    formats: ['Paperback'],
    reviews: [],
  },
];
export const series = books.filter((book) => book.volume);
export const standalone = books.find((book) => !book.volume)!;
export type Article = { slug: string; title: string; date: string; excerpt: string; body: string };
export const articles: Article[] = [];
export type AuthorEvent = {
  title: string;
  start: string;
  end?: string;
  location: string;
  url?: string;
};
export const events: AuthorEvent[] = [];
export const media: { title: string; src: string; poster: string; captions: string }[] = [];
export const socialLinks: { label: string; url: string }[] = [];
// Public recipient, supplied/approved by the author. Blank keeps preparation unavailable.
export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';
export const bio =
  'An ambitious author writing for the people, Jalleh Doty has spent approximately twenty years developing her writing. Her work includes The Child of Humanity series, written with Pari Adli, and the earlier publication Poetry and Satire for the Avant-Garde.';
export const tagline = 'Retain an open mind in the realm of possibilities.';
