/**
 * Live SOC SIEM Telemetry Simulation & KQL Playground Engine
 */

class SocSimulationEngine {
  constructor() {
    this.feedContainer = document.getElementById('siem-live-feed');
    this.metricThreats = document.getElementById('metric-threats-blocked');
    this.metricPackets = document.getElementById('metric-packets-inspected');
    this.metricRules = document.getElementById('metric-rules-active');

    this.threatCount = 14280;
    this.packetCount = 1845200;
    
    this.sampleEvents = [
      { type: 'alert', proto: 'RDP (3389)', ip: '185.220.101.5', country: 'RU', msg: 'Multiple failed RDP logon attempts on Azure-Honeypot-VM (EventID 4625)' },
      { type: 'warning', proto: 'SMB (445)', ip: '192.168.1.140', country: 'INTERNAL', msg: 'Kerberoasting ticket request detected for SPN: MSSQLSvc/sql01.corp' },
      { type: 'alert', proto: 'DNS (53)', ip: '45.154.255.89', country: 'NL', msg: 'High entropy DNS query volume detected (Potential DNS Tunneling)' },
      { type: 'success', proto: 'HTTPS (443)', ip: '104.244.42.1', country: 'US', msg: 'Sentinel automated mitigation: IP quarantined via Network Security Group rule' },
      { type: 'alert', proto: 'TCP (4444)', ip: '194.26.29.112', country: 'BG', msg: 'Wireshark signature match: Meterpreter reverse TCP payload beacon detected' },
      { type: 'warning', proto: 'HTTP (80)', ip: '103.178.229.4', country: 'CN', msg: 'Web vulnerability scanner pattern detected (DIR-Buster user-agent match)' },
      { type: 'success', proto: 'SSH (22)', ip: '10.0.0.5', country: 'INTERNAL', msg: 'Privileged escalation audit complete: No anomalous sudoers modifications' }
    ];

    this.kqlQueries = {
      rdp: {
        query: `SecurityEvent
| where EventID == 4625 // Failed logon
| where TargetAccount !endswith "$"
| summarize FailedAttempts = count() by TargetAccount, IpAddress, bin(TimeGenerated, 5m)
| where FailedAttempts > 5
| order by FailedAttempts desc`,
        results: [
          { TargetAccount: "administrator", IpAddress: "185.220.101.5", FailedAttempts: 142, TimeGenerated: "Just now", Status: "BLOCKED (Auto-NSG)" },
          { TargetAccount: "root", IpAddress: "194.26.29.112", FailedAttempts: 88, TimeGenerated: "2m ago", Status: "QUARANTINED" },
          { TargetAccount: "user01", IpAddress: "103.178.229.4", FailedAttempts: 34, TimeGenerated: "4m ago", Status: "ALERT GENERATED" }
        ]
      },
      kerberoast: {
        query: `SecurityEvent
| where EventID == 4769 // Kerberos Ticket Requested
| where TicketOptions has "0x40810000" and TicketEncryptionType == "0x17" // RC4-HMAC weak cipher
| project TimeGenerated, TargetUserName, ServiceName, IpAddress
| order by TimeGenerated desc`,
        results: [
          { TargetUserName: "svc_backup", ServiceName: "MSSQLSvc/db01", IpAddress: "192.168.1.140", Status: "INVESTIGATING" },
          { TargetUserName: "svc_web", ServiceName: "HTTP/intranet", IpAddress: "192.168.1.155", Status: "FLAGGED T1558.003" }
        ]
      },
      pcap: {
        query: `CommonSecurityLog
| where DeviceVendor == "Snort_NIDS"
| where Activity has "C2_BEACONING" or Severity >= 7
| summarize AlertCount = count() by SourceIP, DestinationIP, Activity
| render barchart`,
        results: [
          { SourceIP: "192.168.1.205", DestinationIP: "45.154.255.89", Activity: "CobaltStrike C2 Beacon (HTTP GET)", AlertCount: 24, Severity: "HIGH" },
          { SourceIP: "192.168.1.112", DestinationIP: "194.26.29.112", Activity: "Metasploit Meterpreter Reverse TCP", AlertCount: 9, Severity: "CRITICAL" }
        ]
      }
    };

    this.startFeed();
    this.startMetrics();
    this.setupKqlRunner();
  }

  addLog(event) {
    if (!this.feedContainer) return;
    const now = new Date().toTimeString().split(' ')[0];
    const logEl = document.createElement('div');
    logEl.className = `siem-log-row ${event.type}`;
    logEl.innerHTML = `
      <div class="log-meta">
        <span>[${now}] ${event.proto}</span>
        <span>${event.country} [${event.ip}]</span>
      </div>
      <div class="log-msg">${event.msg}</div>
    `;

    this.feedContainer.insertBefore(logEl, this.feedContainer.firstChild);

    // Limit feed size
    if (this.feedContainer.children.length > 25) {
      this.feedContainer.removeChild(this.feedContainer.lastChild);
    }
  }

  startFeed() {
    // Initial batch
    for (let i = 0; i < 4; i++) {
      this.addLog(this.sampleEvents[i]);
    }

    // Interval stream
    setInterval(() => {
      const randomEvent = this.sampleEvents[Math.floor(Math.random() * this.sampleEvents.length)];
      this.addLog(randomEvent);
      this.threatCount += Math.floor(Math.random() * 3) + 1;
      this.packetCount += Math.floor(Math.random() * 45) + 10;
      if (this.metricThreats) this.metricThreats.innerText = this.threatCount.toLocaleString();
      if (this.metricPackets) this.metricPackets.innerText = this.packetCount.toLocaleString();
    }, 3800);
  }

  startMetrics() {
    if (this.metricThreats) this.metricThreats.innerText = this.threatCount.toLocaleString();
    if (this.metricPackets) this.metricPackets.innerText = this.packetCount.toLocaleString();
    if (this.metricRules) this.metricRules.innerText = "48 Verified Rules";
  }

  setupKqlRunner() {
    const tabs = document.querySelectorAll('.lab-tab');
    const codeBox = document.getElementById('kql-query-code');
    const runBtn = document.getElementById('run-kql-btn');
    const tableBody = document.getElementById('kql-table-body');
    const tableHead = document.getElementById('kql-table-head');

    if (!tabs || !codeBox || !runBtn || !tableBody) return;

    let activeTab = 'rdp';

    const renderQuery = (key) => {
      activeTab = key;
      const data = this.kqlQueries[key];
      if (!data) return;
      codeBox.textContent = data.query;
      this.renderTable(data.results);
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const queryKey = tab.getAttribute('data-query');
        renderQuery(queryKey);
        if (window.cyberAudio) window.cyberAudio.playClick();
      });
    });

    runBtn.addEventListener('click', () => {
      if (window.cyberAudio) window.cyberAudio.playSuccess();
      runBtn.innerText = "EXECUTING...";
      runBtn.style.opacity = "0.7";
      setTimeout(() => {
        runBtn.innerText = "EXECUTE KQL";
        runBtn.style.opacity = "1";
        const data = this.kqlQueries[activeTab];
        if (data) this.renderTable(data.results);
      }, 400);
    });

    // Initial render
    renderQuery('rdp');
  }

  renderTable(rows) {
    const tableBody = document.getElementById('kql-table-body');
    const tableHead = document.getElementById('kql-table-head');
    if (!tableBody || !tableHead || !rows || rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    tableHead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;

    tableBody.innerHTML = rows.map(r => {
      return `<tr>${headers.map(h => `<td>${r[h]}</td>`).join('')}</tr>`;
    }).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SocSimulationEngine();
});
