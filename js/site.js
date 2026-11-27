/* site.js — heroesofribhus.com
   Shared script injected on every page.
   Builds the topbar and sidebar navigation dynamically.
   Sets active page highlight in sidebar based on current URL.
   Handles mobile sidebar toggle and overlay.
   Created by Ribhian Games LLC 2026© All Rights Reserved */

// ── TOPBAR HTML ──
// Single source of truth for the top navigation bar.
// Change anything here and every page updates automatically.

function getTopbarHTML() {
  const base = getBase();
  return `
<header class="topbar">
  <div style="display:flex;align-items:center;gap:0.8rem;">
    <div class="topbar-menu-btn" onclick="toggleSidebar()" aria-label="Menu">
      <span></span><span></span><span></span>
    </div>
    <a href="${base}index.html" style="display:flex;align-items:center;gap:0.6rem;text-decoration:none;" title="Home">
      <img src="${base}images/ribhian-games-logo.png" alt="Ribhian Games"
        style="width:28px;height:28px;object-fit:cover;border:1px solid rgba(201,151,58,0.3);" />
      <span class="topbar-brand">Ribhian Games LLC</span>
    </a>
  </div>
  <div class="topbar-right">
    <a href="${base}gallery.html" class="topbar-btn" style="text-decoration:none;cursor:pointer;">🖼 Gallery</a>
    <div class="topbar-divider"></div>
    <a href="${base}announcements/announcements.html" class="topbar-btn" style="text-decoration:none;cursor:pointer;">📢 Announcements</a>
    <div class="topbar-divider"></div>
    <div class="topbar-btn coming-soon">🏷 Specials</div>
    <div class="topbar-divider"></div>
    <div class="topbar-btn coming-soon">🔒 Members</div>
  </div>
</header>
`;
}

// ── SIDEBAR HTML ──
// Single source of truth for site navigation.
// Change links here and every page updates automatically.

function getSidebarHTML(base) {
  return `
<nav class="sidebar" id="sidebar">
  <div class="sidebar-logo">
    <a href="${base}index.html">
      <img src="${base}images/ribhian-games-logo.png" alt="Ribhian Games" />
    </a>
  </div>
  <div class="sidebar-nav">

    <div class="sidebar-section open" id="sec-products">
      <div class="sidebar-section-header" onclick="toggleSection('sec-products')">
        Products <span class="sidebar-chevron">▼</span>
      </div>
      <div class="sidebar-children">

        <div class="sidebar-category open" id="cat-heptaverse" onclick="toggleCategory('cat-heptaverse')">
          <a href="${base}products/heptaverse.html" onclick="event.stopPropagation()">The Heptaverse</a>
          <span class="sidebar-chevron">▼</span>
        </div>
        <div class="sidebar-sub-children">
          <a href="${base}products/blood-and-stone.html" class="sidebar-sub-item">Blood &amp; Stone</a>
          <a href="${base}products/chronicles-of-ribhus.html" class="sidebar-sub-item">Chronicles of Ribhus</a>
          <a href="${base}products/madness-and-dust.html" class="sidebar-sub-item">Madness &amp; Dust</a>
          <a href="${base}products/ray-gun-rapture.html" class="sidebar-sub-item">Ray Gun Rapture</a>
          <a href="${base}products/spiral-descent.html" class="sidebar-sub-item">Spiral Descent</a>
          <a href="${base}products/tendrils-in-the-fog.html" class="sidebar-sub-item">Tendrils in the Fog</a>
          <a href="${base}products/the-core.html" class="sidebar-sub-item">The Core</a>
          <a href="${base}products/cosmology.html" class="sidebar-sub-item">Cosmology of the Heptaverse</a>
        </div>

        <div class="sidebar-divider"></div>

        <a href="${base}products/velvet-and-iron.html" class="sidebar-item">Velvet &amp; Iron</a>

        <div class="sidebar-divider"></div>

        <div class="sidebar-category" id="cat-aswi" onclick="toggleCategory('cat-aswi')">
          <a href="${base}products/all-star-wrestlers-investigates.html" onclick="event.stopPropagation()">All Star Wrestlers Investigates</a>
          <span class="sidebar-chevron">▼</span>
        </div>
        <div class="sidebar-sub-children">
          <a href="${base}products/aswi-rpg.html" class="sidebar-sub-item">ASWI Role Playing Game</a>
          <a href="${base}products/aswi-board-game.html" class="sidebar-sub-item">ASWI Board Game</a>
        </div>

      </div>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section">
      <a href="${base}events/events.html" class="sidebar-section-header is-link">⚔ Events</a>
    </div>

    <div class="sidebar-divider"></div>

    <div class="sidebar-section">
      <a href="${base}contact.html" class="sidebar-section-header is-link">✉ Contact Us</a>
    </div>

  </div>
</nav>
`;
}

