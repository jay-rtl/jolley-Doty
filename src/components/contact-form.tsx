'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { contactEmail } from '@/lib/content';
import { validateContact } from '@/lib/contact.mjs';
import { manualEmailDraft, recipientAddress } from '@/lib/manual-email.mjs';
export function ContactInquiry() {
  const params = useSearchParams();
  return (
    <ContactForm
      key={params.toString()}
      ready={Boolean(recipientAddress(contactEmail))}
      initialSubject={params.get('subject') ?? 'general'}
      initialBook={(params.get('book') ?? '').slice(0, 150)}
    />
  );
}
type Errors = Record<string, string[]>;
export function ContactForm({
  ready,
  initialSubject,
  initialBook,
}: {
  ready: boolean;
  initialSubject: string;
  initialBook: string;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState('');
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<NonNullable<ReturnType<typeof manualEmailDraft>> | null>(null);
  const draftRegion = useRef<HTMLElement>(null);
  const draftText = useRef<HTMLTextAreaElement>(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (draft) draftRegion.current?.focus();
  }, [draft]);
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) {
      setStatus(
        'The author’s contact email is being confirmed. Your message has not been sent or stored.',
      );
      return;
    }
    setErrors({});
    setStatus('');
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = {
      name: data.get('name'),
      email: data.get('email'),
      subject: data.get('subject'),
      message: data.get('message'),
      website: '',
      consent: data.get('consent') === 'on',
    };
    const result = validateContact(input);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setStatus('Please correct the highlighted fields.');
      const firstField = Object.keys(result.error.flatten().fieldErrors)[0];
      if (firstField) form.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }
    const prepared = manualEmailDraft(result.data, contactEmail);
    if (!prepared) {
      setStatus('The author’s contact email is unavailable. Your message has not been sent.');
      return;
    }
    setDraft(prepared);
  }
  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.copyText);
      setStatus(
        'Email details copied. Paste them into your email app, review them and click Send.',
      );
    } catch {
      draftText.current?.focus();
      draftText.current?.select();
      setStatus(
        'Automatic copying is unavailable. The email details are selected; copy them manually.',
      );
    }
  }
  const error = (field: string) =>
    errors[field] ? (
      <p id={`${field}-error`} className="field-error">
        {errors[field][0]}
      </p>
    ) : null;
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      method="post"
      action="#email-draft"
      onChange={() => {
        if (draft) {
          setDraft(null);
          setStatus('');
        }
      }}
    >
      {!ready && (
        <div className="notice" role="status">
          The author’s contact email is being confirmed. Email preparation will be available once it
          is set.
        </div>
      )}
      <p className="manual-email-intro">
        Fill out this form to prepare an email. You’ll review the draft, then send it yourself from
        your email app. This website does not send messages automatically.
      </p>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">
            Your name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {error('name')}
        </div>
        <div className="field">
          <label htmlFor="email">
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {error('email')}
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">
          What brings you here? <span aria-hidden="true">*</span>
        </label>
        <select
          name="subject"
          id="subject"
          defaultValue={
            ['general', 'signed-copy', 'speaking', 'media', 'reader-review'].includes(
              initialSubject,
            )
              ? initialSubject
              : 'general'
          }
        >
          <option value="general">General correspondence</option>
          <option value="signed-copy">Signed copy inquiry</option>
          <option value="speaking">Speaking &amp; event invitation</option>
          <option value="media">Media &amp; press inquiry</option>
          <option value="reader-review">Reader review submission</option>
        </select>
        {error('subject')}
      </div>
      <div className="field">
        <label htmlFor="message">
          Your message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={20}
          maxLength={5000}
          defaultValue={
            initialSubject === 'signed-copy' && initialBook
              ? `I would like to inquire about a signed copy of ${initialBook}.\n\n`
              : ''
          }
          placeholder="A few words to start a conversation…"
          aria-invalid={!!errors.message}
          aria-describedby={`message-help${errors.message ? ' message-error' : ''}`}
        />
        <p id="message-help" className="form-note">
          20–5,000 characters. Please do not include payment details or sensitive personal
          information.
        </p>
        {error('message')}
      </div>
      <div>
        <label className="consent-label">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span>
            I understand that the draft will include my details and that I must send it from my
            email app. Read the <Link href="/privacy">privacy notice</Link>.
          </span>
        </label>
        {error('consent')}
      </div>
      <button className="button" type="submit" disabled={!ready || !mounted}>
        {ready ? 'Prepare email' : 'Contact opening soon'}
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
      <noscript>
        <p>Please enable JavaScript to prepare an email draft.</p>
      </noscript>
      {draft && (
        <section
          id="email-draft"
          className="email-draft"
          ref={draftRegion}
          tabIndex={-1}
          aria-labelledby="email-draft-title"
        >
          <span className="eyebrow">REVIEW &amp; SEND</span>
          <h3 id="email-draft-title">Your email draft is ready.</h3>
          <p>
            Nothing has been sent. Open your email app, review the message and click{' '}
            <strong>Send</strong> there.
          </p>
          <label htmlFor="email-draft-details">Email details</label>
          <textarea
            id="email-draft-details"
            ref={draftText}
            readOnly
            value={draft.copyText}
            rows={10}
            spellCheck={false}
          />
          <div className="email-draft-actions">
            <a
              className="button"
              href={draft.href}
              onClick={() =>
                setStatus(
                  'Continue in your email app and click Send. If no app opens, copy the email details below.',
                )
              }
            >
              Open email app <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <button className="button button-outline" type="button" onClick={copyDraft}>
              Copy email details
            </button>
          </div>
          <p className="form-note">
            If your device has no email app configured, or the draft opens incomplete, copy the
            email details and paste them into your preferred email service.
          </p>
        </section>
      )}
      <div role="status" aria-live="polite" className={status ? 'form-status' : ''}>
        {status}
      </div>
    </form>
  );
}
