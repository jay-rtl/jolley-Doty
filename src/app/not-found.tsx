import { PageHeading, ButtonLink } from '@/components/ui';
export default function NotFound() {
  return (
    <>
      <PageHeading label="404 · A PAGE NOT FOUND" title="A little beyond the story.">
        <p>This page is unavailable. Find your way back to the books.</p>
      </PageHeading>
      <div className="wrap section">
        <ButtonLink href="/books">Explore the books</ButtonLink>
      </div>
    </>
  );
}
