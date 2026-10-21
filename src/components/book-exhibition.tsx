'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { series } from '@/lib/content';
import { ArrowLink, BookCover, Eyebrow, PurchaseOptions } from '@/components/ui';

const introductions = [
  'Begin The Child of Humanity here. The first volume introduces the series written by Jalleh Doty and Pari Adli.',
  'Continue with the second volume. The Journey follows Last Savior in The Child of Humanity reading order.',
  'Enter a dystopian landscape where unlikely allies emerge, a humanitarian explores the powers of the mind, and humanity faces the possibility of saving itself.',
];

export function BookExhibition() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    setEnhanced(true);
    const element = track.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setActive(
          Math.max(
            0,
            Math.min(series.length - 1, Math.round(element.scrollLeft / element.clientWidth)),
          ),
        );
      });
    };
    element.addEventListener('scroll', update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      element.removeEventListener('scroll', update);
    };
  }, []);

  function browse(index: number) {
    const element = track.current;
    if (!element) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollTo({
      left: index * element.clientWidth,
      behavior: reduced ? 'instant' : 'smooth',
    });
  }

  return (
    <div className="book-exhibition">
      <div className="exhibition-toolbar">
        <p className="exhibition-instruction">Three volumes. One reading order.</p>
        {enhanced && (
          <div className="exhibition-controls" role="group" aria-label="Browse the series">
            <button
              type="button"
              onClick={() => browse(active - 1)}
              disabled={active === 0}
              aria-label="Previous book"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            {series.map((book, index) => (
              <button
                key={book.slug}
                type="button"
                aria-pressed={active === index}
                aria-label={`Show 0${book.volume} ${book.subtitle}, Book ${book.volume}`}
                onClick={() => browse(index)}
              >
                0{book.volume} <span>{book.subtitle}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => browse(active + 1)}
              disabled={active === series.length - 1}
              aria-label="Next book"
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <div
        className="exhibition-track"
        ref={track}
        tabIndex={0}
        role="region"
        aria-label="The Child of Humanity books, in reading order"
        onKeyDown={(event) => {
          if (
            event.target !== event.currentTarget ||
            !window.matchMedia('(min-width: 901px)').matches
          )
            return;
          const destination = {
            ArrowLeft: Math.max(0, active - 1),
            ArrowRight: Math.min(series.length - 1, active + 1),
            Home: 0,
            End: series.length - 1,
          }[event.key];
          if (destination !== undefined) {
            event.preventDefault();
            browse(destination);
          }
        }}
      >
        {series.map((book, index) => (
          <article
            className={`exhibition-panel exhibition-panel-${index + 1}`}
            key={book.slug}
            aria-labelledby={`exhibit-${book.volume}`}
          >
            <Link
              prefetch={false}
              href={`/books/${book.slug}`}
              className={`exhibition-plate cover-stage cover-stage-${index + 1}`}
            >
              <span className="plate-label">THE CHILD OF HUMANITY</span>
              <span className="plate-volume" aria-hidden="true">
                0{book.volume}
              </span>
              <BookCover book={book} />
              <span className="plate-caption">JALLEH DOTY &amp; PARI ADLI</span>
            </Link>
            <div className="exhibition-copy">
              <Eyebrow>VOLUME 0{book.volume} / 03</Eyebrow>
              <h3 id={`exhibit-${book.volume}`}>{book.subtitle}</h3>
              <p>{introductions[index]}</p>
              <ArrowLink href={`/books/${book.slug}`}>Explore the book</ArrowLink>
              <PurchaseOptions book={book} compact />
            </div>
          </article>
        ))}
      </div>
      <p className="reading-note">
        <span>THE READING ORDER</span>Last Savior <span aria-hidden="true">→</span> The Journey{' '}
        <span aria-hidden="true">→</span> Final Awakening
      </p>
    </div>
  );
}
