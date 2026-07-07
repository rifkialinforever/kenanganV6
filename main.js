const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxdfjp5zJYbXgQ9lO41I4ax4I8sGHLgLcXPLv3jsQkr3S6Bbvr8mDR-X3tHedNwD-Gq/exec";

const canvas = document.getElementById("space-canvas");
const ctx = canvas.getContext("2d");
let stars = [],
  shootingStars = [];
let formingName = false;
let animationsEnabled = true;

// Array untuk menyimpan file yang akan diunggah
let selectedFiles = [];

const themes = {
  midnight: {
    name: "Midnight Space",
    bg: "radial-gradient(circle at center, #2e1065, #1e1b4b, #020617)",
    glassBg: "rgba(76, 29, 149, 0.15)",
    glassBorder: "rgba(139, 92, 246, 0.25)",
    primary: "#8b5cf6",
    secondary: "#7dd3fc",
    star1: "#8b5cf6",
    star2: "#7dd3fc",
  },
  sakura: {
    name: "Sakura Spring",
    bg: "radial-gradient(circle at center, #831843, #500724, #0f0106)",
    glassBg: "rgba(219, 39, 119, 0.15)",
    glassBorder: "rgba(244, 114, 182, 0.25)",
    primary: "#ec4899",
    secondary: "#fbcfe8",
    star1: "#f472b6",
    star2: "#fbcfe8",
  },
  sunset: {
    name: "Warm Sunset",
    bg: "radial-gradient(circle at center, #7c2d12, #431407, #0c0200)",
    glassBg: "rgba(234, 88, 12, 0.15)",
    glassBorder: "rgba(251, 146, 60, 0.25)",
    primary: "#f97316",
    secondary: "#fde047",
    star1: "#f97316",
    star2: "#fef08a",
  },
  mint: {
    name: "Mint Garden",
    bg: "radial-gradient(circle at center, #064e3b, #022c22, #01130e)",
    glassBg: "rgba(5, 150, 105, 0.15)",
    glassBorder: "rgba(52, 211, 153, 0.25)",
    primary: "#10b981",
    secondary: "#6ee7b7",
    star1: "#10b981",
    star2: "#a7f3d0",
  },
};

let currentThemeColors = { ...themes.midnight };

function applyTheme(themeKey) {
  const selected = themes[themeKey];
  if (!selected) return;
  currentThemeColors = selected;

  const rootStyle = document.documentElement.style;
  rootStyle.setProperty("--bg-gradient", selected.bg);
  rootStyle.setProperty("--glass-bg", selected.glassBg);
  rootStyle.setProperty("--glass-border", selected.glassBorder);
  rootStyle.setProperty("--theme-primary", selected.primary);
  rootStyle.setProperty("--theme-secondary", selected.secondary);

  localStorage.setItem("selectedThemeArina", themeKey);
  renderThemeItems();
}

function renderThemeItems() {
  const container = document.getElementById("themeItems");
  if (!container) return;
  container.innerHTML = "";

  const savedTheme = localStorage.getItem("selectedThemeArina") || "midnight";

  Object.keys(themes).forEach((key) => {
    const theme = themes[key];
    const isSelected = key === savedTheme;
    const btn = document.createElement("button");
    btn.className = `p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-20 ${isSelected ? "bg-white/10 border-white" : "bg-white/5 border-white/10 hover:bg-white/10"}`;
    btn.innerHTML = `
                  <span class="text-[10px] font-bold text-white/90 truncate">${theme.name}</span>
                  <div class="flex gap-1.5 mt-2">
                    <span class="w-3.5 h-3.5 rounded-full" style="background-color: ${theme.star1}"></span>
                    <span class="w-3.5 h-3.5 rounded-full" style="background-color: ${theme.star2}"></span>
                  </div>
                `;
    btn.onclick = () => {
      applyTheme(key);
    };
    container.appendChild(btn);
  });
}

// Konstelasi nama "ALIN"
const namePoints = [
  // Huruf A
  { x: 0.3, y: 0.35 },
  { x: 0.31, y: 0.3 },
  { x: 0.32, y: 0.25 },
  { x: 0.33, y: 0.2 },
  { x: 0.34, y: 0.25 },
  { x: 0.35, y: 0.3 },
  { x: 0.36, y: 0.35 },
  { x: 0.32, y: 0.28 },
  { x: 0.34, y: 0.28 },
  // Huruf L
  { x: 0.42, y: 0.2 },
  { x: 0.42, y: 0.25 },
  { x: 0.42, y: 0.3 },
  { x: 0.42, y: 0.35 },
  { x: 0.44, y: 0.35 },
  { x: 0.46, y: 0.35 },
  // Huruf I
  { x: 0.52, y: 0.2 },
  { x: 0.52, y: 0.25 },
  { x: 0.52, y: 0.3 },
  { x: 0.52, y: 0.35 },
  // Huruf N
  { x: 0.6, y: 0.35 },
  { x: 0.6, y: 0.3 },
  { x: 0.6, y: 0.25 },
  { x: 0.6, y: 0.2 },
  { x: 0.62, y: 0.25 },
  { x: 0.64, y: 0.3 },
  { x: 0.66, y: 0.35 },
  { x: 0.66, y: 0.3 },
  { x: 0.66, y: 0.25 },
  { x: 0.66, y: 0.2 },
];

// Optimasi Kinerja Star Space
function initSpace() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  // Batasi jumlah partikel di layar kecil untuk meringankan beban GPU/CPU
  const starCount = window.innerWidth < 640 ? 150 : 300;
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2,
      colorType: Math.random() > 0.5 ? 1 : 2,
      originalSize: Math.random() * 1.5,
    });
  }
}

