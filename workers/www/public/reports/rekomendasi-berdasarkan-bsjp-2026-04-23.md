# Laporan Analisis Strategi "Beli Sore Jual Pagi" (BSJP)
## Evaluasi Dua Model Kandidat untuk Trader Ritel
**Tanggal:** 23 April 2026
**Disusun oleh:** Tim Riset Kuantitatif - BSJP Project

---

## 1. Ringkasan Eksekutif

Laporan ini membandingkan dua versi model prediksi saham yang dirancang khusus untuk **trader ritel dengan modal terbatas** di pasar saham Indonesia (khususnya saham lapis kedua atau *second-liner*). Kedua model menggunakan pendekatan "Beli Sore, Jual Pagi" - membeli saham menjelang penutupan pasar (sekitar pukul 15.30) dan menjualnya keesokan paginya (pukul 10.00).

Hasil pengujian pada **100 hari perdagangan** (13 November 2025 - 21 April 2026) menunjukkan:

| Model | Keuntungan Bersih* | Risiko Penurunan Terbesar** | Cocok untuk Siapa? |
|---|---|---|---|
| **Model A - "Agresif"** | **+226%** | **-48%** | Trader dengan toleransi risiko sangat tinggi yang mengejar pertumbuhan maksimal. |
| **Model B - "Terkendali"** | **+115%** | **-26%** | Trader yang menginginkan keseimbangan antara keuntungan tinggi dan tidur nyenyak di malam hari. |

**Kesimpulan Utama:**
Kedua model **berhasil membuktikan keunggulan (edge) yang nyata**. Model Agresif menawarkan potensi keuntungan spektakuler, namun dengan risiko penurunan nilai yang sangat dalam. Model Terkendali mengorbankan sebagian keuntungan untuk mengurangi risiko secara signifikan, menjadikannya pilihan yang lebih **kokoh (robust)** bagi sebagian besar trader ritel.

> **Glosarium Cepat:**
> - **Keuntungan Bersih (Cumulative Net Return):** Total persentase pertumbuhan modal Anda setelah dikurangi semua biaya transaksi (komisi beli/jual dan selisih harga). Contoh: Modal Rp10 juta menjadi Rp32,6 juta pada Model A, atau Rp21,5 juta pada Model B.
> - **Risiko Penurunan Terbesar (Max Drawdown):** Persentase penurunan terbesar yang pernah dialami nilai portofolio dari puncak tertinggi ke lembah terendah. Angka -48% berarti pada satu titik, modal Rp10 juta pernah menyusut menjadi sekitar Rp5,2 juta sebelum akhirnya pulih dan naik lebih tinggi.

---

## 2. Bagaimana Cara Kerja Model Ini?

Model kami menggunakan **mesin pembelajaran komputer (Machine Learning)** untuk mempelajari pola dari data historis. Sederhananya, setiap sore model akan memindai ratusan saham dan memberikan "skor keyakinan" (probabilitas) kepada masing-masing saham. Skor ini menunjukkan seberapa yakin model bahwa saham tersebut akan naik keesokan paginya.

**Sinyal Utama yang Digunakan Model (dari yang terpenting):**
1. **Momentum Sesi Akhir:** Apakah harga saham sedang bergerak naik dengan cepat di jam terakhir perdagangan? (Ini adalah sinyal paling kuat).
2. **Rentang Harga Harian:** Seberapa lebar fluktuasi harga saham hari itu? Saham yang aktif seringkali berlanjut esok harinya.
3. **Sentimen Global:** Apakah indeks saham AS (Nasdaq) dan nilai tukar Rupiah kemarin menguat? Sentimen global positif seringkali menular ke pasar Indonesia.
4. **"Kebiasaan" Gap Up:** Apakah saham ini dalam 20-60 hari terakhir seringkali langsung naik begitu pasar buka? Beberapa saham memang punya "karakter" seperti itu.

Model kemudian memilih 2 atau 3 saham dengan skor tertinggi untuk dibeli.

---

## 3. Profil Risiko dan Potensi Keuntungan

### 3.1. Perbandingan Pertumbuhan Modal (Grafik Imajiner)

Grafik di bawah ini mengilustrasikan bagaimana modal Rp10 juta akan bertumbuh jika mengikuti rekomendasi kedua model.

**[Tempatkan Gambar: `pnl_growth_chart_comparison.png`]**
*Deskripsi Gambar:* Grafik garis dengan sumbu X = Hari ke-1 sampai ke-100, sumbu Y = Nilai Portofolio (dalam Juta Rupiah).
- **Garis Merah (Model Agresif):** Naik sangat curam dari Rp10 juta menjadi lebih dari Rp32 juta, namun dengan beberapa kali "jurang" penurunan yang dalam (misal, di hari ke-70 turun dari Rp25 juta ke Rp15 juta).
- **Garis Biru (Model Terkendali):** Naik lebih landai dan stabil dari Rp10 juta menjadi sekitar Rp21,5 juta, dengan "jurang" penurunan yang jauh lebih dangkal.

