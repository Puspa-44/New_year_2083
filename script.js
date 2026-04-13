/**
 * script.js — नयाँ वर्ष २०८३
 * Happy New Year 2083 | Bikram Sambat
 *
 * यस file मा भएका sections:
 *  1.  Custom Cursor          — Mouse pointer animation
 *  2.  Loader                 — Loading screen control
 *  3.  Starfield              — पृष्ठभूमिका तारा
 *  4.  Fireworks              — आतिशबाजी animation
 *  5.  Confetti / Ribbons     — रङ्गीन कागज उड्ने effect
 *  6.  Lanterns               — 🏮 तैरिने lanterns
 *  7.  Countdown Timer        — नयाँ वर्षसम्म countdown
 *  8.  Card Mouse Glow        — Card hover glow effect
 *  9.  Scroll Reveal          — Scroll गर्दा cards देखिने
 */


/* ════════════════════════════════════════════════════════
   1. CUSTOM CURSOR
   सामान्य pointer हटाएर golden dot र ring देखाउँछ
════════════════════════════════════════════════════════ */

const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

// Mouse सर्दा cursor follow गर्छ
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  cursorRing.style.left = e.clientX + 'px';
  cursorRing.style.top  = e.clientY + 'px';
});

// Click गर्दा cursor ठूलो हुन्छ
document.addEventListener('mousedown', () => {
  cursor.style.transform     = 'translate(-50%, -50%) scale(1.8)';
  cursorRing.style.width  = '44px';
  cursorRing.style.height = '44px';
});

// Click छोड्दा सामान्य size मा फर्किन्छ
document.addEventListener('mouseup', () => {
  cursor.style.transform     = 'translate(-50%, -50%) scale(1)';
  cursorRing.style.width  = '30px';
  cursorRing.style.height = '30px';
});


/* ════════════════════════════════════════════════════════
   2. LOADER
   Page load हुँदा progress bar र % counter चलाउँछ
════════════════════════════════════════════════════════ */

let progress = 0;
const pctEl  = document.getElementById('ldpct');

// Progress counter — तीव्र गतिमा बढ्छ र १०० मा रोकिन्छ
const progressInterval = setInterval(() => {
  progress += Math.random() * 10 + 3;
  if (progress >= 100) {
    progress = 100;
    clearInterval(progressInterval);
  }
  pctEl.textContent = Math.floor(progress) + '%';
}, 70);

// Page पूर्ण load भएपछि loader hide हुन्छ
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('out');
  }, 2800); // 2.8 second पछि loader हटाउँछ
});


/* ════════════════════════════════════════════════════════
   3. STARFIELD (पृष्ठभूमिका तारा)
   Background canvas मा चम्किने र चल्ने तारा
════════════════════════════════════════════════════════ */

