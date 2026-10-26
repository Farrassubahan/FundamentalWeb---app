import { Question } from '@/types';

export const REFILL_CHALLENGES: Question[] = [
  // 1. HTML Basics
  {
    id: 'refill_html_a',
    type: 'multiple_choice',
    prompt: 'Tag HTML apa yang digunakan untuk membuat tautan atau hyperlink?',
    options: ['<a>', '<link>', '<href>', '<url>'],
    correctAnswer: '<a>',
    explanation: 'Tag <a> (anchor) dengan atribut href digunakan untuk membuat hyperlink ke halaman lain atau URL tujuan.',
  },
  {
    id: 'refill_html_img_alt',
    type: 'multiple_choice',
    prompt: 'Atribut apa pada tag <img> yang wajib untuk aksesibilitas dan teks cadangan jika gambar gagal dimuat?',
    options: ['alt', 'title', 'src', 'caption'],
    correctAnswer: 'alt',
    explanation: 'Atribut "alt" (alternative text) berfungsi menjelaskan isi gambar kepada pembaca layar atau jika file gambar rusak.',
  },
  {
    id: 'refill_html_p_tf',
    type: 'true_false',
    prompt: 'Tag <p> di dalam dokumen HTML digunakan untuk membuat sebuah paragraf teks.',
    correctAnswer: true,
    explanation: 'Benar! Tag <p> merepresentasikan paragraph untuk teks reguler di halaman web.',
  },
  {
    id: 'refill_html_h1_tf',
    type: 'true_false',
    prompt: 'Tag <h6> memiliki ukuran teks bawaan yang lebih besar dibandingkan tag <h1>.',
    correctAnswer: false,
    explanation: 'Salah! <h1> adalah heading tingkat utama (terbesar), sedangkan <h6> adalah tingkatan heading terkecil.',
  },
  {
    id: 'refill_html_doctype',
    type: 'multiple_choice',
    prompt: 'Deklarasi standar di baris paling pertama dokumen HTML5 adalah...',
    options: ['<!DOCTYPE html>', '<html>', '<doctype>', '<meta charset="utf-8">'],
    correctAnswer: '<!DOCTYPE html>',
    explanation: '<!DOCTYPE html> memberi tahu browser untuk merender halaman sesuai spesifikasi HTML5 modern.',
  },
  {
    id: 'refill_html_list_ul',
    type: 'multiple_choice',
    prompt: 'Tag HTML apa yang digunakan untuk membuat daftar yang tidak bernomor (bullet points)?',
    options: ['<ul>', '<ol>', '<li>', '<dl>'],
    correctAnswer: '<ul>',
    explanation: 'Tag <ul> (Unordered List) menghasilkan daftar dengan simbol bullet, sedangkan <ol> bernomor (1, 2, 3).',
  },
  {
    id: 'refill_html_button',
    type: 'true_false',
    prompt: 'Tag <button> di HTML digunakan untuk membuat tombol yang dapat diklik oleh pengguna.',
    correctAnswer: true,
    explanation: 'Benar! Tag <button> secara semantik merepresentasikan tombol interaktif dalam dokumen web.',
  },
  {
    id: 'refill_html_input_type',
    type: 'multiple_choice',
    prompt: 'Nilai atribut "type" pada tag <input> yang menyembunyikan karakter teks yang diketik adalah...',
    options: ['password', 'hidden', 'secret', 'text'],
    correctAnswer: 'password',
    explanation: '<input type="password"> secara otomatis menyamarkan input karakter menjadi titik/bintang demi keamanan.',
  },

  // 2. CSS Styling
  {
    id: 'refill_css_color',
    type: 'multiple_choice',
    prompt: 'Properti CSS mana yang digunakan secara khusus untuk mengubah warna teks?',
    options: ['color', 'font-color', 'text-color', 'background-color'],
    correctAnswer: 'color',
    explanation: 'Di CSS, properti "color" mengatur warna teks huruf, sedangkan "background-color" mengatur warna latar.',
  },
  {
    id: 'refill_css_bg',
    type: 'multiple_choice',
    prompt: 'Properti CSS untuk mengubah warna latar belakang sebuah elemen adalah...',
    options: ['background-color', 'bg-color', 'color-background', 'fill'],
    correctAnswer: 'background-color',
    explanation: 'background-color adalah properti standar CSS untuk mewarnai bidang latar elemen.',
  },
  {
    id: 'refill_css_id_selector',
    type: 'multiple_choice',
    prompt: 'Simbol awalan yang digunakan selektor CSS untuk menargetkan elemen berdasarkan atribut ID adalah...',
    options: ['# (hash)', '. (titik)', '* (bintang)', '$ (dollar)'],
    correctAnswer: '# (hash)',
    explanation: 'Selektor ID di CSS diawali tanda pagar (#), misalnya #header atau #navbar.',
  },
  {
    id: 'refill_css_class_selector',
    type: 'multiple_choice',
    prompt: 'Simbol awalan yang digunakan selektor CSS untuk menargetkan elemen berdasarkan atribut CLASS adalah...',
    options: ['. (titik)', '# (hash)', '@ (at)', '& (ampersand)'],
    correctAnswer: '. (titik)',
    explanation: 'Selektor class di CSS diawali dengan titik (.), contohnya .card atau .btn-primary.',
  },
  {
    id: 'refill_css_margin_padding',
    type: 'multiple_choice',
    prompt: 'Properti CSS untuk mengatur jarak ruang di LUAR batas border elemen disebut...',
    options: ['margin', 'padding', 'spacing', 'gap'],
    correctAnswer: 'margin',
    explanation: 'Margin adalah ruang di luar border elemen, sedangkan padding adalah ruang di dalam elemen antara konten dan border.',
  },
  {
    id: 'refill_css_border_radius',
    type: 'true_false',
    prompt: 'Properti "border-radius: 50%" dapat digunakan untuk membuat elemen berbentuk lingkaran sempurna.',
    correctAnswer: true,
    explanation: 'Benar! Elemen persegi dengan panjang dan lebar sama jika diberi border-radius 50% akan menjadi lingkaran.',
  },
  {
    id: 'refill_css_display_flex',
    type: 'multiple_choice',
    prompt: 'Nilai properti "display" yang paling populer untuk tata letak baris/kolom responsif modern adalah...',
    options: ['flex', 'block', 'table', 'inline'],
    correctAnswer: 'flex',
    explanation: 'Flexbox ("display: flex") menyediakan sistem tata letak 1-dimensi yang sangat fleksibel dan responsif.',
  },
  {
    id: 'refill_css_font_size',
    type: 'multiple_choice',
    prompt: 'Properti CSS untuk mengubah ukuran font atau besar kecilnya teks adalah...',
    options: ['font-size', 'text-size', 'size', 'font-style'],
    correctAnswer: 'font-size',
    explanation: 'Properti font-size (contoh: font-size: 16px atau 1.5rem) digunakan untuk menentukan ukuran huruf.',
  },

  // 3. JavaScript Concepts
  {
    id: 'refill_js_const',
    type: 'multiple_choice',
    prompt: 'Keyword JavaScript apa yang digunakan untuk variabel yang nilainya TIDAK dapat di-reassign (tetap)?',
    options: ['const', 'let', 'var', 'static'],
    correctAnswer: 'const',
    explanation: '"const" mendeklarasikan variabel bernilai konstan yang tidak dapat diubah kembali setelah inisialisasi.',
  },
  {
    id: 'refill_js_let',
    type: 'true_false',
    prompt: 'Variabel yang dideklarasikan dengan "let" di JavaScript nilainya BISA diubah kembali nanti.',
    correctAnswer: true,
    explanation: 'Benar! "let" adalah variabel block-scoped yang nilainya dapat di-reassign sewaktu-waktu.',
  },
  {
    id: 'refill_js_console',
    type: 'multiple_choice',
    prompt: 'Perintah JavaScript standar untuk menampilkan pesan atau log debug di console developer adalah...',
    options: ['console.log()', 'print()', 'echo()', 'System.out.println()'],
    correctAnswer: 'console.log()',
    explanation: 'console.log() digunakan secara universal di browser dan runtime JavaScript untuk mencetak pesan.',
  },
  {
    id: 'refill_js_boolean',
    type: 'multiple_choice',
    prompt: 'Tipe data JavaScript yang hanya memiliki dua kemungkinan nilai (true atau false) adalah...',
    options: ['boolean', 'string', 'number', 'array'],
    correctAnswer: 'boolean',
    explanation: 'Tipe data boolean merepresentasikan nilai logika benar (true) atau salah (false).',
  },
  {
    id: 'refill_js_array_length',
    type: 'multiple_choice',
    prompt: 'Properti apa yang digunakan untuk mengetahui jumlah elemen di dalam sebuah Array JavaScript?',
    options: ['.length', '.size', '.count', '.total'],
    correctAnswer: '.length',
    explanation: 'Di JavaScript, array memiliki properti bawaan ".length" yang mengembalikan jumlah item di dalamnya.',
  },
  {
    id: 'refill_js_equality_tf',
    type: 'true_false',
    prompt: 'Operator === (triple equals) memeriksa kecocokan nilai sekaligus tipe datanya secara ketat.',
    correctAnswer: true,
    explanation: 'Benar! "===" adalah strict equality operator yang membandingkan nilai dan tipe data tanpa konversi paksa.',
  },
  {
    id: 'refill_js_typeof',
    type: 'multiple_choice',
    prompt: 'Apa hasil evaluasi ekspresi: typeof "Halo Dunia" di JavaScript?',
    options: ['string', 'number', 'text', 'object'],
    correctAnswer: 'string',
    explanation: 'Teks yang diapit tanda kutip merupakan tipe data primitif "string".',
  },
  {
    id: 'refill_js_alert_tf',
    type: 'true_false',
    prompt: 'Fungsi alert() di browser digunakan untuk memunculkan kotak dialog popup pesan kepada pengguna.',
    correctAnswer: true,
    explanation: 'Benar! window.alert() menampilkan modal pop-up sederhana bawaan browser dengan pesan teks dan tombol OK.',
  },
];

let globalLastChallengeId: string | null = null;

/**
 * Get a random refill challenge question from the pool, ensuring it doesn't repeat recent ones
 */
export function getRandomRefillChallenge(excludeIds: string[] | string = []): Question {
  const excludeList: string[] = Array.isArray(excludeIds)
    ? [...excludeIds]
    : excludeIds
    ? [excludeIds]
    : [];

  if (globalLastChallengeId && !excludeList.includes(globalLastChallengeId)) {
    excludeList.push(globalLastChallengeId);
  }

  let pool = REFILL_CHALLENGES.filter((q) => !excludeList.includes(q.id));

  // If pool is exhausted, reset filter to allow cycling except the most recent one
  if (pool.length === 0) {
    const lastId = excludeList[excludeList.length - 1];
    pool = REFILL_CHALLENGES.filter((q) => q.id !== lastId);
    if (pool.length === 0) {
      pool = REFILL_CHALLENGES;
    }
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const selected = pool[randomIndex];
  globalLastChallengeId = selected.id;
  return selected;
}
