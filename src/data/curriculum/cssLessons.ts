import { Lesson } from '@/types';

export const CSS_LESSONS: Lesson[] = [
  {
    id: 'css-201',
    worldId: 'css',
    worldTitle: 'CSS Styling',
    level: 1,
    levelTitle: 'CSS Beginner',
    order: 1,
    title: 'Pengantar CSS & Anatomi Rule',
    description: 'Pelajari peran Cascading Style Sheets dalam mempercantik tampilan visual web serta cara menghubungkannya.',
    objectives: [
      'Memahami fungsi utama CSS',
      'Mengenal 3 cara menghubungkan CSS: Inline, Internal, External',
      'Memahami anatomi rule CSS: Selector, Property, dan Value'
    ],
    prerequisites: ['html-107'],
    estimatedMinutes: 5,
    xpReward: 30,
    playgroundStarter: {
      html: '<h1 class="judul">Selamat Datang</h1>\n<p>CSS memberi warna dan keindahan pada halaman web kita!</p>',
      css: '.judul {\n  color: #0284c7;\n  font-size: 28px;\n  text-align: center;\n}\np {\n  color: #475569;\n  line-height: 1.6;\n}',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Apa Itu CSS?'
      },
      {
        type: 'text',
        content: 'CSS singkatan dari Cascading Style Sheets. Jika HTML membuat struktur halaman web, CSS mengatur gaya visual: warna, ukuran font, jarak, bayangan, tata letak, hingga animasi.'
      },
      {
        type: 'heading',
        content: 'Anatomi Rule CSS'
      },
      {
        type: 'text',
        content: 'Sebuah aturan CSS terdiri dari Selector (elemen mana yang ingin ditargetkan), diiringi kurung kurawal berisi deklarasi Property (apa yang diubah) dan Value (nilainya).'
      },
      {
        type: 'code',
        codeLanguage: 'css',
        content: '/* Selector */\nh1 {\n  color: blue;        /* Property: Value; */\n  font-size: 24px;\n}'
      }
    ],
    questions: [
      {
        id: 'q-css-201-1',
        type: 'multiple_choice',
        prompt: 'Dalam deklarasi CSS "color: red;", manakah yang disebut sebagai "property"?',
        options: ['color', 'red', ';', 'h1'],
        correctAnswer: 'color',
        explanation: '"color" adalah property yang ingin diubah, sedangkan "red" adalah value (nilai yang diterapkan).'
      },
      {
        id: 'q-css-201-2',
        type: 'fill_blank',
        prompt: 'Karakter tanda baca apa yang wajib ditulis di akhir setiap baris deklarasi CSS? [___]',
        correctAnswer: ';',
        explanation: 'Setiap deklarasi CSS wajib diakhiri tanda titik koma (semicolon ;) agar browser dapat membedakan dengan deklarasi berikutnya.'
      },
      {
        id: 'q-css-201-3',
        type: 'true_false',
        prompt: 'External CSS dihubungkan di dalam tag <head> menggunakan tag <link rel="stylesheet" href="style.css">.',
        correctAnswer: true,
        explanation: 'Benar. Penggunaan tag <link> di bagian <head> adalah cara paling direkomendasikan karena memisahkan struktur dan styling secara bersih.'
      }
    ]
  },
  {
    id: 'css-202',
    worldId: 'css',
    worldTitle: 'CSS Styling',
    level: 1,
    levelTitle: 'CSS Beginner',
    order: 2,
    title: 'Selector: Elemen, Class, dan ID',
    description: 'Kuasai cara menargetkan elemen secara presisi dengan selector tag, class dot (.), dan ID hash (#).',
    objectives: [
      'Menargetkan elemen berdasarkan nama tag',
      'Menggunakan class selector (.) untuk styling berulang',
      'Menggunakan ID selector (#) untuk elemen unik'
    ],
    prerequisites: ['css-201'],
    estimatedMinutes: 6,
    xpReward: 30,
    playgroundStarter: {
      html: '<p id="utama">Paragraf Spesifik dengan ID</p>\n<p class="sorot">Paragraf A dengan class sorot</p>\n<p class="sorot">Paragraf B dengan class sorot</p>',
      css: '#utama {\n  color: #7c3aed;\n  font-weight: bold;\n}\n.sorot {\n  background-color: #fef08a;\n  padding: 8px;\n  border-radius: 4px;\n}',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Class Selector (.) vs ID Selector (#)'
      },
      {
        type: 'text',
        content: 'Class selector menggunakan tanda titik (.nama-class) dan dapat digunakan berkali-kali pada banyak elemen berbeda. ID selector menggunakan tanda pagar (#nama-id) dan hanya boleh digunakan satu kali secara unik dalam satu halaman.'
      },
      {
        type: 'callout',
        calloutType: 'tip',
        content: 'Aturan umum desainer profesional: Gunakan class selector untuk hampir semua kebutuhan styling CSS. Simpan ID hanya untuk elemen yang benar-benar tunggal atau untuk target JavaScript.'
      },
      {
        type: 'code',
        codeLanguage: 'css',
        content: '/* Menargetkan semua elemen dengan class="tombol-aksi" */\n.tombol-aksi {\n  background-color: #10b981;\n  color: white;\n}\n\n/* Menargetkan elemen unik dengan id="header-utama" */\n#header-utama {\n  background-color: #0f172a;\n}'
      }
    ],
    questions: [
      {
        id: 'q-css-202-1',
        type: 'multiple_choice',
        prompt: 'Simbol awalan apakah yang digunakan dalam CSS untuk menargetkan elemen dengan atribut class?',
        options: ['. (titik)', '# (pagar)', '@ (at)', '$ (dollar)'],
        correctAnswer: '. (titik)',
        explanation: 'Class selector di CSS diawali dengan tanda titik (dot), contoh: .tombol, .kartu.'
      },
      {
        id: 'q-css-202-2',
        type: 'true_false',
        prompt: 'Satu halaman web boleh memiliki 5 elemen berbeda yang menggunakan ID yang persis sama.',
        correctAnswer: false,
        explanation: 'Salah. Atribut ID harus bersifat unik per halaman (hanya satu elemen per ID). Jika ingin styling jamak, gunakan atribut class.'
      }
    ]
  },
  {
    id: 'css-203',
    worldId: 'css',
    worldTitle: 'CSS Styling',
    level: 2,
    levelTitle: 'CSS Layout',
    order: 3,
    title: 'The CSS Box Model',
    description: 'Pahami pondasi terpenting tata letak web: Content, Padding, Border, dan Margin.',
    objectives: [
      'Membedakan Padding (jarak dalam) dan Margin (jarak luar)',
      'Memahami Border sebagai garis batas elemen',
      'Menggunakan box-sizing: border-box untuk perhitungan ukuran yang mudah'
    ],
    prerequisites: ['css-202'],
    estimatedMinutes: 7,
    xpReward: 35,
    playgroundStarter: {
      html: '<div class="kotak">\n  <h3>Box Model Eksperimen</h3>\n  <p>Lihat jarak padding di dalam dan margin di luar kotak ini.</p>\n</div>',
      css: '.kotak {\n  box-sizing: border-box;\n  width: 260px;\n  padding: 20px;\n  border: 4px solid #0284c7;\n  margin: 30px auto;\n  background: #f0fdf4;\n  border-radius: 12px;\n}',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Empat Lapisan Box Model'
      },
      {
        type: 'text',
        content: 'Setiap elemen dalam HTML dianggap oleh browser sebagai sebuah kotak persegi panjang yang terdiri dari 4 lapisan berturut-turut dari dalam ke luar: Content \u2192 Padding \u2192 Border \u2192 Margin.'
      },
      {
        type: 'callout',
        calloutType: 'info',
        content: 'Padding adalah ruang di antara konten dan border (jarak di dalam kotak). Margin adalah ruang kosong di luar border (jarak antar kotak dengan kotak lainnya).'
      },
      {
        type: 'code',
        codeLanguage: 'css',
        content: '* {\n  box-sizing: border-box; /* Memasukkan padding & border ke dalam width */\n}\n\n.kartu {\n  width: 300px;\n  padding: 16px;\n  border: 2px solid #cbd5e1;\n  margin: 20px;\n}'
      }
    ],
    questions: [
      {
        id: 'q-css-203-1',
        type: 'multiple_choice',
        prompt: 'Lapisan manakah yang memberikan jarak kosong di luar batas border sebuah elemen?',
        options: ['Margin', 'Padding', 'Content', 'Outline'],
        correctAnswer: 'Margin',
        explanation: 'Margin adalah ruang kosong terluar yang memisahkan elemen tersebut dari elemen-elemen tetangga di sekitarnya.'
      },
      {
        id: 'q-css-203-2',
        type: 'fill_blank',
        prompt: 'Nilai property apa yang sering diterapkan pada * { box-sizing: [___] } agar ukuran width mencakup padding dan border?',
        correctAnswer: 'border-box',
        explanation: 'Nilai border-box menghitung width dan height sudah termasuk padding dan border, mencegah elemen melebar melebihi batas.'
      }
    ]
  },
  {
    id: 'css-204',
    worldId: 'css',
    worldTitle: 'CSS Styling',
    level: 2,
    levelTitle: 'CSS Layout',
    order: 4,
    title: 'Flexbox: Tata Letak Modern Fleksibel',
    description: 'Kuasai flexbox untuk membuat tata letak horizontal, vertikal, dan perataan tengah dengan mudah.',
    objectives: [
      'Mengaktifkan display: flex pada container',
      'Mengatur arah sumbu dengan flex-direction',
      'Meratakan elemen dengan justify-content dan align-items'
    ],
    prerequisites: ['css-203'],
    estimatedMinutes: 8,
    xpReward: 40,
    playgroundStarter: {
      html: '<div class="flex-container">\n  <div class="item">Item 1</div>\n  <div class="item">Item 2</div>\n  <div class="item">Item 3</div>\n</div>',
      css: '.flex-container {\n  display: flex;\n  justify-content: space-around;\n  align-items: center;\n  background: #e2e8f0;\n  padding: 16px;\n  border-radius: 8px;\n}\n.item {\n  background: #3b82f6;\n  color: white;\n  padding: 15px 20px;\n  border-radius: 6px;\n  font-weight: bold;\n}',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Kekuatan CSS Flexbox'
      },
      {
        type: 'text',
        content: 'Flexbox (Flexible Box Layout) dirancang untuk memudahkan penyusunan elemen dalam satu dimensi (baris atau kolom), bahkan ketika ukuran elemen dinamis.'
      },
      {
        type: 'heading',
        content: 'Property Utama Flex Container'
      },
      {
        type: 'text',
        content: 'justify-content mengatur perataan sepanjang sumbu utama (main axis: horizontal secara default: center, space-between, space-around). align-items mengatur perataan sepanjang sumbu silang (cross axis: vertikal).'
      },
      {
        type: 'code',
        codeLanguage: 'css',
        content: '.wadah {\n  display: flex;\n  justify-content: center; /* Rata tengah horizontal */\n  align-items: center;     /* Rata tengah vertikal */\n  gap: 12px;               /* Jarak antar item */\n}'
      }
    ],
    questions: [
      {
        id: 'q-css-204-1',
        type: 'multiple_choice',
        prompt: 'Property flexbox apa yang digunakan untuk mengatur perataan pada sumbu utama (main axis)?',
        options: ['justify-content', 'align-items', 'flex-direction', 'align-content'],
        correctAnswer: 'justify-content',
        explanation: 'justify-content mendistribusikan ruang kosong di antara item sepanjang main axis.'
      },
      {
        id: 'q-css-204-2',
        type: 'true_false',
        prompt: 'Nilai default dari flex-direction adalah column.',
        correctAnswer: false,
        explanation: 'Salah. Nilai default dari flex-direction adalah row (berjajar dari kiri ke kanan secara horizontal).'
      }
    ]
  },
  {
    id: 'css-205',
    worldId: 'css',
    worldTitle: 'CSS Styling',
    level: 3,
    levelTitle: 'Responsive Design',
    order: 5,
    title: 'Desain Responsif & Media Queries',
    description: 'Buat tampilan web yang otomatis menyesuaikan ukuran layar HP, tablet, maupun layar desktop monitor.',
    objectives: [
      'Memahami filosofi Mobile-First design',
      'Menggunakan @media query dengan min-width atau max-width',
      'Menggunakan satuan relatif seperti rem, %, dan viewport units'
    ],
    prerequisites: ['css-204'],
    estimatedMinutes: 6,
    xpReward: 35,
    playgroundStarter: {
      html: '<div class="card">\n  <h2>Desain Responsif</h2>\n  <p>Coba ubah ukuran tampilan atau amati aturan media query di bawah.</p>\n</div>',
      css: '.card {\n  background: #fef3c7;\n  padding: 16px;\n  border-radius: 8px;\n}\n\n@media (min-width: 600px) {\n  .card {\n    background: #dbeafe;\n    padding: 32px;\n  }\n}',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Mengapa Desain Responsif Wajib?'
      },
      {
        type: 'text',
        content: 'Pengguna mengakses web dari berbagai ukuran layar: smartphone 360px hingga monitor 4K. Media queries memungkinkan kita menerapkan aturan CSS tertentu hanya ketika kondisi layar terpenuhi.'
      },
      {
        type: 'code',
        codeLanguage: 'css',
        content: '/* Tampilan default untuk smartphone */\n.sidebar {\n  display: none;\n}\n\n/* Tampilan untuk layar tablet atau desktop (lebar min 768px) */\n@media (min-width: 768px) {\n  .sidebar {\n    display: block;\n    width: 250px;\n  }\n}'
      }
    ],
    questions: [
      {
        id: 'q-css-205-1',
        type: 'multiple_choice',
        prompt: 'At-rule apakah dalam CSS yang digunakan untuk mendefinisikan breakpoint media query?',
        options: ['@media', '@viewport', '@screen', '@responsive'],
        correctAnswer: '@media',
        explanation: '@media digunakan untuk menetapkan blok CSS yang aktif hanya pada media tertentu atau rentang resolusi tertentu.'
      },
      {
        id: 'q-css-205-2',
        type: 'fill_blank',
        prompt: 'Satuan CSS apa yang mengacu pada 1% dari lebar jendela layar (viewport width)? [___]',
        correctAnswer: 'vw',
        explanation: 'vw singkatan dari Viewport Width, di mana 100vw sama dengan 100% lebar layar jendela peramban.'
      }
    ]
  },
  {
    id: 'css-206',
    worldId: 'css',
    worldTitle: 'CSS Styling',
    level: 4,
    levelTitle: 'CSS Mastery',
    order: 6,
    title: 'Transisi & Animasi CSS',
    description: 'Hidupkan antarmuka pengguna dengan transisi halus, pseudo-class :hover, dan efek transform.',
    objectives: [
      'Menggunakan pseudo-class :hover dan :active',
      'Membuat transisi halus dengan property transition',
      'Menggunakan transform: scale, rotate, dan translate'
    ],
    prerequisites: ['css-205'],
    estimatedMinutes: 6,
    xpReward: 35,
    playgroundStarter: {
      html: '<button class="btn-animasi">Arahkan Kursor / Sentuh Saya!</button>',
      css: '.btn-animasi {\n  background: #0284c7;\n  color: white;\n  font-size: 16px;\n  padding: 12px 24px;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n.btn-animasi:hover {\n  background: #0369a1;\n  transform: translateY(-4px) scale(1.05);\n  box-shadow: 0 10px 15px rgba(0,0,0,0.2);\n}',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Transisi CSS Halus'
      },
      {
        type: 'text',
        content: 'Tanpa transition, perubahan state (misal saat hover) akan terjadi seketika dan kaku. Dengan menyertakan transition: background-color 0.3s ease, browser akan menganimasikan transisi tersebut secara elegan.'
      },
      {
        type: 'code',
        codeLanguage: 'css',
        content: '.kartu {\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n.kartu:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 8px 16px rgba(0,0,0,0.15);\n}'
      }
    ],
    questions: [
      {
        id: 'q-css-206-1',
        type: 'multiple_choice',
        prompt: 'Pseudo-class apa yang aktif ketika kursor pengguna berada di atas suatu elemen?',
        options: [':hover', ':active', ':focus', ':visited'],
        correctAnswer: ':hover',
        explanation: ':hover berlaku saat pointer pengguna berada di atas elemen visual tersebut.'
      },
      {
        id: 'q-css-206-2',
        type: 'true_false',
        prompt: 'Property transform: rotate(45deg); akan memutar elemen sebesar 45 derajat searah jarum jam.',
        correctAnswer: true,
        explanation: 'Benar. Fungsi rotate() memutar elemen 2D sesuai nilai derajat sudut yang ditentukan.'
      }
    ]
  }
];
