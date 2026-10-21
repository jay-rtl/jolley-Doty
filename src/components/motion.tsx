'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createPortal } from 'react-dom';

export function Motion() {
  const path = usePathname();
  const [intro, setIntro] = useState(false);
  const [introHost, setIntroHost] = useState<HTMLElement | null>(null);
  const skip = useRef<() => void>(() => {});

  useEffect(() => {
    setIntroHost(document.querySelector<HTMLElement>('[data-intro-controls]'));
    let cancelled = false;
    let dispose = () => {};
    skip.current = () => setIntro(false);

    // Content is visible in CSS. GSAP takes control only after loading successfully.
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add(
          {
            desktop: '(min-width: 900px) and (hover: hover) and (pointer: fine)',
            reduced: '(prefers-reduced-motion: reduce)',
            regular: '(prefers-reduced-motion: no-preference)',
          },
          (context) => {
            const { desktop, reduced } = context.conditions!;
            const cleanups: (() => void)[] = [];
            document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
            if (reduced) {
              setIntro(false);
              document.documentElement.dataset.intro = 'complete';
              return;
            }

            const titleWords = document.querySelectorAll('.title-word');
            // Never hide already-read content with a late entrance on a slow connection.
            if (titleWords.length && performance.now() < 2500 && window.scrollY < innerHeight / 2) {
              setIntro(true);
              document.documentElement.dataset.intro = 'running';
              const entrance = gsap.timeline({
                defaults: { ease: 'power3.out' },
                onComplete: () => {
                  setIntro(false);
                  document.documentElement.dataset.intro = 'complete';
                },
              });
              entrance
                .fromTo(
                  '.hero-edition',
                  { y: 16, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.65 },
                  0,
                )
                .fromTo(
                  '.hero-cover-link',
                  { y: 85, rotateY: -24, rotateZ: -7, opacity: 0 },
                  { y: 0, rotateY: 0, rotateZ: 0, opacity: 1, duration: 1.45 },
                  0.2,
                )
                .fromTo(
                  '.hero-companion-two',
                  { x: -38, y: 55, opacity: 0 },
                  { x: 0, y: 0, opacity: 1, duration: 1.2 },
                  0.5,
                )
                .fromTo(
                  '.hero-companion-three',
                  { x: -55, y: 35, opacity: 0 },
                  { x: 0, y: 0, opacity: 1, duration: 1.2 },
                  0.66,
                )
                .fromTo(
                  '.hero-feature-topline, .hero-feature-caption, .hero-colophon',
                  { y: 12, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
                  0.95,
                );
              if (desktop) {
                entrance.fromTo(
                  titleWords,
                  { yPercent: 112, rotation: 4 },
                  { yPercent: 0, rotation: 0, duration: 1.3, stagger: 0.16 },
                  0.12,
                );
                entrance.fromTo(
                  '.hero-tagline, .hero-description, .hero-actions',
                  { y: 20 },
                  { y: 0, duration: 0.85, stagger: 0.12 },
                  0.55,
                );
              }
              skip.current = () => entrance.progress(1);
              cleanups.push(() => {
                entrance.kill();
                setIntro(false);
              });
            } else {
              document.documentElement.dataset.intro = 'complete';
              const heading = document.querySelector('.page-heading');
              if (heading)
                gsap.fromTo(
                  heading.children,
                  { y: 26 },
                  {
                    y: 0,
                    duration: 0.85,
                    stagger: 0.1,
                    clearProps: 'transform,opacity',
                  },
                );
            }

            gsap.fromTo(
              '.reading-progress',
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: document.documentElement,
                  start: 'top top',
                  end: 'bottom bottom',
                  scrub: 0.2,
                },
              },
            );
            gsap.utils
              .toArray<HTMLElement>(
                '.section-heading, .author-copy, .standalone-copy, .contact-invitation > div, .journal-rows article',
              )
              .forEach((element) => {
                gsap.fromTo(
                  element,
                  { y: desktop ? 45 : 26 },
                  {
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: element, start: 'top 91%', once: true },
                  },
                );
              });
            gsap.utils.toArray<HTMLElement>('.series-grid').forEach((grid) => {
              if (desktop) {
                gsap.fromTo(
                  grid.querySelectorAll('.series-book'),
                  { y: 85 },
                  {
                    y: 0,
                    duration: 1.15,
                    stagger: 0.16,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: grid, start: 'top 90%', once: true },
                  },
                );
              } else {
                grid.querySelectorAll('.series-book').forEach((book) =>
                  gsap.fromTo(
                    book,
                    { y: 38 },
                    {
                      y: 0,
                      duration: 0.85,
                      scrollTrigger: { trigger: book, start: 'top 93%', once: true },
                    },
                  ),
                );
              }
            });
            gsap.utils.toArray<HTMLElement>('.series-rule').forEach((line) =>
              gsap.fromTo(
                line,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  duration: 1.25,
                  ease: 'power2.inOut',
                  scrollTrigger: { trigger: line, start: 'top 94%', once: true },
                },
              ),
            );
            gsap.utils.toArray<HTMLElement>('.author-image').forEach((portrait) => {
              gsap.fromTo(
                portrait,
                { clipPath: 'inset(9% 0 0 0)', y: 35 },
                {
                  clipPath: 'inset(0% 0 0 0)',
                  y: 0,
                  duration: 1.2,
                  ease: 'power3.out',
                  scrollTrigger: { trigger: portrait, start: 'top 91%', once: true },
                },
              );
              if (desktop)
                gsap.fromTo(
                  portrait.querySelector('img'),
                  { yPercent: -5, scale: 1.1 },
                  {
                    yPercent: 5,
                    scale: 1.1,
                    ease: 'none',
                    scrollTrigger: {
                      trigger: portrait,
                      start: 'top bottom',
                      end: 'bottom top',
                      scrub: 0.7,
                    },
                  },
                );
            });

            const footer = document.querySelector('.footer-masthead');
            if (footer)
              gsap.fromTo(
                footer,
                { y: 30 },
                {
                  y: 0,
                  duration: 1.2,
                  ease: 'power3.out',
                  scrollTrigger: { trigger: footer, start: 'top 97%', once: true },
                },
              );

            gsap.utils.toArray<HTMLElement>('.exhibition-panel').forEach((panel) => {
              gsap.fromTo(
                panel.querySelector('.exhibition-copy'),
                { y: 22 },
                {
                  y: 0,
                  duration: 1,
                  ease: 'power3.out',
                  scrollTrigger: { trigger: panel, start: 'top 93%', once: true },
                },
              );
            });

            if (desktop) {
              gsap.utils.toArray<HTMLElement>('.hero-actions .button').forEach((button) => {
                const x = gsap.quickTo(button, 'x', { duration: 0.5, ease: 'power3.out' });
                const y = gsap.quickTo(button, 'y', { duration: 0.5, ease: 'power3.out' });
                const move = (event: PointerEvent) => {
                  const box = button.getBoundingClientRect();
                  x((event.clientX - box.left - box.width / 2) * 0.07);
                  y((event.clientY - box.top - box.height / 2) * 0.1);
                };
                const reset = () => {
                  x(0);
                  y(0);
                };
                button.addEventListener('pointermove', move);
                button.addEventListener('pointerleave', reset);
                button.addEventListener('blur', reset);
                cleanups.push(() => {
                  button.removeEventListener('pointermove', move);
                  button.removeEventListener('pointerleave', reset);
                  button.removeEventListener('blur', reset);
                });
              });
              // Animation targets are nested so entrance, scroll, and pointer transforms never compete.
              const heroStage = document.querySelector<HTMLElement>('.hero-stage');
              if (heroStage) {
                const x = gsap.quickTo(heroStage, 'x', { duration: 0.9, ease: 'power3.out' });
                const y = gsap.quickTo(heroStage, 'y', { duration: 0.9, ease: 'power3.out' });
                const move = (event: PointerEvent) => {
                  const box = heroStage.getBoundingClientRect();
                  x(((event.clientX - box.left) / box.width - 0.5) * 16);
                  y(((event.clientY - box.top) / box.height - 0.5) * 12);
                };
                const leave = () => {
                  x(0);
                  y(0);
                };
                heroStage.addEventListener('pointermove', move);
                heroStage.addEventListener('pointerleave', leave);
                cleanups.push(() => {
                  heroStage.removeEventListener('pointermove', move);
                  heroStage.removeEventListener('pointerleave', leave);
                });
              }
              gsap.utils.toArray<HTMLElement>('.cover-stage').forEach((stage) => {
                const book = stage.querySelector<HTMLElement>('.book-object');
                if (!book) return;
                gsap.set(book, { transformPerspective: 1000, transformOrigin: 'center center' });
                const rx = gsap.quickTo(book, 'rotationX', { duration: 0.55, ease: 'power3.out' });
                const ry = gsap.quickTo(book, 'rotationY', { duration: 0.55, ease: 'power3.out' });
                const y = gsap.quickTo(book, 'y', { duration: 0.55, ease: 'power3.out' });
                const move = (event: PointerEvent) => {
                  const box = stage.getBoundingClientRect();
                  rx(-((event.clientY - box.top) / box.height - 0.5) * 7);
                  ry(((event.clientX - box.left) / box.width - 0.5) * 12);
                  y(-10);
                };
                const leave = () => {
                  rx(0);
                  ry(0);
                  y(0);
                };
                stage.addEventListener('pointermove', move);
                stage.addEventListener('pointerleave', leave);
                cleanups.push(() => {
                  stage.removeEventListener('pointermove', move);
                  stage.removeEventListener('pointerleave', leave);
                });
              });
            }
            const refresh = () => ScrollTrigger.refresh();
            document.fonts.ready.then(() => {
              if (!cancelled) refresh();
            });
            document.querySelectorAll('img').forEach((image) => {
              image.addEventListener('load', refresh, { once: true });
              cleanups.push(() => image.removeEventListener('load', refresh));
            });
            return () => {
              cleanups.forEach((cleanup) => cleanup());
            };
          },
        );
        dispose = () => {
          media.revert();
          delete document.documentElement.dataset.motion;
          delete document.documentElement.dataset.intro;
        };
      })
      .catch(() => {
        setIntro(false);
      });
    return () => {
      cancelled = true;
      dispose();
    };
  }, [path]);

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      {intro &&
        introHost &&
        createPortal(
          <button type="button" className="intro-skip" onClick={() => skip.current()}>
            Skip introduction ↗
          </button>,
          introHost,
        )}
    </>
  );
}
