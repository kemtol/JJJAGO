# PRD — JAGOALGO.id

**Tanggal:** 2026-04-19
**Status:** Draft

---

## 1. Ringkasan Produk

JAGOALGO.id adalah platform e-learning berbasis web yang memungkinkan pengguna mempelajari skill kreatif dan teknis (UI/UX, Web Development, Illustration) secara online. Platform ini mengedepankan pengalaman belajar yang fleksibel, terjangkau, dan didukung oleh instruktur profesional dari industri.

---

## 2. Tujuan & Sasaran

| Tujuan | Metrik Sukses |
|--------|---------------|
| Menjadi platform skill-building pilihan pengguna muda | 42.000+ pengguna aktif |
| Menyediakan kursus berkualitas tinggi dari instruktur berpengalaman | Rating rata-rata ≥ 4.5 bintang |
| Membangun komunitas belajar yang aktif | Tingkat retensi pengguna ≥ 60% |
| Menghasilkan revenue melalui penjualan kursus | Break-even dalam 12 bulan |

---

## 3. Target Pengguna

**Segmen Utama: Pelajar & Profesional Muda (18–35 tahun)**
- Mahasiswa yang ingin menambah skill di luar kurikulum kampus
- Profesional yang ingin beralih karir atau meningkatkan kompetensi
- Kreator independen yang ingin belajar desain / coding dari dasar

**Pain Point:**
- Kurikulum kampus tidak mengikuti perkembangan industri
- Kursus berkualitas mahal dan jadwalnya tidak fleksibel
- Sulit menemukan mentor / instruktur yang berpengalaman

---

## 4. Fitur Produk

### 4.1 Landing Page (MVP — sudah ada)

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Hero section | Headline, CTA "Get Started", social proof (42k+ users) | Done |
| Trusted by | Logo media terpercaya (TIME, Forbes, TechCrunch) | Done |
| Curriculum overview | Penjelasan metode belajar hands-on & instruktur | Done |
| Feature highlights | Certificate, Instructor, Lifetime Support, Video Lesson | Done |
| Popular Courses | 3 kursus unggulan dengan search bar | Done |
| Why JAGOALGO.id | Perbandingan keunggulan platform | Done |
| Testimonials | 4 ulasan nyata pengguna | Done |
| Join Community | Form subscribe email | Done |
| Footer & Navbar | Navigasi ke Home, Courses, Community, About | Done |

### 4.2 Fitur Lanjutan (Roadmap)

| Fitur | Prioritas | Estimasi |
|-------|-----------|----------|
| Halaman daftar kursus lengkap | P0 | Sprint 1 |
| Halaman detail kursus + preview video | P0 | Sprint 1 |
| Auth: Register / Login / OTP | P0 | Sprint 1 |
| Dashboard pengguna (progress belajar) | P1 | Sprint 2 |
| Checkout & pembayaran kursus | P0 | Sprint 2 |
| Video player + materi kursus | P1 | Sprint 2 |
| Sertifikat otomatis saat kursus selesai | P1 | Sprint 3 |
| Sistem rating & ulasan kursus | P2 | Sprint 3 |
| Halaman profil instruktur | P2 | Sprint 3 |
| Komunitas / forum diskusi | P2 | Sprint 4 |
| Mobile app (PWA atau native) | P3 | Sprint 5+ |

---

## 5. Kursus yang Tersedia (Initial Catalog)

| Kursus | Instruktur | Kategori | Harga |
|--------|-----------|----------|-------|
| UI Design Landing Page | Haydiya | UI/UX | $135 |
| Html and JavaScript | M. Johansen | Web Development | $120 |
| Basic Flat Illustration | Savannah Nguyen | Illustration | $128 |

---

## 6. Arsitektur Teknis

| Komponen | Teknologi |
|----------|-----------|
| Frontend | HTML5, CSS3, Bootstrap 5.3, jQuery |
| Hosting / CDN | Cloudflare Workers (`workers/www`) |
| Font | Google Fonts — Inter |
| Icons | Bootstrap Icons 1.11 |
| Deploy | Wrangler (Cloudflare) |

**Catatan:** `wrangler.toml` dan `workers/www/src/index.js` saat ini masih kosong — perlu dikonfigurasi untuk serving static assets ke production.

---

## 7. Alur Pengguna Utama

### Alur: Pengguna Baru Mendaftar & Membeli Kursus

```
Landing Page
  → Klik "Get Started"
  → Halaman Register / Sign Up
  → Verifikasi OTP (email/HP)
  → Browse kursus
  → Lihat detail kursus
  → Checkout & bayar
  → Akses video materi
  → Selesaikan kursus → dapat sertifikat
```

### Alur: Pengguna Lama Login

```
Landing Page → Sign In → Dashboard → Lanjutkan belajar
```

---

## 8. Desain & Branding

| Elemen | Nilai |
|--------|-------|
| Primary color | `#7c6fcd` (purple) |
| Accent color | `#5dbfb0` (mint) |
| Background | `#ffffff` |
| Dark bg | `#0d0d1a` |
| Font | Inter (400, 500, 600, 700, 800, 900) |
| Border radius | `1rem` |
| Tone | Friendly, youthful, professional |

---

## 9. Batasan & Asumsi

- Platform awal difokuskan ke web (desktop-first, mobile responsive)
- Pembayaran diasumsikan menggunakan payment gateway pihak ketiga (Stripe / Midtrans)
- Konten video di-host di layanan eksternal (YouTube unlisted / Vimeo / Cloudflare Stream)
- Bahasa utama: Inggris (lokalisasi ke Bahasa Indonesia di fase berikutnya)

---

## 10. Risiko

| Risiko | Dampak | Mitigasi |
|--------|--------|----------|
| Kursus tidak cukup bervariasi | Pengguna tidak kembali | Rekrut lebih banyak instruktur sejak awal |
| Performa video lambat | UX buruk, churn tinggi | Gunakan CDN video (Cloudflare Stream) |
| Pembayaran gagal / fraud | Revenue loss | Integrasi Stripe + 3DS authentication |
| Workers belum dikonfigurasi | Produk tidak bisa deploy | Prioritaskan setup Wrangler di Sprint 0 |

---

## 11. Out of Scope (v1)

- Live streaming / webinar interaktif
- Fitur mentoring 1-on-1
- Marketplace instruktur (instruktur upload sendiri)
- Gamifikasi (badges, leaderboard)
- Multi-bahasa

---

*PRD ini akan diperbarui seiring perkembangan produk.*
