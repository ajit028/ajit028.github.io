/**
 * Three.js 3D Rotating Cyber Shield + Interactive 3D Card Tilt Engine
 */

(function() {
  const container = document.getElementById('hero-3d-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 4.2;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  function getThemeColor() {
    const s = getComputedStyle(document.documentElement);
    const rgb = s.getPropertyValue('--color-primary-rgb').trim();
    if (rgb) {
      const p = rgb.split(',').map(n => parseInt(n.trim()));
      if (p.length === 3) return new THREE.Color(p[0]/255, p[1]/255, p[2]/255);
    }
    return new THREE.Color(0x00f0ff);
  }

  let themeColor = getThemeColor();

  // --- OUTER SHIELD WIREFRAME ---
  const shieldGeo = new THREE.IcosahedronGeometry(1.65, 1);
  const shieldMat = new THREE.MeshBasicMaterial({
    color: themeColor,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });
  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  scene.add(shield);

  // --- INNER HOLOGRAPHIC CORE ---
  const glowGeo = new THREE.OctahedronGeometry(1.0, 2);
  const glowMat = new THREE.MeshBasicMaterial({
    color: themeColor,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);

  // --- ORBITING RING 1 ---
  const ring1Geo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: themeColor,
    transparent: true,
    opacity: 0.5
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 2.5;
  scene.add(ring1);

  // --- ORBITING RING 2 ---
  const ring2Geo = new THREE.TorusGeometry(2.8, 0.015, 16, 120);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: themeColor,
    transparent: true,
    opacity: 0.3
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 1.5;
  ring2.rotation.y = Math.PI / 4;
  scene.add(ring2);

  // --- FLOATING CYBER DATA PARTICLES ---
  const dotsCount = 80;
  const dotsGeo = new THREE.BufferGeometry();
  const dotsPos = new Float32Array(dotsCount * 3);
  for (let i = 0; i < dotsCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.0 + Math.random() * 1.5;
    dotsPos[i*3]     = r * Math.sin(phi) * Math.cos(theta);
    dotsPos[i*3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    dotsPos[i*3 + 2] = r * Math.cos(phi);
  }
  dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotsPos, 3));
  const dotsMat = new THREE.PointsMaterial({
    color: themeColor,
    size: 0.045,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true
  });
  const dots = new THREE.Points(dotsGeo, dotsMat);
  scene.add(dots);

  // --- MOUSE PARALLAX ---
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // --- ANIMATION LOOP ---
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    themeColor = getThemeColor();
    shieldMat.color.copy(themeColor);
    glowMat.color.copy(themeColor);
    ring1Mat.color.copy(themeColor);
    ring2Mat.color.copy(themeColor);
    dotsMat.color.copy(themeColor);

    shield.rotation.x = t * 0.18 + mouseY * 0.4;
    shield.rotation.y = t * 0.25 + mouseX * 0.4;

    glow.rotation.x = -t * 0.15;
    glow.rotation.y = -t * 0.2;

    shieldMat.opacity = 0.35 + Math.sin(t * 2) * 0.1;
    glowMat.opacity = 0.15 + Math.sin(t * 2.5) * 0.05;

    ring1.rotation.z = t * 0.35;
    ring2.rotation.z = -t * 0.25;

    dots.rotation.y = t * 0.08;
    dots.rotation.x = t * 0.04;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // --- 3D CARD TILT EFFECT FOR CARDS & CONTAINERS ---
  document.addEventListener('DOMContentLoaded', () => {
    const tiltCards = document.querySelectorAll('.project-card, .skill-category-card, .terminal-box, .siem-feed-box, .interactive-lab-section');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  });
})();
