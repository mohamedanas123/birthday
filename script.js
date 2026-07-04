'use strict';
/* ============================================================
   BIRTHDAY WEBSITE — script.js
   4-Page Flow: Surprise → Cake → Photos → Finale
   ============================================================ */

/* ── Canvas Setup ── */
const sakuraCanvas  = document.getElementById('sakuraCanvas');
const sCtx          = sakuraCanvas.getContext('2d');
const fxCanvas      = document.getElementById('fxCanvas');
const fCtx          = fxCanvas.getContext('2d');
const cursorCanvas  = document.getElementById('cursorCanvas');
const cCtx          = cursorCanvas.getContext('2d');

function resize() {
  sakuraCanvas.width  = fxCanvas.width  = cursorCanvas.width  = window.innerWidth;
  sakuraCanvas.height = fxCanvas.height = cursorCanvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ====================================================================
   HEART CURSOR TRAIL
   ==================================================================== */
const HEART_EMOJIS  = ['💕','💖','🌸','✨','💗','💞','🍅','⭐'];
let cursorParticles = [];
let lastCursorX = -999, lastCursorY = -999;

class CursorParticle {
  constructor(x, y) {
    this.x     = x + (Math.random() - 0.5) * 20;
    this.y     = y + (Math.random() - 0.5) * 20;
    this.emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    this.size  = 14 + Math.random() * 16;
    this.alpha = 1;
    this.vy    = -0.8 - Math.random() * 1.2;
    this.vx    = (Math.random() - 0.5) * 1.5;
    this.decay = 0.022 + Math.random() * 0.015;
    this.rot   = (Math.random() - 0.5) * 0.15;
    this.angle = 0;
  }
  update() {
    this.x     += this.vx;
    this.y     += this.vy;
    this.vy    += 0.04;          // gentle gravity
    this.angle += this.rot;
    this.alpha -= this.decay;
  }
  draw() {
    cCtx.save();
    cCtx.globalAlpha = Math.max(0, this.alpha);
    cCtx.font        = `${this.size}px serif`;
    cCtx.textAlign   = 'center';
    cCtx.textBaseline= 'middle';
    cCtx.translate(this.x, this.y);
    cCtx.rotate(this.angle);
    cCtx.fillText(this.emoji, 0, 0);
    cCtx.restore();
  }
}

// Cursor trail disabled — default cursor active
// Cursor canvas kept but unused
(function animateCursor() {
  cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  requestAnimationFrame(animateCursor);
})();


/* ====================================================================
   CINEMATIC LOADING SCREEN
   ==================================================================== */
(function initLoadScreen() {
  const petalEl = document.getElementById('loadPetals');
  const tagline = document.getElementById('loadTagline');
  const PETALS  = ['🌸','🌸','🌸','💕','✨','🍅','🌸','⭐','🌸'];

  // Spawn floating petals on the load screen
  function spawnLoadPetal() {
    const el = document.createElement('span');
    el.className  = 'load-petal';
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.bottom = '-30px';
    const dur = 6 + Math.random() * 8;
    el.style.animationDuration  = dur + 's';
    el.style.animationDelay     = Math.random() * 2 + 's';
    el.style.fontSize = (0.9 + Math.random() * 1.2) + 'rem';
    petalEl.appendChild(el);
    setTimeout(() => el.remove(), (dur + 3) * 1000);
  }
  for (let i = 0; i < 14; i++) setTimeout(spawnLoadPetal, i * 300);
  setInterval(spawnLoadPetal, 1200);

  // Type the tagline on load screen
  const TEXT = '🌸  A Special Surprise  🌸';
  let idx = 0;
  tagline.textContent = '';
  setTimeout(() => {
    const iv = setInterval(() => {
      tagline.textContent += Array.from(TEXT)[idx++];
      if (idx >= Array.from(TEXT).length) clearInterval(iv);
    }, 55);
  }, 400);
})();

function startExperience() {
  const screen = document.getElementById('loadScreen');
  const btn    = document.getElementById('loadStartBtn');
  // Button press ripple feel
  btn.style.transform = 'scale(0.95)';
  btn.style.transition = 'transform 0.15s ease';
  setTimeout(() => {
    btn.style.transform = '';
    screen.classList.add('exit');
    // Launch a burst to celebrate the start
    burst(window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(() => {
      screen.style.display = 'none';
    }, 1100);
  }, 150);
}


/* ====================================================================
   SAKURA PETALS
   ==================================================================== */
const PETAL_COLS = ['rgba(249,198,208,','rgba(232,131,154,','rgba(255,200,220,','rgba(242,184,128,'];
class Petal {
  constructor(initial) {
    this.reset(initial);
  }
  reset(initial = false) {
    this.x    = Math.random() * sakuraCanvas.width;
    this.y    = initial ? Math.random() * sakuraCanvas.height : -30;
    this.r    = 4 + Math.random() * 7;
    this.vx   = (Math.random() - 0.5) * 1.2;
    this.vy   = 0.6 + Math.random() * 1.1;
    this.rot  = Math.random() * Math.PI * 2;
    this.rotV = (Math.random() - 0.5) * 0.04;
    this.sway = Math.random() * Math.PI * 2;
    this.swS  = 0.018 + Math.random() * 0.02;
    this.swA  = 0.4 + Math.random() * 0.9;
    this.alp  = 0.45 + Math.random() * 0.5;
    this.col  = PETAL_COLS[Math.floor(Math.random() * PETAL_COLS.length)];
  }
  update() {
    this.sway += this.swS;
    this.x += this.vx + Math.sin(this.sway) * this.swA;
    this.y += this.vy;
    this.rot += this.rotV;
    if (this.y > sakuraCanvas.height + 40) this.reset();
  }
  draw() {
    sCtx.save();
    sCtx.translate(this.x, this.y);
    sCtx.rotate(this.rot);
    sCtx.globalAlpha = this.alp;
    sCtx.beginPath();
    sCtx.ellipse(0, 0, this.r, this.r * 0.5, 0, 0, Math.PI * 2);
    sCtx.fillStyle = `${this.col}0.9)`;
    sCtx.fill();
    sCtx.beginPath();
    sCtx.ellipse(-this.r * 0.2, -this.r * 0.2, this.r * 0.3, this.r * 0.18, -0.5, 0, Math.PI * 2);
    sCtx.fillStyle = 'rgba(255,255,255,0.45)';
    sCtx.fill();
    sCtx.restore();
  }
}

const petals = Array.from({ length: 80 }, () => new Petal(true));

(function animateSakura() {
  sCtx.clearRect(0, 0, sakuraCanvas.width, sakuraCanvas.height);
  petals.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateSakura);
})();

/* ====================================================================
   FIREWORKS / FX
   ==================================================================== */
let fwParts = [];
let fwActive = false;
let fwRaf;

class FWParticle {
  constructor(x, y, hue) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    this.x = x; this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = 0.011 + Math.random() * 0.012;
    this.gravity = 0.09;
    this.size = 2 + Math.random() * 3.5;
    this.hue = hue + (Math.random() - 0.5) * 50;
    this.sat = 80 + Math.random() * 20;
    this.lit = 55 + Math.random() * 30;
    this.trail = [];
  }
  update() {
    this.trail.push({ x: this.x, y: this.y, a: this.alpha });
    if (this.trail.length > 7) this.trail.shift();
    this.x += this.vx; this.y += this.vy;
    this.vy += this.gravity; this.vx *= 0.99;
    this.alpha -= this.decay;
  }
  draw() {
    const col = `hsl(${this.hue},${this.sat}%,${this.lit}%)`;
    this.trail.forEach((t, i) => {
      fCtx.save();
      fCtx.globalAlpha = t.a * (i / this.trail.length) * 0.35;
      fCtx.beginPath();
      fCtx.arc(t.x, t.y, this.size * (i / this.trail.length), 0, Math.PI * 2);
      fCtx.fillStyle = col;
      fCtx.fill();
      fCtx.restore();
    });
    fCtx.save();
    fCtx.globalAlpha = this.alpha;
    fCtx.shadowColor = col; fCtx.shadowBlur = 10;
    fCtx.beginPath();
    fCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    fCtx.fillStyle = col;
    fCtx.fill();
    fCtx.restore();
  }
}

