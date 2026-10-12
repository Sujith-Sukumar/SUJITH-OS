import React, { useState, useRef, useEffect } from 'react';
import { portfolioConfig } from '../../data/portfolioData';
import { projectsData } from '../../data/projects';
import { skillsData } from '../../data/skills';
import { experienceData } from '../../data/experience';
import { useWindowStore } from '../../store/windowStore';
import { useSettingsStore } from '../../store/settingsStore';
import { AccentColor } from '../../types/os';
import { playSystemSound } from '../../utils/sound';

interface HistoryEntry {
  command: string;
  output: React.ReactNode;
}

const COMMAND_LIST = [
  'help',
  'about',
  'skills',
  'projects',
  'experience',
  'contact',
  'resume',
  'whoami',
  'clear',
  'cls',
  'neofetch',
  'ls',
  'pwd',
  'date',
  'theme',
  'sudo',
  'exit'
];

export const TerminalApp: React.FC = () => {
  const { openWindow } = useWindowStore();
  const { setAccent } = useSettingsStore();

  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: '',
      output: (
        <div className="space-y-1 text-[var(--terminal-text)] font-mono">
          <div className="font-bold">SUJITH OS [Version 2.0.26] Terminal Shell</div>
          <div className="text-[var(--terminal-muted)]">Type 'help' for available commands, 'whoami' for credentials, or 'clear' to clear.</div>
        </div>
      ),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleAutocomplete = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    const match = COMMAND_LIST.find((c) => c.startsWith(trimmed.toLowerCase()));
    if (match) {
      setInputVal(match);
      playSystemSound('command');
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    playSystemSound('command');
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const root = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim();

    let output: React.ReactNode = null;

    switch (root) {
      case 'help':
        output = (
          <div className="space-y-1.5 text-[var(--terminal-text)]">
            <div className="text-[var(--terminal-prompt)] font-semibold uppercase text-[11px] tracking-wider">Available Commands:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
              <div><span className="font-bold text-[var(--terminal-command)]">about</span> &mdash; Developer background & bio</div>
              <div><span className="font-bold text-[var(--terminal-command)]">skills</span> &mdash; Full stack core technologies</div>
              <div><span className="font-bold text-[var(--terminal-command)]">projects</span> &mdash; Active production repositories</div>
              <div><span className="font-bold text-[var(--terminal-command)]">experience</span> &mdash; Career execution logs</div>
              <div><span className="font-bold text-[var(--terminal-command)]">contact</span> &mdash; Transmission coordinates & email</div>
              <div><span className="font-bold text-[var(--terminal-command)]">resume</span> &mdash; Curriculum vitae document</div>
              <div><span className="font-bold text-[var(--terminal-command)]">whoami</span> &mdash; Current user credentials</div>
              <div><span className="font-bold text-[var(--terminal-command)]">neofetch</span> &mdash; System architecture summary</div>
              <div><span className="font-bold text-[var(--terminal-command)]">theme &lt;color&gt;</span> &mdash; UI accent (blue, purple, green, orange)</div>
              <div><span className="font-bold text-[var(--terminal-command)]">clear</span> &mdash; Wipe console output</div>
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-0.5">
            <div className="font-bold text-[var(--terminal-command)]">{portfolioConfig.personal.fullName}</div>
            <div className="text-[var(--terminal-text)]">{portfolioConfig.personal.role}</div>
            <div className="text-[var(--terminal-muted)] text-xs">{portfolioConfig.personal.location} &bull; {portfolioConfig.personal.primaryStack}</div>
          </div>
        );
        break;

      case 'about':
        output = (
          <div className="space-y-2">
            <div className="font-bold text-[var(--terminal-command)]">{portfolioConfig.personal.name} &mdash; {portfolioConfig.personal.role}</div>
            <div className="text-[var(--terminal-muted)] italic text-xs">"{portfolioConfig.personal.tagline}"</div>
            <p className="text-[var(--terminal-text)] text-xs leading-relaxed max-w-xl">{portfolioConfig.personal.bio[0]}</p>
            <div className="pt-1">
              <button
                onClick={() => openWindow('about')}
                className="text-[var(--terminal-text)] hover:underline text-xs opacity-80 hover:opacity-100"
              >
                &gt; Open About Me application
              </button>
            </div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-[var(--terminal-prompt)]">CORE STACK & DIAGNOSTICS:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {skillsData.map((group) => (
                <div key={group.category} className="p-2 border border-[var(--terminal-border)] rounded">
                  <div className="font-bold text-[var(--terminal-command)] text-[11px] uppercase mb-1">{group.category}</div>
                  <div className="space-y-0.5 text-[var(--terminal-text)]">
                    {group.skills.map((s) => (
                      <div key={s.name} className="flex justify-between">
                        <span>{s.name}</span>
                        <span className="text-[var(--terminal-muted)] text-[10px]">{s.yearsExperience}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-1.5 text-xs">
            <div className="font-semibold text-[var(--terminal-prompt)]">PRODUCTION REPOSITORIES:</div>
            {projectsData.map((p, idx) => (
              <div key={p.id} className="p-1.5 border border-[var(--terminal-border)] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <span className="font-mono text-[var(--terminal-muted)] mr-2">0{idx + 1}.</span>
                  <span className="text-[var(--terminal-command)] font-medium">{p.title}</span>
                  <span className="text-[var(--terminal-muted)] ml-2">({p.technologies.slice(0, 3).join(', ')})</span>
                </div>
                <button
                  onClick={() => openWindow('project-detail', { title: p.title, data: p })}
                  className="text-[var(--terminal-text)] hover:underline text-left sm:text-right opacity-80 hover:opacity-100"
                >
                  Inspect &rarr;
                </button>
              </div>
            ))}
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="space-y-1.5 text-xs font-mono">
            <div className="font-semibold text-[var(--terminal-prompt)]">CAREER TIMELINE LOGS:</div>
            {experienceData.map((e) => (
              <div key={e.year} className="p-1.5 border border-[var(--terminal-border)] rounded">
                <span className="text-[var(--terminal-muted)] font-bold">[{e.year}]</span>{' '}
                <span className="text-[var(--terminal-command)] font-medium">{e.role}</span> &mdash;{' '}
                <span className="text-[var(--terminal-text)]">{e.title}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-xs">
            <div className="font-semibold text-[var(--terminal-prompt)]">COMMUNICATIONS COORDINATES:</div>
            <div>Email: <a href={`mailto:${portfolioConfig.contact.email}`} className="text-[var(--terminal-command)] underline">{portfolioConfig.contact.email}</a></div>
            <div>GitHub: <a href={portfolioConfig.contact.github} target="_blank" rel="noreferrer" className="text-[var(--terminal-command)] underline">{portfolioConfig.contact.github}</a></div>
            <div>LinkedIn: <a href={portfolioConfig.contact.linkedin} target="_blank" rel="noreferrer" className="text-[var(--terminal-command)] underline">{portfolioConfig.contact.linkedin}</a></div>
          </div>
        );
        break;

      case 'resume':
        output = (
          <div className="space-y-1 text-xs">
            <div className="font-semibold text-[var(--terminal-prompt)]">CURRICULUM VITAE:</div>
            <div>Document: <span className="text-[var(--terminal-command)]">{portfolioConfig.contact.resumePdfUrl}</span></div>
            <div className="pt-1">
              <button
                onClick={() => openWindow('resume')}
                className="text-[var(--terminal-text)] hover:underline opacity-80 hover:opacity-100"
              >
                &gt; Launch Document Viewer
              </button>
            </div>
          </div>
        );
        break;

      case 'neofetch':
        output = (
          <div className="flex flex-col sm:flex-row gap-4 p-3 border border-[var(--terminal-border)] rounded font-mono text-xs">
            <div className="select-none hidden sm:block whitespace-pre leading-none text-[11px] text-[var(--terminal-muted)]">
{`   _____ _    _ _____ _____ _______ _    _ 
  / ____| |  | |_   _|_   _|__   __| |  | |
 | (___ | |  | | | |   | |    | |  | |__| |
  \\___ \\| |  | | | |   | |    | |  |  __  |
  ____) | |__| |_| |_ _| |_   | |  | |  | |
 |_____/ \\____/|_____|_____|  |_|  |_|  |_|`}
            </div>
            <div className="space-y-0.5">
              <div><span className="font-bold text-[var(--terminal-command)]">sujith@portfolio</span></div>
              <div className="text-[var(--terminal-muted)]">----------------------</div>
              <div><span className="text-[var(--terminal-muted)]">OS:</span> SUJITH OS v2.0</div>
              <div><span className="text-[var(--terminal-muted)]">Host:</span> Modern Web Client</div>
              <div><span className="text-[var(--terminal-muted)]">Stack:</span> MERN (React, Node, Express, MongoDB)</div>
              <div><span className="text-[var(--terminal-muted)]">Experience:</span> 1.5+ Years</div>
              <div><span className="text-[var(--terminal-muted)]">Location:</span> Kerala, India</div>
              <div><span className="text-[var(--terminal-muted)]">Status:</span> <span className="text-[var(--terminal-success)] font-bold">OPERATIONAL</span></div>
            </div>
          </div>
        );
        break;

      case 'theme':
        if (['blue', 'purple', 'green', 'orange'].includes(arg)) {
          setAccent(arg as AccentColor);
          output = <div className="text-[var(--terminal-success)]">UI accent set to: {arg} (terminal theme remains isolated)</div>;
        } else {
          output = (
            <div className="text-[var(--terminal-muted)]">
              Usage: theme &lt;blue | purple | green | orange&gt;
            </div>
          );
        }
        break;

      case 'date':
        output = <div className="text-[var(--terminal-text)]">{new Date().toLocaleString()}</div>;
        break;

      case 'pwd':
        output = <div className="text-[var(--terminal-text)]">/home/sujith/portfolio</div>;
        break;

      case 'ls':
        output = (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <span className="font-bold text-[var(--terminal-command)]">About/</span>
            <span className="font-bold text-[var(--terminal-command)]">Projects/</span>
            <span className="font-bold text-[var(--terminal-command)]">Skills/</span>
            <span className="font-bold text-[var(--terminal-command)]">Experience/</span>
            <span className="text-[var(--terminal-muted)]">resume.pdf</span>
            <span className="text-[var(--terminal-muted)]">contact.sh</span>
            <span className="text-[var(--terminal-muted)]">README.md</span>
          </div>
        );
        break;

      case 'sudo':
        output = (
          <div className="text-[var(--terminal-error)]">
            Permission denied: Guest session active.
          </div>
        );
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        setInputVal('');
        return;

      default:
        output = (
          <div className="text-[var(--terminal-error)] text-xs">
            Command not found: '{trimmed}'. Type 'help' to see available commands.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleAutocomplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistory[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="h-full flex flex-col p-4 bg-[var(--terminal-bg)] font-mono text-xs text-[var(--terminal-text)] overflow-y-auto cursor-text select-text"
    >
      {/* Historical command log */}
      <div className="space-y-3">
        {history.map((entry, index) => (
          <div key={index} className="space-y-1">
            {entry.command && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--terminal-prompt)] font-bold">sujith@portfolio:~$</span>
                <span className="text-[var(--terminal-command)]">{entry.command}</span>
              </div>
            )}
            {entry.output && <div className="pl-0">{entry.output}</div>}
          </div>
        ))}
      </div>

      {/* Current Active Input Prompt */}
      <div className="flex items-center gap-2 mt-3 flex-shrink-0">
        <span className="text-[var(--terminal-prompt)] font-bold select-none">sujith@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent text-[var(--terminal-command)] outline-none border-none caret-[var(--terminal-cursor)] text-xs font-mono"
        />
      </div>

      <div ref={bottomRef} className="h-4" />
    </div>
  );
};
