# BPROTIC Web Academy 🚀

Aplikasi mobile pembelajaran fundamental pemrograman web (HTML, CSS, JavaScript) dengan pengalaman gamifikasi interaktif terinspirasi Duolingo, didesain **100% offline-first** untuk Android menggunakan React Native & Expo SDK 58.

---

## 🌟 Fitur Utama

1. **Gamified Learning Path**:
   - 4 Dunia Pembelajaran bertingkat: HTML, CSS, JavaScript, dan Web Projects.
   - Peta belajar (roadmap) dengan node interaktif (Locked, Unlocked, Completed).
   - Sistem Hati (Hearts), XP, Streak harian, dan Leveling.
2. **Evaluasi Interaktif 5 Tipe Soal**:
   - Multiple Choice (Pilihan Ganda)
   - True / False (Benar / Salah)
   - Fill in the Blank (Melengkapi Kode)
   - Order Lines (Menyusun Baris Kode)
   - Find the Bug (Menemukan Baris Kode yang Error)
   - Penjelasan detail untuk setiap jawaban benar maupun salah.
3. **Offline Code Playground**:
   - Editor kode multi-tab (HTML, CSS, JavaScript) dengan template bawaan.
   - Eksekusi lokal instan di browser WebView perangkat tanpa server eksternal atau CDN.
   - Panel output konsol dan penanganan runtime error interaktif.
4. **4 Hands-On Web Projects**:
   - Personal Profile Page
   - Interactive Calculator
   - To-Do List Web App
   - Responsive Portfolio Page
   - Dilengkapi kriteria acceptance checklist dan submission review.
5. **Penyimpanan Lokal Persisten**:
   - Didukung `expo-sqlite` untuk menyimpan profil, XP, streak, lencana, dan riwayat quiz.
   - Progres tetap utuh saat aplikasi ditutup atau perangkat direstart.
   - Fitur reset progres dengan modal konfirmasi aman.

---

## 🏗️ 10 AI Agents Pembagian Tanggung Jawab

| Agent | Peran | Kontribusi Utama |
|---|---|---|
| **Agent 1** | Project Lead & Software Architect | Merancang kontrak tipe data (`src/types`), struktur folder modular, dan arsitektur routing Expo Router. |
| **Agent 2** | UI/UX Designer | Menetapkan sistem desain gamifikasi: tombol 3D (`GameButton`), indikator status (`StatPill`), progress bar glossy, palet warna 4 dunia. |
| **Agent 3** | Mobile Frontend Developer | Mengembangkan layar aplikasi: Dashboard, Roadmap, Onboarding, Lesson Detail, Quiz, Progres, dan Pengaturan. |
| **Agent 4** | Curriculum Designer | Menyusun kurikulum teknis HTML, CSS, JavaScript & 4 mini projects dalam Bahasa Indonesia yang ramah pemula. |
| **Agent 5** | Lesson & Quiz Engine Developer | Mengembangkan mesin penilaian 5 tipe soal, feedback instan (`FeedbackBanner`), dan evaluasi skor kelulusan. |
| **Agent 6** | Offline Code Playground Developer | Membangun `LocalCodeRunner` dengan sandbox WebView lokal, interseptor `console.log`, dan template kode. |
| **Agent 7** | Local Database & Progress Developer | Merancang skema SQLite (`users`, `user_stats`, `lesson_progress`, `quiz_history`, `user_badges`) dan repository CRUD offline. |
| **Agent 8** | Gamification Developer | Mengimplementasikan rumus leveling, kalkulasi streak harian, regenerasi hati berkala, dan evaluasi lencana prestasi. |
| **Agent 9** | QA & Testing Engineer | Melakukan audit TypeScript (`tsc --noEmit`), konfigurasi ESLint, dan pengujian alur belajar tanpa internet. |
| **Agent 10** | Build, Integration & Release Engineer | Mengonfigurasi `app.json`, `eas.json` untuk Android APK build, dan bundling aset lokal. |

---

## 📂 Struktur Direktori

```
src/
├── app/
│   ├── _layout.tsx              # Root Stack Navigator & DB Initializer
│   ├── index.tsx                # Root redirect ke (tabs)
│   ├── onboarding.tsx           # Setup profil awal & avatar
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Custom Bottom Tab Navigator
│   │   ├── index.tsx            # Home Dashboard & Quick Continue
│   │   ├── learn.tsx            # Learning Path Roadmap (Worlds 1-4)
│   │   ├── playground.tsx       # Offline Code Playground (HTML/CSS/JS)
│   │   ├── progress.tsx         # Progres, Lencana & Riwayat Quiz
│   │   └── settings.tsx         # Profil, Status Offline & Reset Progres
│   ├── lesson/
│   │   └── [id].tsx             # Pembaca materi & live snippet preview
│   ├── quiz/
│   │   └── [id].tsx             # Gamified Quiz Engine (Hearts, XP, 5 tipe soal)
│   └── project/
│       └── [id].tsx             # Guided Web Project Workbench & Checklist
├── components/
│   ├── ui/                      # GameButton 3D, StatPill, ProgressBar, PathNode, Banner
│   └── playground/              # LocalCodeRunner (isolated WebView)
├── constants/
│   ├── theme.ts                 # Tokens, WorldColors, Spacing, Typography
│   └── badges.ts                # Spesifikasi 10 lencana prestasi offline
├── data/
│   ├── curriculum/              # Dataset pelajaran HTML, CSS, JS
│   ├── projects/                # Dataset 4 web projects
│   └── playgroundTemplates.ts   # Template eksperimen kode offline
├── database/
│   ├── db.ts                    # Inisialisasi SQLite Database
│   └── repository.ts            # Operasi data persisten lokal
├── services/
│   ├── gamification.ts          # Rumus level, streak, regenerasi hati
│   └── quizEngine.ts            # Evaluasi jawaban & kalkulasi skor
└── types/
    └── index.ts                 # Kontrak antarmuka TypeScript
```

---

## 🛠️ Perintah Menjalankan Aplikasi

### 1. Menjalankan Mode Development
```bash
npx expo start
```
Buka aplikasi di Android emulator atau perangkat fisik menggunakan development build.

### 2. Memeriksa Tipe Data (Typecheck)
```bash
npx tsc --noEmit
```

### 3. Memeriksa Linter
```bash
npx eslint
```

---

## 📦 Membangun File APK Android (Stand-Alone)

Aplikasi telah dikonfigurasi dengan EAS Build untuk menghasilkan APK yang dapat dipasang langsung pada perangkat Android tanpa memerlukan Expo Go atau koneksi internet saat dijalankan:

```bash
# 1. Login ke EAS jika belum
npx eas-cli login

# 2. Build APK Android mandiri
npx eas-cli build --profile preview --platform android
```

File APK yang dihasilkan siap di-install pada perangkat Android dan diuji dalam kondisi **Airplane Mode (Tanpa Internet)**.
