// Fungsi untuk membuka modal dan mengisi data secara dinamis
function openModal(imgSrc, title, artist, desc) {
    const modalImg = document.getElementById("modalImage");
    
    // Mencegah kilatan ikon broken image saat gambar memuat
    modalImg.style.visibility = "hidden"; 
    modalImg.src = imgSrc;
    
    // Memunculkan gambar dengan transisi halus setelah selesai di-load
    modalImg.onload = function() {
        modalImg.style.visibility = "visible";
    };

    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalArtist").innerText = artist;
    document.getElementById("modalDesc").innerText = desc;
    
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