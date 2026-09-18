/**
 * Interactive Cyber Terminal CLI Engine
 * Fully responsive Linux-style command line with autocomplete and custom commands.
 */

class CyberTerminal {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input-cmd');
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: () => `
<span style="color: var(--color-primary); font-weight: bold;">AVAILABLE COMMANDS:</span>
  <span style="color: var(--color-accent);">whoami</span>       - Display identity, education & target job role
  <span style="color: var(--color-accent);">skills</span>       - List core SOC, SIEM & network defense capabilities
  <span style="color: var(--color-accent);">projects</span>     - Display high-impact cybersecurity projects
  <span style="color: var(--color-accent);">soc</span>          - Show live telemetry stats & honeypot status
  <span style="color: var(--color-accent);">mitre</span>        - Print mapped MITRE ATT&CK techniques
  <span style="color: var(--color-accent);">contact</span>      - Get recruiter contact info & transmission channels
  <span style="color: var(--color-accent);">hire</span>         - Quick pitch for hiring managers & recruiters
  <span style="color: var(--color-accent);">resume</span>       - View / Download interactive resume
  <span style="color: var(--color-accent);">theme [name]</span> - Change UI theme: cyan | matrix | crimson | synthwave
  <span style="color: var(--color-accent);">audio [on/off]</span>- Toggle cyber acoustic feedback engine
  <span style="color: var(--color-accent);">clear</span>        - Clear terminal console screen
  <span style="color: var(--color-accent);">cat flag.txt</span> - CTF Easter Egg
`,
      whoami: () => `
<span style="color: var(--color-primary); font-weight: bold;">[IDENTITY VERIFIED]</span>
Name:        Ajit Nayak
Title:       SOC Analyst | Cybersecurity Specialist | Network Defender
Location:    Bangalore, India (Targeting / Relocating) | Odisha
Degree:      B.Tech in Computer Science & Engineering
Institution: Govt. College of Engineering, Kalahandi (2021-2025)
CGPA:        7.44 / 10.0
Objective:   Defending enterprise infrastructures, investigating threats with SIEM/KQL, and triaging security incidents with zero-lag response.
`,
      skills: () => `
<span style="color: var(--color-primary); font-weight: bold;">[DEFENSIVE ARSENAL & SKILLS]</span>
  • <span style="color: var(--color-accent);">SIEM & Log Analytics:</span> Microsoft Sentinel, Splunk, Azure Log Analytics, KQL Queries
  • <span style="color: var(--color-accent);">Network Forensics:</span>    Wireshark, tcpdump, Snort IDS/IPS, Nmap, Zeek
  • <span style="color: var(--color-accent);">Threat Hunting:</span>       MITRE ATT&CK Framework, IOC extraction, Threat Intel
  • <span style="color: var(--color-accent);">Infrastructure & AD:</span>  Active Directory auditing, Group Policy, Kerberoasting defense
  • <span style="color: var(--color-accent);">Scripting & OS:</span>       Python 3, Bash, PowerShell, Linux (Ubuntu/Debian), Windows Server
`,
      projects: () => `
<span style="color: var(--color-primary); font-weight: bold;">[TACTICAL SECURITY PROJECTS]</span>
1. <span style="color: var(--color-accent);">Azure Sentinel Cloud Honeypot & SIEM</span>
   - Deployed vulnerable VM in Azure with custom NSG rules.
   - Collected 14,000+ live RDP brute-force attempts from 45+ nations.
   - Built custom KQL queries and automated incident alerts.

2. <span style="color: var(--color-accent);">Active Directory Security Hardening & Audit</span>
   - Lab attack simulation: Kerberoasting, BloodHound graph analysis, AS-REP roasting.
   - Hardened group policies and eliminated weak RC4 service ticket encryptions.

3. <span style="color: var(--color-accent);">Enterprise PCAP Malware & C2 Beaconing Forensics</span>
   - Analyzed packet captures in Wireshark to isolate reverse TCP Meterpreter shells.
   - Engineered custom Snort rules for automated intrusion alerting.

4. <span style="color: var(--color-accent);">Automated Threat Intel & IOC Scanner</span>
   - Python automation feeding VirusTotal & AbuseIPDB APIs for instant hash/IP triage.
`,
      soc: () => `
<span style="color: var(--color-primary); font-weight: bold;">[CURRENT SOC MONITORING STATUS]</span>
  • Threat Level: DEFCON 4 (Normal Monitoring)
  • Attacks Blocked: 14,280+
  • Packets Inspected: 1.8M+
  • Active Detection Rules: 48 Verified Rules
  • Uptime: 99.98%
`,
      mitre: () => `
<span style="color: var(--color-primary); font-weight: bold;">[MITRE ATT&CK COVERAGE]</span>
  • TA0001 Initial Access:   T1110 (Brute Force - RDP) -> Detected via Sentinel KQL
  • TA0006 Credential Access: T1558.003 (Kerberoasting) -> Audited via AD Event ID 4769
  • TA0011 Command & Control: T1071 (Application Layer C2) -> Identified via Wireshark PCAP
  • TA0010 Exfiltration:     T1048 (Exfiltration Over Alternative Protocol) -> Blocked
`,
      contact: () => `
<span style="color: var(--color-primary); font-weight: bold;">[TRANSMISSION CHANNELS]</span>
  • Email:    <a href="mailto:ajit.nayak.028@gmail.com" style="color: var(--color-primary);">ajit.nayak.028@gmail.com</a>
  • LinkedIn: <a href="https://linkedin.com/in/ajit028" target="_blank" style="color: var(--color-primary);">linkedin.com/in/ajit028</a>
  • GitHub:   <a href="https://github.com/ajit028" target="_blank" style="color: var(--color-primary);">github.com/ajit028</a>
`,
      hire: () => `
<span style="color: var(--color-primary); font-weight: bold;">[WHY HIRE AJIT NAYAK FOR YOUR SOC TEAM?]</span>
  1. <span style="color: var(--color-accent);">Hands-on Practical Experience:</span> Built real cloud honeypots, audited real AD domains, and analyzed raw PCAP packets.
  2. <span style="color: var(--color-accent);">Fast Ramp-up:</span> Deep understanding of KQL, MITRE ATT&CK, Event IDs (4624, 4625, 4769, 7045), and network protocols.
  3. <span style="color: var(--color-accent);">Bangalore Ready:</span> Available for immediate joining and relocating with zero lag.
`,
      resume: () => {
        window.open('resume.html', '_blank');
        return `Opening interactive resume in new tab...`;
      },
      'cat flag.txt': () => `
<span style="color: #39ff14; font-weight: bold;">FLAG{4j1t_n4y4k_s0c_m4st3r_2026}</span>
Congratulations! You've found the CTF token. Ready to hire me?
`,
      clear: () => {
        if (this.output) this.output.innerHTML = '';
        return null;
      }
    };

    this.init();
  }

  init() {
    if (!this.input || !this.output) return;

    this.printInitialBanner();

    this.input.addEventListener('keydown', (e) => {
      if (window.cyberAudio) window.cyberAudio.playKeypress();

      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.execute(cmd);
        }
        this.input.value = '';
      } else if (e.key === 'ArrowUp') {
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
        e.preventDefault();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete();
      }
    });
  }

  printInitialBanner() {
    this.print(`
<span style="color: var(--color-primary);">AJIT-CYBERSEC-CLI [Version 3.4.0-release]</span>
<span style="color: var(--text-muted);">Type <span style="color: var(--color-accent); font-weight: bold;">help</span> for available commands or click buttons below.</span>
`);
  }

  print(html) {
    if (!this.output) return;
    const div = document.createElement('div');
    div.innerHTML = html;
    this.output.appendChild(div);
    this.output.scrollTop = this.output.scrollHeight;
  }

  execute(cmdStr) {
    const promptLine = `<div style="margin-top: 6px;"><span style="color: var(--color-accent);">ajit@cybersec-ops:~$</span> <span style="color: #fff;">${cmdStr}</span></div>`;
    this.print(promptLine);

    const parts = cmdStr.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    if (cmdStr.toLowerCase() === 'cat flag.txt') {
      const res = this.commands['cat flag.txt']();
      this.print(res);
      return;
    }

    if (mainCmd === 'theme') {
      if (['cyan', 'matrix', 'crimson', 'synthwave'].includes(arg)) {
        document.documentElement.setAttribute('data-theme', arg);
        document.querySelectorAll('.theme-dot').forEach(d => {
          d.classList.toggle('active', d.classList.contains(arg));
        });
        this.print(`<span style="color: var(--color-primary);">Theme switched to: <strong>${arg.toUpperCase()}</strong></span>`);
      } else {
        this.print(`<span style="color: var(--color-danger);">Invalid theme. Choose: cyan | matrix | crimson | synthwave</span>`);
      }
      return;
    }

    if (mainCmd === 'audio') {
      if (arg === 'on') {
        window.cyberAudio.enabled = false; // toggle will enable it
        const state = window.cyberAudio.toggle();
        this.print(`<span style="color: var(--color-accent);">Cyber Audio FX: <strong>ACTIVE</strong></span>`);
      } else if (arg === 'off') {
        window.cyberAudio.enabled = false;
        this.print(`<span style="color: var(--text-muted);">Cyber Audio FX: <strong>MUTED</strong></span>`);
      } else {
        const state = window.cyberAudio.toggle();
        this.print(`<span style="color: var(--color-primary);">Audio FX toggled: <strong>${state ? 'ON' : 'OFF'}</strong></span>`);
      }
      return;
    }

    if (this.commands[mainCmd]) {
      const output = this.commands[mainCmd]();
      if (output !== null) {
        this.print(output);
      }
    } else {
      this.print(`<span style="color: var(--color-danger);">Command not recognized: '${mainCmd}'. Type <span style="color: var(--color-accent);">help</span> for list.</span>`);
    }
  }

  autocomplete() {
    const cur = this.input.value.trim().toLowerCase();
    if (!cur) return;
    const match = Object.keys(this.commands).find(c => c.startsWith(cur));
    if (match) {
      this.input.value = match;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CyberTerminal();
});
