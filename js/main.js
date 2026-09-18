/**
 * Main Application Controller & UI Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Audio Toggle
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const active = window.cyberAudio.toggle();
      audioBtn.classList.toggle('active', active);
      audioBtn.innerHTML = active 
        ? '<i class="fas fa-volume-up"></i>' 
        : '<i class="fas fa-volume-mute"></i>';
    });
  }

  // 2. Theme Switcher
  const themeDots = document.querySelectorAll('.theme-dot');
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      if (window.cyberAudio) window.cyberAudio.playClick();
      const theme = dot.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  // 3. Typewriter Effect
  const typeTarget = document.getElementById('typewriter-text');
  if (typeTarget) {
    const phrases = [
      "SOC ANALYST"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        typeTarget.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typeTarget.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 30 : 65;

      if (!isDeleting && charIndex === current.length) {
        typeSpeed = 2200; // Hold full text
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
      }

      setTimeout(type, typeSpeed);
    }
    type();
  }

  // 4. Animate Skill Bars on Scroll
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-bar-fill');
        fills.forEach(f => {
          const width = f.getAttribute('data-width');
          f.style.width = width + '%';
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  // 5. Interactive Project Modals
  const projectDetails = {
    sentinel: {
      title: "Azure Sentinel Cloud Honeypot & Global Threat Map",
      badge: "SIEM & Cloud Detection",
      body: `
        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">PROJECT OVERVIEW</h4>
          <p>Engineered an internet-exposed Windows VM honeypot inside Microsoft Azure to lure global threat actors and capture live reconnaissance, RDP brute force attempts, and lateral movement attacks.</p>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">CORE ARCHITECTURE & PIPELINE</h4>
          <ul style="padding-left: 20px; color: var(--text-muted);">
            <li><strong>Data Collection:</strong> Azure Log Analytics workspace configured with Sysmon and Windows Security Event logs (Event ID 4625 for failed logons, 4624 for successful).</li>
            <li><strong>Geo-IP Enrichment:</strong> Custom PowerShell script integrated with IPGeolocation API to extract attacker coordinates (Latitude, Longitude, ISP, Country).</li>
            <li><strong>SIEM & Visualization:</strong> Ingested into Azure Sentinel with interactive Microsoft Sentinel Workbooks & KQL queries mapping global threat vectors.</li>
          </ul>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">KEY METRICS & OUTCOMES</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
            <div style="background: rgba(0,0,0,0.4); padding: 10px; border-left: 2px solid var(--color-accent); border-radius: 4px;">
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Total Attacks Captured</span>
              <div style="font-size: 1.2rem; font-weight: bold; color: var(--text-main);">14,000+ Attempts</div>
            </div>
            <div style="background: rgba(0,0,0,0.4); padding: 10px; border-left: 2px solid var(--color-primary); border-radius: 4px;">
              <span style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase;">Threat Origins</span>
              <div style="font-size: 1.2rem; font-weight: bold; color: var(--text-main);">45+ Countries</div>
            </div>
          </div>
        </div>

        <div>
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">SAMPLE KQL DETECTION RULE</h4>
          <pre style="background: #000; padding: 12px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto; color: #a8d1ff;"><code>SecurityEvent
| where EventID == 4625
| summarize Failures = count() by IpAddress, TargetAccount, bin(TimeGenerated, 5m)
| where Failures > 10
| project TimeGenerated, IpAddress, TargetAccount, Failures</code></pre>
        </div>
      `
    },
    ad: {
      title: "Active Directory Security Auditing & Enterprise Hardening",
      badge: "Identity Defense & Hardening",
      body: `
        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">PROJECT OVERVIEW</h4>
          <p>Built a multi-tier Active Directory Domain Services lab to simulate adversarial attack chains (Kerberoasting, AS-REP Roasting, Pass-the-Hash) and implement enterprise-grade defensive hardening.</p>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">DEFENSIVE AUDITING ACTIONS</h4>
          <ul style="padding-left: 20px; color: var(--text-muted);">
            <li><strong>BloodHound Attack Path Mapping:</strong> Identified shortest paths to Domain Admin and eliminated high-risk nested group memberships.</li>
            <li><strong>Kerberoasting Defense:</strong> Migrated SPNs to Group Managed Service Accounts (gMSA) with 128-character auto-rotating passwords, disabling legacy RC4-HMAC cipher.</li>
            <li><strong>Group Policy Hardening:</strong> Enforced CIS Level 1 benchmarks: disabled LLMNR/NBT-NS, activated SMB signing, and enforced Credential Guard.</li>
          </ul>
        </div>

        <div>
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">MITRE ATT&CK MAPPINGS</h4>
          <span class="tech-tag">T1558.003 - Kerberoasting</span>
          <span class="tech-tag">T1078 - Valid Accounts</span>
          <span class="tech-tag">T1069 - Permission Groups Discovery</span>
        </div>
      `
    },
    pcap: {
      title: "Enterprise PCAP Malware Beaconing & Network Forensics",
      badge: "Deep Packet Inspection",
      body: `
        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">PROJECT OVERVIEW</h4>
          <p>Conducted deep packet inspection (DPI) on compromised network PCAP files to identify malicious C2 traffic, extract exfiltrated data payloads, and engineer custom Snort NIDS detection signatures.</p>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">INVESTIGATION WORKFLOW</h4>
          <ul style="padding-left: 20px; color: var(--text-muted);">
            <li><strong>Traffic Dissection:</strong> Filtered HTTP/HTTPS streams, isolated anomalous GET/POST intervals indicative of CobaltStrike malleable C2 profiles.</li>
            <li><strong>Payload Extraction:</strong> Carved embedded executable binaries and base64 encoded strings transferred over raw TCP streams.</li>
            <li><strong>NIDS Signature Rule Creation:</strong> Authored Snort rules targeting custom user-agents and payload byte sequences.</li>
          </ul>
        </div>

        <div>
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">CUSTOM SNORT RULE CREATED</h4>
          <pre style="background: #000; padding: 12px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); font-family: var(--font-mono); font-size: 0.8rem; overflow-x: auto; color: #a8d1ff;"><code>alert tcp $HOME_NET any -> $EXTERNAL_NET $HTTP_PORTS (msg:"MALWARE-CNC CobaltStrike Beacon Detected"; flow:to_server,established; content:"/submit.php?id="; http_uri; sid:1000042; rev:1;)</code></pre>
        </div>
      `
    },
    threatintel: {
      title: "Automated Threat Intelligence & IOC Pipeline",
      badge: "Security Automation",
      body: `
        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">PROJECT OVERVIEW</h4>
          <p>Created an automated Python 3 pipeline to ingest raw security logs, extract Indicators of Compromise (IPs, MD5/SHA256 hashes, URLs) via regex, and query multi-vendor threat intel feeds in parallel.</p>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="color: var(--color-primary); font-family: var(--font-display); margin-bottom: 6px;">INTEGRATIONS & SPEED</h4>
          <ul style="padding-left: 20px; color: var(--text-muted);">
            <li><strong>Multi-API Triage:</strong> Seamless querying across VirusTotal, AbuseIPDB, and AlienVault OTX with rate-limiting & caching.</li>
            <li><strong>Automated Scoring:</strong> Calculates consolidated risk score (0-100) and formats a structured JSON/CSV report for Tier 1 SOC analysts.</li>
          </ul>
        </div>
      `
    }
  };

  const modalBackdrop = document.getElementById('cyber-modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close-btn');

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.cyberAudio) window.cyberAudio.playClick();
      const projKey = btn.getAttribute('data-project');
      const data = projectDetails[projKey];
      if (data && modalBackdrop) {
        modalTitle.innerText = data.title;
        modalBody.innerHTML = data.body;
        modalBackdrop.classList.add('active');
      }
    });
  });

  if (modalClose && modalBackdrop) {
    modalClose.addEventListener('click', () => {
      if (window.cyberAudio) window.cyberAudio.playClick();
      modalBackdrop.classList.remove('active');
    });

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('active');
      }
    });
  }

  // 6. Copy-to-Clipboard functionality
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          if (window.cyberAudio) window.cyberAudio.playSuccess();
          const orig = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> COPIED!';
          setTimeout(() => {
            btn.innerHTML = orig;
          }, 2000);
        });
      }
    });
  });
});