function animateSpace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!animationsEnabled) {
    requestAnimationFrame(animateSpace);
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const star1Color = currentThemeColors.star1;
  const star2Color = currentThemeColors.star2;

  stars.forEach((s, i) => {
    const starColor = s.colorType === 1 ? star1Color : star2Color;
    if (formingName) {
      let p = namePoints[i % namePoints.length];
      let tx = p.x * canvasWidth;
      let ty = p.y * canvasHeight;
      s.x += (tx - s.x) * 0.07;
      s.y += (ty - s.y) * 0.07;
      s.size = 2.5;
    } else {
      s.x += s.vx;
      s.y += s.vy;
      s.size = s.originalSize;
      if (s.x < 0 || s.x > canvasWidth) s.vx *= -1;
      if (s.y < 0 || s.y > canvasHeight) s.vy *= -1;
    }
    ctx.fillStyle = starColor;
    if (formingName) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = starColor;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Pengurangan probabilitas bintang jatuh agar tidak membebankan rendering loop
  if (Math.random() < 0.01) {
    shootingStars.push({
      x: Math.random() * canvasWidth,
      y: 0,
      len: Math.random() * 60 + 20,
      speed: Math.random() * 8 + 4,
    });
  }

  shootingStars.forEach((ss, i) => {
    ctx.strokeStyle = "rgba(125, 211, 252, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(ss.x - ss.len, ss.y + ss.len);
    ctx.stroke();
    ss.x += ss.speed;
    ss.y += ss.speed;
    if (ss.y > canvasHeight) shootingStars.splice(i, 1);
  });

  requestAnimationFrame(animateSpace);
}

// =======================================================
// ENGINE GUGURAN BUNGA & KELOPAK
// =======================================================
const flCanvas = document.getElementById("flowers-canvas");
const flCtx = flCanvas.getContext("2d");
let flowerPetals = [];

function resizeFlowersCanvas() {
  flCanvas.width = window.innerWidth;
  flCanvas.height = window.innerHeight;
}

class FlowerPetal {
  constructor(x, y, isBurst = false) {
    this.x = x || Math.random() * flCanvas.width;
    this.y = y !== undefined ? y : -20;
    this.size = Math.random() * 10 + 5;

    this.speedX = isBurst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 1.2;
    this.speedY = isBurst ? (Math.random() - 0.5) * 6 - 2 : Math.random() * 1.0 + 0.6;

    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.swayAngle = Math.random() * Math.PI;
    this.swaySpeed = Math.random() * 0.015 + 0.005;

    const types = ["rose-petal", "sakura-petal", "whole-blossom"];
    this.type = types[Math.floor(Math.random() * types.length)];

    const colors = ["#f43f5e", "#fda4af", "#ec4899", "#fbcfe8", "#ffffff", "#e9d5ff"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.3 + 0.5;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.swayAngle) * 0.3;
    this.swayAngle += this.swaySpeed;
    this.rotation += this.rotationSpeed;

    if (this.y > flCanvas.height + 20) {
      this.y = -20;
      this.x = Math.random() * flCanvas.width;
    }
  }

  draw() {
    flCtx.save();
    flCtx.translate(this.x, this.y);
    flCtx.rotate(this.rotation);
    flCtx.globalAlpha = this.opacity;
    flCtx.fillStyle = this.color;

    if (this.type === "rose-petal") {
      flCtx.beginPath();
      flCtx.moveTo(0, 0);
      flCtx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.2);
      flCtx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
      flCtx.fill();
    } else if (this.type === "sakura-petal") {
      flCtx.beginPath();
      flCtx.moveTo(0, 0);
      flCtx.bezierCurveTo(-this.size * 0.8, -this.size * 0.5, -this.size, this.size * 0.5, -this.size * 0.2, this.size * 1.1);
      flCtx.lineTo(0, this.size * 0.9);
      flCtx.lineTo(this.size * 0.2, this.size * 1.1);
      flCtx.bezierCurveTo(this.size, this.size * 0.5, this.size * 0.8, -this.size * 0.5, 0, 0);
      flCtx.fill();
    } else {
      for (let i = 0; i < 5; i++) {
        flCtx.rotate((Math.PI * 2) / 5);
        flCtx.beginPath();
        flCtx.ellipse(this.size * 0.5, 0, this.size * 0.5, this.size * 0.25, 0, 0, Math.PI * 2);
        flCtx.fill();
      }
      flCtx.beginPath();
      flCtx.arc(0, 0, this.size * 0.18, 0, Math.PI * 2);
      flCtx.fillStyle = "#fef08a";
      flCtx.fill();
    }

    flCtx.restore();
  }
}

function initFallingFlowers() {
  flowerPetals = [];
  // Batasi jumlah partikel guguran bunga di layar HP agar lebih ringan
  const petalCount = window.innerWidth < 640 ? 30 : 60;
  for (let i = 0; i < petalCount; i++) {
    flowerPetals.push(new FlowerPetal(Math.random() * flCanvas.width, Math.random() * flCanvas.height));
  }
}

function animateFlowers() {
  flCtx.clearRect(0, 0, flCanvas.width, flCanvas.height);

  if (!animationsEnabled) {
    requestAnimationFrame(animateFlowers);
    return;
  }

  const currentLimit = window.innerWidth < 640 ? 30 : 60;

  flowerPetals.forEach((petal, index) => {
    petal.update();
    petal.draw();

    if (petal.speedY > 2 && (petal.x < -100 || petal.x > flCanvas.width + 100)) {
      flowerPetals.splice(index, 1);
    }
  });

  if (flowerPetals.length < currentLimit) {
    flowerPetals.push(new FlowerPetal());
  }

  requestAnimationFrame(animateFlowers);
}

function triggerFlowerBurst(x, y) {
  // Jumlah partikel ledakan dikurangi saat di mobile
  const burstCount = window.innerWidth < 640 ? 25 : 45;
  for (let i = 0; i < burstCount; i++) {
    flowerPetals.push(new FlowerPetal(x, y, true));
  }
}

// SETUP PESAN MANIS KOSMIK (Ganti Buket)
const cosmicWishes = [
  '"Semoga rasi bintang Rifki & Arina selalu bersinar berdampingan selamanya." ✨',
  '"Satu doa tulus meluncur: Semoga kebahagiaan selalu menyelimuti langkahmu, sayang." 💖',
  '"Ke mana pun kompas ini berputar, arahnya akan selalu kembali berlabuh padamu." 🧭',
  '"Harapan terindah malam ini: Semoga tidurmu nyenyak dan mimpimu dipenuhi kedamaian." 🌌',
  '"Doaku melangit: Dijauhkan dari segala bising cemas, didekatkan pada tawa bahagia." 🌸',
  '"Di setiap sudut semesta, rindu ini akan selalu menemukan jalan pulang ke hatimu." 🌠',
  '"Semoga takdir indah yang sedang kita tenun bermuara pada masa depan yang abadi." 🛡️',
];

function initStarCompassInteractivity() {
  const compassBtn = document.getElementById("interactiveStarCompass");
  const compassText = document.getElementById("starCompassWisdom");

  if (!compassBtn) return;

  compassBtn.onclick = (e) => {
    const rect = compassBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Trigger ledakan bunga & kembang api
    triggerFlowerBurst(centerX, centerY);
    triggerMassiveCelebration();

    // Pemicu bintang jatuh langsung pada space canvas
    for (let i = 0; i < 3; i++) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: 0,
        len: Math.random() * 100 + 40,
        speed: Math.random() * 12 + 6,
      });
    }

    // Ubah kutipan tulisan kompas cinta
    compassText.style.opacity = 0;
    compassText.style.transform = "scale(0.95)";

    setTimeout(() => {
      const randomMsg = cosmicWishes[Math.floor(Math.random() * cosmicWishes.length)];
      compassText.innerText = randomMsg;
      compassText.style.opacity = 1;
      compassText.style.transform = "scale(1)";
    }, 200);
  };
}

