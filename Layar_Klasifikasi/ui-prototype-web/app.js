/**
 * Medisafe Bin — Prototype UI Logic (280×380, non-touch, tombol fisik)
 *
 * Data master kategori limbah:
 * - Benda Tajam → safety box (rigid, tahan penetrasi)
 * - Infeksius → kantong biohazard (heat-sealed otomatis)
 *
 * Key dipakai oleh tombol `data-choice` di `index.html`.
 */
const CHOICES = {
  sharps: {
    label: 'Limbah Benda Tajam',
    note: 'Jarum suntik, ampul, lancet, pisau bedah → Safety Box.',
  },
  infeksius: {
    label: 'Limbah Infeksius',
    note: 'Kasa terkontaminasi, sarung tangan bekas, spuit → Kantong Biohazard.',
  },
};

/**
 * Mapping UI per kategori:
 * - `theme` dipakai untuk class tema card (warna latar + border)
 * - `iconHtml` dipakai untuk menampilkan ikon kecil di card
 */
const CHOICE_UI = {
  sharps: {
    theme: 'theme-sharps',
    iconHtml: `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21l6.5-6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M8.2 11.8l6.8-6.8c.9-.9 2.3-.9 3.2 0l.8.8c.9.9.9 2.3 0 3.2l-6.8 6.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M14.5 6.5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6.5 18.5l-3.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `.trim(),
  },
  infeksius: {
    theme: 'theme-infeksius',
    iconHtml: `<span style="font-size:20px;line-height:1">☣</span>`,
  },
};

/**
 * Fail-safe: jika tidak memilih kategori, otomatis → BENDA TAJAM.
 * Alasan: safety box rigid mampu menahan kedua jenis limbah,
 * sedangkan kantong biohazard berisiko tertembus benda tajam.
 */
const FAILSAFE_SECONDS = 60;

// Durasi animasi (mock untuk prototype)
const OPENING_MS  = 1200;
const CLOSING_MS  = 1600;
const ROUTING_MS  = 2200;
const DISINFECT_MS = 1800;

/**
 * Simulasi kapasitas kompartemen (bertambah setiap buang sampah).
 * Threshold: 0-59% hijau, 60-84% kuning, 85-100% merah.
 */
const capacity = {
  sharps: 25,
  infeksius: 10,
};

const CAPACITY_THRESHOLD_YELLOW = 60;
const CAPACITY_THRESHOLD_RED = 85;

/* ──────────────────────────────────────────
   CORE FUNCTIONS
   ────────────────────────────────────────── */

/**
 * Menampilkan 1 layar (view) dan menyembunyikan yang lain.
 */
function showView(id) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('view--active'));
  const active = document.getElementById(id);
  if (active) active.classList.add('view--active');
}

/**
 * Format countdown menjadi `MM:SS`.
 */
function formatMMSS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * Animasi progress bar (mock UI).
 */
