import { Lesson } from '@/types';

export const JS_LESSONS: Lesson[] = [
  {
    id: 'js-301',
    worldId: 'javascript',
    worldTitle: 'JavaScript Logic',
    level: 1,
    levelTitle: 'JavaScript Beginner',
    order: 1,
    title: 'Otak di Balik Web: Variabel & Tipe Data',
    description: 'Kenalan dengan bahasa pemrograman web terpopuler di dunia dan cara menyimpan data dalam variabel.',
    objectives: [
      'Mengetahui peran JavaScript dalam membuat web interaktif',
      'Menggunakan let dan const untuk mendeklarasikan variabel',
      'Mengenal tipe data primitif: string, number, boolean, null, undefined'
    ],
    prerequisites: ['css-206'],
    estimatedMinutes: 6,
    xpReward: 35,
    playgroundStarter: {
      html: '<h2 id="salam">Memuat...</h2>\n<p id="info"></p>',
      css: 'body { font-family: sans-serif; padding: 20px; }',
      js: 'const nama = "Kurnia";\nlet umur = 20;\nlet isBelajar = true;\n\ndocument.getElementById("salam").innerText = "Halo, " + nama + "!";\ndocument.getElementById("info").innerText = "Umur: " + umur + " tahun.";\nconsole.log("Status aktif:", isBelajar);'
    },
    content: [
      {
        type: 'heading',
        content: 'Peran JavaScript di Web'
      },
      {
        type: 'text',
        content: 'JavaScript adalah bahasa pemrograman dinamis yang berjalan langsung di browser pengguna. Jika HTML menyusun tulang dan CSS merias pakaian, JavaScript memberikan otak dan refleks motorik: kalkulasi, respon klik, animasi, dan manipulasi data.'
      },
      {
        type: 'heading',
        content: 'Variabel: let vs const'
      },
      {
        type: 'text',
        content: 'Gunakan const untuk nilai yang tidak akan diubah (konstan). Gunakan let untuk nilai yang dapat berubah nilainya di kemudian hari. Jangan lagi gunakan var karena memiliki kelemahan scope kuno.'
      },
      {
        type: 'code',
        codeLanguage: 'javascript',
        content: 'const namaSekolah = "BPROTIC Web Academy"; // Tidak bisa diubah\nlet skor = 100;                              // Bisa diubah\nskor = skor + 25;'
      }
    ],
    questions: [
      {
        id: 'q-js-301-1',
        type: 'multiple_choice',
        prompt: 'Keyword apakah yang paling tepat digunakan untuk mendeklarasikan variabel yang nilainya tetap dan tidak boleh diubah?',
        options: ['const', 'let', 'var', 'static'],
        correctAnswer: 'const',
        explanation: 'const (constant) mencegah penugasan ulang (reassignment) nilai variabel setelah dideklarasikan.'
      },
      {
        id: 'q-js-301-2',
        type: 'true_false',
        prompt: 'Tipe data boolean dalam JavaScript hanya bernilai true atau false.',
        correctAnswer: true,
        explanation: 'Benar. Boolean merepresentasikan logika kebenaran biner: hanya ada nilai true (benar) atau false (salah).'
      },
      {
        id: 'q-js-301-3',
        type: 'fill_blank',
        prompt: 'Tuliskan keyword modern untuk mendeklarasikan variabel yang nilainya DAPAT diubah sewaktu-waktu: [___]',
        correctAnswer: 'let',
        explanation: 'let adalah keyword standar ES6 untuk variabel dengan scope blok yang nilainya dapat diubah kembali.'
      }
    ]
  },
  {
    id: 'js-302',
    worldId: 'javascript',
    worldTitle: 'JavaScript Logic',
    level: 1,
    levelTitle: 'JavaScript Beginner',
    order: 2,
    title: 'Operator & Template Literals',
    description: 'Lakukan operasi aritmatika, perbandingan ketat, serta merangkai teks modern dengan backtick (`).',
    objectives: [
      'Memahami operator aritmatika (+, -, *, /, %)',
      'Membedakan perbandingan ketat (===) vs perbandingan longgar (==)',
      'Menggunakan template literals `${ekspresi}`'
    ],
    prerequisites: ['js-301'],
    estimatedMinutes: 6,
    xpReward: 35,
    playgroundStarter: {
      html: '<h3>Kalkulasi Diskon</h3>\n<div id="output"></div>',
      css: 'body { font-family: monospace; font-size: 16px; padding: 20px; }',
      js: 'const harga = 100000;\nconst diskonPersen = 20;\nconst totalBayar = harga - (harga * (diskonPersen / 100));\n\ndocument.getElementById("output").innerText = `Total setelah diskon ${diskonPersen}% adalah Rp ${totalBayar.toLocaleString("id-ID")}`;'
    },
    content: [
      {
        type: 'heading',
        content: 'Perbandingan Ketat (===)'
      },
      {
        type: 'text',
        content: 'Di JavaScript, selalu gunakan triple equals (===) untuk membandingkan kesetaraan nilai dan tipe data sekaligus. Operator ganda (==) dapat menghasilkan bug karena melakukan konversi tipe data otomatis terselubung.'
      },
      {
        type: 'heading',
        content: 'Template Literals Modern'
      },
      {
        type: 'text',
        content: 'Alih-alih menyambung teks dengan tanda tambah ("Halo " + nama), gunakan tanda backtick (`) dan sisipkan variabel dengan ${namaVariabel}.'
      },
      {
        type: 'code',
        codeLanguage: 'javascript',
        content: 'const produk = "Laptop";\nconst harga = 15000000;\nconsole.log(`Harga unit ${produk} adalah Rp ${harga}`);'
      }
    ],
    questions: [
      {
        id: 'q-js-302-1',
        type: 'multiple_choice',
        prompt: 'Apakah hasil evaluasi dari ekspresi: (5 === "5") ?',
        options: ['false', 'true', 'undefined', 'NaN'],
        correctAnswer: 'false',
        explanation: 'Operator === memeriksa tipe data. Angka 5 (number) tidak sama tipenya dengan teks "5" (string), sehingga hasilnya false.'
      },
      {
        id: 'q-js-302-2',
        type: 'fill_blank',
        prompt: 'Karakter tanda kutip apa yang wajib digunakan untuk membuat string template literals? [___]',
        correctAnswer: '`',
        explanation: 'Template literals menggunakan karakter backtick (`) yang biasanya terletak di sebelah angka 1 pada keyboard.'
      }
    ]
  },
  {
    id: 'js-303',
    worldId: 'javascript',
    worldTitle: 'JavaScript Logic',
    level: 2,
    levelTitle: 'Logic & Control Flow',
    order: 3,
    title: 'Percabangan: if, else if, & else',
    description: 'Berikan kecerdasan membuat keputusan pada program berdasarkan kondisi logika.',
    objectives: [
      'Menulis struktur percabangan if, else if, dan else',
      'Menggabungkan kondisi dengan operator logika (&&, ||, !)',
      'Memahami ternary operator sebagai bentuk ringkas if-else'
    ],
    prerequisites: ['js-302'],
    estimatedMinutes: 7,
    xpReward: 40,
    playgroundStarter: {
      html: '<h3>Cek Nilai Kelulusan</h3>\n<p id="hasil"></p>',
      css: 'body { font-family: sans-serif; padding: 20px; }',
      js: 'const nilai = 85;\nlet status = "";\n\nif (nilai >= 85) {\n  status = "Lulus dengan Pujian (Grade A)";\n} else if (nilai >= 70) {\n  status = "Lulus (Grade B)";\n} else {\n  status = "Perlu Mengulang";\n}\n\ndocument.getElementById("hasil").innerText = `Skor ${nilai}: ${status}`;'
    },
    content: [
      {
        type: 'heading',
        content: 'Pengambilan Keputusan (Conditional)'
      },
      {
        type: 'text',
        content: 'Kondisi if memeriksa apakah ekspresi bernilai boolean true. Jika true, blok kodenya dieksekusi. Jika false, program lanjut memeriksa ke blok else if atau else berikutnya.'
      },
      {
        type: 'code',
        codeLanguage: 'javascript',
        content: 'const umur = 18;\nif (umur >= 17) {\n  console.log("Boleh memiliki KTP");\n} else {\n  console.log("Belum cukup umur");\n}'
      }
    ],
    questions: [
      {
        id: 'q-js-303-1',
        type: 'multiple_choice',
        prompt: 'Operator logika apakah yang bernilai true HANYA JIKA kedua sisi kondisi bernilai true?',
        options: ['&& (AND)', '|| (OR)', '! (NOT)', '?? (Nullish)'],
        correctAnswer: '&& (AND)',
        explanation: 'Operator logika AND (&&) mensyaratkan kedua operand bernilai true agar ekspresi keseluruhan menjadi true.'
      },
      {
        id: 'q-js-303-2',
        type: 'true_false',
        prompt: 'Kondisi di dalam kurung if (kondisi) harus selalu menghasilkan evaluasi nilai truthy atau boolean.',
        correctAnswer: true,
        explanation: 'Benar. Browser akan mengonversi ekspresi ke boolean untuk menentukan apakah blok dieksekusi.'
      }
    ]
  },
  {
    id: 'js-304',
    worldId: 'javascript',
    worldTitle: 'JavaScript Logic',
    level: 2,
    levelTitle: 'Logic & Control Flow',
    order: 4,
    title: 'Function & Arrow Function',
    description: 'Bungkus potongan kode yang dapat digunakan kembali berkali-kali dengan fungsi yang efisien.',
    objectives: [
      'Membuat fungsi dengan function keyword dan parameter',
      'Mengembalikan hasil komputasi menggunakan return',
      'Mengenal sintaks modern Arrow Function (() => {})'
    ],
    prerequisites: ['js-303'],
    estimatedMinutes: 7,
    xpReward: 40,
    playgroundStarter: {
      html: '<h3>Kalkulator Luas Persegi Panjang</h3>\n<p id="hasil"></p>',
      css: 'body { font-family: sans-serif; padding: 20px; }',
      js: 'const hitungLuas = (panjang, lebar) => panjang * lebar;\n\nconst p = 12;\nconst l = 5;\nconst luas = hitungLuas(p, l);\n\ndocument.getElementById("hasil").innerText = `Luas dengan p=${p} & l=${l} adalah ${luas} m\u00b2`;'
    },
    content: [
      {
        type: 'heading',
        content: 'Fungsi: Blok Kode Reusable'
      },
      {
        type: 'text',
        content: 'Fungsi menerima input melalui parameter, memproses logika, dan mengembalikan output melalui keyword return.'
      },
      {
        type: 'heading',
        content: 'Sintaks Arrow Function'
      },
      {
        type: 'text',
        content: 'ES6 memperkenalkan Arrow Function yang lebih ringkas dan bersih untuk dibaca.'
      },
      {
        type: 'code',
        codeLanguage: 'javascript',
        content: '// Fungsi Tradisional\nfunction sapa(nama) {\n  return `Halo, ${nama}!`;\n}\n\n// Arrow Function\nconst sapaModern = (nama) => `Halo, ${nama}!`;'
      }
    ],
    questions: [
      {
        id: 'q-js-304-1',
        type: 'multiple_choice',
        prompt: 'Keyword apakah yang digunakan di dalam fungsi untuk mengeluarkan nilai hasil perhitungan ke pemanggilnya?',
        options: ['return', 'output', 'send', 'break'],
        correctAnswer: 'return',
        explanation: 'Keyword return menghentikan eksekusi fungsi dan mengembalikan nilai tertentu ke pemanggil fungsi.'
      },
      {
        id: 'q-js-304-2',
        type: 'fill_blank',
        prompt: 'Lengkapilah sintaks arrow function penambahan berikut: const tambah = (a, b) [___] a + b;',
        correctAnswer: '=>',
        explanation: 'Tanda panah fat arrow (=>) adalah ciri khas penulisan Arrow Function di JavaScript modern.'
      }
    ]
  },
  {
    id: 'js-305',
    worldId: 'javascript',
    worldTitle: 'JavaScript Logic',
    level: 3,
    levelTitle: 'Data Structures',
    order: 5,
    title: 'Array & Operasi Data Modern',
    description: 'Kelola kumpulan data berurutan menggunakan Array dan method populer: map, filter, dan forEach.',
    objectives: [
      'Membuat dan mengakses elemen Array berdasarkan index 0',
      'Menambah/mengurangi elemen dengan push dan pop',
      'Mentransformasi data dengan method map dan filter'
    ],
    prerequisites: ['js-304'],
    estimatedMinutes: 8,
    xpReward: 40,
    playgroundStarter: {
      html: '<h3>Daftar Buah Segar</h3>\n<ul id="daftar"></ul>',
      css: 'body { font-family: sans-serif; padding: 20px; }',
      js: 'const buah = ["Apel", "Jeruk", "Mangga", "Pisang"];\nconst list = document.getElementById("daftar");\n\nbuah.forEach(item => {\n  const li = document.createElement("li");\n  li.textContent = item;\n  list.appendChild(li);\n});'
    },
    content: [
      {
        type: 'heading',
        content: 'Koleksi Berurutan (Array)'
      },
      {
        type: 'text',
        content: 'Array diindeks mulai dari angka 0. Elemen pertama berada pada indeks [0], elemen kedua pada [1], dan seterusnya.'
      },
      {
        type: 'heading',
        content: 'Method Populer Array'
      },
      {
        type: 'text',
        content: 'map() membuat array baru dengan mengubah setiap elemen, sedangkan filter() membuat array baru yang hanya berisi item yang lolos kriteria seleksi.'
      },
      {
        type: 'code',
        codeLanguage: 'javascript',
        content: 'const angka = [1, 2, 3, 4, 5];\nconst genap = angka.filter(n => n % 2 === 0); // [2, 4]\nconst kuadrat = angka.map(n => n * n);        // [1, 4, 9, 16, 25]'
      }
    ],
    questions: [
      {
        id: 'q-js-305-1',
        type: 'multiple_choice',
        prompt: 'Jika const bahasa = ["HTML", "CSS", "JS"]; maka nilai dari bahasa[1] adalah?',
        options: ['CSS', 'HTML', 'JS', 'undefined'],
        correctAnswer: 'CSS',
        explanation: 'Indeks array dimulai dari 0. bahasa[0] adalah "HTML", dan bahasa[1] adalah "CSS".'
      },
      {
        id: 'q-js-305-2',
        type: 'fill_blank',
        prompt: 'Method array apa yang digunakan untuk menambah elemen baru di posisi paling akhir array? [___]',
        correctAnswer: 'push',
        explanation: 'Method .push() menyisipkan satu atau beberapa elemen ke urutan terakhir dari array.'
      }
    ]
  },
  {
    id: 'js-306',
    worldId: 'javascript',
    worldTitle: 'JavaScript Logic',
    level: 4,
    levelTitle: 'DOM & Interaction',
    order: 6,
    title: 'DOM Manipulation & Interaksi Pengguna',
    description: 'Koneksikan JavaScript dengan HTML: ubah teks, manipulasi CSS, dan dengarkan event klik tombol.',
    objectives: [
      'Memilih elemen HTML dengan document.querySelector()',
      'Mengubah konten teks dan atribut secara real-time',
      'Mendengarkan event pengguna dengan addEventListener("click")'
    ],
    prerequisites: ['js-305'],
    estimatedMinutes: 8,
    xpReward: 45,
    playgroundStarter: {
      html: '<h3>Counter Interaktif</h3>\n<h1 id="angka">0</h1>\n<button id="btnTambah">+ Tambah</button>\n<button id="btnReset">Reset</button>',
      css: 'body { font-family: sans-serif; text-align: center; padding: 30px; }\nbutton { font-size: 16px; padding: 10px 18px; margin: 5px; border-radius: 6px; border: none; cursor: pointer; }\n#btnTambah { background: #16a34a; color: white; }\n#btnReset { background: #dc2626; color: white; }',
      js: 'let count = 0;\nconst display = document.querySelector("#angka");\nconst btnTambah = document.querySelector("#btnTambah");\nconst btnReset = document.querySelector("#btnReset");\n\nbtnTambah.addEventListener("click", () => {\n  count++;\n  display.textContent = count;\n});\n\nbtnReset.addEventListener("click", () => {\n  count = 0;\n  display.textContent = count;\n});'
    },
    content: [
      {
        type: 'heading',
        content: 'Apa Itu DOM?'
      },
      {
        type: 'text',
        content: 'DOM (Document Object Model) adalah representasi pohon objek dari dokumen HTML yang memungkinkan JavaScript membaca dan memodifikasi struktur halaman secara live tanpa perlu me-reload browser.'
      },
      {
        type: 'code',
        codeLanguage: 'javascript',
        content: 'const tombol = document.querySelector("#tombol-beli");\ntombol.addEventListener("click", () => {\n  tombol.textContent = "Sudah Dibeli!";\n  tombol.style.backgroundColor = "green";\n});'
      }
    ],
    questions: [
      {
        id: 'q-js-306-1',
        type: 'multiple_choice',
        prompt: 'Method DOM manakah yang menggunakan selector CSS fleksibel untuk memilih elemen pertama yang cocok?',
        options: ['document.querySelector()', 'document.getElementById()', 'document.find()', 'document.select()'],
        correctAnswer: 'document.querySelector()',
        explanation: 'querySelector() menerima selector CSS apapun (.class, #id, tag[attr]) dan mengembalikan elemen pertama yang cocok.'
      },
      {
        id: 'q-js-306-2',
        type: 'fill_blank',
        prompt: 'Method apa yang digunakan pada elemen HTML untuk mendaftarkan fungsi penanganan interaksi event? elemen.[___]("click", handler);',
        correctAnswer: 'addEventListener',
        explanation: 'addEventListener() menghubungkan handler fungsi ke suatu event seperti "click", "input", atau "submit".'
      }
    ]
  },
  {
    id: 'js-307',
    worldId: 'javascript',
    worldTitle: 'JavaScript Logic',
    level: 5,
    levelTitle: 'JavaScript Mastery',
    order: 7,
    title: 'Async/Await & Penanganan Data JSON',
    description: 'Pahami konsep asynchronous non-blocking, format data JSON, serta pola Promise dan Async/Await.',
    objectives: [
      'Memahami sifat asynchronous di browser',
      'Mengubah data objek ke format JSON string dan sebaliknya',
      'Menulis kode asynchronous yang bersih dengan async/await dan try/catch'
    ],
    prerequisites: ['js-306'],
    estimatedMinutes: 8,
    xpReward: 50,
    playgroundStarter: {
      html: '<h3>Simulasi Memuat Data Pengguna</h3>\n<div id="status">Mengambil data offline...</div>\n<div id="hasil" style="margin-top: 15px; font-weight: bold;"></div>',
      css: 'body { font-family: sans-serif; padding: 20px; }\n#hasil { color: #16a34a; background: #f0fdf4; padding: 12px; border-radius: 6px; }',
      js: '// Simulasi pengambilan data lokal secara asynchronous\nconst ambilProfilOffline = () => {\n  return new Promise((resolve) => {\n    setTimeout(() => {\n      resolve({ nama: "Dewi Lestari", peran: "Web Developer", skor: 98 });\n    }, 1000);\n  });\n};\n\nasync function muatData() {\n  try {\n    const user = await ambilProfilOffline();\n    document.getElementById("status").innerText = "Data berhasil dimuat!";\n    document.getElementById("hasil").innerText = `Pengguna: ${user.nama} (${user.peran}) - Skor: ${user.skor}`;\n  } catch (error) {\n    document.getElementById("status").innerText = "Gagal memuat data.";\n  }\n}\n\nmuatData();'
    },
    content: [
      {
        type: 'heading',
        content: 'Mengapa Butuh Asynchronous?'
      },
      {
        type: 'text',
        content: 'Tugas seperti membaca file atau request data membutuhkan waktu. Asynchronous memastikan browser tidak "hang" atau macet saat menunggu operasi tersebut selesai.'
      },
      {
        type: 'callout',
        calloutType: 'tip',
        content: 'Dalam aplikasi offline-first seperti BPROTIC Web Academy, kita menggunakan pola Promise dan Async/Await untuk berinteraksi dengan database lokal SQLite dan simulasi data tanpa membutuhkan jaringan internet!'
      },
      {
        type: 'code',
        codeLanguage: 'javascript',
        content: 'async function bacaData() {\n  try {\n    const response = await fetchMockData();\n    console.log("Sukses:", response);\n  } catch (err) {\n    console.error("Terjadi error:", err);\n  }\n}'
      }
    ],
    questions: [
      {
        id: 'q-js-307-1',
        type: 'multiple_choice',
        prompt: 'Keyword apakah yang harus disematkan di depan deklarasi fungsi agar kita dapat menggunakan keyword await di dalamnya?',
        options: ['async', 'awaitable', 'promise', 'defer'],
        correctAnswer: 'async',
        explanation: 'Keyword await hanya sah digunakan di dalam fungsi yang dideklarasikan dengan keyword async.'
      },
      {
        id: 'q-js-307-2',
        type: 'true_false',
        prompt: 'Blok try / catch digunakan untuk menangani potensi error runtime agar aplikasi tidak crash tiba-tiba.',
        correctAnswer: true,
        explanation: 'Benar. try/catch menangkap exception atau error saat eksekusi sehingga program dapat menangani kondisi kegagalan secara aman.'
      }
    ]
  }
];
