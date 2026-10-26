export interface PlaygroundTemplate {
  id: string;
  name: string;
  description: string;
  category: 'HTML' | 'CSS' | 'JavaScript' | 'Full';
  html: string;
  css: string;
  js: string;
}

export const PLAYGROUND_TEMPLATES: PlaygroundTemplate[] = [
  {
    id: 'starter',
    name: 'Halo Web',
    description: 'Template dasar untuk memulai eksperimen HTML & CSS',
    category: 'HTML',
    html: `<h1>Halo Dunia!</h1>
<p>Selamat datang di <strong>BPROTIC Web Academy</strong> Playground.</p>
<button id="tombol-sapa">Klik Saya</button>
<div id="pesan"></div>`,
    css: `h1 {
  color: #10b981;
  font-family: sans-serif;
}
p {
  color: #475569;
  font-size: 16px;
}
button {
  background: #0284c7;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
#pesan {
  margin-top: 15px;
  padding: 10px;
  background: #f0fdf4;
  color: #15803d;
  border-radius: 6px;
  display: none;
}`,
    js: `const tombol = document.getElementById("tombol-sapa");
const pesan = document.getElementById("pesan");

tombol.addEventListener("click", () => {
  pesan.style.display = "block";
  pesan.innerText = "Tombol berhasil diklik! Web Anda hidup!";
  console.log("Tombol sapa ditekan!");
});`
  },
  {
    id: 'flexbox-card',
    name: 'Kartu Modern 3D',
    description: 'Eksperimen Flexbox, Border Radius, dan Hover Shadow',
    category: 'CSS',
    html: `<div class="card">
  <div class="badge">PRO</div>
  <h2>Web Developer</h2>
  <p>Membangun antarmuka modern yang cepat, indah, dan aksesibel.</p>
  <div class="tags">
    <span>#HTML5</span>
    <span>#CSS3</span>
    <span>#ModernJS</span>
  </div>
</div>`,
    css: `body {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  background: #f8fafc;
}
.card {
  background: white;
  border: 2px solid #e2e8f0;
  border-bottom: 6px solid #cbd5e1;
  border-radius: 16px;
  padding: 20px;
  max-width: 280px;
}
.badge {
  display: inline-block;
  background: #f59e0b;
  color: #78350f;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 6px;
}
h2 {
  margin: 10px 0 6px;
  color: #0f172a;
}
p {
  color: #64748b;
  font-size: 14px;
}
.tags {
  display: flex;
  gap: 6px;
  margin-top: 14px;
}
.tags span {
  background: #f1f5f9;
  color: #334155;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 4px;
}`,
    js: `console.log("Kartu CSS loaded.");`
  },
  {
    id: 'interactive-counter',
    name: 'Counter & Stopwatch',
    description: 'Manipulasi DOM dinamis dan logika perulangan waktu',
    category: 'JavaScript',
    html: `<div style="text-align: center; padding: 20px;">
  <h2>Stopwatch Mini</h2>
  <h1 id="timer" style="font-size: 48px; color: #6366f1; margin: 10px 0;">0.0s</h1>
  <div>
    <button id="btnMulai" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: bold;">Mulai</button>
    <button id="btnStop" style="padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: bold;">Berhenti</button>
    <button id="btnReset" style="padding: 10px 20px; background: #64748b; color: white; border: none; border-radius: 8px; font-weight: bold;">Reset</button>
  </div>
</div>`,
    css: `button { margin: 4px; cursor: pointer; }`,
    js: `let detik = 0;
let timerId = null;
const timerEl = document.getElementById("timer");

document.getElementById("btnMulai").onclick = () => {
  if (timerId) return;
  timerId = setInterval(() => {
    detik += 0.1;
    timerEl.innerText = detik.toFixed(1) + "s";
  }, 100);
  console.log("Timer dimulai");
};

document.getElementById("btnStop").onclick = () => {
  clearInterval(timerId);
  timerId = null;
  console.log("Timer dihentikan pada:", detik.toFixed(1));
};

document.getElementById("btnReset").onclick = () => {
  clearInterval(timerId);
  timerId = null;
  detik = 0;
  timerEl.innerText = "0.0s";
  console.log("Timer direset");
};`
  }
];
