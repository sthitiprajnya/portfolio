"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import clsx from 'clsx';
import { PERSONAL, SKILLS, CERTIFICATIONS, PROJECTS } from '@/data/portfolio';

interface TerminalLine {
  prompt?: string;
  command?: string;
  output?: string | React.ReactNode;
  isInput?: boolean;
}

export function InteractiveTerminal({ className }: { className?: string }) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { prompt: 'sthitaprajna@kali:~$', command: 'whoami' },
    { output: 'infosec-engineer' },
    { prompt: 'sthitaprajna@kali:~$', command: 'cat highlights.txt' },
    { output: '> 50+ Full-scope pen tests executed' },
    { output: '> 230+ Unique vulnerabilities documented' },
    { output: '> Specialised in Cloud Security & AppSec' },
    { output: 'Type "help" for a list of available commands.' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);

  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { ref } = useInView({ threshold: 0.1, triggerOnce: true });

  const scrollToBottom = () => {
    // BOLT: Use behavior 'auto' during processing to avoid overlapping smooth scroll animations
    // and layout thrashing during rapid output streaming.
    endOfTerminalRef.current?.scrollIntoView({ behavior: isProcessing ? 'auto' : 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

  const addLinesWithDelay = async (newOutputLines: string[], delay: number = 200) => {
    setIsProcessing(true);
    for (let i = 0; i < newOutputLines.length; i++) {
      await new Promise(r => setTimeout(r, delay));
      // Security: Limit terminal lines to 100 to prevent client-side memory exhaustion (DoS mitigation)
      setLines(prev => [...prev, { output: newOutputLines[i] }].slice(-100));
    }
    setIsProcessing(false);
  };

  const handleCommand = (cmd: string) => {
    if (isProcessing) return;

    const trimmedCmd = cmd.trim();
    const lowerCmd = trimmedCmd.toLowerCase();

    if (trimmedCmd) {
      // Security: Limit command history to 50 entries to prevent memory exhaustion
      setCommandHistory(prev => [...prev, trimmedCmd].slice(-50));
      setHistoryIndex(-1);
    }

    const currentPromptLine: TerminalLine = { prompt: 'sthitaprajna@kali:~$', command: trimmedCmd, isInput: false };
    // Security: Limit terminal lines to 100 to prevent memory exhaustion
    setLines(prev => [...prev, currentPromptLine].slice(-100));

    let outputToDelay: string[] = [];

    switch (lowerCmd) {
      case 'help':
        outputToDelay = [
          'Available commands:',
          '  whoami          - Display current user identity',
          '  cat skills.txt  - List top tools',
          '  ls projects/    - List project directories',
          '  cat awards.txt  - Show recent awards',
          '  cat certs.txt   - List certifications',
          '  nmap -sV target - Run scan on target',
          '  clear           - Clear terminal output'
        ];
        break;
      case 'whoami':
        outputToDelay = [
          `${PERSONAL.name}`,
          `${PERSONAL.currentRole}`,
          `${PERSONAL.currentCompany}`,
          `${PERSONAL.location}`,
          `Status: OPEN TO OPPORTUNITIES`
        ];
        break;
      case 'cat skills.txt':
      case 'cat skills': {
        const skillsList = SKILLS.flatMap(cat => cat.skills.map(s => s.name)).slice(0, 15).join('\n  - ');
        outputToDelay = ['Loading skills matrix...', `[+] Top Tools:\n  - ${skillsList}`];
        break;
      }
      case 'ls projects/':
      case 'ls projects':
        outputToDelay = PROJECTS.map(p => `drwxr-xr-x  2 sthitaprajna  staff  4096 Jan  1 00:00 ${p.id}`);
        break;
      case 'cat awards.txt':
      case 'cat awards':
        outputToDelay = [
          '2024: Best Intern Award',
          '2025: Rising Performer Award',
          '"Demonstrated exceptional vulnerability discovery and reporting."'
        ];
        break;
      case 'cat certs.txt':
      case 'cat certs':
        outputToDelay = CERTIFICATIONS.map(c => `[${c.year}] ${c.name} - ${c.issuer}`);
        break;
      case 'nmap -sv target':
        outputToDelay = [
          'Starting Nmap 7.94 ( https://nmap.org )',
          'Nmap scan report for target (192.168.1.100)',
          'Host is up (0.015s latency).',
          'Not shown: 996 closed tcp ports (reset)',
          'PORT     STATE SERVICE',
          '22/tcp   open  ssh',
          '80/tcp   open  http',
          '443/tcp  open  https',
          '3306/tcp open  mysql',
          '',
          '[!] 50+ engagements completed successfully.',
          'Nmap done: 1 IP address (1 host up) scanned in 12.43 seconds'
        ];
        break;
      case 'clear':
        setLines([]);
        setCurrentInput('');
        return;
      case 'sudo rm -rf /':
        outputToDelay = ['Permission denied. Nice try.'];
        break;
      case 'cat flag.txt':
      case 'cat flag':
        outputToDelay = ['HTB{y0u_f0und_th3_3ast3r_3gg}'];
        break;
      case 'ssh root@localhost':
        outputToDelay = ["Connection refused. You're already in."];
        break;
      case 'cat /etc/passwd':
        outputToDelay = ['Seriously? I patched that.'];
        break;
      case '':
        setCurrentInput('');
        return;
      default:
        outputToDelay = [`bash: ${trimmedCmd.split(' ')[0]}: command not found`];
    }

    if (outputToDelay.length > 0) {
      addLinesWithDelay(outputToDelay, lowerCmd.startsWith('nmap') ? 300 : 50);
    }
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  return (
    <div
      ref={ref}
      className={clsx(
        "rounded-card overflow-hidden bg-black border border-border font-mono text-mono-sm text-green relative shadow-[var(--glow-green-sm)] flex flex-col h-[300px]",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex bg-[#1a1a1a] px-3 py-1 items-center border-b border-border shrink-0">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="mx-auto text-[0.65rem] text-text-muted">sthitaprajna@kali ~</div>
      </div>
      <div
        className="p-4 leading-relaxed overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        aria-live="polite"
        aria-atomic="false"
      >
        {lines.map((line, lineIdx) => (
          <div key={lineIdx} className="flex whitespace-pre-wrap break-words">
            {line.prompt && <span className="text-text-muted mr-2 shrink-0">{line.prompt}</span>}
            {line.command && <span>{line.command}</span>}
            {line.output && <span className="text-text-secondary">{line.output}</span>}
          </div>
        ))}
        {!isProcessing && (
          <div className="flex whitespace-pre-wrap break-words mt-1">
            <span className="text-text-muted mr-2 shrink-0">sthitaprajna@kali:~$</span>
            <input
              ref={inputRef}
              type="text"
              aria-label="Terminal command input"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none flex-grow text-green caret-green placeholder:text-green/30"
              placeholder="Type 'help' for available commands..."
              autoComplete="off"
              spellCheck="false"
              autoFocus
              maxLength={500}
            />
          </div>
        )}
        <div ref={endOfTerminalRef} />
      </div>
    </div>
  );
}