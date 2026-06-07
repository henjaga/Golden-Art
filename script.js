// Fungsi untuk membuka modal dan mengisi data secara dinamis (Revisi Parameter Lengkap)
function openModal(imgSrc, title, artist, size, paint, year, instagram, desc) {
    const modalImg = document.getElementById("modalImage");
    
    // Mencegah kilatan ikon broken image saat gambar memuat
    modalImg.style.visibility = "hidden"; 
    modalImg.src = imgSrc;
    
    // Memunculkan gambar dengan transisi halus setelah selesai di-load
    modalImg.onload = function() {
        modalImg.style.visibility = "visible";
    };

    // Mengisi data teks utama
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalArtist").innerText = artist;
    document.getElementById("modalSize").innerText = size;
    document.getElementById("modalPaint").innerText = paint;
    document.getElementById("modalYear").innerText = year;
    document.getElementById("modalDesc").innerText = desc;
    
    // Mengatur tautan dan teks Instagram secara dinamis
    const instaLink = document.getElementById("modalInstagram");
    const instaHandle = document.getElementById("modalIgHandle");
    
    if (instagram && instagram !== '#') {
        // Membersihkan karakter '@' jika tidak sengaja terinput ganda di parameter
        const cleanHandle = instagram.replace('@', '');
        instaLink.href = `https://instagram.com/${cleanHandle}`;
        instaHandle.innerText = `@${cleanHandle}`;
        instaLink.style.display = "inline-flex";
    } else {
        instaLink.style.display = "none"; // Sembunyikan jika tidak ada data IG
    }
    
    document.getElementById("paintingModal").style.display = "flex";
    
    // MENGUNCI SCROLL BACKGROUND UTAMA (UX Fix)
    document.body.classList.add("modal-open");
}

// Fungsi untuk menutup modal
function closeModal() {
    document.getElementById("paintingModal").style.display = "none";
    // MEMBUKA KEMBALI SCROLL BACKGROUND UTAMA
    document.body.classList.remove("modal-open");
}

// Menutup modal jika area background hitam di luar panel klik
window.onclick = function(event) {
    var modal = document.getElementById("paintingModal");
    if (event.target == modal) {
        closeModal();
    }
}

// UX Tambahan: Menutup modal dengan tombol ESC pada keyboard
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

// =======================================================
// LOGIKA TAP MOBILE (Memunculkan tombol detail saat di-tap)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function(event) {
            // Hanya berjalan di layar HP/Mobile
            if (window.innerWidth <= 768) {
                
                // Jika user menekan tombol detail, biarkan fungsi modal berjalan
                if (event.target.classList.contains('btn-detail')) {
                    return;
                }
                
                // Tutup/sembunyikan tombol dari gambar lain yang sedang aktif
                galleryItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle (buka/tutup) tombol pada gambar yang ditekan
                this.classList.toggle('active');
            }
        });
    });

    // UX Tambahan: Sembunyikan tombol kembali jika user mengetuk di luar area gambar
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.gallery-item') && window.innerWidth <= 768) {
            galleryItems.forEach(item => item.classList.remove('active'));
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("galleryContainer");

    // Pastikan kode fetch ini hanya berjalan jika galleryContainer ditemukan di halaman
    if (galleryContainer) {
        fetch("galeri.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    // Membuat elemen gallery item
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");

                    // Menyusun template HTML untuk setiap item galeri
                    galleryItem.innerHTML = `
                        <div class="gallery-img-wrapper">
                            <img src="${item.imgSrc}" alt="${item.title}">
                        </div>
                        <div class="painting-title">
                            ${item.title}
                            <span class="artist-name">${item.artist}</span>
                        </div>
                        <button class="btn-detail">Lihat Detail</button>
                    `;

                    // Menambahkan event listener klik untuk tombol detail (agar parameternya aman dari bug tanda kutip)
                    const btnDetail = galleryItem.querySelector(".btn-detail");
                    btnDetail.addEventListener("click", () => {
                        openModal(
                            item.imgSrc,
                            item.title,
                            item.artist,
                            item.size,
                            item.paintType,
                            item.year,
                            item.instagram,
                            item.description
                        );
                    });

                    // Memasukkan ke dalam grid container utama
                    galleryContainer.appendChild(galleryItem);
                });

                // Setelah data selesai di-render, panggil ulang logika Tap Mobile jika diperlukan
                initMobileTap(); 
            })
            .catch(error => console.error("Gagal memuat database galeri:", error));
    }
});

// Bungkus logika sentuhan HP lama Anda ke dalam fungsi agar bisa dijalankan setelah fetch selesai
function initMobileTap() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                if (event.target.classList.contains('btn-detail')) return;
                galleryItems.forEach(otherItem => {
                    if (otherItem !== item) otherItem.classList.remove('active');
                });
                this.classList.toggle('active');
            }
        });
    });
}