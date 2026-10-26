import { Lesson } from '@/types';

export const HTML_LESSONS: Lesson[] = [
  {
    id: 'html-101',
    worldId: 'html',
    worldTitle: 'HTML Fundamentals',
    level: 1,
    levelTitle: 'HTML Beginner',
    order: 1,
    title: 'Mengenal HTML & Cara Kerja Browser',
    description: 'Pelajari konsep dasar bagaimana web bekerja dan peran HTML sebagai kerangka halaman web.',
    objectives: [
      'Memahami kepanjangan dan fungsi utama HTML',
      'Mengetahui bagaimana browser membaca kode HTML dan menampilkannya',
      'Mengenal analogi HTML sebagai kerangka tulang pada manusia'
    ],
    prerequisites: [],
    estimatedMinutes: 5,
    xpReward: 25,
    playgroundStarter: {
      html: '<h1>Halo Dunia!</h1>\n<p>Saya sedang belajar membuat web di BPROTIC Web Academy.</p>',
      css: 'h1 { color: #ea580c; font-family: sans-serif; }\np { color: #475569; font-size: 16px; }',
      js: 'console.log("Browser berhasil memuat HTML!");'
    },
    content: [
      {
        type: 'heading',
        content: 'Apa Itu HTML?'
      },
      {
        type: 'text',
        content: 'HTML adalah singkatan dari HyperText Markup Language. HTML bukanlah bahasa pemrograman logika (seperti JavaScript atau Python), melainkan bahasa markup yang digunakan untuk menyusun struktur dan kerangka sebuah halaman web.'
      },
      {
        type: 'callout',
        calloutType: 'tip',
        content: 'Analogi paling mudah: Jika sebuah website adalah rumah, maka HTML adalah pondasi batu bata dan kerangka dindingnya, CSS adalah cat tembok dan dekorasinya, sedangkan JavaScript adalah instalasi listrik otomatis yang membuatnya hidup!'
      },
      {
        type: 'heading',
        content: 'Bagaimana Browser Bekerja?'
      },
      {
        type: 'text',
        content: 'Saat kamu mengetik alamat situs atau membuka file web, web browser (seperti Google Chrome, Firefox, atau Edge) akan membaca kode teks HTML baris demi baris, menerjemahkannya (parsing), lalu merendernya menjadi tampilan visual grafis yang kamu lihat di layar.'
      },
      {
        type: 'code',
        codeLanguage: 'html',
        content: '<h1>Judul Website Pertama</h1>\n<p>Ini adalah sebuah paragraf teks biasa.</p>'
      }
    ],
    questions: [
      {
        id: 'q-html-101-1',
        type: 'multiple_choice',
        prompt: 'Apakah kepanjangan dari singkatan HTML?',
        options: [
          'HyperText Markup Language',
          'Hyperlink and Text Management Language',
          'Home Tool Markup Language',
          'High Technical Modern Language'
        ],
        correctAnswer: 'HyperText Markup Language',
        explanation: 'HTML adalah HyperText Markup Language, standar bahasa markup global untuk dokumen web yang dirancang untuk ditampilkan di peramban (browser).'
      },
      {
        id: 'q-html-101-2',
        type: 'true_false',
        prompt: 'HTML adalah bahasa pemrograman yang digunakan untuk kalkulasi logika rumit.',
        correctAnswer: false,
        explanation: 'Salah. HTML adalah bahasa markup struktur dokumen, bukan bahasa pemrograman komputasi logika. Komputasi dan logika di web ditangani oleh JavaScript.'
      },
      {
        id: 'q-html-101-3',
        type: 'fill_blank',
        prompt: 'Lengkapilah tag penutup untuk membuat judul utama berikut: <h1>Selamat Datang di Web [___]',
        correctAnswer: '</h1>',
        explanation: 'Dalam HTML, hampir setiap tag pembuka berpasangan dengan tag penutup yang diawali garis miring, yaitu </h1>.'
      }
    ]
  },
  {
    id: 'html-102',
    worldId: 'html',
    worldTitle: 'HTML Fundamentals',
    level: 1,
    levelTitle: 'HTML Beginner',
    order: 2,
    title: 'Struktur Dasar Dokumen HTML',
    description: 'Kuasai anatomi standar dokumen HTML modern dengan <!DOCTYPE>, <html>, <head>, dan <body>.',
    objectives: [
      'Mengetahui deklarasi <!DOCTYPE html>',
      'Membedakan peran tag <head> untuk metadata dan <body> untuk konten visual',
      'Menuliskan kerangka HTML boilerplate yang valid'
    ],
    prerequisites: ['html-101'],
    estimatedMinutes: 6,
    xpReward: 30,
    playgroundStarter: {
      html: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Website Saya</title>\n  </head>\n  <body>\n    <h2>Halo dari Body!</h2>\n    <p>Semua yang terlihat di layar berada di dalam body.</p>\n  </body>\n</html>',
      css: 'body { font-family: sans-serif; padding: 20px; }\nh2 { color: #0284c7; }',
      js: 'console.log("Judul dokumen:", document.title);'
    },
    content: [
      {
        type: 'heading',
        content: 'Anatomi Kerangka Standar HTML'
      },
      {
        type: 'text',
        content: 'Setiap halaman HTML modern diawali dengan deklarasi <!DOCTYPE html>. Dokumen kemudian dibungkus dalam tag <html>, yang dibagi menjadi dua bagian utama: <head> dan <body>.'
      },
      {
        type: 'callout',
        calloutType: 'info',
        content: '<head> berisi informasi untuk mesin dan browser (metadata, judul tab, link CSS). Sedangkan <body> berisi semua hal yang dapat dilihat pengguna langsung di layar.'
      },
      {
        type: 'code',
        codeLanguage: 'html',
        content: '<!DOCTYPE html>\n<html lang="id">\n  <head>\n    <meta charset="UTF-8">\n    <title>Judul di Tab Browser</title>\n  </head>\n  <body>\n    <h1>Konten Utama Halaman</h1>\n  </body>\n</html>'
      }
    ],
    questions: [
      {
        id: 'q-html-102-1',
        type: 'multiple_choice',
        prompt: 'Di bagian manakah elemen yang tampak visual di layar pengguna harus diletakkan?',
        options: ['<body>', '<head>', '<title>', '<meta>'],
        correctAnswer: '<body>',
        explanation: 'Elemen <body> membungkus seluruh konten yang ditampilkan pada browser seperti teks, tombol, gambar, dan formulir.'
      },
      {
        id: 'q-html-102-2',
        type: 'order_lines',
        prompt: 'Urutkan hierarki kerangka HTML yang benar dari paling luar ke dalam:',
        lines: [
          '<!DOCTYPE html>',
          '<html>',
          '<head>',
          '<body>'
        ],
        correctAnswer: [
          '<!DOCTYPE html>',
          '<html>',
          '<head>',
          '<body>'
        ],
        explanation: 'Urutan standar dimulai dari deklarasi <!DOCTYPE html>, pembuka <html>, elemen konfigurasi <head>, dan elemen tampilan <body>.'
      },
      {
        id: 'q-html-102-3',
        type: 'find_bug',
        prompt: 'Temukan baris yang memiliki kesalahan penulisan tag penutup:',
        codeSnippet: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Web Saya</title>\n  <head>\n  <body>\n  </body>\n</html>',
        buggyLine: 4,
        correctAnswer: 4,
        explanation: 'Pada baris ke-5 tertulis <head> padahal seharusnya tag penutup </head> dengan tanda garis miring slash.'
      }
    ]
  },
  {
    id: 'html-103',
    worldId: 'html',
    worldTitle: 'HTML Fundamentals',
    level: 1,
    levelTitle: 'HTML Beginner',
    order: 3,
    title: 'Heading, Paragraf, dan Format Teks',
    description: 'Pelajari hierarki heading h1 sampai h6, paragraf, serta formatting teks tebal, miring, dan garis bawah.',
    objectives: [
      'Menggunakan hierarki heading h1 sampai h6 secara semantik',
      'Membuat paragraf dengan tag <p> dan baris baru <br>',
      'Memformat teks menggunakan <strong>, <em>, dan <mark>'
    ],
    prerequisites: ['html-102'],
    estimatedMinutes: 5,
    xpReward: 25,
    playgroundStarter: {
      html: '<h1>Judul Terbesar (H1)</h1>\n<h3>Sub-judul Sedang (H3)</h3>\n<p>Belajar HTML itu <strong>sangat seru</strong> dan <em>mudah dipahami</em>!</p>',
      css: 'h1 { color: #b45309; }\nstrong { color: #16a34a; }',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Hierarki Heading (h1 - h6)'
      },
      {
        type: 'text',
        content: 'HTML menyediakan 6 level heading: <h1> adalah judul paling penting dan terbesar, sedangkan <h6> adalah yang terkecil. Idealnya, hanya gunakan satu <h1> per halaman untuk judul topik utama.'
      },
      {
        type: 'heading',
        content: 'Paragraf dan Penekanan Kata'
      },
      {
        type: 'text',
        content: 'Gunakan <p> untuk paragraf. Untuk menebalkan teks dengan makna penting gunakan <strong>, untuk penekanan miring gunakan <em>, dan tag <br> untuk pindah baris tanpa membuat paragraf baru.'
      },
      {
        type: 'code',
        codeLanguage: 'html',
        content: '<p>Halo! Saya <strong>Andi</strong>.<br>Saya seorang calon <em>Full-Stack Developer</em>.</p>'
      }
    ],
    questions: [
      {
        id: 'q-html-103-1',
        type: 'multiple_choice',
        prompt: 'Tag heading manakah yang menghasilkan ukuran judul paling besar dan prioritas tertinggi?',
        options: ['<h1>', '<h6>', '<head>', '<header>'],
        correctAnswer: '<h1>',
        explanation: '<h1> adalah heading level 1, merupakan judul utama paling penting dalam dokumen HTML.'
      },
      {
        id: 'q-html-103-2',
        type: 'true_false',
        prompt: 'Tag <br> membutuhkan tag penutup </br>.',
        correctAnswer: false,
        explanation: 'Salah. Tag <br> adalah elemen kosong (void/self-closing element), tidak membutuhkan tag penutup terpisah.'
      },
      {
        id: 'q-html-103-3',
        type: 'fill_blank',
        prompt: 'Tag semantik apa yang digunakan untuk memberi penekanan tebal (important text)? Tuliskan tag pembukanya: [___]',
        correctAnswer: '<strong>',
        explanation: 'Tag <strong> digunakan untuk menandai teks yang memiliki tingkat kepentingan tinggi dan ditampilkan tebal secara default.'
      }
    ]
  },
  {
    id: 'html-104',
    worldId: 'html',
    worldTitle: 'HTML Fundamentals',
    level: 1,
    levelTitle: 'HTML Beginner',
    order: 4,
    title: 'Link dan Gambar di Web',
    description: 'Menghubungkan halaman dengan hyperlink <a> dan menyisipkan media visual dengan elemen <img>.',
    objectives: [
      'Membuat hyperlink menggunakan tag <a> dan atribut href',
      'Menampilkan gambar lokal atau web dengan tag <img>',
      'Mengerti pentingnya atribut alt pada gambar untuk aksesibilitas'
    ],
    prerequisites: ['html-103'],
    estimatedMinutes: 6,
    xpReward: 30,
    playgroundStarter: {
      html: '<h2>Koleksi Favorit</h2>\n<p>Kunjungi <a href="https://example.com" target="_blank">Situs Resmi</a></p>\n<img src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300" alt="Lukisan Abstrak" width="250" />',
      css: 'img { border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }\na { color: #2563eb; font-weight: bold; }',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Hyperlink: Menghubungkan Jagat Web'
      },
      {
        type: 'text',
        content: 'Tag <a> (anchor) digunakan untuk membuat link ke halaman lain atau file lain. Tujuannya ditentukan melalui atribut href.'
      },
      {
        type: 'heading',
        content: 'Menyematkan Gambar'
      },
      {
        type: 'text',
        content: 'Tag <img> tidak memiliki tag penutup. Atribut wajibnya adalah src (sumber gambar) dan alt (teks alternatif jika gambar gagal dimuat atau dibaca screen reader).'
      },
      {
        type: 'code',
        codeLanguage: 'html',
        content: '<a href="https://bprotic.com" target="_blank">Buka BPROTIC</a>\n<img src="foto.jpg" alt="Foto Profil Budi" width="200">'
      }
    ],
    questions: [
      {
        id: 'q-html-104-1',
        type: 'multiple_choice',
        prompt: 'Atribut manakah pada tag <a> yang menentukan URL alamat tujuan tautan?',
        options: ['href', 'src', 'link', 'target'],
        correctAnswer: 'href',
        explanation: 'Atribut href (Hypertext Reference) menentukan URL atau tujuan dari tautan anchor.'
      },
      {
        id: 'q-html-104-2',
        type: 'fill_blank',
        prompt: 'Atribut apa pada tag <img> yang wajib disertakan untuk menyediakan deskripsi teks alternatif? [___]',
        correctAnswer: 'alt',
        explanation: 'Atribut alt menyediakan deskripsi teks jika gambar gagal dimuat dan sangat penting untuk aksesibilitas tunanetra (screen reader).'
      },
      {
        id: 'q-html-104-3',
        type: 'true_false',
        prompt: 'Atribut target="_blank" pada link akan membuka halaman tujuan di tab atau jendela baru.',
        correctAnswer: true,
        explanation: 'Benar. Nilai _blank memerintahkan browser untuk membuka URL tujuan di tab atau jendela baru peramban.'
      }
    ]
  },
  {
    id: 'html-105',
    worldId: 'html',
    worldTitle: 'HTML Fundamentals',
    level: 2,
    levelTitle: 'HTML Builder',
    order: 5,
    title: 'Daftar (List): Ordered & Unordered',
    description: 'Menyusun daftar item rapi dengan ordered list <ol>, unordered list <ul>, dan list item <li>.',
    objectives: [
      'Membuat daftar berpoin dengan <ul>',
      'Membuat daftar bernomor dengan <ol>',
      'Memahami penggunaan tag <li> sebagai elemen isi item'
    ],
    prerequisites: ['html-104'],
    estimatedMinutes: 5,
    xpReward: 25,
    playgroundStarter: {
      html: '<h3>Teknologi Web Fundamental:</h3>\n<ul>\n  <li>HTML (Struktur)</li>\n  <li>CSS (Desain)</li>\n  <li>JavaScript (Interaksi)</li>\n</ul>',
      css: 'ul { background: #f1f5f9; padding: 20px 30px; border-radius: 8px; }\nli { margin-bottom: 8px; color: #0f172a; }',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Unordered List (<ul>)'
      },
      {
        type: 'text',
        content: 'Gunakan <ul> ketika urutan item tidak mempengaruhi arti (menampilkan bullet points). Setiap item di dalamnya dibungkus dengan <li> (list item).'
      },
      {
        type: 'heading',
        content: 'Ordered List (<ol>)'
      },
      {
        type: 'text',
        content: 'Gunakan <ol> ketika urutan memiliki tahapan langkah berurutan (menampilkan angka 1, 2, 3, dst).'
      },
      {
        type: 'code',
        codeLanguage: 'html',
        content: '<ol>\n  <li>Buka browser</li>\n  <li>Ketik kode HTML</li>\n  <li>Simpan dan refresh halaman</li>\n</ol>'
      }
    ],
    questions: [
      {
        id: 'q-html-105-1',
        type: 'multiple_choice',
        prompt: 'Tag apa yang digunakan untuk membuat daftar bernomor angka berurutan?',
        options: ['<ol>', '<ul>', '<dl>', '<list>'],
        correctAnswer: '<ol>',
        explanation: '<ol> adalah Ordered List yang secara otomatis memberi nomor angka pada setiap <li> di dalamnya.'
      },
      {
        id: 'q-html-105-2',
        type: 'fill_blank',
        prompt: 'Tag apa yang wajib digunakan untuk membungkus setiap butir item di dalam <ul> maupun <ol>? [___]',
        correctAnswer: '<li>',
        explanation: '<li> singkatan dari List Item, digunakan di dalam <ul> maupun <ol> untuk merepresentasikan satu entri daftar.'
      }
    ]
  },
  {
    id: 'html-106',
    worldId: 'html',
    worldTitle: 'HTML Fundamentals',
    level: 2,
    levelTitle: 'HTML Builder',
    order: 6,
    title: 'Formulir Web & Input Interaktif',
    description: 'Membangun formulir interaktif dengan <form>, <input>, <label>, <select>, <textarea>, dan <button>.',
    objectives: [
      'Membuat form input teks, password, email, dan checkbox',
      'Menggunakan tag <label> yang terhubung dengan id input',
      'Membuat tombol submit dan memahami validasi bawaan HTML5'
    ],
    prerequisites: ['html-105'],
    estimatedMinutes: 7,
    xpReward: 35,
    playgroundStarter: {
      html: '<form onsubmit="event.preventDefault(); alert(\'Terkirim!\');">\n  <label for="nama">Nama Lengkap:</label><br>\n  <input type="text" id="nama" placeholder="Masukkan nama..." required><br><br>\n  <button type="submit">Kirim Data</button>\n</form>',
      css: 'input { padding: 8px; border: 1px solid #cbd5e1; border-radius: 4px; width: 80%; }\nbutton { padding: 8px 16px; background: #16a34a; color: white; border: none; border-radius: 4px; cursor: pointer; }',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Elemen <form> dan Tipe Input'
      },
      {
        type: 'text',
        content: 'Formulir adalah cara utama website menerima masukan pengguna. Tag <input> memiliki atribut type yang sangat variatif: text, email, password, number, checkbox, radio, dan date.'
      },
      {
        type: 'callout',
        calloutType: 'tip',
        content: 'Selalu gunakan atribut required pada input jika field tersebut wajib diisi oleh pengguna sebelum dikirim.'
      },
      {
        type: 'code',
        codeLanguage: 'html',
        content: '<form action="/daftar" method="POST">\n  <label for="user-email">Email:</label>\n  <input type="email" id="user-email" required>\n  <button type="submit">Daftar Sekarang</button>\n</form>'
      }
    ],
    questions: [
      {
        id: 'q-html-106-1',
        type: 'multiple_choice',
        prompt: 'Tipe input apa yang digunakan agar karakter yang diketik pengguna disamarkan (titik-titik/bintang)?',
        options: ['password', 'hidden', 'secret', 'text'],
        correctAnswer: 'password',
        explanation: 'Input dengan type="password" menyamarkan teks yang diketik agar menjaga kerahasiaan kata sandi.'
      },
      {
        id: 'q-html-106-2',
        type: 'fill_blank',
        prompt: 'Atribut HTML5 apa yang ditambahkan ke <input> agar wajib diisi sebelum form dapat di-submit? [___]',
        correctAnswer: 'required',
        explanation: 'Atribut required memberitahu browser untuk mencegah form submit jika input masih kosong.'
      },
      {
        id: 'q-html-106-3',
        type: 'true_false',
        prompt: 'Tag <textarea> digunakan untuk input teks satu baris pendek seperti nama depan.',
        correctAnswer: false,
        explanation: 'Salah. <textarea> digunakan untuk teks multi-baris panjang (seperti pesan atau komentar). Untuk satu baris pendek gunakan <input type="text">.'
      }
    ]
  },
  {
    id: 'html-107',
    worldId: 'html',
    worldTitle: 'HTML Fundamentals',
    level: 3,
    levelTitle: 'HTML Mastery',
    order: 7,
    title: 'Semantic HTML & Tata Letak Modern',
    description: 'Tingkatkan kualitas kode dengan tag semantik modern: header, nav, main, section, article, dan footer.',
    objectives: [
      'Membedakan div non-semantik dengan tag semantik HTML5',
      'Mengenal struktur layout: <header>, <nav>, <main>, <section>, <footer>',
      'Memahami dampak semantic HTML terhadap SEO dan Accessibility'
    ],
    prerequisites: ['html-106'],
    estimatedMinutes: 6,
    xpReward: 35,
    playgroundStarter: {
      html: '<header>\n  <h1>Portal Berita Web</h1>\n  <nav><a href="#">Beranda</a> | <a href="#">Kontak</a></nav>\n</header>\n<main>\n  <article>\n    <h2>Artikel Unggulan</h2>\n    <p>Semantic HTML membuat kode lebih bermakna dan ramah SEO!</p>\n  </article>\n</main>\n<footer>\n  <p>&copy; 2026 BPROTIC Web Academy</p>\n</footer>',
      css: 'header, footer { background: #1e293b; color: white; padding: 15px; }\nnav a { color: #38bdf8; }\nmain { padding: 20px; }',
      js: ''
    },
    content: [
      {
        type: 'heading',
        content: 'Mengapa Semantic HTML Penting?'
      },
      {
        type: 'text',
        content: 'Tag semantik memiliki arti jelas bagi manusia, search engine (Google), dan alat bantu aksesibilitas. Alih-alih membuat <div class="footer">, HTML5 menyediakan langsung tag <footer>.'
      },
      {
        type: 'code',
        codeLanguage: 'html',
        content: '<header>\n  <nav><!-- Menu Navigasi --></nav>\n</header>\n<main>\n  <article><!-- Konten artikel mandiri --></article>\n</main>\n<footer><!-- Hak cipta dan link bawah --></footer>'
      }
    ],
    questions: [
      {
        id: 'q-html-107-1',
        type: 'multiple_choice',
        prompt: 'Tag semantik manakah yang paling tepat untuk membungkus tautan menu navigasi website?',
        options: ['<nav>', '<menu>', '<header>', '<aside>'],
        correctAnswer: '<nav>',
        explanation: 'Elemen <nav> ditujukan khusus untuk mendefinisikan blok navigasi utama situs web.'
      },
      {
        id: 'q-html-107-2',
        type: 'true_false',
        prompt: 'Hanya boleh ada satu elemen <main> per dokumen halaman web.',
        correctAnswer: true,
        explanation: 'Benar. Elemen <main> mewakili konten dominan yang unik untuk dokumen tersebut dan tidak boleh terduplikasi.'
      }
    ]
  }
];
