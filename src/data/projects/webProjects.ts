import { WebProject } from '@/types';

export const WEB_PROJECTS: WebProject[] = [
  {
    id: 'project-401',
    worldId: 'projects',
    title: 'Personal Profile Page',
    description: 'Rancang halaman profil diri online yang profesional, rapi, dan responsif menggunakan semantic HTML dan CSS modern.',
    difficulty: 'Pemula',
    prerequisites: ['html-107', 'css-203'],
    xpReward: 100,
    criteria: [
      'Memiliki elemen <header> dengan nama dan profesi',
      'Memiliki bagian foto profil atau avatar berbentuk lingkaran (border-radius: 50%)',
      'Memiliki daftar keahlian (skills list) menggunakan tag <ul> dan <li>',
      'Menggunakan card styling dengan border, padding, dan bayangan (box-shadow)',
      'Tersedia tombol kontak interaktif yang terhubung ke link media sosial'
    ],
    hints: [
      'Gunakan max-width: 500px dan margin: 20px auto untuk membuat kartu profil rata tengah.',
      'Gunakan display: flex untuk menyusun ikon media sosial secara horizontal dengan rapi.',
      'Tambahkan efek hover dengan transition: transform 0.2s agar kartu terasa hidup.'
    ],
    starterCode: {
      html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Profil Saya</title>
</head>
<body>
  <div class="card-profil">
    <div class="avatar-box">
      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" alt="Avatar" class="avatar">
    </div>
    <header>
      <h1>Nama Anda</h1>
      <p class="profesi">Junior Web Developer</p>
    </header>
    <main>
      <h3>Keahlian:</h3>
      <ul class="skills">
        <li>HTML5 Semantic</li>
        <li>CSS Flexbox</li>
        <li>JavaScript Basics</li>
      </ul>
    </main>
    <footer>
      <a href="#" class="btn-kontak">Hubungi Saya</a>
    </footer>
  </div>
</body>
</html>`,
      css: `body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f1f5f9;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  margin: 0;
  padding: 16px;
}

.card-profil {
  background: white;
  width: 100%;
  max-width: 380px;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #10b981;
}

h1 {
  margin: 12px 0 4px;
  font-size: 22px;
  color: #0f172a;
}

.profesi {
  color: #64748b;
  margin-top: 0;
  font-size: 14px;
}

.skills {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.skills li {
  background: #e0f2fe;
  color: #0369a1;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.btn-kontak {
  display: inline-block;
  margin-top: 16px;
  background: #10b981;
  color: white;
  text-decoration: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: bold;
  transition: opacity 0.2s;
}

.btn-kontak:hover {
  opacity: 0.9;
}`,
      js: `console.log("Halaman profil siap!");`
    }
  },
  {
    id: 'project-402',
    worldId: 'projects',
    title: 'Interactive Calculator',
    description: 'Bangun kalkulator web fungsional yang dapat melakukan operasi tambah, kurang, kali, bagi, dan reset.',
    difficulty: 'Menengah',
    prerequisites: ['css-204', 'js-304'],
    xpReward: 120,
    criteria: [
      'Memiliki layar display untuk menampilkan angka yang sedang dihitung',
      'Menggunakan CSS Grid atau Flexbox untuk menyusun tombol angka dan operator',
      'Mendukung operasi penambahan (+), pengurangan (-), perkalian (*), dan pembagian (/)',
      'Tombol AC (All Clear) untuk mengosongkan display',
      'Mencegah error runtime saat pembagian angka nol'
    ],
    hints: [
      'Gunakan dataset pada tombol (misal data-val="7") untuk membaca nilai tombol saat diklik.',
      'Gunakan display: grid dengan grid-template-columns: repeat(4, 1fr) untuk membuat susunan 4 kolom kalkulator rapi.',
      'Simpan input sebagai string, lalu evaluasi saat tombol "=" ditekan.'
    ],
    starterCode: {
      html: `<div class="kalkulator">
  <div class="display" id="layar">0</div>
  <div class="tombol-grid">
    <button class="btn aksi" onclick="bersihkan()">AC</button>
    <button class="btn aksi" onclick="hapusSatu()">DEL</button>
    <button class="btn operator" onclick="tekan('%')">%</button>
    <button class="btn operator" onclick="tekan('/')">/</button>

    <button class="btn" onclick="tekan('7')">7</button>
    <button class="btn" onclick="tekan('8')">8</button>
    <button class="btn" onclick="tekan('9')">9</button>
    <button class="btn operator" onclick="tekan('*')">&times;</button>

    <button class="btn" onclick="tekan('4')">4</button>
    <button class="btn" onclick="tekan('5')">5</button>
    <button class="btn" onclick="tekan('6')">6</button>
    <button class="btn operator" onclick="tekan('-')">-</button>

    <button class="btn" onclick="tekan('1')">1</button>
    <button class="btn" onclick="tekan('2')">2</button>
    <button class="btn" onclick="tekan('3')">3</button>
    <button class="btn operator" onclick="tekan('+')">+</button>

    <button class="btn nol" onclick="tekan('0')">0</button>
    <button class="btn" onclick="tekan('.')">.</button>
    <button class="btn sama-dengan" onclick="hitung()">=</button>
  </div>
</div>`,
      css: `body {
  font-family: sans-serif;
  background: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90vh;
  margin: 0;
}

.kalkulator {
  background: #1e293b;
  width: 320px;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.display {
  background: #0b1120;
  color: #38bdf8;
  font-family: monospace;
  font-size: 32px;
  text-align: right;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 20px;
  word-break: break-all;
  min-height: 40px;
}

.tombol-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.btn {
  background: #334155;
  color: white;
  border: none;
  font-size: 18px;
  font-weight: bold;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.1s, background 0.1s;
}

.btn:active {
  transform: scale(0.95);
}

.operator {
  background: #f59e0b;
  color: #0f172a;
}

.aksi {
  background: #ef4444;
}

.sama-dengan {
  background: #10b981;
}

.nol {
  grid-column: span 2;
}`,
      js: `let ekspresi = "";
const layar = document.getElementById("layar");

function tekan(karakter) {
  if (ekspresi === "0" && !isNaN(karakter)) {
    ekspresi = karakter;
  } else {
    ekspresi += karakter;
  }
  updateDisplay();
}

function bersihkan() {
  ekspresi = "";
  updateDisplay();
}

function hapusSatu() {
  ekspresi = ekspresi.slice(0, -1);
  updateDisplay();
}

function hitung() {
  try {
    // Sanitasi kalkulasi sederhana
    const hasil = Function('"use strict"; return (' + ekspresi + ')')();
    ekspresi = String(hasil);
    updateDisplay();
  } catch (e) {
    layar.innerText = "Error";
    ekspresi = "";
  }
}

function updateDisplay() {
  layar.innerText = ekspresi === "" ? "0" : ekspresi;
}`
    }
  },
  {
    id: 'project-403',
    worldId: 'projects',
    title: 'To-Do List Web App',
    description: 'Kembangkan aplikasi pencatat daftar tugas harian lengkap dengan fitur tambah, centang selesai, dan hapus item.',
    difficulty: 'Menengah',
    prerequisites: ['js-306'],
    xpReward: 140,
    criteria: [
      'Input form untuk mengetik tugas baru dengan tombol tambah',
      'Menampilkan daftar tugas dinamis dari Array state',
      'Tombol atau checkbox untuk menandai tugas selesai (garis coret)',
      'Tombol hapus (delete) untuk membuang tugas dari daftar',
      'Menampilkan jumlah tugas aktif yang tersisa'
    ],
    hints: [
      'Simpan daftar todo dalam array objek: { id: Date.now(), text: "...", done: false }.',
      'Gunakan method filter() saat menghapus item berdasarkan id-nya.',
      'Gunakan class CSS "selesai" dengan text-decoration: line-through untuk tugas yang sudah tuntas.'
    ],
    starterCode: {
      html: `<div class="todo-app">
  <h2>Catatan Tugas Hari Ini</h2>
  <div class="input-row">
    <input type="text" id="todoInput" placeholder="Tulis rencana tugasmu...">
    <button id="btnTambah" onclick="tambahTugas()">+ Tambah</button>
  </div>
  <ul id="todoList" class="todo-list"></ul>
  <div class="footer-info">
    <span id="sisaTugas">0 tugas tersisa</span>
  </div>
</div>`,
      css: `body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  padding: 30px 16px;
  margin: 0;
}

.todo-app {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
}

h2 {
  margin-top: 0;
  color: #0f172a;
}

.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
}

button#btnTambah {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-weight: bold;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.todo-item.selesai span {
  text-decoration: line-through;
  color: #94a3b8;
}

.btn-hapus {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

.footer-info {
  margin-top: 16px;
  font-size: 13px;
  color: #64748b;
  text-align: right;
}`,
      js: `let todos = [
  { id: 1, text: "Selesaikan materi CSS Flexbox", done: true },
  { id: 2, text: "Buat mini project kalkulator", done: false }
];

function renderTodos() {
  const list = document.getElementById("todoList");
  list.innerHTML = "";
  
  let sisa = 0;
  todos.forEach(todo => {
    if (!todo.done) sisa++;
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " selesai" : "");
    li.innerHTML = \`
      <span onclick="toggleSelesai(\${todo.id})" style="cursor: pointer; flex: 1;">
        \${todo.done ? "✅" : "⬜"} \${todo.text}
      </span>
      <button class="btn-hapus" onclick="hapusTugas(\${todo.id})">Hapus</button>
    \`;
    list.appendChild(li);
  });
  
  document.getElementById("sisaTugas").innerText = \`\${sisa} tugas aktif tersisa\`;
}

function tambahTugas() {
  const input = document.getElementById("todoInput");
  const teks = input.value.trim();
  if (!teks) return;
  todos.push({ id: Date.now(), text: teks, done: false });
  input.value = "";
  renderTodos();
}

function toggleSelesai(id) {
  todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  renderTodos();
}

function hapusTugas(id) {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

renderTodos();`
    }
  },
  {
    id: 'project-404',
    worldId: 'projects',
    title: 'Responsive Portfolio Page',
    description: 'Karya agung final: portofolio developer modern yang memadukan navigasi responsif, galeri proyek, dan formulir interaktif.',
    difficulty: 'Mahir',
    prerequisites: ['project-401', 'project-402', 'project-403'],
    xpReward: 200,
    criteria: [
      'Struktur semantik lengkap (<header>, <nav>, <section>, <footer>)',
      'Hero section dengan panggilan aksi (Call To Action button)',
      'Grid portofolio responsif yang menyesuaikan ukuran layar',
      'Filter kategori proyek menggunakan JavaScript',
      'Formulir kirim pesan dengan validasi input'
    ],
    hints: [
      'Gunakan CSS Grid repeat(auto-fit, minmax(280px, 1fr)) untuk membuat galeri proyek responsif otomatis.',
      'Gunakan JavaScript event listener pada tombol filter untuk menyembunyikan atau menampilkan kartu proyek.',
      'Terapkan dark theme accents untuk memberikan kesan premium developer portfolio.'
    ],
    starterCode: {
      html: `<header class="navbar">
  <div class="logo">&lt;BPROTIC /&gt;</div>
  <nav class="nav-links">
    <a href="#about">Tentang</a>
    <a href="#projects">Karya</a>
    <a href="#contact">Kontak</a>
  </nav>
</header>

<section class="hero" id="about">
  <h1>Halo, Saya <span class="highlight">Budi Raharjo</span></h1>
  <p>Front-End Web Developer & Penggemar Teknologi Kreatif</p>
  <a href="#projects" class="cta-btn">Lihat Portofolio</a>
</section>

<section class="projects-section" id="projects">
  <h2>Karya Pilihan</h2>
  <div class="filter-bar">
    <button class="filter-btn active" onclick="filterKarya('all')">Semua</button>
    <button class="filter-btn" onclick="filterKarya('html')">HTML/CSS</button>
    <button class="filter-btn" onclick="filterKarya('js')">JavaScript</button>
  </div>
  <div class="project-grid" id="gridKarya">
    <!-- Diisi otomatis oleh JavaScript -->
  </div>
</section>

<footer id="contact">
  <p>&copy; 2026 Budi Raharjo. Dibuat dengan BPROTIC Web Academy.</p>
</footer>`,
      css: `body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin: 0;
  background: #0f172a;
  color: #f8fafc;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 30px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.logo {
  font-family: monospace;
  font-size: 20px;
  font-weight: bold;
  color: #10b981;
}

.nav-links a {
  color: #cbd5e1;
  text-decoration: none;
  margin-left: 20px;
  font-weight: 500;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
}

.hero h1 {
  font-size: 36px;
  margin-bottom: 10px;
}

.highlight {
  color: #38bdf8;
}

.cta-btn {
  display: inline-block;
  margin-top: 20px;
  background: #10b981;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}

.projects-section {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.filter-btn {
  background: #334155;
  color: #cbd5e1;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.filter-btn.active {
  background: #38bdf8;
  color: #0f172a;
  font-weight: bold;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.project-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-5px);
  border-color: #38bdf8;
}

footer {
  text-align: center;
  padding: 30px;
  border-top: 1px solid #334155;
  color: #64748b;
  font-size: 14px;
}`,
      js: `const daftarKarya = [
  { id: 1, judul: "Web Portofolio Pribadi", tag: "html", desc: "Desain layout bersih dengan flexbox." },
  { id: 2, judul: "Kalkulator Cepat Online", tag: "js", desc: "Aplikasi kalkulasi interaktif." },
  { id: 3, judul: "To-Do List Produktivitas", tag: "js", desc: "Manajemen tugas harian dengan DOM." },
  { id: 4, judul: "Landing Page Startup", tag: "html", desc: "Halaman promosi produk responsif." }
];

function renderGrid(karyaList) {
  const grid = document.getElementById("gridKarya");
  grid.innerHTML = "";
  karyaList.forEach(k => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = \`
      <h3>\${k.judul}</h3>
      <p style="color: #94a3b8; font-size: 14px;">\${k.desc}</p>
      <span style="font-size: 12px; background: #334155; padding: 4px 8px; border-radius: 4px; color: #38bdf8;">#\${k.tag}</span>
    \`;
    grid.appendChild(card);
  });
}

function filterKarya(kategori) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
  
  if (kategori === "all") {
    renderGrid(daftarKarya);
  } else {
    const terfilter = daftarKarya.filter(k => k.tag === kategori);
    renderGrid(terfilter);
  }
}

renderGrid(daftarKarya);`
    }
  }
];
