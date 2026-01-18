/**
 * Data master kategori limbah (copywriting untuk UI prototype).
 * Key dipakai oleh tombol `data-choice` di `index.html`.
 */
const CHOICES = {
  sharps: {
    label: 'Limbah Benda Tajam',
    note: 'Contoh: jarum suntik, pisau bedah, ampul pecah.',
  },
  infeksius: {
    label: 'Limbah Infeksius',
    note: 'Contoh: limbah terkontaminasi darah/cairan tubuh (kasa, sarung tangan, dll).',
  },
  noninfeksius: {
    label: 'Limbah Noninfeksius',
    note: 'Contoh: kertas, plastik bersih, kemasan (tidak terkontaminasi).',
  },
};

/**
 * Mapping UI per kategori:
 * - `theme` dipakai untuk class tema card (warna latar + border)
 * - `iconHtml` dipakai untuk menampilkan ikon kecil di card
 */
const CHOICE_UI = {
  sharps: {
    theme: 'theme-yellow',
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
    theme: 'theme-yellow',
    iconHtml: `<span style="font-size:22px;line-height:1">☣</span>`,
  },
  noninfeksius: {
    theme: 'theme-green',
    iconHtml: `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 7h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M10 7V5h4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M7 7l1 14h8l1-14" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M10 11v7M14 11v7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `.trim(),
  },
};

// Failsafe: jika tidak memilih klasifikasi, otomatis infeksius.
const FAILSAFE_SECONDS = 60;

// Durasi animasi (mock untuk esai)
const OPENING_MS = 1200;
const CLOSING_MS = 1600;
const ROUTING_MS = 2200;

/**
 * Menampilkan 1 layar (view) dan menyembunyikan yang lain.
 * `id` harus cocok dengan id pada <section class="view" ...> di HTML.
 */
function showView(id) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('view--active'));
  const active = document.getElementById(id);
  if (active) active.classList.add('view--active');
}

/**
 * Format countdown menjadi `MM:SS`.
 * Dipakai untuk failsafe timer di layar klasifikasi.
 */
function formatMMSS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

/**
 * Animasi progress bar sederhana berbasis requestAnimationFrame.
 * Catatan: Ini murni mock UI (tidak mengontrol hardware).
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

/**
 * Mengisi UI pada layar routing + layar session actions (hasil akhir).
 * @param {keyof typeof CHOICES} choiceKey
 * @param {string} noteSuffix
 */
function setRoute(choiceKey, noteSuffix) {
  const data = CHOICES[choiceKey];
  const ui = CHOICE_UI[choiceKey];

  const iconEl = document.getElementById('routeIcon');
  if (iconEl) iconEl.innerHTML = ui?.iconHtml ?? '';

  const labelEl = document.getElementById('routeLabel');
  if (labelEl) labelEl.textContent = data?.label ?? '-';

  const noteEl = document.getElementById('routeNote');
  if (noteEl) {
    noteEl.textContent = noteSuffix ? `${data?.note ?? ''} ${noteSuffix}`.trim() : (data?.note ?? '');
  }

  const cardEl = document.getElementById('routeCard');
  if (cardEl) {
    cardEl.classList.remove('theme-neutral', 'theme-yellow', 'theme-green');
    cardEl.classList.add(ui?.theme ?? 'theme-neutral');
  }

  // Also update post-routing session alert
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
    sessionCardEl.classList.remove('theme-neutral', 'theme-yellow', 'theme-green');
    sessionCardEl.classList.add(ui?.theme ?? 'theme-neutral');
  }
}

/**
 * Mengisi UI pada layar konfirmasi (sebelum routing).
 * @param {keyof typeof CHOICES} choiceKey
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
    cardEl.classList.remove('theme-neutral', 'theme-yellow', 'theme-green');
    cardEl.classList.add(ui?.theme ?? 'theme-neutral');
  }
}

/**
 * Entry point: memasang event handler, mengelola state session,
 * dan menjalankan failsafe timer untuk layar klasifikasi.
 */
function wire() {
  // Default start screen.
  showView('view-rfid');

  // State sederhana: setelah RFID diterima, user boleh ulang buang sampah
  // tanpa scan ulang (sampai menekan "Selesai").
  let sessionActive = false;

  const openBtn = document.getElementById('btnOpenLid');
  const openProgress = document.getElementById('openProgress');
  const openBar = document.getElementById('openBar');
  const openSub = document.querySelector('#view-open .sub');
  // Helper: reset tampilan view-open setiap kali user masuk view ini.
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

  // Simulasi RFID (tanpa hardware): mengaktifkan session.
  document.getElementById('btnScan')?.addEventListener('click', () => {
    const status = document.getElementById('rfidStatus');
    if (status) status.textContent = 'RFID diterima (Nakes).';
    sessionActive = true;
    resetOpenView();
    showView('view-open');
  });

  // Logout: kembali ke layar RFID dan menonaktifkan session.
  const doLogout = () => {
    sessionActive = false;
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

  // Step: membuka penutup (mock progress), lalu masuk ke insert.
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

  // Failsafe countdown (only active on classify screen)
  // - Jika user diam selama FAILSAFE_SECONDS saat di view-classify,
  //   sistem auto memilih kategori `infeksius`.
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

  // Menjalankan proses routing (mock motor), lalu menuju layar session.
  function startRouting(choiceKey, noteSuffix) {
    setRoute(choiceKey, noteSuffix);
    showView('view-routing');
    animateBar(document.getElementById('routeBar'), ROUTING_MS);
    window.setTimeout(() => {
      if (sessionActive) {
        showView('view-session');
      } else {
        const status = document.getElementById('rfidStatus');
        if (status) status.textContent = 'Menunggu RFID…';
        showView('view-rfid');
      }
    }, ROUTING_MS);
  }

  // Tombol di layar konfirmasi: kembali (biar user bisa ganti pilihan).
  document.getElementById('btnConfirmBack')?.addEventListener('click', () => {
    showView('view-classify');
    resetIdle();
  });

  // Tombol di layar konfirmasi: OK = lanjut routing.
  document.getElementById('btnConfirmOk')?.addEventListener('click', () => {
    if (!pendingChoiceKey) return;
    startRouting(pendingChoiceKey, '');
    pendingChoiceKey = null;
  });

  // Step: sampah sudah masuk → tutup penutup → masuk klasifikasi.
  document.getElementById('btnInserted')?.addEventListener('click', () => {
    showView('view-closing');
    animateBar(document.getElementById('closingBar'), CLOSING_MS);
    window.setTimeout(() => {
      showView('view-classify');
      resetIdle();
    }, CLOSING_MS);
  });

  const tick = () => {
    if (!isClassifyActive()) return;
    const elapsed = (Date.now() - lastInputAt) / 1000;
    const remaining = Math.max(0, FAILSAFE_SECONDS - elapsed);
    if (countdownEl) countdownEl.textContent = formatMMSS(remaining);
    if (!failsafeFired && remaining <= 0) {
      failsafeFired = true;
      startRouting('infeksius', '(Dipilih otomatis)');
    }
  };

  // Setiap ada input (touch/klik/keyboard) saat layar klasifikasi aktif,
  // reset timer agar failsafe tidak terpanggil.
  ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach((evt) => {
    document.addEventListener(
      evt,
      () => {
        if (isClassifyActive()) lastInputAt = Date.now();
      },
      { passive: true }
    );
  });

  // Timer kecil untuk update countdown UI.
  window.setInterval(tick, 200);

  // Binding tombol-tombol kategori (berdasarkan `data-choice`).
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
