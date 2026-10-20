import { notFound } from 'next/navigation';
import { articles } from '@/lib/content';
import { PageHeading } from '@/components/ui';
import { pageMetadata } from '@/lib/site';
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return article ? pageMetadata(article.title, article.excerpt, `/news/${slug}`) : {};
}
export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <>
      <PageHeading label="FROM THE AUTHOR’S DESK" title={article.title}>
        <time dateTime={article.date}>{article.date}</time>
      </PageHeading>
      <article className="wrap">
        <div className="prose">
          {article.body.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </article>
    </>
  );
}