// ── BASE PATH DETECTION ──
function getBase() {
  const path = window.location.pathname;
  if (path.includes('/products/') || path.includes('/events/')) {
    return '../';
  }
  return '';
}

// ── TOPBAR LOADER ──
function loadTopbar() {
  const mount = document.getElementById('topbar-mount');
  if (!mount) return;
  mount.innerHTML = getTopbarHTML();
  injectVideoModal();
}

// ── VIDEO MODAL ──
function injectVideoModal() {
  if (document.getElementById('heptaverse-video-modal')) return;

  // Inject styles once
  const style = document.createElement('style');
  style.textContent = `
    .video-modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 2000;
      background: rgba(0,0,0,0.88);
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
    }
    .video-modal-overlay.active { display: flex; }
    .video-modal-box {
      position: relative;
      width: 92vw;
      max-width: 1100px;
      background: #000;
      border: 1px solid rgba(201,151,58,0.3);
      box-shadow: 0 0 60px rgba(0,0,0,0.9), 0 0 30px rgba(201,151,58,0.1);
    }
    .video-modal-box video {
      width: 100%;
      height: auto;
      min-height: 400px;
      display: block;
      background: #000;
    }
    .video-modal-close {
      position: absolute;
      top: -2.2rem;
      right: 0;
      background: none;
      border: none;
      color: #7a6e5e;
      font-family: 'Cinzel', serif;
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      cursor: pointer;
      padding: 0.3rem 0;
      transition: color 0.2s;
    }
    .video-modal-close:hover { color: #c9973a; }
    .video-volume-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 1rem;
      background: #0f0d0b;
      border-top: 1px solid rgba(201,151,58,0.15);
    }
    .video-mute-btn {
      background: none;
      border: none;
      color: #c9973a;
      font-size: 1rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      flex-shrink: 0;
      transition: color 0.2s;
    }
    .video-mute-btn:hover { color: #e8b84b; }
    .video-volume-label {
      font-family: 'Cinzel', serif;
      font-size: 0.55rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #7a6e5e;
      flex-shrink: 0;
    }
    .video-volume-slider {
      -webkit-appearance: none;
      appearance: none;
      flex: 1;
      height: 3px;
      border-radius: 2px;
      background: linear-gradient(to right, #c9973a 70%, #3a3228 70%);
      outline: none;
      cursor: pointer;
    }
    .video-volume-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #c9973a;
      border: 2px solid #080707;
      box-shadow: 0 0 6px rgba(201,151,58,0.4);
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
    }
    .video-volume-slider::-webkit-slider-thumb:hover {
      background: #e8b84b;
      box-shadow: 0 0 10px rgba(201,151,58,0.6);
    }
    .video-volume-slider::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #c9973a;
      border: 2px solid #080707;
      cursor: pointer;
    }
    .video-volume-slider::-moz-range-track {
      height: 3px;
      background: #3a3228;
      border-radius: 2px;
    }
  `;
  document.head.appendChild(style);

  // Inject modal markup
  const base = getBase();
  const modal = document.createElement('div');
  modal.className = 'video-modal-overlay';
  modal.id = 'heptaverse-video-modal';
  modal.innerHTML = `
    <div class="video-modal-box">
      <div style="position:absolute;top:-2.2rem;left:0;right:0;display:flex;justify-content:space-between;align-items:center;">
        <a href="${base}index.html" style="font-family:'Cinzel',serif;font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:#c9973a;text-decoration:none;display:flex;align-items:center;gap:0.5rem;border:1px solid rgba(201,151,58,0.4);padding:0.2rem 0.7rem;transition:background 0.2s;"
          onmouseover="this.style.background='rgba(201,151,58,0.1)'" onmouseout="this.style.background='transparent'">
          ← Home
        </a>
        <button class="video-modal-close" onclick="closeVideoModal()">✕ &nbsp;Close</button>
      </div>
      <video id="heptaverse-video" controls preload="metadata" width="1280" height="720" style="width:100%;height:auto;background:#000;">
        <source src="${base}media/Kickstarter Uplifting Rock.mov" type="video/quicktime" />
        <source src="${base}media/Kickstarter Uplifting Rock.mov" type="video/mp4" />
        Your browser does not support this video format.
      </video>
      <div class="video-volume-bar">
        <button class="video-mute-btn" id="video-mute-btn" onclick="toggleVideoMute()" title="Mute / Unmute">🔊</button>
        <span class="video-volume-label">Volume</span>
        <input class="video-volume-slider" id="video-volume-slider" type="range" min="0" max="1" step="0.02" value="0.8"
          oninput="setVideoVolume(this.value)" />
      </div>
    </div>
  `;
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeVideoModal();
  });
  document.body.appendChild(modal);
}

