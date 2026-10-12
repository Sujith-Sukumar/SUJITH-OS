import React, { useState } from 'react';
import { portfolioConfig } from '../../data/portfolioData';
import {
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  FileText,
  Printer,
} from 'lucide-react';
import { playSystemSound } from '../../utils/sound';

export const ResumeApp: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const { personal, contact } = portfolioConfig;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 15, 145));
    playSystemSound('click');
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 15, 70));
    playSystemSound('click');
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
    playSystemSound('click');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col bg-surface text-txt-primary select-none">
      {/* Top Document Viewer Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-surface-secondary border-b border-border">
        {/* Document details */}
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-txt-muted" />
          <span className="text-xs font-mono font-medium text-txt-primary">
            Sujith_K_FullStack_Resume.pdf
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-txt-muted">
            1 Page
          </span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-surface border border-border rounded-md p-0.5">
          <button
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-surface-hover text-txt-muted hover:text-txt-primary transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-0.5 text-[11px] font-mono text-txt-secondary hover:text-txt-primary"
          >
            {zoomLevel}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-surface-hover text-txt-muted hover:text-txt-primary transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Buttons: VIEW & DOWNLOAD */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover text-txt-secondary hover:text-txt-primary border border-border text-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          {/* VIEW RESUME BUTTON */}
          <a
            href={contact.resumePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-hover text-txt-primary border border-border text-xs font-medium transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-txt-muted" />
            <span>VIEW RESUME</span>
          </a>

          {/* DOWNLOAD RESUME BUTTON */}
          <a
            href={contact.resumePdfUrl}
            download="Sujith_K_FullStack_Resume.pdf"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-txt-primary text-bg font-medium text-xs transition-opacity hover:opacity-90 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD RESUME</span>
          </a>
        </div>
      </div>

      {/* Document View Canvas Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center bg-surface-secondary/50 select-text">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 w-full max-w-3xl bg-white text-zinc-900 rounded-lg shadow-lg p-8 sm:p-12 font-sans border border-zinc-200"
        >
          {/* Header */}
          <div className="border-b-2 border-zinc-900 pb-5 mb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-950">
                {personal.fullName}
              </h1>
              <p className="text-sm font-semibold text-zinc-700 mt-0.5">
                {personal.role} &bull; MERN Stack Specialist
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                {personal.location} &bull; {contact.email}
              </p>
            </div>
            <div className="text-right text-xs text-zinc-600 font-mono hidden sm:block">
              <div>Experience: 1.5+ Years</div>
              <div>Status: Available</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2 font-mono">
              EXECUTIVE PROFILE
            </h2>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {personal.bio.join(' ')}
            </p>
          </div>

          {/* Technical Competencies */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2 font-mono">
              CORE TECHNICAL EXPERTISE
            </h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-zinc-900">Frontend:</span> React.js, TypeScript, Next.js, JavaScript (ES6+), Angular, Redux, Tailwind CSS, Bootstrap, Material UI
              </div>
              <div>
                <span className="font-semibold text-zinc-900">Backend:</span> Node.js, Express.js, Socket.io, RESTful APIs, JWT Auth, Nodemailer
              </div>
              <div>
                <span className="font-semibold text-zinc-900">Database & Cloud:</span> MongoDB, Mongoose, AWS S3, Cloudinary, Razorpay Gateway, Google Gemini API
              </div>
              <div>
                <span className="font-semibold text-zinc-900">Workflow:</span> Git, GitHub, Postman, VS Code, Agile / Scrum
              </div>
            </div>
          </div>

          {/* Featured Key Deliverables */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2 font-mono">
              SELECTED PROJECT HIGHLIGHTS
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold text-zinc-950">
                  <span>Matrimony Platform (Full Stack MERN)</span>
                  <span className="font-mono text-zinc-600 text-[11px]">Production</span>
                </div>
                <div className="text-zinc-600 text-[11px]">
                  React.js, Node.js, Express, MongoDB, Socket.io, AWS S3, Razorpay
                </div>
                <p className="text-zinc-700 mt-1">
                  Engineered end-to-end matchmaking platform featuring real-time chat via Socket.io, AWS S3 media pipeline, and Razorpay subscription gateway.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-zinc-950">
                  <span>Learning Management System (LMS)</span>
                  <span className="font-mono text-zinc-600 text-[11px]">Completed</span>
                </div>
                <div className="text-zinc-600 text-[11px]">
                  React.js, TypeScript, Node.js, Express, MongoDB, AWS S3, Cloudinary
                </div>
                <p className="text-zinc-700 mt-1">
                  Developed enterprise course management application with video delivery, student enrollment pipelines, and hierarchical role-based access control.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-bold text-zinc-950">
                  <span>OLX Classifieds Clone</span>
                  <span className="font-mono text-zinc-600 text-[11px]">Completed</span>
                </div>
                <div className="text-zinc-600 text-[11px]">
                  React.js, JavaScript (ES6+), Node.js, Express, MongoDB, Tailwind CSS
                </div>
                <p className="text-zinc-700 mt-1">
                  Built classified marketplace application supporting item listing creation, real-time query filtering, and Cloudinary media processing.
                </p>
              </div>
            </div>
          </div>

          {/* Verified Document Footer */}
          <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>Verified Document // SUJITH OS System Export</span>
            <span>Location: Kerala, India</span>
          </div>
        </div>
      </div>

      {/* PDF config hint at bottom */}
      <div className="px-4 py-1.5 bg-surface-secondary border-t border-border text-[11px] font-mono text-txt-muted flex items-center justify-between">
        <span>PDF Path: <code className="text-txt-primary">src/data/portfolioData.ts</code> &rarr; <code className="text-txt-primary">resumePdfUrl</code></span>
        <span className="text-txt-muted">Client-Side Rendered</span>
      </div>
    </div>
  );
};
