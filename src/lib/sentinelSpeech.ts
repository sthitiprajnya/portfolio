type Topic = 'experience' | 'cert' | 'skill' | 'contact' | 'project' | 'htb' | 'default';

const BANKS = {
  openers: [
    "Analyzing query...",
    "Retrieving data matrix...",
    "Scanning memory banks...",
    "Accessing Sthita's records...",
    "Decrypting payload..."
  ],
  closers: [
    "Would you like to know more?",
    "Awaiting further inquiries.",
    "System standing by.",
    "Data transmission complete.",
    "Let me know if you need deeper analysis."
  ],
  content: {
    experience: [
      "Sthitaprajna has been an Information Security Engineer and Pen Tester at iServeU Technology for over 2 years.",
      "His battle log shows 2+ years of securing FinTech pipelines at iServeU.",
      "He leads VAPT operations and cloud security architecture at iServeU, backed by 2 years of field experience."
    ],
    cert: [
      "He holds 11 active certifications, prominently eJPT v2, TCM PEH, and INE Cloud Associate.",
      "His certification stack includes eJPT v2, CCNA, PEH, and multiple EC-Council credentials.",
      "Currently maintaining 11 active certs across offensive security and network defense."
    ],
    skill: [
      "Primary weapons: Burp Suite Pro, Nessus, Nuclei, and Wazuh. Scripting in Python and Bash.",
      "He specializes in Web App Sec, Cloud Security (GCP/AWS), and custom Python automation.",
      "His skill matrix covers advanced VAPT, SIEM deployment, and deep GCP security hardening."
    ],
    contact: [
      "You can ping him at sthitabiswal2002@gmail.com or access his LinkedIn profile.",
      "Establish a secure channel via sthitabiswal2002@gmail.com.",
      "Reach out directly at sthitabiswal2002@gmail.com for recruitment protocols."
    ],
    project: [
      "Key deployments include GCP bucket hardening, a custom Wazuh SIEM setup, and PCI/PII DLP pipelines.",
      "He has built automated VAPT pipelines and executed an MQTT IoT attack chain PoC.",
      "Notable projects revolve around cloud infrastructure defense and automated vulnerability scanning."
    ],
    htb: [
      "Current HackTheBox rank: Hacker. 1,240 points, Top 15%, with 42 system owns.",
      "He's highly active on HTB: 1,240 points, Top 15% globally.",
      "HTB telemetry shows 24 User owns, 18 Root owns, and 45 completed challenges."
    ],
    default: [
      "I am an interactive terminal. Please query a specific topic like 'experience' or 'skills'.",
      "Query out of bounds. Try asking about his projects, certifications, or HackTheBox rank.",
      "That is classified or unknown. Ask me about his tech stack or contact details instead."
    ]
  }
};

const recentResponses: string[] = [];

export function generateDynamicSpeech(input: string): string {
  const q = input.toLowerCase();

  let topic: Topic = 'default';
  if (q.includes('experience') || q.includes('years') || q.includes('work')) topic = 'experience';
  else if (q.includes('cert')) topic = 'cert';
  else if (q.includes('skill') || q.includes('tool') || q.includes('stack')) topic = 'skill';
  else if (q.includes('contact') || q.includes('hire') || q.includes('email')) topic = 'contact';
  else if (q.includes('project')) topic = 'project';
  else if (q.includes('hackthebox') || q.includes('htb')) topic = 'htb';

  const openers = BANKS.openers;
  const closers = BANKS.closers;
  const contents = BANKS.content[topic];

  const opener = openers[Math.floor(Math.random() * openers.length)];
  const closer = closers[Math.floor(Math.random() * closers.length)];

  // Try to find a content piece we haven't used recently
  let content = contents[Math.floor(Math.random() * contents.length)];
  let attempts = 0;
  while (recentResponses.includes(content) && attempts < 3) {
    content = contents[Math.floor(Math.random() * contents.length)];
    attempts++;
  }

  // Update recent responses
  recentResponses.push(content);
  if (recentResponses.length > 10) recentResponses.shift();

  // 1 in 4 chance to omit opener or closer for conversational variety
  const useOpener = Math.random() > 0.25;
  const useCloser = Math.random() > 0.25;

  let finalSpeech = '';
  if (useOpener) finalSpeech += opener + ' ';
  finalSpeech += content;
  if (useCloser) finalSpeech += ' ' + closer;

  return finalSpeech.trim();
}