function openVideoModal() {
  const modal = document.getElementById('heptaverse-video-modal');
  const video = document.getElementById('heptaverse-video');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (video) {
    video.volume = 0.8;
    video.play();
  }
}

function goHomeFromVideo() {
  var modal = document.getElementById('heptaverse-video-modal');
  var video = document.getElementById('heptaverse-video');
  if (video) {
    video.muted = true;
    video.volume = 0;
    video.pause();
    video.src = '';
    video.load();
  }
  if (modal) {
    modal.parentNode.removeChild(modal);
  }
  var path = window.location.pathname;
  var base = (path.includes('/products/') || path.includes('/events/')) ? '../' : '';
  window.location.replace(base + 'index.html');
}

function closeVideoModal() {
  var modal = document.getElementById('heptaverse-video-modal');
  var video = document.getElementById('heptaverse-video');
  if (!modal) return;
  modal.classList.remove('active');
  if (video) { video.pause(); video.currentTime = 0; }
  document.body.style.overflow = '';
}

// Kill ALL media on page unload — catches navigation away from any page
window.addEventListener('beforeunload', function() {
  document.querySelectorAll('video, audio').forEach(function(el) {
    el.pause();
    el.removeAttribute('src');
    el.load();
  });
});

function setVideoVolume(val) {
  const video  = document.getElementById('heptaverse-video');
  const slider = document.getElementById('video-volume-slider');
  const btn    = document.getElementById('video-mute-btn');
  if (!video) return;
  video.volume = val;
  video.muted  = (val == 0);
  // Update slider fill gradient
  if (slider) slider.style.background =
    `linear-gradient(to right, #c9973a ${val * 100}%, #3a3228 ${val * 100}%)`;
  // Update speaker icon
  if (btn) btn.textContent = val == 0 ? '🔇' : val < 0.4 ? '🔉' : '🔊';
}

function toggleVideoMute() {
  const video  = document.getElementById('heptaverse-video');
  const slider = document.getElementById('video-volume-slider');
  if (!video) return;
  video.muted = !video.muted;
  const effectiveVol = video.muted ? 0 : video.volume;
  setVideoVolume(video.muted ? 0 : video.volume);
  if (slider && !video.muted) slider.value = video.volume;
  if (slider &&  video.muted) slider.value = 0;
}

// ── SIDEBAR LOADER ──
function loadSidebar() {
  const mount = document.getElementById('sidebar-mount');
  if (!mount) return;
  const base = getBase();
  mount.innerHTML = getSidebarHTML(base);
  highlightActivePage();
  restoreToggleStates();
}

// ── HIGHLIGHT ACTIVE PAGE ──
function highlightActivePage() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll(
    '.sidebar-sub-item, .sidebar-item, .sidebar-category a, .sidebar-section-header.is-link'
  ).forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop();
    if (linkFile && linkFile === currentFile) {
      link.classList.add('active');
      const subChildren = link.closest('.sidebar-sub-children');
      if (subChildren) {
        const category = subChildren.previousElementSibling;
        if (category) category.classList.add('open');
      }
    }
  });
}

// ── RESTORE TOGGLE STATES ──
function restoreToggleStates() {
  const productsSection = document.getElementById('sec-products');
  if (productsSection) productsSection.classList.add('open');
  const heptaverse = document.getElementById('cat-heptaverse');
  if (heptaverse) heptaverse.classList.add('open');
}

// ── TOGGLES ──
function toggleSection(id) {
  const sec = document.getElementById(id);
  if (sec) sec.classList.toggle('open');
}

function toggleCategory(id) {
  const cat = document.getElementById(id);
  if (cat) cat.classList.toggle('open');
}

// ── MOBILE SIDEBAR ──
function toggleSidebar() {
  const mount = document.getElementById('sidebar-mount');
  const overlay = document.getElementById('sidebar-overlay');
  if (mount) mount.classList.toggle('open');
  if (overlay) overlay.classList.toggle('visible');
}

function closeSidebar() {
  const mount = document.getElementById('sidebar-mount');
  const overlay = document.getElementById('sidebar-overlay');
  if (mount) mount.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadTopbar();
  loadSidebar();
});