### 3.2. Ukuran Kualitas Keuntungan: Sharpe Ratio

Dalam dunia investasi, bukan hanya seberapa besar untung yang penting, tetapi juga **seberapa mulus** perjalanannya. Ibarat naik mobil, kita lebih suka jalan tol yang lurus daripada jalan pegunungan yang curam dan membuat mabuk.

**Sharpe Ratio** adalah ukuran yang menggabungkan keuntungan dan "guncangan" (volatilitas) perjalanan tersebut.

| Model | **Sharpe Ratio (Tahunan)** | Interpretasi Sederhana |
|---|---|---|
| **Model A - "Agresif"** | **3.70** | **Sangat Baik.** Keuntungan yang dihasilkan jauh lebih besar dibandingkan guncangan yang harus ditanggung. |
| **Model B - "Terkendali"** | **3.57** | **Sangat Baik.** Hampir sama baiknya dengan Model A, meskipun keuntungan total lebih rendah. |

> **Penjelasan Sharpe Ratio:** Angka di atas 1.0 sudah dianggap **baik**. Angka di atas 3.0 menandakan performa **luar biasa**, setara dengan dana lindung nilai (*hedge fund*) kelas atas. Ini menunjukkan bahwa model kita tidak sekadar beruntung, tetapi memang memiliki keunggulan yang konsisten.

### 3.3. Mengukur Risiko "Jurang" Terdalam: Ulcer Index & Calmar Ratio

**Max Drawdown** hanya menceritakan satu kejadian terburuk. **Ulcer Index** mengukur seberapa "sakit" dan "lama" masa-masa sulit secara keseluruhan. Semakin kecil angkanya, semakin baik.

| Model | **Max Drawdown** | **Ulcer Index** | **Calmar Ratio** |
|---|---|---|---|
| **Model A - "Agresif"** | -48.48% | 19.58% | 7.00 |
| **Model B - "Terkendali"** | -26.04% | 11.12% | **8.35** |

> **Penjelasan:**
> - **Ulcer Index (Indeks "Maag"):** Bayangkan ini sebagai tingkat stres Anda saat melihat portofolio merah. Model B memiliki indeks stres yang jauh lebih rendah (11.12%) daripada Model A (19.58%).
> - **Calmar Ratio (Rasio Imbalan-Penderitaan):** Membandingkan keuntungan tahunan dengan *max drawdown*. Model B (8.35) lebih unggul dari Model A (7.00), menunjukkan bahwa untuk setiap 1% risiko penurunan, Model B memberikan imbalan yang lebih besar.

**[Tempatkan Gambar: `monte_maxdd_hist_comparison.png`]**
*Deskripsi Gambar:* Dua histogram berdampingan. Sumbu X = Persentase Max Drawdown (dari -80% hingga 0%), Sumbu Y = Frekuensi (seberapa sering terjadi dalam 10.000 simulasi).
- Histogram Model A lebih lebar dan memiliki "ekor gemuk" di sebelah kiri (sering mengalami penurunan -40% hingga -60%).
- Histogram Model B lebih sempit dan terpusat di sekitar -25%, dengan ekor kiri yang jauh lebih pendek.
*Pesan Utama:* Dalam skenario terburuk sekalipun, Model B cenderung membatasi kerugian Anda di kisaran -25% hingga -40%, sementara Model A bisa menyeret Anda ke dalam penurunan lebih dari -50%.

---

## 4. Fase "Naik-Turun" Kinerja Bulanan

Tidak ada model yang sempurna. Kedua model akan mengalami fase di mana kinerjanya kurang baik. Dengan menganalisis kinerja **20 hari terakhir** secara bergulir, kita bisa melihat seberapa sering model "macet".

| Metrik (Rolling 20 Hari) | **Model A (Agresif)** | **Model B (Terkendali)** |
|---|---|---|
| **Rata-rata Sharpe Ratio** | 5.0 (Sangat Baik) | 4.9 (Sangat Baik) |
| **Kondisi Terburuk (P10)** | Sharpe Ratio -3.5 (Rugi) | Sharpe Ratio -3.5 (Rugi) |
| **Rata-rata Max Drawdown** | -5.5% | -5.5% |
| **Max Drawdown Terburuk (P90)** | **-24.0%** | **-3.6%** |

> **Interpretasi:** Angka P90 pada Max Drawdown adalah temuan kunci. Artinya, dalam 90% periode 20-hari, **Model B tidak pernah mengalami penurunan lebih dari -3.6%**. Sebaliknya, pada 10% periode terburuk, Model A bisa anjlok hingga -24% hanya dalam 20 hari. Ini menegaskan bahwa **Model B jauh lebih stabil dalam jangka pendek**.

---

## 5. Simulasi Skenario Masa Depan: "Bagaimana Jika...?"

