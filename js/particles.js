/**
 * Cyber Network Particle & Threat Constellation Canvas
 */

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.packets = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.numNodes = 55;
    this.themeColor = { r: 0, g: 240, b: 255 };

    this.resize();
    this.initNodes();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initNodes() {
    this.nodes = [];
    const count = Math.min(Math.floor((this.width * this.height) / 22000), 75);
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.5,
        baseRadius: Math.random() * 2 + 1.5,
        isHub: Math.random() > 0.85
      });
    }
  }

  updateColor() {
    const rootStyle = getComputedStyle(document.documentElement);
    const rgbStr = rootStyle.getPropertyValue('--color-primary-rgb').trim();
    if (rgbStr) {
      const parts = rgbStr.split(',').map(n => parseInt(n.trim()));
      if (parts.length === 3) {
        this.themeColor = { r: parts[0], g: parts[1], b: parts[2] };
      }
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initNodes();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    window.addEventListener('click', (e) => {
      this.createPulse(e.clientX, e.clientY);
    });
  }

  createPulse(x, y) {
    if (window.cyberAudio) window.cyberAudio.playClick();
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      this.packets.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * 3.5,
        vy: Math.sin(angle) * 3.5,
        life: 1.0,
        decay: 0.025
      });
    }
  }

  animate() {
    this.updateColor();
    this.ctx.clearRect(0, 0, this.width, this.height);

    const { r, g, b } = this.themeColor;

    // Draw and update packets (data telemetry)
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.packets.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.life})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;

    // Connect nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const nodeA = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeB = this.nodes[j];
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const maxDist = 130;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.25;
          this.ctx.beginPath();
          this.ctx.moveTo(nodeA.x, nodeA.y);
          this.ctx.lineTo(nodeB.x, nodeB.y);
          this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          this.ctx.lineWidth = nodeA.isHub || nodeB.isHub ? 1.2 : 0.6;
          this.ctx.stroke();

          // Random packet traversal
          if (Math.random() < 0.0003) {
            this.packets.push({
              x: nodeA.x,
              y: nodeA.y,
              vx: (nodeB.x - nodeA.x) / 40,
              vy: (nodeB.y - nodeA.y) / 40,
              life: 1.0,
              decay: 0.025
            });
          }
        }
      }

      // Mouse interactivity
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const mdx = nodeA.x - this.mouse.x;
        const mdy = nodeA.y - this.mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < this.mouse.radius) {
          const force = (1 - mDist / this.mouse.radius) * 1.5;
          nodeA.x += (mdx / mDist) * force;
          nodeA.y += (mdy / mDist) * force;

          // Mouse connection line
          const alpha = (1 - mDist / this.mouse.radius) * 0.4;
          this.ctx.beginPath();
          this.ctx.moveTo(nodeA.x, nodeA.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }

      // Update node positions
      nodeA.x += nodeA.vx;
      nodeA.y += nodeA.vy;

      if (nodeA.x < 0 || nodeA.x > this.width) nodeA.vx *= -1;
      if (nodeA.y < 0 || nodeA.y > this.height) nodeA.vy *= -1;

      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(nodeA.x, nodeA.y, nodeA.isHub ? nodeA.radius * 1.8 : nodeA.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = nodeA.isHub ? `rgba(${r}, ${g}, ${b}, 0.9)` : `rgba(${r}, ${g}, ${b}, 0.5)`;
      if (nodeA.isHub) {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
      }
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ParticleNetwork('particle-canvas');
});