function updateCounter() {
  const start = new Date("2026-05-10T11:57:00");
  const now = new Date();
  let diff = now - start;

  if (diff < 0) diff = 0;

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("c-years").innerText = years;
  document.getElementById("c-months").innerText = months;
  document.getElementById("c-days").innerText = days;
  document.getElementById("c-hours").innerText = hours;
  document.getElementById("c-minutes").innerText = minutes;
  document.getElementById("c-seconds").innerText = seconds;
}

// Hitung Mundur Ulang Tahun Rifki & Arina
// Hari lahir Rifki Al Azhari 15 Juli 2006, Arina Husnul Nafisah 07 Juli 2008
function updateBirthdayCountdown() {
  const now = new Date();
  const currentYear = now.getFullYear();

  let nextUltahKu = new Date(currentYear, 6, 15);
  if (now > nextUltahKu) {
    nextUltahKu.setFullYear(currentYear + 1);
  }
  let diffKu = nextUltahKu - now;
  let daysKu = Math.ceil(diffKu / (1000 * 60 * 60 * 24));
  let ageKu = nextUltahKu.getFullYear() - 2006;

  let nextUltahAlin = new Date(currentYear, 6, 7);
  if (now > nextUltahAlin) {
    nextUltahAlin.setFullYear(currentYear + 1);
  }
  let diffAlin = nextUltahAlin - now;
  let daysAlin = Math.ceil(diffAlin / (1000 * 60 * 60 * 24));
  let ageAlin = nextUltahAlin.getFullYear() - 2008;

  const timerText = document.getElementById("birthdayTimerText");

  const isUltahKu = now.getDate() === 15 && now.getMonth() === 6;
  const isUltahAlin = now.getDate() === 7 && now.getMonth() === 6;

  if (isUltahKu) {
    timerText.innerHTML = `🎉 <strong>Hari ini adalah hari ulang tahun Rifki Al Azhari yang ke-${ageKu}!</strong> Momen yang sangat istimewa! 🎉`;
  } else if (isUltahAlin) {
    timerText.innerHTML = `💖 <strong>Hari ini adalah hari ulang tahun Arina Husnul Nafisah yang ke-${ageAlin}!</strong> Semoga bahagia selalu! 💖`;
  } else {
    if (daysKu < daysAlin) {
      timerText.innerHTML = `<i class="fa-regular fa-star text-yellow-300"></i> Momen Rifki terdekat: <strong>${daysKu} hari lagi</strong> (Ke-${ageKu} pada 15 Juli)`;
    } else {
      timerText.innerHTML = `<i class="fa-solid fa-heart text-pink-400"></i> Momen Arina terdekat: <strong>${daysAlin} hari lagi</strong> (Ke-${ageAlin} pada 7 Juli)`;
    }
  }
}

// Menghitung Umur Dinamis Berdasarkan Tanggal Lahir Secara Real-Time
function updateDynamicAges() {
  function getAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  const ageRifkiEl = document.getElementById("age-rifki");
  const ageArinaEl = document.getElementById("age-arina");

  if (ageRifkiEl) ageRifkiEl.innerText = getAge("2006-07-15");
  if (ageArinaEl) ageArinaEl.innerText = getAge("2008-07-07");
}

// Daftar Lagu Romantis
const playlist = [
  { title: "Sesuatu Yang Sempurna", artist: "Hijau Daun", url: "musik/lagu1.mp3" },
  { title: "Bukan Cinta Biasa", artist: "Siti Nurhaliza", url: "musik/lagu2.mp3" },
  { title: "Sedia Aku Sebelum Hujan", artist: "Brigitta Meliala", url: "musik/lagu3.mp3" },
  { title: "Surat Cinta Untuk Starla", artist: "Virgoun Putra Tambunan", url: "musik/lagu4.mp3" },
  { title: "Celengan Rindu", artist: "Fiersa Besari", url: "musik/lagu5.mp3" },
];
let currentTrack = 0;
const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");

function loadTrack(i) {
  currentTrack = i;
  audio.src = playlist[i].url;
  document.getElementById("trackName").innerText = `${playlist[i].title} - ${playlist[i].artist}`;
  renderPlaylist();
}

function renderPlaylist() {
  const container = document.getElementById("playlistItems");
  container.innerHTML = "";
  playlist.forEach((track, i) => {
    const isActive = i === currentTrack;
    const div = document.createElement("div");
    div.className = `p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${isActive ? "bg-violet-500/20 border border-violet-500/30" : "hover:bg-white/5"}`;
    div.innerHTML = `
                          <div class="flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                                  <i class="fa-solid ${isActive ? "fa-volume-high text-violet-400" : "fa-play text-xs opacity-40"}"></i>
                              </div>
                              <div>
                                  <p class="text-xs font-bold ${isActive ? "text-violet-300" : "text-white/80"}">${track.title}</p>
                                  <p class="text-[9px] uppercase text-white/40">${track.artist}</p>
                              </div>
                          </div>
                      `;
    div.onclick = () => {
      loadTrack(i);
      audio.play();
      playIcon.className = "fa-solid fa-pause";
    };
    container.appendChild(div);
  });
}

document.getElementById("togglePlaylist").onclick = () => {
  const p = document.getElementById("playlistWindow");
  p.classList.toggle("opacity-0");
  p.classList.toggle("pointer-events-none");
  p.classList.toggle("translate-y-10");
  document.getElementById("themeWindow").classList.add("opacity-0", "pointer-events-none", "translate-y-10");
};
document.getElementById("closePlaylist").onclick = () => {
  const p = document.getElementById("playlistWindow");
  p.classList.add("opacity-0", "pointer-events-none", "translate-y-10");
};

