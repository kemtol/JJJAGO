# BSJP — Catatan Pemahaman Sesi Apr 2026

Dokumen ini ditulis sebagai narasi, bukan dokumentasi teknis. Tujuannya supaya siapapun yang baca bisa langsung paham konteks dan keputusan yang sudah dibuat, tanpa harus baca semua kode dan metrics dari awal.

---

## 1. Cara Kerja Pipeline Secara Sederhana

Bayangkan kita punya mesin yang setiap hari belajar dari data pasar, lalu tiap sore mengeluarkan 3 rekomendasi saham yang kemungkinan besar akan naik dari sore ke pagi besok.

Prosesnya ada 4 tahap:

**Tahap 1 — Kumpulkan data mentah (Level 0)**
Setiap hari kita ambil dua jenis data: pertama, aktivitas broker — siapa yang beli dan jual saham apa, dari sumber IPOT. Kedua, data harga OHLCV dari Yahoo Finance. Ini disimpan apa adanya, belum diproses.

**Tahap 2 — Olah jadi fitur (Level 1)**
Data mentah diolah menjadi angka-angka yang bermakna. Misalnya: "broker lokal beli bersih berapa di saham ini 3 hari terakhir?", "berapa kali saham ini gap up dalam 20 hari?". Hasilnya 122 kolom per kombinasi tanggal × broker × saham.

**Tahap 3 — Buat tabel training (Level 2)**
Fitur dari semua broker diagregat per saham per hari. Di sini juga dibuat **label**: apakah saham ini keesokan paginya naik melebihi biaya transaksi (TP) atau justru turun parah (SL)? Label inilah yang akan diajarkan ke model. Hasilnya 234 kolom per kombinasi tanggal × saham.

**Tahap 4 — Training & validasi walk-forward**
Model LightGBM belajar dari data historis, lalu diuji di periode yang belum pernah dilihat sebelumnya (OOT = 100 hari terakhir). Proses ini diulang beberapa kali dengan jendela training yang terus bergeser maju — inilah yang disebut **walk-forward**. Tujuannya agar hasil validasi benar-benar mencerminkan performa di kondisi nyata, bukan di data yang sudah "dihafalkan" model.

Setelah training, model menghasilkan **skor probabilitas** untuk setiap saham setiap hari. Tiga saham dengan skor tertinggi jadi rekomendasi, dengan alokasi modal 60%–30%–10% (rank #1 dapat porsi terbesar karena keyakinan paling tinggi).

---

## 2. Perjalanan Iterasi: Dari v1 Sampai Grid Search

### v1–v7: Belajar sambil jalan

Di awal, setiap versi adalah eksperimen manual — ubah satu hal, lihat hasilnya, ulang. Perlahan-lahan ditemukan hal-hal penting:

- **v5 GAGAL**: Kita filter saham yang terlalu illiquid, tapi justru itu yang jadi sumber edge. Langsung dimatikan.
- **v6**: Fix bug simulasi portofolio. Baseline yang jujur.
- **v7**: Tambah fitur "karakter gap down" — setiap saham punya watak berbeda soal seberapa sering dan parah dia gap down di malam hari. Model yang bisa membaca ini jauh lebih pintar memilih saham yang "aman". Hasilnya: return naik dari +80% ke +103%, drawdown turun dari -56% ke -30%.

**v7 jadi best practice** dan dicatat di edge.md. Angka +102.8% itu konsisten — baik di OOT window lama maupun ketika diukur ulang dengan data terkini (s.d. Apr 2026), hasilnya tetap +102.8%. v7 masih relevan.

### v8–v9: Eksplorasi yang hasilnya lebih rendah dari v7

Setelah v7, ada banyak eksperimen kecil. Semuanya menghasilkan return positif tapi lebih rendah dari v7:
- v8: +66.5% OOT, drawdown -40.6% — lebih volatile dari v7
- v9: +31.8% OOT, drawdown -32.0% — return turun
- v9b: sanity check reproduksi v7 — berhasil (+95.2%), konfirmasi v7 stabil
- v9c: evaluasi year-to-date (hanya 2026) — hasil -42.8%, konfirmasi pasar 2026 lebih keras
- v9d: coba LGBMRanker. Gagal — win rate 44%, return -0.3%

### v10: Dua perubahan besar sekaligus

Di sini ada **pivot metodologi** yang penting. Selama ini model belajar memprediksi return overnight (beli sore, jual pagi). Di v10, dicoba objective baru: **beli di open pagi, jual di close sekitar jam 10:00**. Ini disebut "close10".

Kenapa? Karena di pagi hari setelah market buka, ada lebih banyak fleksibilitas — bisa pasang TP intraday, bisa pilih momen exit yang lebih baik. Exit jam 09:05 itu sangat kaku.

Hasilnya menjanjikan:
- `v10_close10_obj` (k=3, tanpa guard): +226% OOT, tapi drawdown -48% — terlalu dalam.
- `v10_close10_obj_k2_guard`: kurangi ke 2 posisi → drawdown turun ke -34%.
- `v10_close10_obj_k2_w25_guard`: tambah batasan bobot maksimal 25% per saham → drawdown -26%, return +115%, Sharpe 3.57.

**Kandidat ini (`k2_w25_guard`) yang kemudian dijadikan kandidat operasional**, karena satu-satunya yang sudah divalidasi lengkap dengan Monte Carlo 10.000 simulasi.

### v11: Temuan krusial — v7 terlalu dikekang

Sambil jalan, muncul hipotesis baru: **mungkin selama ini model kita terlalu dikekang oleh regularisasi yang terlalu ketat**. v7 pakai `min_data_in_leaf=500` — artinya setiap daun di decision tree harus punya minimal 500 data. Ini sangat konservatif.

Hyperopt dijalankan, dan terbukti: dengan `min_data_in_leaf=50` dan lambda yang lebih longgar, AUC OOT naik dan return melonjak drastis.

Tapi ada trade-off: model yang lebih longgar juga memilih saham yang lebih volatile. Return hariannya naik dari ~1% ke ~4% per hari, tapi volatilitas harian ikut naik dari ~4% ke ~15%. Karena return di-compound setiap hari, selisih vol sekecil itu bisa menghasilkan perbedaan return yang luar biasa besar di akhir 100 hari.

`v11_hyperopt` menunjukkan +1668% di OOT. Angka ini matematis benar, tapi **belum bisa dipercaya** karena belum ada Monte Carlo dan ada risiko hyperparameter overfitting (lihat bagian 4).

### Grid search: bukan metodologi baru, hanya pencarian sistematis

Setelah v11 membuktikan bahwa area params yang lebih longgar itu promising, daripada tebak-tebak satu per satu lagi, dijalankan **grid search** — artinya semua kombinasi params dalam rentang tertentu dicoba sekaligus:
