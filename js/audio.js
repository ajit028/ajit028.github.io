/**
 * Cyber Audio FX Engine (Web Audio API Synthesizer)
 * Generates dynamic futuristic soundscapes without external audio files.
 */

class CyberAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playPowerUp();
    }
    return this.enabled;
  }

  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.1) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio context errors
    }
  }

  playClick() {
    this.playTone(1200, 'triangle', 0.04, 0.05);
  }

  playKeypress() {
    const freqs = [600, 750, 900, 1050];
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    this.playTone(f, 'sine', 0.02, 0.03);
  }

  playAlert() {
    if (!this.enabled || !this.ctx) return;
    this.playTone(880, 'sawtooth', 0.1, 0.08);
    setTimeout(() => this.playTone(660, 'sawtooth', 0.15, 0.08), 100);
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    this.playTone(523.25, 'sine', 0.08, 0.08); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.08, 0.08), 70); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.12, 0.08), 140); // G5
  }

  playPowerUp() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.35);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {}
  }
}

window.cyberAudio = new CyberAudioEngine();