document.getElementById("toggleTheme").onclick = () => {
  const t = document.getElementById("themeWindow");
  t.classList.toggle("opacity-0");
  t.classList.toggle("pointer-events-none");
  t.classList.toggle("translate-y-10");
  document.getElementById("playlistWindow").classList.add("opacity-0", "pointer-events-none", "translate-y-10");
};
document.getElementById("closeTheme").onclick = () => {
  const t = document.getElementById("themeWindow");
  t.classList.add("opacity-0", "pointer-events-none", "translate-y-10");
};

playBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playIcon.className = "fa-solid fa-pause";
  } else {
    audio.pause();
    playIcon.className = "fa-solid fa-play ml-1";
  }
};

// LOGIKA KUNJUNGAN STREAK HARIAN
function initVisitStreak() {
  const startStreak = new Date("2026-05-11T11:57:00");
  const now = new Date();

  const diffTime = now - startStreak;
  let count = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (count < 1) count = 1;

  const streakNumEl = document.getElementById("streak-number");
  const modalStreakCountEl = document.getElementById("modal-streak-count");
  if (streakNumEl) streakNumEl.innerText = count;
  if (modalStreakCountEl) modalStreakCountEl.innerText = count;

  updateFlameTiers(count);
}

function updateFlameTiers(count) {
  const root = document.documentElement;
  let flameColor, glow1, glow2, tierText;

  if (count < 30) {
    flameColor = "#f59e0b";
    glow1 = "rgba(245, 158, 11, 0.6)";
    glow2 = "rgba(239, 68, 68, 0.95)";
    tierText = "Love Ember 🔥 (Kehangatan Mula-mula)";
  } else if (count >= 30 && count < 50) {
    flameColor = "#ef4444";
    glow1 = "rgba(239, 68, 68, 0.75)";
    glow2 = "rgba(185, 28, 28, 0.95)";
    tierText = "Scarlet Passion 🌹 (Makin Membara Indah!)";
  } else if (count >= 50 && count < 100) {
    flameColor = "#c084fc";
    glow1 = "rgba(139, 92, 246, 0.7)";
    glow2 = "rgba(76, 29, 149, 0.95)";
    tierText = "Cosmic Amethyst 🌌 (Satu Frekuensi Jiwa)";
  } else {
    flameColor = "#f43f5e";
    glow1 = "rgba(244, 63, 94, 0.85)";
    glow2 = "rgba(225, 29, 72, 0.98)";
    tierText = "Eternal Supernova ✨ (Abadi Tak Terhingga)";
  }

  root.style.setProperty("--flame-color", flameColor);
  root.style.setProperty("--flame-glow-1", glow1);
  root.style.setProperty("--flame-glow-2", glow2);

  const label = document.getElementById("flame-tier-label");
  if (label) {
    label.innerText = tierText;
    label.style.color = flameColor;
  }
}

function initStreakModalControls() {
  const streakModal = document.getElementById("streakInfoModal");
  const openBtn = document.getElementById("openStreakInfoBtn");
  const closeBtn = document.getElementById("closeStreakInfo");
  const claimBtn = document.getElementById("claimStreakBtn");

  openBtn.onclick = () => {
    streakModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  closeBtn.onclick = () => {
    streakModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  claimBtn.onclick = () => {
    streakModal.classList.remove("active");
    document.body.style.overflow = "";
  };
}

// ==========================================
// SISTEM KEMBANG API MEWAH
// ==========================================
const fwCanvas = document.getElementById("fireworks-canvas");
const fwCtx = fwCanvas.getContext("2d");
let fireworks = [];
let fwParticles = [];

function resizeFwCanvas() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}

class FireworkRocket {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = Math.sqrt(Math.pow(sx - tx, 2) + Math.pow(sy - ty, 2));
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.04;
    this.brightness = Math.random() * 20 + 60;
    this.hue = Math.random() * 360;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.acceleration;
    let vx = Math.cos(this.angle) * this.speed;
    let vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = Math.sqrt(Math.pow(this.sx - (this.x + vx), 2) + Math.pow(this.sy - (this.y + vy), 2));

    if (this.distanceTraveled >= this.distanceToTarget) {
      createLuxuriousBurst(this.tx, this.ty, this.hue);
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw() {
    fwCtx.beginPath();
    fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    fwCtx.lineTo(this.x, this.y);
    fwCtx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
    fwCtx.lineWidth = 1.8;
    fwCtx.stroke();
  }
}

class LuxuriousParticle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 6 + 2;
    this.friction = 0.95;
    this.gravity = 0.1;
    this.hue = Math.random() * 40 + (hue - 20);
    this.brightness = Math.random() * 30 + 50;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.01;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
      fwParticles.splice(index, 1);
    }
  }

  draw() {
    fwCtx.beginPath();
    fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    fwCtx.lineTo(this.x, this.y);
    fwCtx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    fwCtx.lineWidth = Math.random() * 1.5 + 1;
    fwCtx.stroke();
  }
}

function createLuxuriousBurst(x, y, hue) {
  // Optimasi: Kurangi partikel kembang api di HP agar lancar
  let pCount = window.innerWidth < 640 ? 40 : 80;
  while (pCount--) {
    fwParticles.push(new LuxuriousParticle(x, y, hue));
  }
}

function launchSingleRocket() {
  let sx = Math.random() * (fwCanvas.width * 0.6) + fwCanvas.width * 0.2;
  let sy = fwCanvas.height;
  let tx = Math.random() * (fwCanvas.width * 0.8) + fwCanvas.width * 0.1;
  let ty = Math.random() * (fwCanvas.height * 0.45) + fwCanvas.height * 0.1;
  fireworks.push(new FireworkRocket(sx, sy, tx, ty));
}

function triggerMassiveCelebration() {
  // Kurangi jumlah selebrasi beruntun di HP
  let burstCount = window.innerWidth < 640 ? 4 : 7;
  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      launchSingleRocket();
    }, i * 300);
  }
}

function runFireworksLoop() {
  if (!animationsEnabled) {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    requestAnimationFrame(runFireworksLoop);
    return;
  }

  fwCtx.globalCompositeOperation = "destination-out";
  fwCtx.fillStyle = "rgba(0, 0, 0, 0.22)";
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwCtx.globalCompositeOperation = "lighter";

  let rCount = fireworks.length;
  while (rCount--) {
    fireworks[rCount].draw();
    fireworks[rCount].update(rCount);
  }

  let pCount = fwParticles.length;
  while (pCount--) {
    fwParticles[pCount].draw();
    fwParticles[pCount].update(pCount);
  }

  requestAnimationFrame(runFireworksLoop);
}