(function initStarfield() {
  const canvas = document.getElementById('bg-c');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  // Screen resize हुँदा canvas र तारा update हुन्छन्
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    // नयाँ size अनुसार तारा बनाउँछ
    stars = Array.from({ length: 280 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.8 + 0.1,   // radius
      a:  Math.random(),                 // opacity
      da: (Math.random() - 0.5) * 0.008,// opacity change rate — टिमटिमाउने
      dx: (Math.random() - 0.5) * 0.04  // horizontal drift
    }));
  }

  resize();
  window.addEventListener('resize', resize);

  function drawStars() {
    ctx.clearRect(0, 0, W, H);

    stars.forEach(star => {
      // Opacity oscillate गराउँछ — टिमटिमाउने effect
      star.a += star.da;
      if (star.a < 0 || star.a > 1) star.da *= -1;

      // बिस्तारै सर्छ
      star.x += star.dx;
      if (star.x < 0) star.x = W;
      if (star.x > W) star.x = 0;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.a})`;
      ctx.fill();
    });

    requestAnimationFrame(drawStars);
  }

  drawStars();
})();


/* ════════════════════════════════════════════════════════
   4. FIREWORKS (आतिशबाजी)
   Automatically fireworks burst हुन्छन्
════════════════════════════════════════════════════════ */

(function initFireworks() {
  const canvas = document.getElementById('fw-c');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // रङहरूको list
  const COLORS = [
    '#FFD700', '#FF1744', '#00E5FF', '#B5FF00',
    '#FF6B9D', '#BF00FF', '#FF8C00', '#ffffff',
    '#FFF1A0', '#FF6D00'
  ];

  const particles = []; // सबै particles यहाँ store हुन्छन्

  // एउटा particle (spark) को class
  class Particle {
    constructor(x, y, color, isRing = false) {
      this.x = x; this.y = y;
      this.color = color;
      this.isRing = isRing;

      // Ring particles धेरै ढिलो उड्छन्
      const speed = isRing
        ? Math.random() * 3  + 0.5
        : Math.random() * 7  + 2;
      const angle = Math.random() * Math.PI * 2;

      this.vx   = Math.cos(angle) * speed;
      this.vy   = Math.sin(angle) * speed;
      this.r    = isRing ? Math.random() * 2 + 0.5 : Math.random() * 3.5 + 1;
      this.life  = 1;
      this.decay = isRing
        ? Math.random() * 0.015 + 0.008
        : Math.random() * 0.020 + 0.012;
      this.trail = []; // पुरानो position राख्छ — पुच्छर effect
    }

    update() {
      // Trail — पुरानो positions save गर्छ
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 12) this.trail.shift();

      this.x  += this.vx;
      this.y  += this.vy;
      this.vy += this.isRing ? 0.04 : 0.12; // gravity
      this.vx *= 0.98; // air resistance
      this.life -= this.decay;
    }

    draw() {
      ctx.save();

      // Trail (पुच्छर) draw गर्छ
      this.trail.forEach((pos, i) => {
        const trailAlpha = (i / this.trail.length) * this.life * 0.45;
        ctx.globalAlpha = trailAlpha;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, this.r * (i / this.trail.length), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      });

      // मुख्य particle
      ctx.globalAlpha  = this.life;
      ctx.shadowBlur   = 14;
      ctx.shadowColor  = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();

      ctx.restore();
    }
  }

  // एउटा firework burst बनाउँछ
  function burst(x, y) {
    const color1 = COLORS[Math.floor(Math.random() * COLORS.length)];
    const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
    const count  = Math.floor(Math.random() * 90 + 70);

    // मुख्य particles
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y, color1));

    // Ring particles — ढिलो बाहिर फैलिन्छन्
    for (let i = 0; i < 35; i++) particles.push(new Particle(x, y, color2, true));

    // Sparkle ring — exactly circular burst
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      const p = new Particle(x, y, '#ffffff');
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.r  = 1;
      p.decay = 0.025;
      particles.push(p);
    }
  }

  let lastBurstTime = 0;

  function animationLoop(timestamp) {
    // Trail effect — पूर्णतः clear नगरेर धुवाँ जस्तो देखाउँछ
    ctx.fillStyle = 'rgba(2, 2, 9, 0.15)';
    ctx.fillRect(0, 0, W, H);

    // हरेक ०.९ second मा नयाँ burst
    if (timestamp - lastBurstTime > 900) {
      burst(
        Math.random() * W * 0.82 + W * 0.09,
        Math.random() * H * 0.48 + H * 0.04
      );
      // कहिलेकाहीं एकसाथ २-३ burst
      if (Math.random() > 0.5)
        setTimeout(() => burst(Math.random() * W * 0.82 + W * 0.09, Math.random() * H * 0.42 + H * 0.04), 280);
      if (Math.random() > 0.65)
        setTimeout(() => burst(Math.random() * W * 0.82 + W * 0.09, Math.random() * H * 0.42 + H * 0.04), 560);

      lastBurstTime = timestamp;
    }

    // सबै particles update र draw गर्छ, सकिएका हटाउँछ
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(animationLoop);
  }

  requestAnimationFrame(animationLoop);
})();


/* ════════════════════════════════════════════════════════
   5. CONFETTI / RIBBONS (रङ्गीन कागज)
   माथिबाट झर्ने रङ्गीन ribbon र confetti
════════════════════════════════════════════════════════ */

(function initRibbons() {
  const canvas = document.getElementById('ribbon-c');
  const ctx    = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    '#FFD700', '#FF6B9D', '#00E5FF', '#B5FF00',
    '#BF00FF', '#FF1744', '#FFF1A0', '#FF8C00', '#ffffff'
  ];

  const ribbons = [];

  class Ribbon {
    constructor(preplace = false) { this.reset(preplace); }

    // Reset — नयाँ position र property set गर्छ
    reset(preplace = false) {
      this.x    = Math.random() * W;
      this.y    = preplace ? Math.random() * H : -20; // सुरुमा randomly place वा माथिबाट
      this.w    = Math.random() * 14 + 4;
      this.h    = Math.random() * 20 + 7;
      this.vx   = (Math.random() - 0.5) * 1;     // horizontal drift
      this.vy   = Math.random() * 2.2 + 0.6;     // fall speed
      this.rot  = Math.random() * Math.PI * 2;   // rotation
      this.drot = (Math.random() - 0.5) * 0.1;  // rotation speed
      this.color= COLORS[Math.floor(Math.random() * COLORS.length)];
      this.osc  = Math.random() * Math.PI * 2;   // oscillation phase
      this.freq = Math.random() * 0.04 + 0.01;   // oscillation frequency
      this.alpha= Math.random() * 0.55 + 0.25;   // transparency
      this.type = Math.random() > 0.5 ? 'rect' : 'ellipse'; // आकार
    }

    update() {
      this.osc += this.freq;
      // बाँया-दाँया oscillate गर्दै तल झर्छ
      this.x += this.vx + Math.sin(this.osc) * 0.9;
      this.y += this.vy;
      this.rot += this.drot;
      // Screen बाहिर गएपछि माथिबाट फेरि आउँछ
      if (this.y > H + 25) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      if (this.type === 'rect') {
        ctx.rect(-this.w / 2, -this.h / 2, this.w, this.h);
      } else {
        ctx.ellipse(0, 0, this.w / 2, this.h / 2, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    }
  }

  // १२० वटा ribbon बनाउँछ — सुरुमा screen मा randomly place गर्छ
  for (let i = 0; i < 120; i++) ribbons.push(new Ribbon(true));

  function drawRibbons() {
    ctx.clearRect(0, 0, W, H);
    ribbons.forEach(r => { r.update(); r.draw(); });
    requestAnimationFrame(drawRibbons);
  }

  drawRibbons();
})();


/* ════════════════════════════════════════════════════════
   6. LANTERNS (तैरिने बत्ती)
   Hero section मा 🏮 🪔 ✨ माथि उड्छन्
════════════════════════════════════════════════════════ */

const heroSection = document.querySelector('.hero');
const LANTERN_EMOJIS = ['🏮', '🕯️', '✨', '🌟', '⭐', '🪔'];

function spawnLantern() {
  const el = document.createElement('div');
  el.className = 'lantern';
  el.textContent = LANTERN_EMOJIS[Math.floor(Math.random() * LANTERN_EMOJIS.length)];

  const duration = Math.random() * 12 + 10; // १०-२२ second उड्छ
  const size     = Math.random() * 1.8 + 0.9;
  const glowSize = Math.round(size * 8);

  el.style.cssText = `
    left:       ${Math.random() * 100}vw;
    bottom:     -60px;
    font-size:  ${size}rem;
    animation:  lanUp ${duration}s linear forwards;
    opacity:    0;
    filter:     drop-shadow(0 0 ${glowSize}px rgba(255, 160, 0, 0.8));
  `;

  heroSection.appendChild(el);

  // Animation सकिएपछि DOM बाट हटाउँछ — memory सफा राख्न
  setTimeout(() => el.remove(), (duration + 1) * 1000);
}

// शुरुमा ५ वटा lantern spawn गर्छ
for (let i = 0; i < 5; i++) setTimeout(spawnLantern, i * 400);

// हरेक १.६ second मा नयाँ lantern थपिन्छ
setInterval(spawnLantern, 1600);


/* ════════════════════════════════════════════════════════
   7. COUNTDOWN TIMER
   बैशाख १, २०८३ (April 14, 2026) सम्म countdown
   नयाँ वर्ष आइसकेपछि special message देखाउँछ
════════════════════════════════════════════════════════ */

(function initCountdown() {
  // बैशाख १, २०८३ को मध्यरात (Nepal time = UTC+5:45)
  // April 14, 2026 00:00:00 NPT = April 13, 2026 18:15:00 UTC
  const TARGET_DATE = new Date('2026-04-14T00:00:00+05:45');

  const cdGrid    = document.getElementById('cd-grid');
  const cdArrived = document.getElementById('cd-arrived');

  // Number लाई दुई digit मा बनाउँछ — "5" → "05"
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  // Element को text update गर्छ र flip animation चलाउँछ
  function updateElement(id, value) {
    const el = document.getElementById(id);
    const formatted = pad(value);
    if (el.textContent !== formatted) {
      el.textContent = formatted;
      // Animation restart गर्न class हटाएर फेरि थप्छ
      el.classList.remove('tick');
      void el.offsetWidth; // reflow — animation reset
      el.classList.add('tick');
    }
  }

  function tick() {
    const now  = new Date();
    let diff   = TARGET_DATE - now; // milliseconds remaining

    // नयाँ वर्ष आइसकेको छ!
    if (diff <= 0) {
      cdGrid.hidden    = true;
      cdArrived.hidden = false;
      return; // Timer रोक्छ
    }

    // समय calculate गर्छ
    const days    = Math.floor(diff / 86400000); diff %= 86400000;
    const hours   = Math.floor(diff / 3600000);  diff %= 3600000;
    const minutes = Math.floor(diff / 60000);    diff %= 60000;
    const seconds = Math.floor(diff / 1000);

    updateElement('cd-d', days);
    updateElement('cd-h', hours);
    updateElement('cd-m', minutes);
    updateElement('cd-s', seconds);
  }

  tick(); // पहिलो पटक तुरुन्त चलाउँछ
  setInterval(tick, 1000); // हरेक १ second मा update
})();


/* ════════════════════════════════════════════════════════
   8. CARD MOUSE GLOW
   Wish cards hover गर्दा mouse position मा glow देखाउँछ
   CSS variable --mx र --my को माध्यमबाट
════════════════════════════════════════════════════════ */

document.querySelectorAll('.w-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    // Card भित्रको mouse position percentage मा calculate गर्छ
    const xPercent = ((e.clientX - rect.left) / rect.width  * 100) + '%';
    const yPercent = ((e.clientY - rect.top)  / rect.height * 100) + '%';
    card.style.setProperty('--mx', xPercent);
    card.style.setProperty('--my', yPercent);
  });
});


/* ════════════════════════════════════════════════════════
   9. SCROLL REVEAL
   Cards scroll गर्दा slide-up animation सँग देखिन्छन्
   IntersectionObserver — efficient र modern approach
════════════════════════════════════════════════════════ */

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // data-d attribute बाट delay लिन्छ (milliseconds)
      const delay = parseInt(entry.target.dataset.d || 0);
      setTimeout(() => {
        entry.target.classList.add('vis'); // 'vis' class ले animate गर्छ
      }, delay);
      // एकपटक देखाएपछि observe रोक्छ — performance राम्रो हुन्छ
      scrollObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1 // १०% देखिँदा trigger हुन्छ
});

// सबै wish cards लाई observe गर्छ
document.querySelectorAll('.w-card').forEach(card => {
  scrollObserver.observe(card);
});