"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { CyberButton }  from '@/components/ui/CyberButton';
import { ScrollReveal, fadeSlideUp, fadeSlideLeft } from '@/components/ui/ScrollReveal';
import { PERSONAL } from '@/data/portfolio';

type Status = 'idle' | 'transmitting' | 'sent' | 'error';

// BOLT: Hoist the email validation regex to the module level to avoid
// redundant Regular Expression compilation on every render cycle.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// This form uses EmailJS to send emails directly from the browser.
export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const successButtonRef = useRef<HTMLButtonElement>(null);

  const [form, setForm] = useState({
    from_name:  '',
    from_email: '',
    subject:    '',
    message:    '',
    hp_field:   '', // Honeypot field
  });

  const [errors, setErrors]   = useState<Partial<typeof form>>({});
  const [status, setStatus]   = useState<Status>('idle');
  const [emailCopied, setEmailCopied] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<typeof form> = {};

    // Security: Enforce length limits in addition to UI constraints (Defense in Depth)
    if (!form.from_name.trim()) {
      errs.from_name = 'Name is required';
    } else if (form.from_name.length > 100) {
      errs.from_name = 'Name must be under 100 characters';
    }

    if (!form.from_email.trim()) {
      errs.from_email = 'Email is required';
    } else if (form.from_email.length > 100) {
      errs.from_email = 'Email must be under 100 characters';
    } else if (!EMAIL_REGEX.test(form.from_email)) {
      errs.from_email = 'Invalid email format';
    }

    if (form.subject && form.subject.length > 200) {
      errs.subject = 'Subject must be under 200 characters';
    }

    if (!form.message.trim()) {
      errs.message = 'Message is required';
    } else if (form.message.length > 2000) {
      errs.message = 'Message must be under 2000 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof form]) {
      setErrors(prev => { const n = { ...prev }; delete n[name as keyof typeof form]; return n; });
    }
  };

  const isEmailJSConfigured =
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID &&
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (process.env.NODE_ENV !== 'production' && !isEmailJSConfigured) {
    console.warn("EmailJS environment variables are missing. Form submissions will not work.");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEmailJSConfigured) {
      window.location.href = `mailto:${PERSONAL.email}`;
      return;
    }
    if (!validate()) return;

    // Security: Honeypot check
    if (form.hp_field) {
      console.warn("Honeypot triggered. Bot suspected.");
      setStatus('sent'); // Silently fail by pretending to send
      return;
    }

    // Security: Basic submission cooldown (60 seconds) to prevent spamming.
    // Wrap in try-catch for private browsing modes that restrict storage access.
    const LAST_SUBMISSION_KEY = 'last_submission_time';
    const COOLDOWN_MS = 60 * 1000;
    let lastSubmission: string | null = null;
    try {
      lastSubmission = localStorage.getItem(LAST_SUBMISSION_KEY);
    } catch (e) {
      console.warn('Storage access failed during rate-limit check.', e);
    }
    const now = Date.now();
    const lastSubmissionTime = lastSubmission ? parseInt(lastSubmission, 10) : 0;

    // Security: Check for valid number and enforce cooldown to prevent spamming
    if (lastSubmission && !isNaN(lastSubmissionTime) && now - lastSubmissionTime < COOLDOWN_MS) {
      const remaining = Math.ceil((COOLDOWN_MS - (now - lastSubmissionTime)) / 1000);
      setErrors({ message: `Submission rate limited. Please wait ${remaining}s.` });
      setStatus('error');
      return;
    }

    setStatus('transmitting');

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        console.error("EmailJS environment variables are missing.");
        setStatus('error');
        return;
      }

      if (!formRef.current) return;

      // BOLT: Lazy-load @emailjs/browser to reduce initial bundle size (~15KB gzipped deferred)
      const emailjs = (await import('@emailjs/browser')).default;

      // Security: Explicitly send only validated fields to avoid transmitting the entire form (including honeypot)
      const templateParams = {
        from_name: form.from_name,
        from_email: form.from_email,
        subject: form.subject,
        message: form.message,
      };

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        {
          publicKey: publicKey,
        }
      );

      setStatus('sent');
      try {
        localStorage.setItem(LAST_SUBMISSION_KEY, Date.now().toString());
      } catch (e) {
        console.warn('Failed to set rate-limit timestamp in storage.', e);
      }
      setForm({ from_name: '', from_email: '', subject: '', message: '', hp_field: '' });
      // SUCCESS_STATE_AUTOFOCUS: Move focus to the success message button for screen readers
      setTimeout(() => successButtonRef.current?.focus(), 100);
      setTimeout(() => setStatus('idle'), 10000); // Extended idle reset for better readability
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus('error');
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      tabIndex={-1}
      aria-labelledby="section-title-contact"
      className="py-24 bg-deep relative border-t border-border outline-none"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle number="09" title="Let's Talk." id="contact" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* ── Left: contact info ── */}
          <ScrollReveal variants={fadeSlideUp} className="space-y-8 flex flex-col justify-between h-full">

            <div>
              <p className="font-mono text-sm text-text-secondary leading-relaxed max-w-md">
                My inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>

              {/* Availability indicator */}
              <div className="flex items-center space-x-3 mt-8 p-4 rounded-card bg-green/5 border border-green/20 inline-flex w-full max-w-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green" />
                </span>
                <span className="font-mono text-[0.7rem] text-green font-bold uppercase tracking-widest">
                  CURRENTLY AVAILABLE FOR HIRE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group relative flex flex-col items-center justify-center p-6 rounded-card glass hover:border-cyan hover:shadow-[var(--glow-cyan-sm)] hover:-translate-y-1 transition-all">
                <a
                  href={`mailto:${PERSONAL.email}`}
                  className="flex flex-col items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-card w-full h-full"
                  aria-label={`Send email to ${PERSONAL.email}`}
                  title={`Send email to ${PERSONAL.email}`}
                >
                  <div className="w-12 h-12 rounded-pill bg-cyan/10 flex items-center justify-center text-cyan mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-text-muted group-hover:text-cyan">Email</span>
                </a>

                {/* Micro-UX: Quick copy button for accessibility/convenience */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(PERSONAL.email);
                      setEmailCopied(true);
                      setTimeout(() => setEmailCopied(false), 2000);
                    }}
                    className="p-1.5 rounded-card bg-cyan/5 border border-cyan/10 text-cyan opacity-20 group-hover:opacity-100 focus-visible:opacity-100 transition-all hover:bg-cyan hover:text-black outline-none focus-visible:ring-2 focus-visible:ring-cyan"
                    aria-label="Copy email address to clipboard"
                    title="Copy email address"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {emailCopied && (
                      <motion.span
                        initial={{ opacity: 0, y: 5, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 5, x: '-50%' }}
                        className="absolute bottom-full left-1/2 mb-2 px-2 py-1 bg-cyan text-black font-mono text-[0.6rem] rounded-card font-bold shadow-[var(--glow-cyan-sm)] z-20 pointer-events-none whitespace-nowrap"
                        role="status"
                        aria-live="polite"
                      >
                        COPIED!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <a
                href={PERSONAL.linkedin}
                target="_blank" rel="noopener noreferrer"

                className="group flex flex-col items-center justify-center p-6 rounded-card glass hover:border-violet hover:shadow-[var(--glow-violet-sm)] hover:-translate-y-1 transition-all outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                 <div className="w-12 h-12 rounded-pill bg-violet/10 flex items-center justify-center text-violet mb-4 group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                     <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                   </svg>
                 </div>
                 <span className="font-mono text-xs uppercase tracking-widest text-text-muted group-hover:text-violet">LinkedIn</span>
              </a>

              <a
                href={PERSONAL.github}
                target="_blank" rel="noopener noreferrer"

                className="group flex flex-col items-center justify-center p-6 rounded-card glass hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all col-span-2 sm:col-span-1 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                 <div className="w-12 h-12 rounded-pill bg-white/5 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                     <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                   </svg>
                 </div>
                 <span className="font-mono text-xs uppercase tracking-widest text-text-muted group-hover:text-white">GitHub</span>
              </a>

              <div className="group flex flex-col items-center justify-center p-6 rounded-card glass col-span-2 sm:col-span-1">
                 <div className="w-12 h-12 rounded-pill bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] flex items-center justify-center text-text-muted mb-4">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                   </svg>
                 </div>
                 <span className="font-mono text-[0.65rem] uppercase tracking-widest text-text-muted text-center">{PERSONAL.location}</span>
              </div>
            </div>

          </ScrollReveal>

          {/* ── Right: form ── */}
          <ScrollReveal variants={fadeSlideLeft} className="p-8 glass-heavy rounded-card relative overflow-hidden" data-orb-target="contact-form">
            <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={status === 'transmitting'} className="space-y-6 relative z-10">

              {/* Honeypot field - hidden from human users */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <input
                  type="text"
                  name="hp_field"
                  value={form.hp_field}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Success Terminal Output */}
              {status === 'sent' ? (
                <div className="rounded-card overflow-hidden border border-green/50 bg-[#0a0a0a] font-mono text-sm" role="alert" aria-live="assertive">
                  <div className="flex items-center px-4 py-2 bg-green/10 border-b border-green/20 text-green">
                    <span className="w-2 h-2 rounded-full bg-green animate-pulse mr-2" />
                    <span>SECURE_CHANNEL_ESTABLISHED</span>
                  </div>
                  <div className="p-6 space-y-3">
                     <div className="text-cyan"><span className="text-text-muted mr-2">$</span>./transmit_message.sh</div>
                     <div className="text-text-secondary">Authenticating... [OK]</div>
                     <div className="text-text-secondary">Encrypting payload... [OK]</div>
                     <div className="text-text-secondary">Routing through proxy... [OK]</div>
                     <div className="text-green font-bold mt-2">✓ MESSAGE_TRANSMITTED</div>
                     <div className="text-amber mt-2 animate-pulse">AWAITING_RESPONSE...</div>
                     <div className="pt-4">
                       <button
                         ref={successButtonRef}
                         type="button"
                         onClick={() => setStatus('idle')}
                         className="text-[0.6rem] text-cyan hover:text-white underline tracking-widest uppercase outline-none focus-visible:ring-1 focus-visible:ring-cyan"
                       >
                         [ SEND_ANOTHER_MESSAGE ]
                       </button>
                     </div>
                  </div>
                </div>
              ) : (
                <>
                  <FloatingInput id="from_name"  name="from_name"  type="text"  label="Name"             value={form.from_name}  onChange={handleChange} error={errors.from_name}  required maxLength={100} />
                  <FloatingInput id="from_email" name="from_email" type="email" label="Email"            value={form.from_email} onChange={handleChange} error={errors.from_email} required maxLength={100} />
                  <FloatingInput id="subject"    name="subject"    type="text"  label="Subject (optional)" value={form.subject}   onChange={handleChange} maxLength={200} />
                  <FloatingTextarea id="message" name="message" label="Message" value={form.message} onChange={handleChange} error={errors.message} required maxLength={2000} />

                  <CyberButton
                    type={isEmailJSConfigured ? "submit" : "button"}
                    disabled={status === 'transmitting'}
                    color={status === 'error' ? 'amber' : 'cyan'}
                    className={clsx(
                      'w-full mt-4',
                      status === 'error' && 'border-red text-red hover:bg-red'
                    )}
                    onClick={(e) => {
                       if (!isEmailJSConfigured) {
                          e.preventDefault();
                          window.location.href = `mailto:${PERSONAL.email}`;
                       }
                    }}
                  >
                    {!isEmailJSConfigured && '[CONFIGURING — USE EMAIL DIRECT]'}
                    {isEmailJSConfigured && status === 'idle' && 'TRANSMIT_MESSAGE'}
                    {isEmailJSConfigured && status === 'transmitting' && (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        PREPARING_TRANSMISSION...
                      </span>
                    )}
                    {isEmailJSConfigured && status === 'error' && 'RETRY_TRANSMISSION'}
                  </CyberButton>
                </>
              )}
            </form>
            <div className="mt-4 text-center font-mono text-[0.6rem] text-text-muted">Avg. response time: ~24h</div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}

// ── Reusable floating-label input ─────────────────────────────

interface FloatingInputProps {
  id: string; name: string; type: string; label: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; required?: boolean;
  maxLength?: number;
}

function FloatingInput({ id, name, type, label, value, onChange, error, required, maxLength }: FloatingInputProps) {
  const charCount = value.length;

  return (
    <div className="relative">
      <input
        id={id} name={name} type={type} value={value} onChange={onChange}
        required={required} maxLength={maxLength}
        aria-required={required} aria-invalid={!!error}
        aria-describedby={clsx(
          error && `${id}-error`,
          maxLength && `${id}-counter`
        )}
        placeholder=" "
        className={clsx(
          'w-full bg-[#020408] border rounded-card px-4 py-4 pt-6 text-text-primary outline-none transition-all peer',
          error
            ? 'border-red shadow-[var(--glow-red-sm)]'
            : 'border-border focus:border-cyan focus:shadow-[var(--glow-cyan-sm)]'
        )}
      />
      <label
        htmlFor={id}
        className={clsx(
          'absolute left-4 top-4 text-text-muted transition-all duration-200 pointer-events-none font-mono text-xs uppercase tracking-widest',
          'peer-focus:top-2 peer-focus:text-[0.6rem] peer-focus:text-cyan',
          value && 'top-2 text-[0.6rem] text-text-secondary'
        )}
      >
        {label}
        {required && <span className="text-red ml-1">*</span>}
      </label>
      <div className="flex justify-between items-start mt-1 px-1">
        <div>
          {error && (
            <span id={`${id}-error`} aria-live="polite" className="font-mono text-[0.65rem] text-red">
              {error}
            </span>
          )}
        </div>
        {maxLength && (
          <span
            id={`${id}-counter`}
            aria-live="polite"
            className={clsx(
              "font-mono text-[0.65rem] transition-colors",
              charCount >= maxLength ? "text-red" : charCount >= maxLength * 0.9 ? "text-amber" : "text-text-muted"
            )}
          >
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

interface FloatingTextareaProps {
  id: string; name: string; label: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string; required?: boolean;
  maxLength?: number;
}

function FloatingTextarea({ id, name, label, value, onChange, error, required, maxLength }: FloatingTextareaProps) {
  const charCount = value.length;

  return (
    <div className="relative">
      <textarea
        id={id} name={name} value={value} onChange={onChange}
        required={required} maxLength={maxLength}
        aria-required={required} aria-invalid={!!error}
        aria-describedby={clsx(
          error && `${id}-error`,
          maxLength && `${id}-counter`
        )}
        placeholder=" "
        className={clsx(
          'w-full bg-[#020408] border rounded-card px-4 py-4 pt-6 text-text-primary outline-none transition-all peer min-h-[140px] resize-y',
          error
            ? 'border-red shadow-[var(--glow-red-sm)]'
            : 'border-border focus:border-cyan focus:shadow-[var(--glow-cyan-sm)]'
        )}
      />
      <label
        htmlFor={id}
        className={clsx(
          'absolute left-4 top-4 text-text-muted transition-all duration-200 pointer-events-none font-mono text-xs uppercase tracking-widest',
          'peer-focus:top-2 peer-focus:text-[0.6rem] peer-focus:text-cyan',
          value && 'top-2 text-[0.6rem] text-text-secondary'
        )}
      >
        {label}
        {required && <span className="text-red ml-1">*</span>}
      </label>
      <div className="flex justify-between items-start mt-1 px-1">
        <div>
          {error && (
            <span id={`${id}-error`} aria-live="polite" className="font-mono text-[0.65rem] text-red">
              {error}
            </span>
          )}
        </div>
        {maxLength && (
          <span
            id={`${id}-counter`}
            aria-live="polite"
            className={clsx(
              "font-mono text-[0.65rem] transition-colors",
              charCount >= maxLength ? "text-red" : charCount >= maxLength * 0.9 ? "text-amber" : "text-text-muted"
            )}
          >
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