document.getElementById("launchFireworksBtn").onclick = () => {
  triggerMassiveCelebration();
};

setInterval(() => {
  if (Math.random() < 0.3) {
    launchSingleRocket();
  }
}, 15000);

// Galeri Demo Romantis jika API belum terhubung atau error
const demoGalleryData = [
  {
    folder: "Januari 2026",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
        time: "10 Januari 2026",
        note: "Momen manis saat kita menikmati senja di bawah rasi bintang yang sama.",
      },
      {
        url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
        time: "24 Januari 2026",
        note: "Tawa ceriamu hari ini adalah suara favoritku di seluruh alam semesta.",
      },
    ],
  },
  {
    folder: "Februari 2026",
    images: [
      {
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600",
        time: "14 Februari 2026",
        note: "Merayakan hari kasih sayang dengan secangkir cokelat hangat dan senyum termanismu.",
      },
    ],
  },
  {
    folder: "Maret 2026",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
        time: "05 Maret 2026",
        note: "Melangkah bersama, merekatkan jalinan kenangan yang indah.",
      },
    ],
  },
];

let allGalleryData = [];
let activeFolderFilter = "";

window.closeCurrentFolder = () => {
  activeFolderFilter = "";
  buildFolderNavigation(allGalleryData);
  renderFilteredGallery();
};

function buildFolderNavigation(data) {
  const nav = document.getElementById("folderNav");
  nav.innerHTML = "";

  const folderList = [{ name: "Semua", isAll: true }];
  data.forEach((folderObj) => {
    folderList.push({ name: folderObj.folder, isAll: false });
  });

  folderList.forEach((folderItem) => {
    const isActive = activeFolderFilter === folderItem.name;

    const folderContainer = document.createElement("div");
    folderContainer.className = `folder-container folder-wrapper relative flex flex-col items-center justify-end cursor-pointer ${isActive ? "active" : ""}`;

    folderContainer.innerHTML = `
                  <div class="absolute inset-x-1 bottom-6 sm:bottom-8 top-5 sm:top-6 folder-back"></div>
                  <div class="absolute inset-x-3 sm:inset-x-4 h-10 sm:h-12 bottom-9 sm:bottom-12 folder-paper-2 rounded-t-lg flex items-center justify-center">
                    <i class="fa-solid fa-heart text-[7px] sm:text-[8px] text-pink-400/50"></i>
                  </div>
                  <div class="absolute inset-x-5 sm:inset-x-6 h-10 sm:h-12 bottom-8 sm:bottom-10 folder-paper-1 rounded-t-lg flex items-center justify-center">
                    <i class="fa-solid fa-star text-[6px] sm:text-[7px] text-sky-400/50"></i>
                  </div>
                  <div class="absolute inset-x-1 bottom-6 sm:bottom-8 top-10 sm:top-12 folder-front shadow-lg">
                    <div class="absolute -top-2 sm:-top-3 left-0 w-8 sm:w-12 h-2 sm:h-3 bg-inherit border-t border-l border-r border-violet-400/30 rounded-t-md"></div>
                    <div class="absolute inset-0 flex items-center justify-center text-white/30 text-[10px] sm:text-xs">
                      <i class="fa-solid ${folderItem.isAll ? "fa-globe" : "fa-images"}"></i>
                    </div>
                  </div>
                  <span class="folder-title mt-2 text-[8px] sm:text-[10px] font-bold tracking-wider text-sky-200/80 uppercase text-center truncate w-full z-10 transition-colors px-1">
                    ${folderItem.name}
                  </span>
                `;

    folderContainer.onclick = () => {
      if (activeFolderFilter === folderItem.name) {
        activeFolderFilter = "";
      } else {
        activeFolderFilter = folderItem.name;
      }
      buildFolderNavigation(data);
      renderFilteredGallery();
    };

    nav.appendChild(folderContainer);
  });
}

function renderFilteredGallery() {
  const container = document.getElementById("galleryContainer");
  const status = document.getElementById("galleryStatus");
  container.innerHTML = "";

  if (!activeFolderFilter) {
    status.innerHTML = `
                  <div class="glass p-6 sm:p-8 rounded-3xl max-w-sm sm:max-w-md mx-auto border border-violet-500/20 text-center animate-pulse py-10 sm:py-12 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                    <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-violet-500/15 flex items-center justify-center mx-auto mb-4">
                      <i class="fa-solid fa-folder-closed text-2xl sm:text-3xl text-violet-400"></i>
                    </div>
                    <p class="text-xs sm:text-sm text-sky-200/90 italic font-semibold tracking-wide px-2">
                      "Ketuk salah satu folder di atas untuk membuka lembaran kenangan kita..." ✨
                    </p>
                  </div>
                `;
    status.classList.remove("hidden");
    return;
  }
  status.classList.add("hidden");

  const filteredData = activeFolderFilter === "Semua" ? allGalleryData : allGalleryData.filter((f) => f.folder === activeFolderFilter);

  if (!filteredData || filteredData.length === 0) {
    status.innerHTML = `
                  <div class="text-center py-10 px-4">
                    <p class="text-white/40 italic text-xs sm:text-sm mb-4">Belum ada kenangan di folder ini.</p>
                    <button onclick="closeCurrentFolder()" class="text-[10px] sm:text-xs bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2 mx-auto">
                      <i class="fa-solid fa-folder-closed"></i> Tutup Folder
                    </button>
                  </div>
                `;
    status.classList.remove("hidden");
    return;
  }

  filteredData.forEach((folderObj) => {
    const section = document.createElement("section");
    section.className = "mb-12";
    section.innerHTML = `
                            <div class="flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-white/5">
                                <div class="flex items-center gap-3">
                                    <h3 class="text-base sm:text-xl font-bold text-sky-300 uppercase tracking-[0.15em] sm:tracking-[0.2em]">${folderObj.folder}</h3>
                                    <div class="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-sky-500/50 to-transparent"></div>
                                </div>
                                <button onclick="closeCurrentFolder()" class="text-[10px] sm:text-xs bg-violet-600/20 hover:bg-violet-600/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-violet-500/30 text-violet-200 hover:text-white transition-all flex items-center gap-1.5 shrink-0">
                                    <i class="fa-solid fa-folder-closed"></i> Tutup
                                </button>
                            </div>
                            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"></div>
                        `;

    const grid = section.querySelector(".grid");
    folderObj.images.forEach((img) => {
      const div = document.createElement("div");
      div.className = "gallery-item glass rounded-2xl sm:rounded-3xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 cursor-pointer";
      div.innerHTML = `
                                <div class="relative aspect-[4/5] overflow-hidden bg-white/5">
                                    <img src="${img.url}" loading="lazy" decoding="async" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" onerror="this.src='https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600'">
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <i class="fa-solid fa-expand text-white text-lg sm:text-2xl animate-pulse"></i>
                                    </div>
                                </div>
                                <div class="p-3 sm:p-5">
                                    <p class="text-[8px] sm:text-[10px] font-bold text-sky-300 uppercase tracking-widest mb-1 truncate">${img.time}</p>
                                    <p class="text-white/70 text-[10px] sm:text-xs italic line-clamp-2 leading-relaxed">"${img.note}"</p>
                                </div>
                            `;
      div.onclick = () => openPreview(img.url, img.note, folderObj.folder, img.time);
      grid.appendChild(div);
    });
    container.appendChild(section);
  });
}

