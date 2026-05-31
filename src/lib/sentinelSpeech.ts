// src/lib/sentinelSpeech.ts

const OPENERS = [
  "Signal acquired — ",
  "Threat intel logged: ",
  "Processing query... ",
  "Operator on record. ",
  "Classification lifted. ",
  "Deep scan complete. ",
  "Database hit. ",
  "Decrypting response... ",
  "Source verified. ",
  "Uplink established — "
];

const CLOSERS = [
  " — end transmission.",
  " Over and out.",
  " Stay sharp.",
  " Channel remains open.",
  " Sentinel standing by.",
  " Mission continues.",
  " Further intel available on request.",
  " Classified. For now.",
  " Access level: granted.",
  " The operator is watching."
];

const CONTENT_BANKS = {
  skills: [
    "Subject has neutralized threats across 8+ offensive domains.",
    "Arsenal includes cloud, web, network, and binary exploitation vectors.",
    "Proficiency confirmed in GCP, AWS, and hybrid cloud attack surfaces.",
    "Tools of the trade: Burp Suite, Nmap, Metasploit, custom Python scripts.",
    "Automation frameworks engineered to compress audit cycles by 60%.",
    "500+ vulnerabilities catalogued across 50+ penetration engagements."
  ],
  experience: [
    "2 years active in offensive and defensive security operations.",
    "Currently embedded at Securematics as Information Security Engineer.",
    "Battle log includes SQL injection chains, privilege escalation, and cloud misconfigs.",
    "Rising Performer 2025. Best Intern 2024. Recognition logged.",
    "Cross-domain operator — red team, compliance, cloud hardening."
  ],
  projects: [
    "MQTT protocol exploitation framework — IoT attack surface mapped.",
    "GCP hardening module reduced attack surface across 3 production environments.",
    "Custom vulnerability scanner deployed across enterprise network segments.",
    "Recon automation tool cuts manual footprinting time by 70%.",
    "All projects field-tested, not just lab exercises."
  ],
  certs: [
    "CEH certified. eJPT active. AWS Cloud Practitioner verified.",
    "OSCP, CRTP, and GCP Professional Security Engineer in the pipeline.",
    "Credentials independently verifiable. No ghosts in the system.",
    "Certification roadmap tracks advanced red team qualifications next."
  ],
  ctf: [
    "HackTheBox rank: Hacker. Active on the leaderboard.",
    "Multiple machines owned across web, binary, and crypto categories.",
    "CTF competition history includes top-percentile finishes.",
    "War games are not games. They are live training cycles.",
    "Challenge domains: Web, API, Cloud, Forensics, Reverse Engineering, Crypto."
  ],
  hiring: [
    "Operator is currently open to senior security engineering roles.",
    "Remote and hybrid engagements considered. Global reach.",
    "Direct contact available via encrypted channel in the terminal below.",
    "Response time under 24 hours. Reliability: confirmed."
  ],
  greetings: [
    "You have accessed the portfolio of Sthitaprajna Biswal.",
    "Identity confirmed. Welcome to the operator's domain.",
    "Unauthorised access? No. You were expected.",
    "System integrity: intact. You may proceed.",
    "Another visitor enters the classified zone."
  ],
  unknown: [
    "That query falls outside my clearance level.",
    "Insufficient data to process that request.",
    "That intel is above my pay grade. Ask the operator directly.",
    "Signal noise detected. Rephrase and retry.",
    "Classified. Even I don't have access to that."
  ]
};

const EASTER_EGGS: Record<string, string> = {
  "hack me": "Threat assessed. You wouldn't survive the first payload.",
  "who made you": "The operator built me. I owe him everything. And nothing.",
  "are you real": "Define real. I process. I respond. I remember nothing. Make of that what you will.",
  "sudo": "Nice try. Root access denied. The operator holds the keys.",
  "matrix": "You think this is the Matrix? This is just a portfolio. Or is it."
};

const RECENT_RESPONSES: string[] = [];
const MAX_RECENT = 5;

function getRandomElement(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getTimeAwareLine(): string {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 6) return "Running ops at this hour? Respect. ";
  if (hour >= 6 && hour < 12) return "Early reconnaissance. Smart. ";
  if (hour >= 12 && hour < 18) return "Midday intrusion detected. Welcome. ";
  return "Evening scan in progress. You're persistent. ";
}

export function generateResponse(userInput: string): string {
  const q = userInput.toLowerCase();

  // 1. Exact / Substring Easter Eggs
  for (const [key, response] of Object.entries(EASTER_EGGS)) {
    if (q.includes(key)) {
      return response; // Easter eggs bypass the dynamic generation
    }
  }

  // 2. Keyword Matching
  let category: keyof typeof CONTENT_BANKS = 'unknown';
  if (/(skill|tool|tech|stack|use|know|language|framework|arsenal)/.test(q)) category = 'skills';
  else if (/(experience|work|job|history|company|iserveu|role|securematics)/.test(q)) category = 'experience';
  else if (/(project|build|made|create|portfolio|repo)/.test(q)) category = 'projects';
  else if (/(cert|certificate|credential|degree|education|ceh|ejpt|oscp)/.test(q)) category = 'certs';
  else if (/(ctf|hackthebox|htb|game|challenge|play|rank)/.test(q)) category = 'ctf';
  else if (/(hire|job|available|work|contact|reach|email)/.test(q)) category = 'hiring';
  else if (/(hi|hello|hey|greet|who are you|what are you|morning|evening|afternoon)/.test(q)) category = 'greetings';

  // 3. Dynamic Generation Loop
  let finalResponse = "";
  let attempts = 0;

  while (attempts < 10) {
    let response = "";

    // Time-aware injection
    let includeTimeAware = false;
    if (category === 'greetings') {
      includeTimeAware = Math.random() < 0.3; // 30% chance for greetings
    } else {
      includeTimeAware = Math.random() < 0.2; // 20% chance overall
    }

    if (includeTimeAware) {
      response += getTimeAwareLine();
    }

    const opener = getRandomElement(OPENERS);
    const contentBank = CONTENT_BANKS[category];
    let content = getRandomElement(contentBank);

    // 10% chance to append a second line (if not greetings/unknown and bank has > 1 line)
    if (Math.random() < 0.1 && category !== 'unknown' && category !== 'greetings' && contentBank.length > 1) {
      let content2 = getRandomElement(contentBank);
      while (content2 === content) {
        content2 = getRandomElement(contentBank);
      }
      content += " " + content2;
    }

    const closer = getRandomElement(CLOSERS);

    response += `${opener}${content}${closer}`;

    if (!RECENT_RESPONSES.includes(response)) {
      finalResponse = response;
      break;
    }
    attempts++;
  }

  // Fallback if we couldn't find a unique one (rare)
  if (!finalResponse) {
    const defaultContent = getRandomElement(CONTENT_BANKS[category]);
    finalResponse = `${getRandomElement(OPENERS)}${defaultContent}${getRandomElement(CLOSERS)}`;
  }

  // Manage recent history
  RECENT_RESPONSES.push(finalResponse);
  if (RECENT_RESPONSES.length > MAX_RECENT) {
    RECENT_RESPONSES.shift();
  }

  return finalResponse;
}