function burst(x, y) {
  const hue = Math.random() * 360;
  for (let i = 0; i < 40; i++) fwParts.push(new FWParticle(x, y, hue));
  if (!fwActive) { fwActive = true; animateFW(); }
}

function animateFW() {
  fCtx.fillStyle = 'rgba(0,0,0,0.14)';
  fCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
  fwParts = fwParts.filter(p => p.alpha > 0.02);
  fwParts.forEach(p => { p.update(); p.draw(); });
  if (fwParts.length > 0) { fwRaf = requestAnimationFrame(animateFW); }
  else { fCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height); fwActive = false; }
}

function grandFinale() {
  const btn = document.querySelector('.finale-fireworks-btn');
  btn.textContent = '🎆 Happy Birthday Tomato!! 🍅💕';
  btn.disabled = true;
  btn.style.background = 'linear-gradient(135deg,#F5C842,#E8839A)';

  const W = fxCanvas.width, H = fxCanvas.height;
  const delays = [0, 300, 600, 900, 1200, 1600, 2000, 2500];
  delays.forEach(d => {
    setTimeout(() => burst(
      W * (0.15 + Math.random() * 0.7),
      H * (0.1  + Math.random() * 0.55)
    ), d);
  });
}

/* ====================================================================
   PAGE NAVIGATION
   ==================================================================== */