async function fetchGallery() {
  try {
    const response = await fetch(BACKEND_URL);
    const data = await response.json();
    if (data && data.length > 0) {
      allGalleryData = data;
    } else {
      allGalleryData = demoGalleryData;
    }
  } catch (e) {
    allGalleryData = demoGalleryData;
  }
  buildFolderNavigation(allGalleryData);
  renderFilteredGallery();
  initializeCarousel();
}

// ==========================================
// CAROUSEL AUTO SLIDESHOW
// ==========================================
let carouselData = [];
let currentSlide = 0;
let carouselAutoPlay = true;
let carouselInterval = null;

function initializeCarousel() {
  // Flatten all images from all folders
  carouselData = [];
  allGalleryData.forEach((folder) => {
    folder.images.forEach((img) => {
      carouselData.push({
        url: img.url,
        note: img.note,
        time: img.time,
        folder: folder.folder,
      });
    });
  });

  if (carouselData.length === 0) {
    document.getElementById("carouselSection").style.display = "none";
    return;
  }

  document.getElementById("carouselSection").style.display = "block";
  renderCarouselSlides();
  updateCarouselDisplay();
  startCarouselAutoPlay();
}

function renderCarouselSlides() {
  const slidesContainer = document.getElementById("carouselSlides");
  slidesContainer.innerHTML = "";

  carouselData.forEach((slide, index) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = `carousel-slide ${index === 0 ? "active" : ""}`;
    slideDiv.innerHTML = `<img src="${slide.url}" alt="Carousel slide ${index + 1}" onerror="this.src='https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600'" loading="lazy" decoding="async">`;
    slidesContainer.appendChild(slideDiv);
  });
}

function updateCarouselDisplay() {
  const slides = document.querySelectorAll(".carousel-slide");
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });

  const slide = carouselData[currentSlide];
  document.getElementById("carouselNote").innerText = `"${slide.note}"`;
  document.getElementById("carouselTime").innerText = `${slide.folder} • ${slide.time}`;
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % carouselData.length;
  updateCarouselDisplay();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
  updateCarouselDisplay();
}

function startCarouselAutoPlay() {
  if (carouselAutoPlay && carouselData.length > 1) {
    carouselInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % carouselData.length;
      updateCarouselDisplay();
    }, 6000);
  }
}

function toggleCarouselPlayPause() {
  carouselAutoPlay = !carouselAutoPlay;
  const icon = document.getElementById("playPauseIcon");
  if (carouselAutoPlay) {
    icon.className = "fa-solid fa-pause";
    startCarouselAutoPlay();
  } else {
    icon.className = "fa-solid fa-play";
    if (carouselInterval) {
      clearInterval(carouselInterval);
      carouselInterval = null;
    }
  }
}

// Note: Manual controls are hidden, carousel auto-plays

const modal = document.getElementById("imagePreviewModal");
const previewImg = document.getElementById("previewImg");
const previewNote = document.getElementById("previewNote");
const previewDate = document.getElementById("previewDate");
const downloadBtn = document.getElementById("downloadBtn");