function animateBar(barEl, durationMs) {
  if (!barEl) return;
  barEl.style.width = '0%';
  const start = performance.now();

  const frame = (t) => {
    const p = Math.min(1, (t - start) / durationMs);
    barEl.style.width = `${Math.round(p * 100)}%`;
    if (p < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

/* ──────────────────────────────────────────
   LED CAPACITY INDICATORS
   ────────────────────────────────────────── */

function getCapacityLevel(pct) {
  if (pct >= CAPACITY_THRESHOLD_RED) return 'red';
  if (pct >= CAPACITY_THRESHOLD_YELLOW) return 'yellow';
  return 'green';
}

function updateLEDs() {
  ['sharps', 'infeksius'].forEach((cat) => {
    const level = getCapacityLevel(capacity[cat]);
    const dots = document.querySelectorAll(`.led-group--${cat} .led-dot`);

    dots.forEach((dot) => {
      dot.classList.remove('led-dot--active', 'led-dot--green', 'led-dot--yellow', 'led-dot--red');
    });

    if (level === 'green' && dots[0]) {
      dots[0].classList.add('led-dot--active', 'led-dot--green');
    } else if (level === 'yellow') {
      if (dots[0]) dots[0].classList.add('led-dot--active', 'led-dot--green');
      if (dots[1]) dots[1].classList.add('led-dot--active', 'led-dot--yellow');
    } else if (level === 'red') {
      if (dots[0]) dots[0].classList.add('led-dot--active', 'led-dot--green');
      if (dots[1]) dots[1].classList.add('led-dot--active', 'led-dot--yellow');
      if (dots[2]) dots[2].classList.add('led-dot--active', 'led-dot--red');
    }
  });
}

function incrementCapacity(cat) {
  capacity[cat] = Math.min(100, capacity[cat] + Math.floor(Math.random() * 8 + 5));
  updateLEDs();
  updateRetrievalView();
}

/* ──────────────────────────────────────────
   RETRIEVAL VIEW (Level 2 - Petugas Kebersihan)
   ────────────────────────────────────────── */

function updateRetrievalView() {
  ['sharps', 'infeksius'].forEach((cat) => {
    const pct = capacity[cat];
    const levelEl = document.getElementById(`retrieval-${cat}-level`);
    const fillEl = document.getElementById(`retrieval-${cat}-fill`);

    if (levelEl) levelEl.textContent = `${pct}%`;
    if (fillEl) {
      fillEl.style.width = `${pct}%`;
      fillEl.classList.remove('compartment-card__fill--yellow', 'compartment-card__fill--red');
      const level = getCapacityLevel(pct);
      if (level === 'yellow') fillEl.classList.add('compartment-card__fill--yellow');
      if (level === 'red') fillEl.classList.add('compartment-card__fill--red');
    }
  });
}

/* ──────────────────────────────────────────
   UI POPULATION FUNCTIONS
   ────────────────────────────────────────── */

/**
 * Mengisi UI pada layar routing + layar session actions.
 * @param {string} choiceKey
 * @param {string} noteSuffix
 */
function setRoute(choiceKey, noteSuffix) {
  const data = CHOICES[choiceKey];
  const ui = CHOICE_UI[choiceKey];

  // Route card
  const iconEl = document.getElementById('routeIcon');
  if (iconEl) iconEl.innerHTML = ui?.iconHtml ?? '';

  const labelEl = document.getElementById('routeLabel');
  if (labelEl) labelEl.textContent = data?.label ?? '-';

  const noteEl = document.getElementById('routeNote');
  if (noteEl) {
    noteEl.textContent = noteSuffix
      ? `${data?.note ?? ''} ${noteSuffix}`.trim()
      : (data?.note ?? '');
  }

  const cardEl = document.getElementById('routeCard');
  if (cardEl) {
    cardEl.classList.remove('theme-neutral', 'theme-sharps', 'theme-infeksius');
    cardEl.classList.add(ui?.theme ?? 'theme-neutral');
  }

  // Session card
  const sessionIconEl = document.getElementById('sessionIcon');
  if (sessionIconEl) sessionIconEl.innerHTML = ui?.iconHtml ?? '';

  const sessionLabelEl = document.getElementById('sessionLabel');
  if (sessionLabelEl) sessionLabelEl.textContent = 'Berhasil dipilah';

  const sessionNoteEl = document.getElementById('sessionNote');
  if (sessionNoteEl) {
    const target = data?.label ?? '-';
    const suffix = noteSuffix ? ` ${noteSuffix}` : '';
    sessionNoteEl.textContent = `Kategori: ${target}.${suffix}`.trim();
  }

  const sessionCardEl = document.getElementById('sessionCard');
  if (sessionCardEl) {
    sessionCardEl.classList.remove('theme-neutral', 'theme-sharps', 'theme-infeksius');
    sessionCardEl.classList.add(ui?.theme ?? 'theme-neutral');
  }
}

/**
 * Mengisi UI pada layar konfirmasi.
 * @param {string} choiceKey
 */
function setConfirm(choiceKey) {
  const data = CHOICES[choiceKey];
  const ui = CHOICE_UI[choiceKey];

  const iconEl = document.getElementById('confirmIcon');
  if (iconEl) iconEl.innerHTML = ui?.iconHtml ?? '';

  const labelEl = document.getElementById('confirmLabel');
  if (labelEl) labelEl.textContent = data?.label ?? '-';

  const noteEl = document.getElementById('confirmNote');
  if (noteEl) noteEl.textContent = data?.note ?? '-';

  const cardEl = document.getElementById('confirmCard');
  if (cardEl) {
    cardEl.classList.remove('theme-neutral', 'theme-sharps', 'theme-infeksius');
    cardEl.classList.add(ui?.theme ?? 'theme-neutral');
  }
}

/* ──────────────────────────────────────────
   MAIN WIRING
   ────────────────────────────────────────── */

function wire() {
  showView('view-rfid');
  updateLEDs();

  // Session state
  let sessionActive = false;
  let accessLevel = null; // 'medis' | 'kebersihan'

  const openBtn = document.getElementById('btnOpenLid');
  const openProgress = document.getElementById('openProgress');
  const openBar = document.getElementById('openBar');
  const openSub = document.querySelector('#view-open .sub');

  const resetOpenView = () => {
    if (openBtn) {
      openBtn.style.display = '';
      openBtn.disabled = false;
      openBtn.textContent = 'Buka Penutup Bin';
    }
    if (openProgress) openProgress.style.display = 'none';
    if (openBar) openBar.style.width = '0%';
    if (openSub) openSub.textContent = 'Tekan tombol untuk membuka penutup bin.';
  };

  /* ── RFID Level 1: Tenaga Medis ── */
  document.getElementById('btnScanMedis')?.addEventListener('click', () => {
    const status = document.getElementById('rfidStatus');
    if (status) status.textContent = 'RFID diterima — Tenaga Medis';
    sessionActive = true;
    accessLevel = 'medis';
    resetOpenView();
    showView('view-open');
  });

  /* ── RFID Level 2: Petugas Kebersihan ── */
  document.getElementById('btnScanKebersihan')?.addEventListener('click', () => {
    const status = document.getElementById('rfidStatus');
    if (status) status.textContent = 'RFID diterima — Petugas Kebersihan';
    sessionActive = true;
    accessLevel = 'kebersihan';
    updateRetrievalView();
    showView('view-retrieval');
  });

  /* ── Retrieval: Simulasi buka pintu samping ── */
  document.getElementById('btnRetrieveSharps')?.addEventListener('click', () => {
    capacity.sharps = 0;
    updateLEDs();
    updateRetrievalView();
    const note = document.getElementById('retrievalNote');
    if (note) note.textContent = '✓ Safety box benda tajam diganti.';
  });

  document.getElementById('btnRetrieveInfeksius')?.addEventListener('click', () => {
    capacity.infeksius = 0;
    updateLEDs();
    updateRetrievalView();
    const note = document.getElementById('retrievalNote');
    if (note) note.textContent = '✓ Kantong biohazard tersegel diambil.';
  });

  document.getElementById('btnRetrievalDone')?.addEventListener('click', () => {
    sessionActive = false;
    accessLevel = null;
    const status = document.getElementById('rfidStatus');
    if (status) status.textContent = 'Menunggu RFID…';
    const note = document.getElementById('retrievalNote');
    if (note) note.textContent = 'Pilih kompartemen untuk diambil.';
    showView('view-rfid');
  });

  /* ── Logout ── */
  const doLogout = () => {
    sessionActive = false;
    accessLevel = null;
    const status = document.getElementById('rfidStatus');
    if (status) status.textContent = 'Menunggu RFID…';
    resetOpenView();
    showView('view-rfid');
  };

  document.getElementById('btnLogout')?.addEventListener('click', doLogout);

  document.getElementById('btnOpenAgain')?.addEventListener('click', () => {
    if (!sessionActive) return;
    resetOpenView();
    showView('view-open');
  });

  /* ── Step: Buka penutup (servo) → insert ── */
  openBtn?.addEventListener('click', () => {
    if (openBtn) {
      openBtn.disabled = true;
      openBtn.textContent = 'Membuka…';
      openBtn.style.display = 'none';
    }
    if (openSub) openSub.textContent = 'Penutup sedang dibuka…';
    if (openProgress) openProgress.style.display = 'block';
    animateBar(openBar, OPENING_MS);

    window.setTimeout(() => {
      showView('view-insert');
    }, OPENING_MS);
  });

  /* ── Failsafe countdown (hanya di view-classify) ── */
  let lastInputAt = Date.now();
  let failsafeFired = false;
  let pendingChoiceKey = null;
  const countdownEl = document.getElementById('idleCountdown');
  const isClassifyActive = () =>
    document.getElementById('view-classify')?.classList.contains('view--active');

  const resetIdle = () => {
    lastInputAt = Date.now();
    failsafeFired = false;
    if (countdownEl) countdownEl.textContent = formatMMSS(FAILSAFE_SECONDS);
  };

  /* ── Routing (servo motor) → disinfeksi → session ── */
  function startRouting(choiceKey, noteSuffix) {
    // Increment capacity for the chosen category
    incrementCapacity(choiceKey);

    setRoute(choiceKey, noteSuffix);
    showView('view-routing');
    animateBar(document.getElementById('routeBar'), ROUTING_MS);

    window.setTimeout(() => {
      // After routing → disinfection step
      showView('view-disinfect');
      animateBar(document.getElementById('disinfectBar'), DISINFECT_MS);

      window.setTimeout(() => {
        if (sessionActive) {
          showView('view-session');
        } else {
          doLogout();
        }
      }, DISINFECT_MS);
    }, ROUTING_MS);
  }

  /* ── Konfirmasi: kembali / OK ── */
  document.getElementById('btnConfirmBack')?.addEventListener('click', () => {
    showView('view-classify');
    resetIdle();
  });

  document.getElementById('btnConfirmOk')?.addEventListener('click', () => {
    if (!pendingChoiceKey) return;
    startRouting(pendingChoiceKey, '');
    pendingChoiceKey = null;
  });

  /* ── Step: sampah masuk → tutup penutup → klasifikasi ── */
  document.getElementById('btnInserted')?.addEventListener('click', () => {
    showView('view-closing');
    animateBar(document.getElementById('closingBar'), CLOSING_MS);
    window.setTimeout(() => {
      showView('view-classify');
      resetIdle();
    }, CLOSING_MS);
  });

  /* ── Failsafe timer tick ── */
  const tick = () => {
    if (!isClassifyActive()) return;
    const elapsed = (Date.now() - lastInputAt) / 1000;
    const remaining = Math.max(0, FAILSAFE_SECONDS - elapsed);
    if (countdownEl) countdownEl.textContent = formatMMSS(remaining);
    if (!failsafeFired && remaining <= 0) {
      failsafeFired = true;
      // Fail-safe: otomatis ke BENDA TAJAM (bukan infeksius)
      startRouting('sharps', '(Fail-safe: safety box)');
    }
  };

  // Reset timer saat ada input di layar klasifikasi
  ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach((evt) => {
    document.addEventListener(
      evt,
      () => {
        if (isClassifyActive()) lastInputAt = Date.now();
      },
      { passive: true }
    );
  });

  window.setInterval(tick, 200);

  /* ── Binding tombol kategori ── */
  document.querySelectorAll('#view-classify [data-choice]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-choice');
      if (!key || !CHOICES[key]) return;
      pendingChoiceKey = key;
      setConfirm(key);
      showView('view-confirm');
    });
  });
}

// Jalankan wiring setelah DOM siap.
document.addEventListener('DOMContentLoaded', wire);
