'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
export function ContactInquiry() {
  const params = useSearchParams();
  return (
    <ContactForm
      key={params.toString()}
      ready={false}
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
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) {
      setStatus('Correspondence is not available yet. Your message has not been sent or stored.');
      return;
    }
    setErrors({});
    setStatus('');
    setBusy(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          subject: data.get('subject'),
          message: data.get('message'),
          website: data.get('website'),
          consent: data.get('consent') === 'on',
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors ?? {});
        setStatus(result.message ?? 'Your message could not be delivered. Please try again later.');
      } else {
        setStatus('Thank you. Your message has been sent to the author.');
        form.reset();
      }
    } catch {
      setStatus('The connection was interrupted. Your message was not sent. Please try again.');
    } finally {
      setBusy(false);
    }
  }
  const error = (field: string) =>
    errors[field] ? (
      <p id={`${field}-error`} className="field-error">
        {errors[field][0]}
      </p>
    ) : null;
  return (
    <form className="contact-form" onSubmit={submit}>
      {!ready && (
        <div className="notice" role="status">
          Correspondence opens soon. The author’s contact service is being set up; messages cannot
          be sent yet.
        </div>
      )}
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
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input name="website" id="website" tabIndex={-1} autoComplete="off" />
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
            I understand that my information will be used to respond to this inquiry, as described
            in the <Link href="/privacy">privacy notice</Link>.
          </span>
        </label>
        {error('consent')}
      </div>
      <button className="button" type="submit" disabled={!ready || busy}>
        {busy ? 'Sending…' : ready ? 'Send your message' : 'Contact opening soon'}
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
      <div role="status" aria-live="polite" className={status ? 'form-status' : ''}>
        {status}
      </div>
    </form>
  );
}