function openPreview(url, note, folder, time) {
  previewImg.src = url;
  previewNote.innerText = note;
  previewDate.innerText = `${folder} • ${time}`;
  downloadBtn.href = url;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

document.getElementById("closePreview").onclick = () => {
  modal.classList.remove("active");
  document.body.style.overflow = "";
};

const upModal = document.getElementById("uploadModal");
const fileInput = document.getElementById("fileInput");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const submitBtn = document.getElementById("submitUpload");
const uploadMsg = document.getElementById("uploadMsg");
const noteInput = document.getElementById("noteInput");

// Deklarasi Elemen Baru untuk Pratinjau Banyak Foto
const multiPreviewContainer = document.getElementById("multiPreviewContainer");
const multiPreviewGrid = document.getElementById("multiPreviewGrid");
const selectedCount = document.getElementById("selectedCount");
const uploadProgressContainer = document.getElementById("uploadProgressContainer");
const uploadProgressBar = document.getElementById("uploadProgressBar");
const progressText = document.getElementById("progressText");
const progressPercent = document.getElementById("progressPercent");

document.getElementById("openUploadBtn").onclick = () => {
  upModal.classList.add("active");
  document.body.style.overflow = "hidden";
};

function resetUploadForm() {
  fileInput.value = "";
  selectedFiles = [];
  multiPreviewGrid.innerHTML = "";
  multiPreviewContainer.classList.add("hidden");
  uploadPlaceholder.classList.remove("hidden");
  uploadMsg.classList.add("hidden");
  noteInput.value = "";
  uploadProgressContainer.classList.add("hidden");
  uploadProgressBar.style.width = "0%";
  progressText.innerText = "MENGUNGGAH: 0 / 0 FOTO";
  progressPercent.innerText = "0%";
  submitBtn.disabled = false;
  submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane text-xs"></i> <span>Kirim ke Vault</span>`;
}

document.getElementById("closeUpload").onclick = () => {
  upModal.classList.remove("active");
  document.body.style.overflow = "";
  resetUploadForm();
};

// Handler Penanganan Pilihan Berkas Beruntun / Banyak Berkas
fileInput.onchange = () => {
  const files = Array.from(fileInput.files);
  if (files.length > 0) {
    // Gabungkan dengan file yang sudah dipilih sebelumnya
    selectedFiles = selectedFiles.concat(files);
    renderMultiPreviews();
  }
};

function renderMultiPreviews() {
  multiPreviewGrid.innerHTML = "";

  if (selectedFiles.length > 0) {
    uploadPlaceholder.classList.add("hidden");
    multiPreviewContainer.classList.remove("hidden");
    selectedCount.innerText = selectedFiles.length;

    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewItem = document.createElement("div");
        previewItem.className = "preview-grid-item";
        previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview" />
                <div class="remove-preview-btn" onclick="removeSingleFile(${index})">
                  <i class="fa-solid fa-xmark"></i>
                </div>
              `;
        multiPreviewGrid.appendChild(previewItem);
      };
      reader.readAsDataURL(file);
    });
  } else {
    uploadPlaceholder.classList.remove("hidden");
    multiPreviewContainer.classList.add("hidden");
  }
}

window.removeSingleFile = (index) => {
  selectedFiles.splice(index, 1);
  renderMultiPreviews();
};

// Mengunggah Banyak Berkas Secara Berurutan Ke Backend
submitBtn.onclick = async () => {
  if (selectedFiles.length === 0) {
    uploadMsg.innerText = "Pilih setidaknya satu foto terlebih dahulu.";
    uploadMsg.className = "p-3 rounded-xl text-[10px] uppercase text-red-400 border border-red-500/30";
    uploadMsg.classList.remove("hidden");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> <span>Mengunggah...</span>`;
  uploadMsg.classList.add("hidden");
  uploadProgressContainer.classList.remove("hidden");

  const totalFiles = selectedFiles.length;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < totalFiles; i++) {
    const file = selectedFiles[i];
    const currentNum = i + 1;

    // Perbarui Tampilan Kemajuan
    progressText.innerText = `MENGUNGGAH: ${currentNum} / ${totalFiles} FOTO`;
    const currentPercent = Math.round((i / totalFiles) * 100);
    uploadProgressBar.style.width = `${currentPercent}%`;
    progressPercent.innerText = `${currentPercent}%`;

    try {
      const base64Data = await getBase64(file);
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "upload",
          fileName: file.name,
          base64: base64Data,
          note: noteInput.value,
        }),
      });
      const result = await res.json();
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (e) {
      failCount++;
    }
  }

  // Selesai Semua Upload
  uploadProgressBar.style.width = "100%";
  progressPercent.innerText = "100%";

  if (successCount === totalFiles) {
    uploadMsg.innerText = `Sukses! ${successCount} Kenangan sudah tersimpan di Vault.`;
    uploadMsg.className = "p-3 rounded-xl text-[10px] uppercase text-green-400 border border-green-500/30";
  } else {
    uploadMsg.innerText = `Selesai dengan beberapa kendala. Berhasil: ${successCount}, Gagal: ${failCount}`;
    uploadMsg.className = "p-3 rounded-xl text-[10px] uppercase text-yellow-400 border border-yellow-500/30";
  }
  uploadMsg.classList.remove("hidden");

  setTimeout(async () => {
    upModal.classList.remove("active");
    document.body.style.overflow = "";
    resetUploadForm();
    await fetchGallery();
  }, 2000);
};

// Helper Mengubah File Menjadi Base64 dengan Promise (Agar bisa sinkron satu per satu)
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// Throttling Event Resize Agar Tidak Membebankan Browser
let resizeTimeout;
window.addEventListener("resize", () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initSpace();
    resizeFlowersCanvas();
    resizeFwCanvas();
  }, 250);
});

// ==========================================
// AUTOMATED CELEBRATIONS
// ==========================================
function updateCelebrationCountdowns() {
  const anniversary = new Date("2026-05-10");
  const now = new Date();

  // Anniversary countdown
  let nextAnniversary = new Date(now.getFullYear(), anniversary.getMonth(), anniversary.getDate());
  if (now > nextAnniversary) {
    nextAnniversary = new Date(now.getFullYear() + 1, anniversary.getMonth(), anniversary.getDate());
  }

  const daysUntilAnniversary = Math.ceil((nextAnniversary - now) / (1000 * 60 * 60 * 24));
  document.getElementById("anniversaryCountdown").innerText = `${daysUntilAnniversary} Hari Lagi`;
  document.getElementById("anniversaryText").innerText = nextAnniversary.toLocaleDateString("id-ID");

  // Update every day
  setTimeout(updateCelebrationCountdowns, 24 * 60 * 60 * 1000);
}

// Memory Map
let celebrationMap = null;
let mapMarkers = [];

function initMemoryMap() {
  if (!celebrationMap) {
    celebrationMap = L.map("celebrationMap", { zoomControl: true }).setView([-6.2088, 106.8456], 11);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
      filter: (el) => el.classList.add("brightness-75", "contrast-125"),
    }).addTo(celebrationMap);

    celebrationMap.on("click", (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const locationName = prompt("Nama lokasi ini:");
      if (locationName) {
        addMemoryMarker(lat, lng, locationName);
      }
    });

    loadSavedMemories();
  }
}

function addMemoryMarker(lat, lng, name) {
  const marker = L.circleMarker([lat, lng], {
    radius: 8,
    fillColor: "#8b5cf6",
    color: "#7dd3fc",
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.8,
  })
    .bindPopup(`<div class="text-center"><strong class="text-purple-600">${name}</strong><br><small>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</small></div>`)
    .addTo(celebrationMap);

  mapMarkers.push({ lat, lng, name });
  localStorage.setItem("memoryLocations", JSON.stringify(mapMarkers));
  updateLocationsList();
}

function loadSavedMemories() {
  const saved = localStorage.getItem("memoryLocations");
  if (saved) {
    mapMarkers = JSON.parse(saved);
    mapMarkers.forEach((m) => {
      L.circleMarker([m.lat, m.lng], {
        radius: 8,
        fillColor: "#8b5cf6",
        color: "#7dd3fc",
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.8,
      })
        .bindPopup(`<strong>${m.name}</strong>`)
        .addTo(celebrationMap);
    });
    updateLocationsList();
  }
}

function updateLocationsList() {
  const list = document.getElementById("savedLocations");
  list.innerHTML = mapMarkers.map((m) => `<div class="text-white/70">📍 ${m.name}</div>`).join("");
}

// ==========================================
// CUSTOM THEME CREATOR
// ==========================================
let customThemes = JSON.parse(localStorage.getItem("customThemes")) || {};

