import { PERSONAL, SKILLS, EXPERIENCE, PROJECTS, CERTIFICATIONS, CTF_PROFILE } from '@/data/portfolio';

const PATTERNS: { pattern: RegExp; response: string | string[] }[] = [
  {
    pattern: /(experience|years|background|work|history|job)/i,
    response: [
      `Sthitaprajna has been an Information Security Engineer and Pen Tester at ${EXPERIENCE[0].company} since ${EXPERIENCE[0].period.split(' — ')[0]}.`,
      `His battle log shows solid experience in securing FinTech pipelines at ${EXPERIENCE[0].company}.`,
      `He leads VAPT operations and cloud security architecture at ${EXPERIENCE[0].company}.`
    ]
  },
  {
    pattern: /(project|built|made|portfolio)/i,
    response: [
      `Key deployments include ${PROJECTS.map(p => p.title).join(', ')}.`,
      `He has built automated VAPT pipelines and executed an MQTT IoT attack chain PoC.`,
      `Notable projects revolve around cloud infrastructure defense, like his ${PROJECTS[0].title}.`
    ]
  },
  // Day 77: Add 10 new recruiter Q&A pairs about certifications
  {
    pattern: /(ceh|certified ethical hacker)/i,
    response: "Yes, he holds the Certified Ethical Hacker (CEH) certification from EC-Council."
  },
  {
    pattern: /(oscp|offensive security certified professional)/i,
    response: "He is currently pursuing his OSCP. It's on his active certification roadmap."
  },
  {
    pattern: /(pnpt|practical network penetration tester)/i,
    response: "He holds the PNPT (Practical Network Penetration Tester) from TCM Security, proving his ability to perform full-scale external and internal network penetration tests."
  },
  {
    pattern: /(comptia security\+|security\+|sec\+)/i,
    response: "He possesses a solid foundation in security principles, although his certifications lean more toward practical application like PNPT and eJPT rather than Security+."
  },
  {
    pattern: /(ejpt|elearnsecurity junior penetration tester)/i,
    response: "Yes, he has earned the eJPT certification, demonstrating strong foundational penetration testing skills."
  },
  {
    pattern: /(aws security|aws certified security)/i,
    response: "He has extensive practical AWS security experience, and formal cloud security certifications are on his professional roadmap."
  },
  {
    pattern: /(gcp professional cloud security|gcp security)/i,
    response: "He has hardened GCP environments against CIS benchmarks and automated scanning, though he currently focuses on vendor-neutral offensive certs."
  },
  {
    pattern: /(are you certified|do you have certifications|what certs do you have)/i,
    response: `Yes, he has ${CERTIFICATIONS.length} active certifications including ${CERTIFICATIONS.map(c => c.name).slice(0, 3).join(', ')}.`
  },
  {
    pattern: /(best cert|top cert|highest cert)/i,
    response: "His most notable certification is the PNPT from TCM Security, which involved a rigorous 5-day real-world penetration test."
  },
  {
    pattern: /(expired certs|valid certs|cert expiry)/i,
    response: "All displayed certifications are currently active and independently verifiable via issuing authorities."
  },
  {
    pattern: /(cert|certification)/i,
    response: [
      `He holds ${CERTIFICATIONS.length} active certifications, prominently ${CERTIFICATIONS[0].name} and ${CERTIFICATIONS[1].name}.`,
      `His certification stack includes ${CERTIFICATIONS.map(c => c.name).slice(0,3).join(', ')}.`,
      `Currently maintaining ${CERTIFICATIONS.length} active certs across offensive security and network defense.`
    ]
  },
  {
    pattern: /(skill|tool|stack|tech)/i,
    response: [
      `Primary weapons: ${SKILLS[0].skills.map((s: { name: string }) => s.name).slice(0, 4).join(', ')}.`,
      `He specializes in Web App Sec, Cloud Security, and ${SKILLS[2].skills.map((s: { name: string }) => s.name).slice(0, 2).join(' / ')}.`,
      `His skill matrix covers advanced VAPT, SIEM deployment, and deep GCP security hardening.`
    ]
  },
  {
    pattern: /(ctf|hackthebox|htb|rank|points)/i,
    response: [
      `Current HackTheBox rank: ${CTF_PROFILE.htbRank}. ${CTF_PROFILE.htbPoints} points, N/A respect.`,
      `He's highly active on HTB: ${CTF_PROFILE.htbPoints} points, Top ${CTF_PROFILE.globalPercentile} globally.`,
      `HTB telemetry shows ${CTF_PROFILE.htbRootOwns} System owns, ${CTF_PROFILE.htbUserOwns} User owns, and ${CTF_PROFILE.htbChallengesSolved} completed challenges.`
    ]
  },
  {
    pattern: /(contact|email|hire|reach)/i,
    response: [
      `You can ping him at ${PERSONAL.email} or access his LinkedIn profile.`,
      `Establish a secure channel via ${PERSONAL.email}.`,
      `Reach out directly at ${PERSONAL.email} for recruitment protocols.`
    ]
  },
  {
    pattern: /(github|open source|code|commit)/i,
    response: [
      `He's active on GitHub with 852 commits and 43 PRs this year.`,
      `His open source activity shows 852 commits. Check out his GitHub for scripts and tools.`
    ]
  },
  {
    pattern: /(hello|hi|hey|greet)/i,
    response: [
      "Greetings. How can I assist you in learning about Sthita?",
      "Hello. Please query a specific topic like 'experience' or 'skills'.",
      "System online. Awaiting your query."
    ]
  }
];

export function generateDynamicSpeech(input: string): string {
  for (const { pattern, response } of PATTERNS) {
    if (pattern.test(input)) {
      if (Array.isArray(response)) {
        return response[Math.floor(Math.random() * response.length)];
      }
      return response;
    }
  }

  const defaults = [
    "I am an interactive terminal. Please query a specific topic like 'experience' or 'skills'.",
    "Query out of bounds. Try asking about his projects, certifications, or HackTheBox rank.",
    "That is classified or unknown. Ask me about his tech stack or contact details instead."
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}
