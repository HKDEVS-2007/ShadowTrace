/* ================================================================
   THE THREE BUGS — 3D ROAMING CHARACTERS & CONTINUOUS LOGO ENGINE
   ================================================================ */

(function () {
  'use strict';

  // Config & State
  const BUGS_CONFIG = [
    {
      id: 'specs',
      name: 'Bit',
      role: 'Lead Analyst 👓',
      img: '/static/images/bug_specs.png',
      width: 100,
      height: 115,
      color: '#22d3ee',
      glow: 'rgba(34, 211, 238, 0.6)',
      quotes: [
        "Analyzing telemetry data streams... 🔬",
        "Inspecting packet headers! 🔍",
        "Look at those live KPI metrics! 📊",
        "Zero undetected anomalies on my watch! 🛡️",
        "The Three Bugs are scanning the perimeter! ⚡",
        "System latency is optimal. Great job team!"
      ]
    },
    {
      id: 'hacker',
      name: 'Glitch',
      role: 'Exploit Hunter </> 🎧',
      img: '/static/images/bug_hacker.png',
      width: 110,
      height: 118,
      color: '#8b5cf6',
      glow: 'rgba(139, 92, 246, 0.7)',
      quotes: [
        "Decrypting suspicious payloads... </> 💻",
        "My headphones filter out the network noise!",
        "Rule 2 triggered! Dissecting the payload now. 🚨",
        "Countermeasures compiled in 0.03 seconds! ⚡",
        "The Three Bugs SOC is active 24/7!",
        "No malware slips past this keyboard! ⌨️"
      ]
    },
    {
      id: 'detective',
      name: 'Cipher',
      role: 'Threat Intel 📝',
      img: '/static/images/bug_detective.png',
      width: 95,
      height: 116,
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.65)',
      quotes: [
        "Noting down suspicious IP patterns... 📝",
        "Cross-referencing threat indicators! 🧐",
        "Hmm, repeated failed logins within 5 minutes? 🔍",
        "Case filed for The Three Bugs investigation! 📂",
        "Connecting the dots across access timestamps...",
        "High confidence threat flagged! 🎯"
      ]
    }
  ];

  let speedMultiplier = 1.35; // Default "Fast" speed
  let isSquadFormation = false;
  let isPaused = false;
  let isHidden = false;
  let stageEl = null;
  let hudEl = null;
  let bugs = [];
  let mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 };
  let lastTime = performance.now();

  // Mouse tracking
  window.addEventListener('mousemove', (e) => {
    mouse.vx = e.clientX - mouse.lastX;
    mouse.vy = e.clientY - mouse.lastY;
    mouse.lastX = mouse.x = e.clientX;
    mouse.lastY = mouse.y = e.clientY;
  }, { passive: true });

  class BugEntity {
    constructor(cfg, index) {
      this.cfg = cfg;
      this.index = index;

      // Dimensions & Positioning
      const pad = 80;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.x = pad + Math.random() * (w - pad * 2);
      this.y = pad + Math.random() * (h - pad * 2);
      this.z = (Math.random() - 0.5) * 40; // 3D depth

      // Velocity & Target
      this.vx = (Math.random() - 0.5) * 3;
      this.vy = (Math.random() - 0.5) * 2.5;
      this.vz = (Math.random() - 0.5) * 1.5;
      this.tx = this.x;
      this.ty = this.y;
      this.tz = 0;

      // 3D Angles
      this.rotY = this.vx >= 0 ? 0 : 180;
      this.targetRotY = this.rotY;
      this.rotX = 0;
      this.rotZ = 0;
      this.hoverPhase = Math.random() * Math.PI * 2;
      this.flipProgress = 0; // for 360 backflip

      // Dragging state
      this.isDragging = false;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.lastDragX = 0;
      this.lastDragY = 0;
      this.dragVx = 0;
      this.dragVy = 0;

      // Perch & Speech timers
      this.perchTimer = 4 + Math.random() * 8;
      this.isPerched = false;
      this.perchTargetEl = null;
      this.bubbleTimer = null;

      // Build DOM
      this.createDOM();
      this.bindEvents();
    }

    createDOM() {
      const el = document.createElement('div');
      el.className = `bug-entity bug-${this.cfg.id}`;
      el.style.width = `${this.cfg.width}px`;
      el.style.height = `${this.cfg.height}px`;

      el.innerHTML = `
        <div class="bug-floor-shadow"></div>
        <div class="bug-body">
          <div class="bug-aura-ring"></div>
          <img src="${this.cfg.img}" alt="${this.cfg.name}" class="bug-sprite" draggable="false" />
        </div>
        <div class="bug-nametag">
          <span class="bug-nametag-icon">🐞</span>
          <span>${this.cfg.name}</span>
          <span class="bug-nametag-role">${this.cfg.role}</span>
        </div>
        <div class="bug-bubble"></div>
      `;

      stageEl.appendChild(el);
      this.el = el;
      this.bodyEl = el.querySelector('.bug-body');
      this.spriteEl = el.querySelector('.bug-sprite');
      this.shadowEl = el.querySelector('.bug-floor-shadow');
      this.bubbleEl = el.querySelector('.bug-bubble');
    }

    bindEvents() {
      // Pointer drag & click
      let downPos = { x: 0, y: 0 };
      let hasDragged = false;

      this.el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        this.isDragging = true;
        hasDragged = false;
        downPos = { x: e.clientX, y: e.clientY };
        this.dragStartX = e.clientX - this.x;
        this.dragStartY = e.clientY - this.y;
        this.lastDragX = e.clientX;
        this.lastDragY = e.clientY;
        this.dragVx = 0;
        this.dragVy = 0;
        this.el.setPointerCapture(e.pointerId);
        e.stopPropagation();
      });

      this.el.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;
        const dx = e.clientX - downPos.x;
        const dy = e.clientY - downPos.y;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDragged = true;

        this.x = e.clientX - this.dragStartX;
        this.y = e.clientY - this.dragStartY;
        this.dragVx = e.clientX - this.lastDragX;
        this.dragVy = e.clientY - this.lastDragY;
        this.lastDragX = e.clientX;
        this.lastDragY = e.clientY;
      });

      const onPointerUp = (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;
        try { this.el.releasePointerCapture(e.pointerId); } catch (_) {}

        if (hasDragged) {
          // Release with throw inertia
          this.vx = Math.max(-14, Math.min(14, this.dragVx * 0.9));
          this.vy = Math.max(-14, Math.min(14, this.dragVy * 0.9));
        } else {
          // Click! Celebration flip + speech bubble
          this.celebrate();
        }
      };

      this.el.addEventListener('pointerup', onPointerUp);
      this.el.addEventListener('pointercancel', onPointerUp);

      // Context thought bubble on double-click
      this.el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        this.sayRandomQuote(true);
        this.celebrate();
      });
    }

    celebrate() {
      this.flipProgress = 1.0;
      this.spawnParticles();
      this.sayRandomQuote();
    }

    say(text, durationMs = 3800) {
      if (!this.bubbleEl) return;
      this.bubbleEl.textContent = text;
      this.bubbleEl.classList.add('active');
      if (this.bubbleTimer) clearTimeout(this.bubbleTimer);
      this.bubbleTimer = setTimeout(() => {
        this.bubbleEl.classList.remove('active');
      }, durationMs);
    }

    sayRandomQuote(force = false) {
      if (!force && this.bubbleEl.classList.contains('active')) return;
      const q = this.cfg.quotes[Math.floor(Math.random() * this.cfg.quotes.length)];
      this.say(q);
    }

    spawnParticles() {
      const rect = this.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const symbols = ['✨', '⚡', '💻', '🔍', '🛡️', '👾'];

      for (let i = 0; i < 7; i++) {
        const p = document.createElement('div');
        p.className = 'bug-particle';
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        p.textContent = sym;
        p.style.fontSize = `${12 + Math.random() * 8}px`;
        p.style.left = `${cx}px`;
        p.style.top = `${cy}px`;
        const angle = Math.random() * Math.PI * 2;
        const dist = 45 + Math.random() * 55;
        p.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
        p.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 900);
      }
    }

    update(dt) {
      if (isHidden || isPaused) return;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      this.hoverPhase += dt * 3.5;

      if (!this.isDragging) {
        // Squad formation logic vs autonomous roaming
        if (isSquadFormation) {
          const centerX = screenW / 2;
          const centerY = screenH / 2 - 40;
          const offsets = [
            { x: -130, y: -20, z: 20 },  // Bit (left wing)
            { x: 0,    y: -50, z: 50 },  // Glitch (vanguard center)
            { x: 130,  y: -20, z: 20 }   // Cipher (right wing)
          ];
          const off = offsets[this.index] || { x: 0, y: 0, z: 0 };
          this.tx = centerX + off.x;
          this.ty = centerY + off.y;
          this.tz = off.z;

          // Smooth gather
          this.vx += (this.tx - this.x) * 0.08;
          this.vy += (this.ty - this.y) * 0.08;
          this.vz += (this.tz - this.z) * 0.08;
          this.vx *= 0.82;
          this.vy *= 0.82;
          this.vz *= 0.82;
          this.targetRotY = 0;
        } else {
          // Autonomous roaming & POI perching
          this.perchTimer -= dt;
          if (this.perchTimer <= 0) {
            this.togglePerch();
          }

          if (this.isPerched && this.perchTargetEl) {
            // Hover near POI
            const rect = this.perchTargetEl.getBoundingClientRect();
            this.tx = rect.left + rect.width / 2 - this.cfg.width / 2;
            this.ty = rect.top - this.cfg.height * 0.85;
            this.tz = 30;

            this.vx += (this.tx - this.x) * 0.05;
            this.vy += (this.ty - this.y) * 0.05;
            this.vz += (this.tz - this.z) * 0.05;
            this.vx *= 0.84;
            this.vy *= 0.84;
            this.vz *= 0.84;
          } else {
            // Organic wander physics
            // Random steering impulses
            if (Math.random() < 0.035) {
              const speed = (2.2 + Math.random() * 2.5) * speedMultiplier;
              const angle = Math.random() * Math.PI * 2;
              this.vx += Math.cos(angle) * speed;
              this.vy += Math.sin(angle) * speed;
              this.vz += (Math.random() - 0.5) * 1.5;
            }

            // Mouse avoidance & interaction
            const dxM = this.x + this.cfg.width / 2 - mouse.x;
            const dyM = this.y + this.cfg.height / 2 - mouse.y;
            const distM = Math.sqrt(dxM * dxM + dyM * dyM);

            if (distM < 130 && distM > 0) {
              const pushForce = (130 - distM) / 130 * 4.5 * speedMultiplier;
              this.vx += (dxM / distM) * pushForce;
              this.vy += (dyM / distM) * pushForce;
            }

            // Soft screen boundary containment
            const margin = 70;
            if (this.x < margin) this.vx += 0.8 * speedMultiplier;
            if (this.x > screenW - this.cfg.width - margin) this.vx -= 0.8 * speedMultiplier;
            if (this.y < margin) this.vy += 0.8 * speedMultiplier;
            if (this.y > screenH - this.cfg.height - margin) this.vy -= 0.8 * speedMultiplier;

            // Z containment
            if (this.z < -40) this.vz += 0.4;
            if (this.z > 60) this.vz -= 0.4;

            // Damping & speed clamping
            const maxSpd = 7.5 * speedMultiplier;
            const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (spd > maxSpd) {
              this.vx = (this.vx / spd) * maxSpd;
              this.vy = (this.vy / spd) * maxSpd;
            }
            this.vx *= 0.965;
            this.vy *= 0.965;
            this.vz *= 0.95;
          }

          // Direction facing
          if (Math.abs(this.vx) > 0.3) {
            this.targetRotY = this.vx > 0 ? 0 : 180;
          }
        }

        // Apply velocities
        this.x += this.vx * (dt * 60);
        this.y += this.vy * (dt * 60);
        this.z += this.vz * (dt * 60);
      }

      // Smooth 3D banking rotations
      const rotYDiff = this.targetRotY - this.rotY;
      this.rotY += rotYDiff * 0.12;

      // Pitch & Roll based on velocity
      const targetRotX = Math.max(-18, Math.min(18, -this.vy * 3.5));
      const targetRotZ = Math.max(-20, Math.min(20, this.vx * 3.0));
      this.rotX += (targetRotX - this.rotX) * 0.1;
      this.rotZ += (targetRotZ - this.rotZ) * 0.1;

      // Sinusoidal floating hover
      const hoverY = Math.sin(this.hoverPhase) * 6;
      const hoverZ = Math.cos(this.hoverPhase * 0.8) * 8;

      // 360 Flip Celebration animation
      let flipRotY = 0;
      let flipHopY = 0;
      if (this.flipProgress > 0) {
        this.flipProgress -= dt * 2.2;
        if (this.flipProgress < 0) this.flipProgress = 0;
        const t = 1 - this.flipProgress;
        flipRotY = t * 360;
        flipHopY = -Math.sin(t * Math.PI) * 45;
      }

      // Final 3D positions
      const posX = this.x;
      const posY = this.y + hoverY + flipHopY;
      const posZ = this.z + hoverZ;

      // Apply 3D matrix transform
      const finalRotY = this.rotY + flipRotY;
      const scale = 1 + posZ / 450;

      this.el.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px)`;
      this.bodyEl.style.transform = `scale3d(${scale}, ${scale}, ${scale}) rotateY(${finalRotY}deg) rotateX(${this.rotX}deg) rotateZ(${this.rotZ}deg)`;

      // Dynamic 3D floor shadow underneath
      const shadowScale = Math.max(0.4, Math.min(1.4, 1 - posZ / 250));
      const shadowOpacity = Math.max(0.15, Math.min(0.65, 0.45 - posZ / 300));
      this.shadowEl.style.transform = `translate3d(0, ${25 + posZ * 0.3}px, ${-posZ}px) scale(${shadowScale}) rotateX(70deg)`;
      this.shadowEl.style.opacity = `${shadowOpacity}`;
    }

    togglePerch() {
      if (this.isPerched) {
        this.isPerched = false;
        this.perchTimer = 8 + Math.random() * 14;
      } else {
        // Select an interactive card on screen
        const candidates = document.querySelectorAll('.kpi, .dropzone, .rule-chip, .team-continuous-badge, .avatar, #qaAnalyze');
        if (candidates.length > 0 && Math.random() < 0.65) {
          const target = candidates[Math.floor(Math.random() * candidates.length)];
          const r = target.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight) {
            this.isPerched = true;
            this.perchTargetEl = target;
            this.perchTimer = 4 + Math.random() * 5;
            setTimeout(() => {
              if (this.isPerched && Math.random() < 0.75) {
                this.sayRandomQuote();
              }
            }, 1200);
            return;
          }
        }
        this.perchTimer = 6 + Math.random() * 10;
      }
    }
  }

  // Continuous Video Controller
  function initContinuousVideoBadges() {
    // 1. Sidebar Brand Video
    const brandMark = document.querySelector('.sidebar .brand-mark');
    if (brandMark) {
      brandMark.classList.add('video-active');
      brandMark.innerHTML = `
        <video class="brand-mark-video" autoplay loop muted playsinline src="/static/3Bugs.mp4"></video>
      `;
      const v = brandMark.querySelector('video');
      if (v) v.play().catch(() => {});
    }

    // 2. Topbar Continuous Team Badge
    const topbarRight = document.querySelector('.topbar-right');
    if (topbarRight && !document.getElementById('teamContinuousBadge')) {
      const badge = document.createElement('div');
      badge.className = 'team-continuous-badge';
      badge.id = 'teamContinuousBadge';
      badge.title = 'The Three Bugs — Click to assemble squad!';
      badge.innerHTML = `
        <div class="team-badge-video-wrap">
          <video class="team-badge-video" autoplay loop muted playsinline src="/static/3Bugs.mp4"></video>
        </div>
        <div class="team-badge-info">
          <span class="team-badge-name">The Three Bugs</span>
          <span class="team-badge-status"><span class="team-dot-live"></span>Continuous Live</span>
        </div>
      `;
      // Insert before refresh button or avatar
      topbarRight.insertBefore(badge, topbarRight.firstChild);

      badge.addEventListener('click', () => {
        isSquadFormation = !isSquadFormation;
        bugs.forEach(b => b.celebrate());
        const toastFn = window.toast || function () {};
        toastFn('info', 'The Three Bugs Squad', isSquadFormation ? 'Squad assembled in formation!' : 'Bugs roaming freely across UI.');
      });

      const bv = badge.querySelector('video');
      if (bv) bv.play().catch(() => {});
    }

    // 3. Floating Hologram Card Showcase
    if (!document.getElementById('teamHologramCard')) {
      const card = document.createElement('div');
      card.className = 'team-hologram-card';
      card.id = 'teamHologramCard';
      card.innerHTML = `
        <div class="hologram-video-frame">
          <video class="hologram-video" autoplay loop muted playsinline src="/static/3Bugs.mp4"></video>
          <div class="hologram-scanline"></div>
        </div>
        <div class="hologram-info">
          <div class="hologram-title">The Three Bugs <span class="hologram-tag">LIVE SOC</span></div>
          <div class="hologram-sub">Continuous Team Animation & 3D Sentinels</div>
        </div>
        <div class="hologram-ctrls">
          <button class="hologram-btn" id="holoSquadBtn" title="Assemble 3D Squad">
            <i data-lucide="users" style="width:14px;height:14px;"></i>
          </button>
          <button class="hologram-btn" id="holoMinBtn" title="Minimize">
            <i data-lucide="minus" style="width:14px;height:14px;"></i>
          </button>
        </div>
      `;
      document.body.appendChild(card);

      const hv = card.querySelector('video');
      if (hv) hv.play().catch(() => {});

      const minBtn = card.querySelector('#holoMinBtn');
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('minimized');
      });

      const squadBtn = card.querySelector('#holoSquadBtn');
      squadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isSquadFormation = !isSquadFormation;
        squadBtn.classList.toggle('active', isSquadFormation);
        bugs.forEach(b => b.celebrate());
      });

      if (window.lucide && lucide.createIcons) lucide.createIcons();
    }
  }

  // HUD Squad Controller
  function initHUD() {
    hudEl = document.createElement('div');
    hudEl.className = 'bugs-hud-bar';
    hudEl.id = 'bugsHudBar';
    hudEl.innerHTML = `
      <div class="hud-badge">
        <span class="team-dot-live"></span>
        <span>The Three Bugs 3D</span>
      </div>
      <button class="hud-btn active" id="hudSpeedBtn" title="Toggle Speed">
        <i data-lucide="zap" style="width:13px;height:13px;"></i>
        <span id="hudSpeedLabel">Fast</span>
      </button>
      <button class="hud-btn" id="hudFormationBtn" title="Gather Trio in Formation">
        <i data-lucide="sparkles" style="width:13px;height:13px;"></i>
        <span>Squad Up</span>
      </button>
      <button class="hud-btn" id="hudToggleBtn" title="Pause / Play Roaming">
        <i data-lucide="play" style="width:13px;height:13px;" id="hudPlayIcon"></i>
      </button>
    `;
    document.body.appendChild(hudEl);

    // Speed toggle (Fast -> Warp -> Chill -> Fast)
    const speedBtn = hudEl.querySelector('#hudSpeedBtn');
    const speedLabel = hudEl.querySelector('#hudSpeedLabel');
    speedBtn.addEventListener('click', () => {
      if (speedMultiplier === 1.35) {
        speedMultiplier = 2.4; // Warp
        speedLabel.textContent = 'Warp ⚡';
        speedBtn.style.color = '#f43f5e';
      } else if (speedMultiplier === 2.4) {
        speedMultiplier = 0.7; // Chill
        speedLabel.textContent = 'Chill 🌸';
        speedBtn.style.color = '#38bdf8';
      } else {
        speedMultiplier = 1.35; // Fast
        speedLabel.textContent = 'Fast 🚀';
        speedBtn.style.color = '#22d3ee';
      }
    });

    // Formation toggle
    const formBtn = hudEl.querySelector('#hudFormationBtn');
    formBtn.addEventListener('click', () => {
      isSquadFormation = !isSquadFormation;
      formBtn.classList.toggle('active', isSquadFormation);
      bugs.forEach(b => b.celebrate());
    });

    // Pause / Play toggle
    const toggleBtn = hudEl.querySelector('#hudToggleBtn');
    toggleBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      toggleBtn.classList.toggle('active', isPaused);
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isPaused ? 'pause' : 'play');
        if (window.lucide && lucide.createIcons) lucide.createIcons();
      }
    });

    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  // Animation Loop
  function startLoop() {
    function frame(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!document.hidden) {
        for (let i = 0; i < bugs.length; i++) {
          bugs[i].update(dt);
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Initialization
  function init() {
    // Stage container
    stageEl = document.createElement('div');
    stageEl.className = 'bugs-roam-stage';
    stageEl.id = 'bugsRoamStage';
    document.body.appendChild(stageEl);

    // Spawn 3 Bugs
    bugs = BUGS_CONFIG.map((cfg, i) => new BugEntity(cfg, i));

    // Welcome cheer
    setTimeout(() => {
      if (bugs.length >= 3) {
        bugs[0].say("The Three Bugs reporting for duty! 👓");
        setTimeout(() => bugs[1].say("Security console live & secured! </>"), 800);
        setTimeout(() => bugs[2].say("Monitoring all threat signals! 📝"), 1600);
      }
    }, 1500);

    // Continuous video badges & HUD
    initContinuousVideoBadges();
    initHUD();

    // Start 3D Engine
    startLoop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global controller
  window.ThreeBugs = {
    bugs,
    setSpeed: (mult) => { speedMultiplier = mult; },
    squadUp: () => { isSquadFormation = true; bugs.forEach(b => b.celebrate()); },
    scatter: () => { isSquadFormation = false; },
    togglePause: () => { isPaused = !isPaused; }
  };

})();
