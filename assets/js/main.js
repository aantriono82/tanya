// Tanya Jawab Islam — interaksi sisi klien
(function () {
  "use strict";

  // --- Salin tautan ---
  document.querySelectorAll("[data-salin]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var url = btn.getAttribute("data-salin");
      var pesan = document.querySelector("[data-pesan-aksi]");
      function kabari(teks) { if (pesan) pesan.textContent = teks; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          kabari("Tautan sudah disalin. Silakan dibagikan.");
        }, function () { kabari("Gagal menyalin otomatis — salin alamat di bilah alamat peramban Anda."); });
      } else {
        kabari("Salin alamat di bilah alamat peramban Anda untuk membagikan.");
      }
    });
  });

  // --- Tombol "Jawaban ini membantu" ---
  // Mengirim sinyal evaluasi ke layanan formulir yang sama; angka tidak ditampilkan ke publik.
  var KUNCI_FORM = window.__KUNCI_FORM__ || "";
  document.querySelectorAll("[data-membantu]").forEach(function (btn) {
    var judul = btn.getAttribute("data-membantu");
    var sudah = false;
    try { sudah = localStorage.getItem("membantu:" + judul) === "1"; } catch (e) {}
    if (sudah) { btn.disabled = true; btn.textContent = "Terima kasih atas tanggapan Anda"; return; }
    btn.addEventListener("click", function () {
      var pesan = document.querySelector("[data-pesan-aksi]");
      btn.disabled = true;
      try { localStorage.setItem("membantu:" + judul, "1"); } catch (e) {}
      if (KUNCI_FORM) {
        var data = new FormData();
        data.append("access_key", KUNCI_FORM);
        data.append("subject", "Tanggapan 'membantu' — Tanya Jawab Islam");
        data.append("judul_jawaban", judul);
        data.append("dari_halaman", window.location.href);
        fetch("https://api.web3forms.com/submit", { method: "POST", body: data }).catch(function () {});
      }
      if (pesan) pesan.textContent = "Terima kasih — tanggapan Anda tercatat sebagai bahan evaluasi redaksi.";
      btn.textContent = "Terima kasih atas tanggapan Anda";
    });
  });

  // --- Formulir (bertanya & koreksi) via Web3Forms ---
  document.querySelectorAll("[data-formulir]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var status = form.querySelector("[data-status-kirim]");
      if (!KUNCI_FORM) {
        if (status) status.textContent = "Formulir belum aktif — kunci akses layanan formulir belum dipasang.";
        return;
      }
      var data = new FormData(form);
      data.append("access_key", KUNCI_FORM);
      data.append("subject", form.getAttribute("data-subjek") || "Kiriman formulir — Tanya Jawab Islam");
      data.append("from_name", "Situs Tanya Jawab Islam");
      var tombol = form.querySelector("button[type=submit]");
      if (tombol) tombol.disabled = true;
      if (status) status.textContent = "Mengirim…";
      fetch("https://api.web3forms.com/submit", { method: "POST", body: data })
        .then(function (r) { return r.json(); })
        .then(function (hasil) {
          if (hasil && hasil.success) {
            form.reset();
            if (status) status.textContent = "Terkirim. Terima kasih — kiriman Anda sudah masuk ke redaksi dan akan diseleksi terlebih dahulu.";
          } else {
            if (status) status.textContent = "Pengiriman gagal di sisi layanan. Silakan coba lagi beberapa saat lagi.";
          }
        })
        .catch(function () {
          if (status) status.textContent = "Pengiriman gagal — periksa koneksi internet Anda lalu coba lagi.";
        })
        .finally(function () { if (tombol) tombol.disabled = false; });
    });
  });

  // --- Halaman koreksi: isi otomatis dari parameter tautan ---
  var param = new URLSearchParams(window.location.search);
  var kj = document.getElementById("k-judul");
  var kt = document.getElementById("k-tautan");
  if (kj && param.get("judul")) kj.value = param.get("judul");
  if (kt && param.get("tautan")) kt.value = param.get("tautan");

  // --- Pencarian statis ---
  // Penyeragam ejaan: pembaca menulis istilah yang sama dengan banyak cara
  // (salat/sholat/shalat, wudu/wudhu, Ramadan/Ramadhan, …). Teks indeks dan kata
  // kunci sama-sama diubah ke satu bentuk baku sebelum dicocokkan.
  var EJAAN = {
    salat: "shalat", sholat: "shalat", solat: "shalat",
    wudu: "wudhu", wudlu: "wudhu",
    ramadhan: "ramadan", romadhon: "ramadan", ramadlan: "ramadan",
    alquran: "quran", quraan: "quran", kuran: "quran",
    hadits: "hadis", hadist: "hadis", hadith: "hadis",
    fitri: "fitrah",
    dzikir: "zikir", dhikr: "zikir",
    shubuh: "subuh",
    dzuhur: "zuhur", dhuhur: "zuhur", duhur: "zuhur", lohor: "zuhur",
    ashar: "asar", magrib: "maghrib", isyak: "isya",
    taraweh: "tarawih",
    shaum: "puasa", saum: "puasa", shiyam: "puasa",
    shadaqah: "sedekah", sadaqah: "sedekah", sodaqoh: "sedekah",
    tobat: "taubat",
    kadha: "qadha", qodho: "qadha",
    fidiah: "fidyah",
    akikah: "aqiqah", aqiqoh: "aqiqah", akika: "aqiqah",
    jenasah: "jenazah", janazah: "jenazah",
    tayammum: "tayamum", tadabur: "tadabbur", tadaburi: "tadabburi",
    syawwal: "syawal",
    gibah: "ghibah", ghibbah: "ghibah",
    mahrom: "mahram",
    nafaqah: "nafkah",
    akhlaq: "akhlak", aqidah: "akidah"
  };
  function seragamkan(teks) {
    return (teks || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")   // buang tanda diakritik (ā, ḥ, …)
      .replace(/['’ʼ‘`]/g, "")                            // qur'an → quran, do'a → doa
      .replace(/\bal[\s-]+quran\b/g, "quran")              // al-quran / al quran → quran
      .split(/[^a-z0-9؀-ۿ]+/)
      .filter(Boolean)
      .map(function (k) { return EJAAN.hasOwnProperty(k) ? EJAAN[k] : k; })
      .join(" ");
  }

  var formCari = document.getElementById("form-cari");
  if (formCari) {
    var input = document.getElementById("kata-kunci");
    var wadah = document.getElementById("hasil-cari");
    var ringkasan = document.getElementById("ringkasan-cari");
    var janjiIndeks = null;   // indeks diunduh dan disiapkan sekali saja
    var jeda = null;

    function muatIndeks() {
      if (!janjiIndeks) {
        janjiIndeks = fetch("/index.json")
          .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
          .then(function (d) {
            return d.map(function (item) {
              item._judul = seragamkan(item.judul);
              item._tags = seragamkan((item.tags || []).join(" "));
              item._ringkasan = seragamkan(item.ringkasan);
              item._kategori = seragamkan(item.kategori);
              item._isi = seragamkan(item.isi);
              return item;
            });
          })
          .catch(function (e) { janjiIndeks = null; throw e; });  // izinkan coba lagi
      }
      return janjiIndeks;
    }
    function tampilkan(daftar, kata) {
      wadah.innerHTML = "";
      ringkasan.textContent = daftar.length
        ? "Ditemukan " + daftar.length + " tanya jawab untuk “" + kata + "”."
        : "Tidak ada tanya jawab yang cocok untuk “" + kata + "”. Coba kata lain, atau ajukan langsung lewat halaman Bertanya.";
      daftar.forEach(function (item) {
        var el = document.createElement("article");
        el.className = "kartu";
        if (item.kategori) {
          var chip = document.createElement("span");
          chip.className = "kat-chip";
          chip.textContent = item.kategori;
          el.appendChild(chip);
        }
        var h3 = document.createElement("h3");
        var a = document.createElement("a");
        a.href = item.tautan;
        a.textContent = item.judul;
        h3.appendChild(a);
        var p = document.createElement("p");
        p.textContent = item.ringkasan || "";
        el.appendChild(h3);
        el.appendChild(p);
        wadah.appendChild(el);
      });
    }
    // Skor: kecocokan di judul paling berbobot, lalu tag, ringkasan, kategori, isi.
    function skor(item, kataKunci) {
      var total = 0;
      for (var i = 0; i < kataKunci.length; i++) {
        var k = kataKunci[i], s = 0;
        if (item._judul.indexOf(k) >= 0) s += 10;
        if (item._tags.indexOf(k) >= 0) s += 6;
        if (item._ringkasan.indexOf(k) >= 0) s += 3;
        if (item._kategori.indexOf(k) >= 0) s += 2;
        if (item._isi.indexOf(k) >= 0) s += 1;
        if (!s) return 0;   // setiap kata kunci wajib ditemukan
        total += s;
      }
      return total;
    }
    function cari(kata) {
      var asli = (kata || "").trim();
      var kataKunci = seragamkan(asli).split(" ").filter(Boolean);
      if (!kataKunci.length) { wadah.innerHTML = ""; ringkasan.textContent = ""; return; }
      muatIndeks().then(function (d) {
        if (input.value.trim() !== asli) return;   // abaikan hasil kedaluwarsa
        var hasil = d
          .map(function (item) { return { item: item, skor: skor(item, kataKunci) }; })
          .filter(function (h) { return h.skor > 0; })
          .sort(function (a, b) {
            return b.skor - a.skor || (b.item.tanggal > a.item.tanggal ? 1 : b.item.tanggal < a.item.tanggal ? -1 : 0);
          })
          .map(function (h) { return h.item; });
        tampilkan(hasil, asli);
        try { history.replaceState(null, "", "?q=" + encodeURIComponent(asli)); } catch (e) {}
      }).catch(function () {
        ringkasan.textContent = "Indeks pencarian gagal dimuat. Silakan muat ulang halaman ini.";
      });
    }
    formCari.addEventListener("submit", function (ev) {
      ev.preventDefault();
      clearTimeout(jeda);
      cari(input.value);
    });
    input.addEventListener("input", function () {
      clearTimeout(jeda);
      jeda = setTimeout(function () { cari(input.value); }, 200);
    });
    input.addEventListener("focus", function () { muatIndeks().catch(function () {}); }, { once: true });
    var awal = param.get("q");
    if (awal) { input.value = awal; cari(awal); }
  }
})();