let currentPage = 1;

function goToPage(num) {
  const cur = document.getElementById(`page${currentPage}`);
  const next = document.getElementById(`page${num}`);
  if (!next || num === currentPage) return;

  cur.classList.add('exit');
  setTimeout(() => {
    cur.classList.add('hidden');
    cur.classList.remove('exit');
    next.classList.remove('hidden');
    next.getBoundingClientRect();
    currentPage = num;

    // Update page dots
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i + 1 === num);
    });

    if (num === 2) initPage2();
    if (num === 3) initPage3();
    if (num === 4) initPage4();
  }, 700);
}

/* ====================================================================
   PAGE 1 — SURPRISE REVEAL
   ==================================================================== */
(function initPage1() {
  // Burst stars around the name
  const burstEl = document.getElementById('burstStars');
  const emojis = ['🌸','✨','🎉','💕','⭐','🎀','🌟','🎈','🍅','💫'];
  const count = 16;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'bstar';
    el.textContent = emojis[i % emojis.length];
    const angle = (i / count) * 360;
    const dist = 140 + Math.random() * 100;
    el.style.setProperty('--bx', `${Math.cos(angle * Math.PI / 180) * dist}px`);
    el.style.setProperty('--by', `${Math.sin(angle * Math.PI / 180) * dist}px`);
    el.style.left = el.style.top = '50%';
    el.style.transform = 'translate(-50%,-50%)';
    el.style.animationDelay = (1.8 + i * 0.05) + 's';
    el.style.fontSize = (1.2 + Math.random() * 0.8) + 'rem';
    burstEl.appendChild(el);
  }

  // Type name letter by letter
  const nameEl = document.getElementById('wishName');
  const line1  = document.getElementById('wishLine1');
  line1.textContent = '✨  Happy Birthday  ✨';

  const NAME = 'Tomato! 🍅';
  let i = 0;
  nameEl.textContent = '';
  setTimeout(() => {
    const iv = setInterval(() => {
      // Use Array.from to handle emoji correctly
      const chars = Array.from(NAME);
      nameEl.textContent += chars[i++];
      if (i >= chars.length) {
        clearInterval(iv);
        // Burst fireworks on name complete
        setTimeout(() => {
          burst(window.innerWidth / 2, window.innerHeight * 0.35);
        }, 200);
      }
    }, 130);
  }, 2200);
})();