function initThemeCreator() {
  const primaryPicker = document.getElementById("primaryColorPicker");
  const secondaryPicker = document.getElementById("secondaryColorPicker");
  const preview = document.getElementById("themePreview");
  const saveBtn = document.getElementById("saveThemeBtn");
  const themeName = document.getElementById("themeName");

  primaryPicker.addEventListener("input", (e) => {
    preview.style.setProperty("--preview-primary", e.target.value);
  });

  secondaryPicker.addEventListener("input", (e) => {
    preview.style.setProperty("--preview-secondary", e.target.value);
  });

  saveBtn.onclick = () => {
    if (!themeName.value) {
      alert("Masukkan nama tema!");
      return;
    }

    customThemes[themeName.value] = {
      primary: primaryPicker.value,
      secondary: secondaryPicker.value,
    };

    localStorage.setItem("customThemes", JSON.stringify(customThemes));
    renderCustomThemes();
    themeName.value = "";
  };

  renderCustomThemes();
}

function renderCustomThemes() {
  const list = document.getElementById("customThemesList");
  list.innerHTML = "";

  Object.entries(customThemes).forEach(([name, colors]) => {
    const btn = document.createElement("button");
    btn.className = "p-3 rounded-lg border-2 border-white/10 hover:border-white/30 transition-all text-white text-sm";
    btn.style.background = `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
    btn.innerHTML = `${name}<br><small>${colors.primary}</small>`;
    btn.onclick = () => {
      applyCustomTheme(colors);
      localStorage.setItem("selectedTheme", name);
    };
    list.appendChild(btn);
  });
}

function applyCustomTheme(colors) {
  document.documentElement.style.setProperty("--theme-primary", colors.primary);
  document.documentElement.style.setProperty("--theme-secondary", colors.secondary);
  document.documentElement.style.setProperty("--bg-gradient", `linear-gradient(135deg, ${colors.primary}22, ${colors.secondary}22)`);
}

function setupModalToggles() {
  // Celebrations
  document.getElementById("toggleCelebrations").onclick = () => {
    const modal = document.getElementById("celebrationsModal");
    modal.classList.remove("opacity-0", "pointer-events-none", "translate-y-10");
    updateCelebrationCountdowns();
  };
  document.getElementById("closeCelebrations").onclick = () => {
    const modal = document.getElementById("celebrationsModal");
    modal.classList.add("opacity-0", "pointer-events-none", "translate-y-10");
  };

  // Throwback button
  document.getElementById("throwbackBtn").onclick = () => {
    const allPhotos = Array.from(document.querySelectorAll("#albumGallery img"));
    if (allPhotos.length > 0) {
      const randomPhoto = allPhotos[Math.floor(Math.random() * allPhotos.length)];
      randomPhoto.click();
    } else {
      alert("Tidak ada foto dalam galeri!");
    }
  };

  // Map
  document.getElementById("toggleMemoryMap").onclick = () => {
    const modal = document.getElementById("mapModal");
    modal.classList.remove("opacity-0", "pointer-events-none", "translate-y-10");
    setTimeout(() => initMemoryMap(), 100);
  };
  document.getElementById("closeMap").onclick = () => {
    const modal = document.getElementById("mapModal");
    modal.classList.add("opacity-0", "pointer-events-none", "translate-y-10");
  };

  // Theme Creator
  document.getElementById("toggleThemeCreator").onclick = () => {
    const modal = document.getElementById("themeCreatorModal");
    modal.classList.remove("opacity-0", "pointer-events-none", "translate-y-10");
  };
  document.getElementById("closeThemeCreator").onclick = () => {
    const modal = document.getElementById("themeCreatorModal");
    modal.classList.add("opacity-0", "pointer-events-none", "translate-y-10");
  };
}

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("selectedThemeArina") || "midnight";
  applyTheme(savedTheme);

  initSpace();
  animateSpace();

  initFallingFlowers();
  animateFlowers();

  initStarCompassInteractivity();

  fetchGallery();
  loadTrack(0);

  runFireworksLoop();

  setInterval(updateCounter, 1000);
  updateCounter();

  updateBirthdayCountdown();
  setInterval(updateBirthdayCountdown, 60000);

  updateDynamicAges();
  setInterval(updateDynamicAges, 3600000);

  initVisitStreak();
  initStreakModalControls();

  const toggleAnimBtn = document.getElementById("toggleAnimationsBtn");
  const toggleAnimIcon = document.getElementById("toggleAnimIcon");
  const toggleAnimText = document.getElementById("toggleAnimText");

  toggleAnimBtn.onclick = () => {
    animationsEnabled = !animationsEnabled;
    if (animationsEnabled) {
      toggleAnimBtn.classList.remove("bg-rose-500/20", "border-rose-400/30", "shadow-[0_0_15px_rgba(244,63,94,0.2)]");
      toggleAnimBtn.classList.add("bg-emerald-500/20", "border-emerald-400/30", "shadow-[0_0_15px_rgba(16,185,129,0.2)]");
      toggleAnimIcon.className = "fa-solid fa-toggle-on text-emerald-400 text-sm sm:text-base";
      toggleAnimText.innerText = "Animasi: ON";
      triggerMassiveCelebration();
    } else {
      toggleAnimBtn.classList.remove("bg-emerald-500/20", "border-emerald-400/30", "shadow-[0_0_15px_rgba(16,185,129,0.2)]");
      toggleAnimBtn.classList.add("bg-rose-500/20", "border-rose-400/30", "shadow-[0_0_15px_rgba(244,63,94,0.2)]");
      toggleAnimIcon.className = "fa-solid fa-toggle-off text-rose-400 text-sm sm:text-base";
      toggleAnimText.innerText = "Animasi: OFF";
    }
  };

  setInterval(() => {
    formingName = !formingName;
  }, 10000);

  setTimeout(() => {
    document.getElementById("preloader").classList.add("fade-out");
    if (window.AOS) AOS.init({ duration: 1000, once: true });

    setTimeout(() => {
      triggerMassiveCelebration();
    }, 1500);
  }, 2000);

  // ==========================================
  // PWA SERVICE WORKER & INSTALL PROMPT
  // ==========================================
  // Register Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("✅ Service Worker registered successfully:", registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000);
      })
      .catch((error) => {
        console.warn("⚠️ Service Worker registration failed:", error);
      });
  }

  // PWA Install Prompt
  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log("💾 PWA install prompt available");
  });

  window.addEventListener("appinstalled", () => {
    console.log("✨ PWA was installed");
    deferredPrompt = null;
  });

  // Initialize feature modals
  setupModalToggles();
  initThemeCreator();
});
