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

window.onclick = function(event) {
    var modal = document.getElementById("paintingModal");
    if (event.target == modal) {
        closeModal();
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});


// =======================================================
// LOGIKA AMBIL DATA DARI DATABASE JSON (FETCH MULTIPLE)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("galleryContainer");
    const karyaContainer = document.getElementById("karyaContainer");
    const dokumentasiContainer = document.getElementById("dokumentasiContainer");

    // Array penampung semua request fetch data
    const fetchPromises = [];

    // 1. MEMUAT DATA: KARYA KAMI
    if (karyaContainer) {
        const fetchKarya = fetch("karya.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");
                    galleryItem.innerHTML = `
                        <div class="gallery-img-wrapper">
                            <img src="${item.imgSrc}" alt="${item.title}" loading="lazy">
                        </div>
                        <div class="painting-title">${item.title}</div>
                    `;
                    karyaContainer.appendChild(galleryItem);
                });
            });
        fetchPromises.push(fetchKarya);
    }

    // 2. MEMUAT DATA: GALERI UTAMA
    if (galleryContainer) {
        const fetchGallery = fetch("galeri.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");
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

                    const btnDetail = galleryItem.querySelector(".btn-detail");
                    btnDetail.addEventListener("click", () => {
                        openModal(
                            item.imgSrc, item.title, item.artist, item.size, 
                            item.paintType, item.year, item.instagram, item.description
                        );
                    });

                    galleryContainer.appendChild(galleryItem);
                });
            });
        fetchPromises.push(fetchGallery);
    }

    // 3. MEMUAT DATA: DOKUMENTASI KEGIATAN (FOTO & VIDEO)
    if (dokumentasiContainer) {
        const fetchDokumentasi = fetch("dokumentasi.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");

                    // Memisahkan render HTML berdasarkan tipe data (video / image)
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
                    dokumentasiContainer.appendChild(galleryItem);
                });
            });
        fetchPromises.push(fetchDokumentasi);
    }

    // PASTIKAN SEMUA DATA SELESAI DI-RENDER SEBELUM MENGAKTIFKAN LOGIKA HP
    Promise.all(fetchPromises)
        .then(() => {
            initMobileTap();
        })
        .catch(error => console.error("Gagal memuat database JSON:", error));
});


// =======================================================
// LOGIKA TAP MOBILE (Aktif setelah render JSON selesai)
// =======================================================
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

    // Sembunyikan kembali efek hover jika user mengetuk di luar area kartu
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.gallery-item') && window.innerWidth <= 768) {
            galleryItems.forEach(item => item.classList.remove('active'));
        }
    });
}