/* ====================================================================
   PAGE 2 — DRAG KNIFE CAKE CUTTING
   ==================================================================== */
function initPage2() {
  const stage       = document.getElementById('cakeStage');
  const knifeDrag   = document.getElementById('knifeDrag');
  const knifeGlow   = knifeDrag.querySelector('.knife-glow');
  const cutCanvas   = document.getElementById('cutCanvas');
  const cutCtx      = cutCanvas.getContext('2d');
  const cakeWhole   = document.getElementById('cakeWhole');
  const cakeCutWrap = document.getElementById('cakeCutWrap');
  const creamSplats = document.getElementById('creamSplats');
  const cutMessage  = document.getElementById('cutMessage');
  const progressBar = document.getElementById('cutProgressBar');
  const hintEl      = document.getElementById('cakeSubHint');

  let isDragging = false;
  let cutDone    = false;

  // Size canvas to stage
  function sizeCanvas() {
    cutCanvas.width  = stage.offsetWidth  || 280;
    cutCanvas.height = stage.offsetHeight || 340;
  }
  sizeCanvas();

  // Where the cake body starts/ends (relative to stage top)
  // Candles top ~18px, cake body starts around 80px from top
  const CAKE_TOP    = 80;   // px from stage top where cake begins
  const CAKE_BOTTOM = 310;  // px from stage top where plate ends
  const CAKE_TOTAL  = CAKE_BOTTOM - CAKE_TOP;
  const CUT_X       = (cutCanvas.width / 2);

  // Draw the cut line on canvas as knife moves
  function drawCutLine(progress) {
    cutCtx.clearRect(0, 0, cutCanvas.width, cutCanvas.height);
    if (progress <= 0) return;

    const lineEnd = CAKE_TOP + CAKE_TOTAL * progress;

    // Glow outer line
    cutCtx.save();
    cutCtx.beginPath();
    cutCtx.moveTo(CUT_X, CAKE_TOP);
    cutCtx.lineTo(CUT_X, lineEnd);
    cutCtx.strokeStyle = 'rgba(255,200,200,0.35)';
    cutCtx.lineWidth   = 10;
    cutCtx.lineCap     = 'round';
    cutCtx.stroke();

    // Sharp inner line
    cutCtx.beginPath();
    cutCtx.moveTo(CUT_X, CAKE_TOP);
    cutCtx.lineTo(CUT_X, lineEnd);
    cutCtx.strokeStyle = 'rgba(255, 80, 120, 0.9)';
    cutCtx.lineWidth   = 2.5;
    cutCtx.lineCap     = 'round';

    // Dashed cut effect
    cutCtx.setLineDash([6, 3]);
    cutCtx.stroke();
    cutCtx.setLineDash([]);
    cutCtx.restore();

    // Spark dot at knife tip
    cutCtx.beginPath();
    cutCtx.arc(CUT_X, lineEnd, 5, 0, Math.PI * 2);
    cutCtx.fillStyle = 'rgba(255,100,150,0.9)';
    cutCtx.shadowColor = '#FF6B9D';
    cutCtx.shadowBlur  = 12;
    cutCtx.fill();
    cutCtx.shadowBlur  = 0;
  }

  // Knife drag: get Y relative to stage
  function getY(e) {
    const r = stage.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return clientY - r.top;
  }

  function onDragStart(e) {
    if (cutDone) return;
    e.preventDefault();
    isDragging = true;
    knifeDrag.classList.add('dragging');
  }

  function onDragMove(e) {
    if (!isDragging || cutDone) return;
    e.preventDefault();

    const y = getY(e);
    // Clamp knife to cake area
    const clampedY = Math.max(0, Math.min(y, CAKE_BOTTOM + 10));

    // Move knife element
    knifeDrag.style.top  = (clampedY - 30) + 'px';    // offset for knife size
    knifeDrag.style.left = '50%';

    // Progress: how far through the cake (0 → 1)
    const rawProgress = (clampedY - CAKE_TOP) / CAKE_TOTAL;
    const progress = Math.max(0, Math.min(1, rawProgress));

    // Update progress bar
    progressBar.style.width = (progress * 100) + '%';

    // Update glow trail under knife
    const glowH = Math.max(0, clampedY - CAKE_TOP);
    knifeGlow.style.height = glowH + 'px';

    // Draw cut line on canvas
    drawCutLine(progress);

    // Blow candles at 30% progress
    if (progress > 0.3) blowCandles();

    // Trigger full cut at 100%
    if (progress >= 1) completeCut();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    knifeDrag.classList.remove('dragging');

    // Snap knife back up if not done
    if (!cutDone) {
      const progress = parseFloat(progressBar.style.width || '0') / 100;
      if (progress < 1) {
        // Not far enough — bounce back
        knifeDrag.style.transition = 'top 0.5s var(--spring), left 0.3s ease';
        knifeDrag.style.top  = '0px';
        knifeDrag.style.left = '50%';
        knifeGlow.style.height = '0px';
        setTimeout(() => { knifeDrag.style.transition = ''; }, 600);
        // Fade out cut line
        cutCtx.clearRect(0, 0, cutCanvas.width, cutCanvas.height);
        progressBar.style.width = '0%';
      }
    }
  }

  let candlesBlown = false;
  function blowCandles() {
    if (candlesBlown) return;
    candlesBlown = true;
    for (let i = 1; i <= 5; i++) {
      const f = document.getElementById(`cf${i}`);
      if (f) setTimeout(() => f.classList.add('blown'), i * 80);
    }
  }

  let cutTriggered = false;
  function completeCut() {
    if (cutTriggered) return;
    cutTriggered = true;
    cutDone      = true;
    isDragging   = false;
    knifeDrag.classList.remove('dragging');

    blowCandles();

    // Vibrate knife on completion
    knifeDrag.style.animation = 'none';
    knifeDrag.style.transition = 'transform 0.15s ease';
    let shakes = 0;
    const shakeIv = setInterval(() => {
      knifeDrag.style.transform = `translateX(-50%) translateX(${shakes % 2 === 0 ? 4 : -4}px)`;
      if (++shakes > 5) {
        clearInterval(shakeIv);
        // Hide knife & whole cake, show halves
        setTimeout(() => {
          knifeDrag.style.opacity = '0';
          knifeDrag.style.transition = 'opacity 0.4s ease';
          cakeWhole.style.opacity = '0';
          cakeWhole.style.transition = 'opacity 0.3s ease';

          setTimeout(() => {
            knifeDrag.classList.add('hidden');
            cakeWhole.classList.add('hidden');
            cakeCutWrap.classList.remove('hidden');
            creamSplats.classList.remove('hidden');

            // Show success text above candles
            const topMsg = document.getElementById('cutTopMessage');
            if (topMsg) { topMsg.classList.remove('hidden'); topMsg.classList.add('show'); }

            // Show next button
            setTimeout(() => {
              cutCanvas.style.opacity = '0';
              progressBar.style.width = '100%';
              cutMessage.classList.remove('hidden');
              if (hintEl) hintEl.style.display = 'none';
            }, 900);
          }, 350);
        }, 100);
      }
    }, 60);
  }

  // Attach events
  knifeDrag.addEventListener('mousedown',  onDragStart);
  knifeDrag.addEventListener('touchstart', onDragStart, { passive: false });
  document.addEventListener('mousemove',  onDragMove);
  document.addEventListener('touchmove',  onDragMove,  { passive: false });
  document.addEventListener('mouseup',    onDragEnd);
  document.addEventListener('touchend',   onDragEnd);
}



