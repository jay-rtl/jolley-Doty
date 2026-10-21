import Link from 'next/link';
import { PageHeading, EmptyState } from '@/components/ui';
import { articles } from '@/lib/content';
import { pageMetadata } from '@/lib/site';
export const metadata = pageMetadata(
  'News & Reflections',
  'Author announcements, book news and reflections from the desk of Jalleh Doty.',
  '/news',
);
export default function News() {
  return (
    <>
      <PageHeading label="FROM THE AUTHOR’S DESK" title="Notes & reflections.">
        <p>New chapters, occasional announcements, and thoughts along the way.</p>
      </PageHeading>
      <section className="wrap section">
        {articles.length ? (
          <div className="news-list">
            {articles.map((article) => (
              <article className="news-card" key={article.slug}>
                <time dateTime={article.date}>{article.date}</time>
                <h2>
                  <Link prefetch={false} href={`/news/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>
                <p>{article.excerpt}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState label="THE JOURNAL" title="The next page is yet to come.">
            No announcements have been published yet. Future book news and notes from Jalleh will be
            shared here.
          </EmptyState>
        )}
      </section>
    </>
  );
}
