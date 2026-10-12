import React, { useState } from 'react';
import { portfolioConfig } from '../../data/portfolioData';
import {
  Send,
  Mail,
  Shield,
  CheckCircle2,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import confetti from 'canvas-confetti';
import { playSystemSound } from '../../utils/sound';

export const ContactApp: React.FC = () => {
  const { contact, personal } = portfolioConfig;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    playSystemSound('click');

    setTimeout(() => {
      setStatus('sent');
      playSystemSound('notify');
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    }, 1000);
  };

  const handleReset = () => {
    setStatus('idle');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto text-txt-primary bg-surface select-text">
      {/* Top Comms Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-txt-muted" />
            <h1 className="text-base font-semibold tracking-tight text-txt-primary font-sans">
              COMMS DISPATCHER // DIRECT TRANSMISSION
            </h1>
          </div>
          <p className="text-xs font-mono text-txt-muted mt-0.5">
            Destination: {personal.fullName} &bull; Location: {personal.location}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-status-success" />
          <span className="text-txt-secondary">CHANNEL READY</span>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-5 flex-1">
        {/* Left Column: Transmission Form */}
        <div className="md:col-span-3">
          {status === 'sent' ? (
            <div className="h-full flex flex-col items-center justify-center p-6 rounded-xl bg-surface-secondary border border-border text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-status-success">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-txt-primary">TRANSMISSION CONFIRMED</h3>
                <p className="text-xs text-txt-secondary mt-1 max-w-sm">
                  Your message has been received. Sujith will review your note and respond promptly.
                </p>
              </div>
              <div className="p-2.5 rounded bg-surface border border-border text-[11px] font-mono text-txt-muted w-full max-w-xs text-left">
                <div>DISPATCH ID: TX_SUJITH_{Date.now().toString().slice(-6)}</div>
                <div>STATUS: 200 OK (CONFIRMED)</div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-txt-primary text-xs font-medium hover:bg-surface-hover transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-txt-muted mb-1 uppercase font-semibold">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name / organization"
                    className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-border-hover transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-txt-muted mb-1 uppercase font-semibold">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-border-hover transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-txt-muted mb-1 uppercase font-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Subject or project inquiry"
                  className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-border-hover transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-txt-muted mb-1 uppercase font-semibold">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message or project scope..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-secondary border border-border text-xs text-txt-primary placeholder:text-txt-muted focus:outline-none focus:border-border-hover transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-txt-primary text-bg font-semibold text-xs tracking-tight transition-opacity hover:opacity-90 disabled:opacity-50 shadow-sm"
              >
                {status === 'sending' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                    <span>DISPATCHING...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND MESSAGE</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Coordinates & Social Channels */}
        <div className="md:col-span-2 space-y-3">
          <div className="p-3.5 rounded-lg bg-surface-secondary border border-border space-y-2.5">
            <div className="text-[10px] font-mono uppercase text-txt-muted tracking-wider font-semibold">
              DIRECT CHANNELS
            </div>

            {/* Email Card */}
            <a
              href={`mailto:${contact.email}`}
              className="group flex items-start gap-2.5 p-2.5 rounded-lg bg-surface border border-border hover:border-border-hover transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-surface-secondary border border-border flex items-center justify-center text-txt-secondary flex-shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-txt-muted">EMAIL</div>
                <div className="text-xs font-medium text-txt-primary truncate">{contact.email}</div>
              </div>
            </a>

            {/* GitHub Card */}
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2.5 p-2.5 rounded-lg bg-surface border border-border hover:border-border-hover transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-surface-secondary border border-border flex items-center justify-center text-txt-secondary flex-shrink-0">
                <GithubIcon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono text-txt-muted">GITHUB</div>
                <div className="text-xs font-medium text-txt-primary truncate flex items-center gap-1">
                  <span>github.com/profile</span>
                  <ExternalLink className="w-3 h-3 text-txt-muted" />
                </div>
              </div>
            </a>

            {/* LinkedIn Card */}
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2.5 p-2.5 rounded-lg bg-surface border border-border hover:border-border-hover transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-surface-secondary border border-border flex items-center justify-center text-txt-secondary flex-shrink-0">
                <LinkedinIcon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono text-txt-muted">LINKEDIN</div>
                <div className="text-xs font-medium text-txt-primary truncate flex items-center gap-1">
                  <span>linkedin.com/in/sujith-sukumar</span>
                  <ExternalLink className="w-3 h-3 text-txt-muted" />
                </div>
              </div>
            </a>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary border border-border text-xs font-mono space-y-1.5 text-txt-secondary">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-txt-muted" />
              <span>Location: {personal.location}</span>
            </div>
            <div className="text-status-success">
              &bull; {personal.availability}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
