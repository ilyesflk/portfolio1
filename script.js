/* ============================================================
   ILIAS FALEK — Portfolio Script
   Three.js • GSAP • Interactions
   ============================================================ */

(() => {
  'use strict';

  /* ======================================
     1. CUSTOM CURSOR
     ====================================== */
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover expansion on interactive elements
  const interactives = document.querySelectorAll('a, button, .project-card, .filter-btn, input, textarea');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });


  /* ======================================
     2. NAVBAR SCROLL + HAMBURGER
     ====================================== */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileOverlay.classList.remove('open');
    });
  });


  /* ======================================
     3. TYPEWRITER EFFECT
     ====================================== */
  const typedEl  = document.getElementById('typedText');
  const phrases  = [
    'Frontend Developer',
    'Mobile App Builder',
    'Platform Architect',
    'PFE Project Specialist'
  ];
  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
      typedEl.textContent = current.substring(0, charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 35);
    } else {
      charIdx++;
      typedEl.textContent = current.substring(0, charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 80);
    }
  }
  setTimeout(typeLoop, 600);


  /* ======================================
     4. SCROLL REVEAL (Intersection Observer)
     ====================================== */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));


  /* ======================================
     5. ANIMATED STAT COUNTERS
     ====================================== */
  const statNums = document.querySelectorAll('.stat-number[data-count]');
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const end   = parseInt(el.dataset.count, 10);
        let current = 0;
        const step  = Math.ceil(end / 40);
        const timer = setInterval(() => {
          current += step;
          if (current >= end) { current = end; clearInterval(timer); }
          el.textContent = current + '+';
        }, 40);
        statObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObs.observe(el));


  /* ======================================
     6. SKILL BAR ANIMATION
     ====================================== */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillObs  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.style.width = bar.dataset.width + '%';
        skillObs.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(bar => skillObs.observe(bar));


  /* ======================================
     7. PROJECT FILTER
     ====================================== */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project card mouse tracking for radial gradient
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
  });


  /* ======================================
     8. GSAP ANIMATIONS
     ====================================== */
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.from('.hero-name', {
    opacity: 0, y: 60, scale: 0.92,
    duration: 1.2, ease: 'power3.out', delay: 0.3
  });
  gsap.from('.hero-subtitle', {
    opacity: 0, y: 30,
    duration: 1, ease: 'power3.out', delay: 0.7
  });
  gsap.from('.hero-cta', {
    opacity: 0, y: 30,
    duration: 1, ease: 'power3.out', delay: 1.0
  });

  // Section parallax
  document.querySelectorAll('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0, x: -40,
      duration: 0.9, ease: 'power2.out'
    });
  });


  /* ======================================
     9. THREE.JS — HERO SCENE
     ====================================== */
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 8);

  // --- Particle Field ---
  const particleCount = 1200;
  const particleGeom  = new THREE.BufferGeometry();
  const positions     = new Float32Array(particleCount * 3);
  const colors        = new Float32Array(particleCount * 3);

  const colorCyan   = new THREE.Color(0x00f0ff);
  const colorViolet = new THREE.Color(0xa855f7);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

    const c = Math.random() > 0.5 ? colorCyan : colorViolet;
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeom.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const particles = new THREE.Points(particleGeom, particleMat);
  scene.add(particles);

  // --- Glowing Neon Grid Floor ---
  const gridSize   = 80;
  const gridDiv    = 60;
  const gridHelper = new THREE.GridHelper(gridSize, gridDiv, 0x00f0ff, 0x00f0ff);
  gridHelper.position.y = -3;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity     = 0.08;
  gridHelper.material.depthWrite   = false;
  scene.add(gridHelper);

  // Secondary grid for depth
  const gridHelper2 = new THREE.GridHelper(gridSize, gridDiv / 2, 0xa855f7, 0xa855f7);
  gridHelper2.position.y = -3.01;
  gridHelper2.material.transparent = true;
  gridHelper2.material.opacity     = 0.04;
  gridHelper2.material.depthWrite   = false;
  scene.add(gridHelper2);

  // --- Floating Icosahedron ---
  const icoGeom = new THREE.IcosahedronGeometry(1.8, 1);
  const icoMat  = new THREE.MeshPhongMaterial({
    color:       0x00f0ff,
    emissive:    0x00f0ff,
    emissiveIntensity: 0.15,
    wireframe:   true,
    transparent: true,
    opacity:     0.55
  });
  const icosahedron = new THREE.Mesh(icoGeom, icoMat);
  icosahedron.position.set(3.5, 1, -2);
  scene.add(icosahedron);

  // Inner solid icosahedron
  const icoInnerGeom = new THREE.IcosahedronGeometry(1.2, 1);
  const icoInnerMat  = new THREE.MeshPhongMaterial({
    color:       0xa855f7,
    emissive:    0xa855f7,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity:     0.12,
    flatShading: true
  });
  const icoInner = new THREE.Mesh(icoInnerGeom, icoInnerMat);
  icoInner.position.copy(icosahedron.position);
  scene.add(icoInner);

  // --- Second Geometric Shape (Octahedron) ---
  const octGeom = new THREE.OctahedronGeometry(1.0, 0);
  const octMat  = new THREE.MeshPhongMaterial({
    color:       0xa855f7,
    emissive:    0xa855f7,
    emissiveIntensity: 0.15,
    wireframe:   true,
    transparent: true,
    opacity:     0.4
  });
  const octahedron = new THREE.Mesh(octGeom, octMat);
  octahedron.position.set(-4, 0.5, -3);
  scene.add(octahedron);

  // --- Torus Knot ---
  const torusGeom = new THREE.TorusKnotGeometry(0.6, 0.15, 80, 12, 2, 3);
  const torusMat  = new THREE.MeshPhongMaterial({
    color:       0xf0a500,
    emissive:    0xf0a500,
    emissiveIntensity: 0.1,
    wireframe:   true,
    transparent: true,
    opacity:     0.3
  });
  const torusKnot = new THREE.Mesh(torusGeom, torusMat);
  torusKnot.position.set(-2.5, 3, -5);
  scene.add(torusKnot);

  // --- Lights ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00f0ff, 1.5, 40);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xa855f7, 1.2, 40);
  pointLight2.position.set(-5, 3, -5);
  scene.add(pointLight2);

  const pointLight3 = new THREE.PointLight(0xf0a500, 0.8, 30);
  pointLight3.position.set(0, -2, 8);
  scene.add(pointLight3);

  // --- Mouse Parallax ---
  let targetRotX = 0, targetRotY = 0;
  document.addEventListener('mousemove', (e) => {
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.4;
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.4;
  });

  // --- Animation Loop ---
  const clock = new THREE.Clock();

  function animateHero() {
    requestAnimationFrame(animateHero);
    const t = clock.getElapsedTime();

    // Particles drift
    particles.rotation.y = t * 0.015;
    particles.rotation.x = Math.sin(t * 0.01) * 0.05;

    // Icosahedron rotation + float
    icosahedron.rotation.x = t * 0.2;
    icosahedron.rotation.y = t * 0.3;
    icosahedron.position.y = 1 + Math.sin(t * 0.8) * 0.4;
    icoInner.rotation.x = -t * 0.15;
    icoInner.rotation.y = -t * 0.25;
    icoInner.position.y = icosahedron.position.y;

    // Octahedron
    octahedron.rotation.x = t * 0.25;
    octahedron.rotation.z = t * 0.15;
    octahedron.position.y = 0.5 + Math.sin(t * 0.6 + 1) * 0.35;

    // Torus Knot
    torusKnot.rotation.x = t * 0.3;
    torusKnot.rotation.y = t * 0.2;
    torusKnot.position.y = 3 + Math.sin(t * 0.5 + 2) * 0.3;

    // Mouse parallax on camera
    camera.rotation.x += (targetRotX * 0.15 - camera.rotation.x) * 0.04;
    camera.rotation.y += (targetRotY * 0.15 - camera.rotation.y) * 0.04;

    // Grid subtle pulse
    gridHelper.material.opacity = 0.06 + Math.sin(t * 0.5) * 0.02;

    renderer.render(scene, camera);
  }
  animateHero();


  /* ======================================
     10. THREE.JS — SKILLS WAVE
     ====================================== */
  const skillsSection = document.getElementById('skills');
  const skillsCanvas  = document.getElementById('skills-canvas');
  const skillsRenderer = new THREE.WebGLRenderer({ canvas: skillsCanvas, antialias: true, alpha: true });
  skillsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function resizeSkills() {
    const rect = skillsSection.getBoundingClientRect();
    skillsRenderer.setSize(rect.width, rect.height);
    skillsCamera.aspect = rect.width / rect.height;
    skillsCamera.updateProjectionMatrix();
  }

  const skillsScene  = new THREE.Scene();
  const skillsCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  skillsCamera.position.set(0, 3, 6);
  skillsCamera.lookAt(0, 0, 0);

  // Ribbon / Wave plane
  const waveGeom = new THREE.PlaneGeometry(20, 8, 80, 40);
  const waveMat  = new THREE.MeshPhongMaterial({
    color:       0x00f0ff,
    emissive:    0x00f0ff,
    emissiveIntensity: 0.05,
    wireframe:   true,
    transparent: true,
    opacity:     0.06,
    side:        THREE.DoubleSide
  });
  const waveMesh = new THREE.Mesh(waveGeom, waveMat);
  waveMesh.rotation.x = -Math.PI / 2.5;
  waveMesh.position.y = -2;
  skillsScene.add(waveMesh);

  const skillsLight = new THREE.PointLight(0xa855f7, 1.0, 30);
  skillsLight.position.set(0, 5, 5);
  skillsScene.add(skillsLight);
  skillsScene.add(new THREE.AmbientLight(0xffffff, 0.1));

  const skillsClock = new THREE.Clock();
  function animateSkills() {
    requestAnimationFrame(animateSkills);
    const t = skillsClock.getElapsedTime();
    const pos = waveGeom.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const wave = Math.sin(x * 0.5 + t * 0.8) * 0.3
                 + Math.sin(y * 0.3 + t * 0.6) * 0.2;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;

    skillsRenderer.render(skillsScene, skillsCamera);
  }

  resizeSkills();
  animateSkills();


  /* ======================================
     11. WINDOW RESIZE
     ====================================== */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    resizeSkills();
  });


  /* ======================================
     12. CONTACT FORM (visual feedback)
     ====================================== */
  const contactForm = document.getElementById('contactForm');
  const sendBtn     = document.getElementById('sendBtn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendBtn.textContent = 'Sent! ✓';
    sendBtn.style.background = 'linear-gradient(135deg, #00f0ff, #22c55e)';
    setTimeout(() => {
      sendBtn.textContent = 'Send Message';
      sendBtn.style.background = '';
      contactForm.reset();
    }, 2500);
  });

})();