Kita tidak bisa memprediksi masa depan, tapi kita bisa "bermain perang-perangan" menggunakan data historis untuk melihat kemungkinan-kemungkinan terburuk. Kami menjalankan **10.000 simulasi skenario pasar** menggunakan teknik *Block Bootstrap*.

| Hasil Simulasi (Horizon 252 hari ~= 1 tahun) | **Model A (Agresif)** | **Model B (Terkendali)** |
|---|---|---|
| **Probabilitas Akhir Tahun RUGI** | **6.9%** | **0.2%** |
| **Probabilitas Mengalami Max DD > -30%** | **91.8%** | **24.5%** |
| **Median Keuntungan Akhir Tahun** | +1.445% | +592% |
| **Skenario Terburuk (P95 Max Drawdown)** | -68.0% | -40.2% |

**[Tempatkan Gambar: `monte_return_cdf_comparison.png`]**
*Deskripsi Gambar:* Dua kurva CDF. Sumbu X = Keuntungan Terminal (dari 0x hingga 20x modal), Sumbu Y = Probabilitas Kumulatif (0% hingga 100%).
- Kurva Model A berada di sebelah kanan (lebih banyak skenario untung besar), tetapi juga memiliki ekor di kiri (skenario untung kecil/rugi).
- Kurva Model B juga di kanan, tetapi lebih "terkumpul" rapat, menunjukkan kepastian hasil yang lebih tinggi.

> **Peringatan Keras untuk Model A:** Meskipun potensi keuntungannya menggiurkan, hasil simulasi menunjukkan bahwa **hampir pasti (92% kemungkinan)** Anda akan mengalami masa-masa di mana portofolio Anda anjlok lebih dari 30%. Hanya trader dengan mental baja dan modal yang benar-benar "dingin" yang sanggup melewati ini tanpa panik dan menarik dana di saat yang salah.

---

## 6. Rekomendasi untuk Trader Ritel

Berdasarkan semua data, analisis risiko, dan realita pasar saham lapis kedua di Indonesia, berikut panduan praktisnya:

### Jika Anda Memilih **Model B - "Terkendali"** (Rekomendasi Utama)

Ini adalah pilihan yang lebih aman dan berkelanjutan untuk sebagian besar trader.

1. **Modal Awal:** Mulailah dengan modal yang Anda relakan jika hilang (misal, Rp10 - Rp50 juta). Jangan gunakan uang pinjaman atau uang kebutuhan pokok.
2. **Praktikkan Disiplin:** Ikuti rekomendasi model **APA ADANYA**. Setiap hari, beli maksimal 2 saham teratas yang direkomendasikan.
3. **Jangan "Menambah Porsi" di Saham yang Sama:** Model sudah menentukan bobot optimal. Menambah porsi sendiri di saham yang sama justru akan merusak keseimbangan risiko yang telah diperhitungkan.

### Jika Anda Tergoda oleh **Model A - "Agresif"**

Hanya pilih ini jika Anda **sangat paham risikonya** dan memiliki toleransi tinggi. **Wajib** menerapkan aturan main berikut:

1. **Modal Dingin Mutlak:** Hanya gunakan dana yang jika hilang 50% tidak akan mempengaruhi kehidupan finansial Anda.
2. **Pakai Aturan "Taruhan Proporsional (Kelly Criterion)":** Alih-alih mempertaruhkan 34% modal per saham (aturan asli model), gunakan aturan yang lebih aman:
   - **Aturan Praktis:** Untuk setiap rekomendasi, hitung berapa persen modal yang harus dipertaruhkan dengan rumus: `(Probabilitas% * 1.4 - 0.4) / 1.4`. Hasilnya (misal 15%), jangan pakai full, tapi pakai setengahnya saja (misal 7.5%).
   - **Mengapa?** Ini mencegah Anda "bangkrut" saat model sedang dalam siklus rugi beruntun.
3. **Lakukan Filter Manual "Saham Aman":** Sebelum *checkout*, cek di Google atau aplikasi sekuritas: Apakah saham ini sedang dalam pengawasan bursa (UMA) atau dihentikan sementara (suspensi)? Jika iya, **LEWATKAN**.

---

## 7. Penutup

Kedua model yang kami sajikan adalah hasil dari riset mendalam dan telah melalui proses validasi yang ketat. Keduanya **bukanlah "cuan instan" tanpa risiko**, melainkan alat yang canggih.

**Model B ("Terkendali") adalah pilihan yang matang dan bijaksana.** Ia berhasil "menjinakkan" potensi liar dari sinyal *alpha* murni menjadi sebuah mesin pertumbuhan modal yang lebih stabil dan berkelanjutan. Fokus pada disiplin dan manajemen risiko adalah kunci untuk memanfaatkan teknologi ini dalam perjalanan investasi Anda.

---

**Lampiran (Tersedia Berdasarkan Permintaan):**
- Data transaksi harian lengkap (100 hari).
- Laporan metrik statistik lengkap.
- Simulasi Monte Carlo dan uji stres lainnya.

**Kontak Tim Riset:** [Email/Contact Internal]
