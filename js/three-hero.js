/**
 * Three.js 3D Rotating Cyber Shield + Floating Holographic Ring
 * Creates a dramatic 3D hero background element
 */

(function() {
  const container = document.getElementById('hero-3d-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Read theme color
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

  // --- SHIELD WIREFRAME (Icosahedron) ---
  const shieldGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const shieldMat = new THREE.MeshBasicMaterial({
    color: themeColor,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const shield = new THREE.Mesh(shieldGeo, shieldMat);
  scene.add(shield);

  // --- INNER GLOW SPHERE ---
  const glowGeo = new THREE.IcosahedronGeometry(1.2, 2);
  const glowMat = new THREE.MeshBasicMaterial({
    color: themeColor,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);

  // --- ORBITING RING 1 ---
  const ring1Geo = new THREE.TorusGeometry(2.2, 0.015, 16, 100);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: themeColor,
    transparent: true,
    opacity: 0.35
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 2.4;
  scene.add(ring1);

  // --- ORBITING RING 2 ---
  const ring2Geo = new THREE.TorusGeometry(2.6, 0.01, 16, 120);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: themeColor,
    transparent: true,
    opacity: 0.2
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 1.6;
  ring2.rotation.y = Math.PI / 4;
  scene.add(ring2);

  // --- FLOATING DATA DOTS ---
  const dotsCount = 60;
  const dotsGeo = new THREE.BufferGeometry();
  const dotsPos = new Float32Array(dotsCount * 3);
  for (let i = 0; i < dotsCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.0 + Math.random() * 1.2;
    dotsPos[i*3]     = r * Math.sin(phi) * Math.cos(theta);
    dotsPos[i*3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    dotsPos[i*3 + 2] = r * Math.cos(phi);
  }
  dotsGeo.setAttribute('position', new THREE.BufferAttribute(dotsPos, 3));
  const dotsMat = new THREE.PointsMaterial({
    color: themeColor,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });
  const dots = new THREE.Points(dotsGeo, dotsMat);
  scene.add(dots);

  // --- MOUSE INTERACTION ---
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

    // Update theme color every 2 seconds
    if (Math.floor(t) % 2 === 0) {
      themeColor = getThemeColor();
      shieldMat.color.copy(themeColor);
      glowMat.color.copy(themeColor);
      ring1Mat.color.copy(themeColor);
      ring2Mat.color.copy(themeColor);
      dotsMat.color.copy(themeColor);
    }

    // Shield rotation
    shield.rotation.x = t * 0.15 + mouseY * 0.3;
    shield.rotation.y = t * 0.2 + mouseX * 0.3;

    // Inner glow counter-rotation
    glow.rotation.x = -t * 0.1;
    glow.rotation.y = -t * 0.15;

    // Pulsing shield opacity
    shieldMat.opacity = 0.2 + Math.sin(t * 1.5) * 0.08;
    glowMat.opacity = 0.06 + Math.sin(t * 2) * 0.03;

    // Ring orbits
    ring1.rotation.z = t * 0.3;
    ring2.rotation.z = -t * 0.2;

    // Dots slow rotation
    dots.rotation.y = t * 0.05;
    dots.rotation.x = t * 0.03;

    renderer.render(scene, camera);
  }
  animate();

  // --- RESIZE HANDLING ---
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();