/* ====================================================================
   PAGE 3 — FALLING POLAROID PHOTOS
   ==================================================================== */
const PHOTO_CAPTIONS = [
  'My favourite 💕', 'Pure joy ✨', 'Us 🌸',
  'Always 💖', 'My world 🍅', 'Golden moments ⭐',
  'Sunshine 🌻', 'Forever 💕', 'Bliss 🌙',
  'My love 🎀', 'Perfect day 🌈', 'You & me 💞',
];

function initPage3() {
  const stage = document.getElementById('polaroidStage');
  stage.innerHTML = '';
  const TOTAL = 12;
  const stageW = stage.offsetWidth || window.innerWidth;

  // Layout: arrange in staggered rows
  const cols = window.innerWidth > 700 ? 4 : (window.innerWidth > 480 ? 3 : 2);
  const itemW = Math.min(160, (stageW - 40) / cols - 20);
  const rows = Math.ceil(TOTAL / cols);
  const stageH = rows * (itemW + 70) + 80;
  stage.style.minHeight = stageH + 'px';

  for (let i = 0; i < TOTAL; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const baseX = col * ((stageW - 32) / cols) + (stageW / cols / 2) - itemW / 2 - 4;
    const baseY = row * (itemW + 70) + 40;
    const jitterX = (Math.random() - 0.5) * 30;
    const jitterY = (Math.random() - 0.5) * 20;
    const rot = (Math.random() - 0.5) * 14;
    const rotStart = rot + (Math.random() - 0.5) * 40;
    const delay = i * 0.12 + Math.random() * 0.1;

    const card = document.createElement('div');
    card.className = 'polaroid';
    card.style.cssText = `
      left: ${baseX + jitterX}px;
      top: ${baseY + jitterY}px;
      --p-size: ${itemW}px;
      --p-rot: ${rot}deg;
      --p-rot-start: ${rotStart}deg;
      --p-y: 0px;
      --fall-dur: ${0.8 + Math.random() * 0.4}s;
      --fall-delay: ${delay}s;
      width: ${itemW}px;
    `;
    card.innerHTML = `
      <img src="photos/${i + 1}.jpg" alt="Memory ${i + 1}" 
           onerror="this.parentNode.classList.add('no-photo'); this.remove();">
      <div class="p-caption">${PHOTO_CAPTIONS[i]}</div>
    `;
    stage.appendChild(card);
  }

  // Add style for missing photos
  if (!document.getElementById('nophotoStyle')) {
    const style = document.createElement('style');
    style.id = 'nophotoStyle';
    style.textContent = `
      .polaroid.no-photo {
        background: linear-gradient(135deg, #FFB3C6, #FFDDE8);
        display: flex; align-items: center; justify-content: center;
        padding: 10px;
      }
      .polaroid.no-photo::before {
        content: '📸';
        font-size: 2.5rem;
        opacity: 0.5;
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -60%);
      }
    `;
    document.head.appendChild(style);
  }

  // Show "next" button after all photos have fallen
  setTimeout(() => {
    const btn = document.getElementById('photoDoneBtn');
    btn.classList.remove('hidden');
    btn.classList.add('show');
  }, TOTAL * 130 + 1200);
}

/* ====================================================================
   PAGE 4 — FINAL MESSAGE
   ==================================================================== */
function initPage4() {
  const starsEl = document.getElementById('finalStars');
  if (starsEl && !starsEl.dataset.built) {
    starsEl.dataset.built = '1';
    for (let i = 0; i < 90; i++) {
      const s = document.createElement('div');
      s.className = 'fstar';
      const size = 1 + Math.random() * 3;
      s.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        background: hsl(${310 + Math.random() * 60},70%,80%);
        animation-duration: ${1.2 + Math.random() * 2.5}s;
        animation-delay: ${Math.random() * 2}s;
      `;
      starsEl.appendChild(s);
    }
  }

  // Auto launch gentle fireworks on page enter
  setTimeout(() => {
    const W = fxCanvas.width, H = fxCanvas.height;
    [0, 600, 1200].forEach(d => {
      setTimeout(() => burst(W * (0.2 + Math.random() * 0.6), H * (0.1 + Math.random() * 0.5)), d);
    });
  }, 800);
}
