// =======================================================
// INTERAKSI UTAMA MODAL DETAIL LUKISAN
// =======================================================
function openModal(imgSrc, title, artist, size, paint, year, instagram, desc) {
    const modalImg = document.getElementById("modalImage");
    
    modalImg.style.visibility = "hidden"; 
    modalImg.src = imgSrc;
    
    modalImg.onload = function() {
        modalImg.style.visibility = "visible";
    };

    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalArtist").innerText = artist;
    document.getElementById("modalSize").innerText = size;
    document.getElementById("modalPaint").innerText = paint;
    document.getElementById("modalYear").innerText = year;
    document.getElementById("modalDesc").innerText = desc;
    
    const instaLink = document.getElementById("modalInstagram");
    const instaHandle = document.getElementById("modalIgHandle");
    
    if (instagram && instagram !== '#') {
        const cleanHandle = instagram.replace('@', '');
        instaLink.href = `https://instagram.com/${cleanHandle}`;
        instaHandle.innerText = `@${cleanHandle}`;
        instaLink.style.display = "inline-flex";
    } else {
        instaLink.style.display = "none";
    }
    
    document.getElementById("paintingModal").style.display = "flex";
    document.body.classList.add("modal-open");
}

function closeModal() {
    document.getElementById("paintingModal").style.display = "none";
    document.body.classList.remove("modal-open");
}

// Menutup modal secara global (Klik luar area atau tekan ESC)
window.onclick = function(event) {
    if (event.target === document.getElementById("paintingModal")) {
        closeModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});


// =======================================================
// RENDER ASINKRONUS DATABASE JSON (OPTIMAL PERFORMANCE)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("galleryContainer");
    const karyaContainer = document.getElementById("karyaContainer");
    const dokumentasiContainer = document.getElementById("dokumentasiContainer");

    const fetchPromises = [];

    // 1. MEMUAT DATA: KARYA KAMI (Menggunakan Fragment)
    if (karyaContainer) {
        const fetchKarya = fetch("karya.json")
            .then(response => response.json())
            .then(data => {
                const fragment = document.createDocumentFragment();
                data.forEach(item => {
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");
                    galleryItem.innerHTML = `
                        <div class="gallery-img-wrapper">
                            <img src="${item.imgSrc}" alt="${item.title}" loading="lazy">
                        </div>
                        <div class="painting-title">${item.title}</div>
                    `;
                    fragment.appendChild(galleryItem);
                });
                karyaContainer.appendChild(fragment);
            });
        fetchPromises.push(fetchKarya);
    }

    // 2. MEMUAT DATA: GALERI UTAMA (Menggunakan Fragment & Penyimpanan Data Object)
    if (galleryContainer) {
        const fetchGallery = fetch("galeri.json")
            .then(response => response.json())
            .then(data => {
                const fragment = document.createDocumentFragment();
                data.forEach(item => {
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");
                    
                    // Simpan data mentah ke dalam dataset elemen agar mudah ditarik saat di-klik
                    galleryItem.dataset.paintingInfo = JSON.stringify(item);

                    galleryItem.innerHTML = `
                        <div class="gallery-img-wrapper">
                            <img src="${item.imgSrc}" alt="${item.title}" loading="lazy">
                        </div>
                        <div class="painting-title">
                            ${item.title}
                            <span class="artist-name">${item.artist}</span>
                        </div>
                        <button class="btn-detail">Lihat Detail</button>
                    `;
                    fragment.appendChild(galleryItem);
                });
                galleryContainer.appendChild(fragment);
            });
        fetchPromises.push(fetchGallery);
    }

    // 3. MEMUAT DATA: DOKUMENTASI KEGIATAN
    if (dokumentasiContainer) {
        const fetchDokumentasi = fetch("dokumentasi.json")
            .then(response => response.json())
            .then(data => {
                const fragment = document.createDocumentFragment();
                data.forEach(item => {
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");

                    if (item.type === "video") {
                        galleryItem.innerHTML = `
                            <div class="gallery-img-wrapper">
                                <video controls preload="none" poster="${item.poster}">
                                    <source src="${item.src}" type="video/webm">
                                    Browser Anda tidak mendukung pemutar video.
                                </video>
                            </div>
                            <div class="painting-title">
                                <span class="artist-name">${item.title}</span>
                            </div>
                        `;
                    } else {
                        galleryItem.innerHTML = `
                            <div class="gallery-img-wrapper">
                                <img src="${item.src}" alt="${item.title}" loading="lazy">
                            </div>
                            <div class="painting-title">
                                <span class="artist-name">${item.title}</span>
                            </div>
                        `;
                    }
                    fragment.appendChild(galleryItem);
                });
                dokumentasiContainer.appendChild(fragment);
            });
        fetchPromises.push(fetchDokumentasi);
    }

    // AKTIFKAN EVENT DELEGATION SETELAH SEMUA ELEMENT BERHASIL DI-RENDER
    Promise.all(fetchPromises)
        .then(() => {
            initGalleryInteractions();
        })
        .catch(error => console.error("Gagal memuat sistem database:", error));
});


// =======================================================
// MANAGEMENT EVENT INTERAKSI (EVENT DELEGATION METHOD)
// =======================================================
function initGalleryInteractions() {
    const galleryContainer = document.getElementById("galleryContainer");
    if (!galleryContainer) return;

    galleryContainer.addEventListener("click", function(event) {
        const item = event.target.closest(".gallery-item");
        if (!item) return;

        // Ambil kembali data object murni yang kita simpan di dataset tadi
        const data = JSON.parse(item.dataset.paintingInfo);

        // Kasus 1: Jika yang diklik adalah tombol "Lihat Detail"
        if (event.target.classList.contains("btn-detail")) {
            openModal(data.imgSrc, data.title, data.artist, data.size, data.paintType, data.year, data.instagram, data.description);
            return;
        }

        // Kasus 2: Logika sentuhan layar HP (Mobile Tap Toggle)
        if (window.innerWidth <= 768) {
            const allItems = galleryContainer.querySelectorAll(".gallery-item");
            allItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove("active");
            });
            item.classList.toggle("active");
        }
    });

    // Menutup tombol melayang jika mengetuk area kosong di luar gambar pada HP
    document.addEventListener('click', function(event) {
        if (!event.target.closest('#galleryContainer') && window.innerWidth <= 768) {
            const allItems = galleryContainer.querySelectorAll(".gallery-item");
            allItems.forEach(item => item.classList.remove('active'));
        }
    });
}