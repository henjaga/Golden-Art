// =======================================================
// MANAGEMENT MODAL DETAIL GALERI UTAMA
// =======================================================
function openModal(imgSrc, title, artist, size, paint, year, instagram, desc) {
    const modalImg = document.getElementById("modalImage");
    modalImg.style.visibility = "hidden"; 
    modalImg.src = imgSrc;
    modalImg.onload = function() { modalImg.style.visibility = "visible"; };

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


// =======================================================
// MANAGEMENT MODAL POPUP ORDER & LOGIKA SLIDER CAROUSEL
// =======================================================
let currentSlideIndex = 0;
let totalSlides = 0;

function openOrderModal(data) {
    document.getElementById("orderTitle").innerText = data.title;
    document.getElementById("orderDesc").innerText = data.description || "Hubungi kami langsung untuk detail pengerjaan layanan ini.";

    const slidesContainer = document.getElementById("carouselSlides");
    const dotsContainer = document.getElementById("carouselDots");
    
    slidesContainer.innerHTML = "";
    dotsContainer.innerHTML = "";

    // Fallback jika array penampung foto kosong, gunakan asset utama minimal 3 loop
    const images = data.images && data.images.length >= 3 ? data.images : [data.imgSrc, data.imgSrc, data.imgSrc];
    totalSlides = images.length;
    currentSlideIndex = 0;

    images.forEach((src, idx) => {
        // Render Gambar Slide
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${data.title} Sample ${idx + 1}`;
        img.classList.add("carousel-slide-img");
        slidesContainer.appendChild(img);

        // Render Indikator Titik (Dots)
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (idx === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    updateCarouselView();
    document.getElementById("orderModal").style.display = "flex";
    document.body.classList.add("modal-open");
}

function closeOrderModal() {
    document.getElementById("orderModal").style.display = "none";
    document.body.classList.remove("modal-open");
}

function goToSlide(index) {
    currentSlideIndex = index;
    updateCarouselView();
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateCarouselView();
}

function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    updateCarouselView();
}

function updateCarouselView() {
    const slidesContainer = document.getElementById("carouselSlides");
    if(slidesContainer) {
        slidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    const dots = document.querySelectorAll("#carouselDots .dot");
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentSlideIndex);
    });
}


// Global Window Close Listeners (Klik Luar & ESC)
window.onclick = function(event) {
    if (event.target === document.getElementById("paintingModal")) closeModal();
    if (event.target === document.getElementById("orderModal")) closeOrderModal();
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
        closeOrderModal();
    }
});


// =======================================================
// PROSES RENDER ASINKRONUS DATA JSON
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("galleryContainer");
    const karyaContainer = document.getElementById("karyaContainer");
    const dokumentasiContainer = document.getElementById("dokumentasiContainer");

    const fetchPromises = [];

    // 1. MEMUAT DATA: KARYA KAMI (Ditambahkan Tombol Order Sekarang)
    if (karyaContainer) {
        const fetchKarya = fetch("karya.json")
            .then(response => response.json())
            .then(data => {
                const fragment = document.createDocumentFragment();
                data.forEach(item => {
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");
                    galleryItem.dataset.orderInfo = JSON.stringify(item);

                    galleryItem.innerHTML = `
                        <div class="gallery-img-wrapper">
                            <img src="${item.imgSrc}" alt="${item.title}" loading="lazy">
                        </div>
                        <div class="painting-title">${item.title}</div>
                        <button class="btn-detail btn-order">Order Sekarang</button>
                    `;
                    fragment.appendChild(galleryItem);
                });
                karyaContainer.appendChild(fragment);
            });
        fetchPromises.push(fetchKarya);
    }

    // 2. MEMUAT DATA: GALERI UTAMA
    if (galleryContainer) {
        const fetchGallery = fetch("galeri.json")
            .then(response => response.json())
            .then(data => {
                const fragment = document.createDocumentFragment();
                data.forEach(item => {
                    const galleryItem = document.createElement("div");
                    galleryItem.classList.add("gallery-item");
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

    // EVENT INTERACTION INITIALIZATION AFTER ALL FETCH DONE
    Promise.all(fetchPromises)
        .then(() => {
            initGalleryInteractions();
            
            // Pasang event listener statis untuk kontrol Carousel
            document.getElementById("nextArrow").addEventListener("click", nextSlide);
            document.getElementById("prevArrow").addEventListener("click", prevSlide);
            document.getElementById("closeOrderBtn").addEventListener("click", closeOrderModal);
        })
        .catch(error => console.error("Sistem gagal memuat repositori JSON:", error));
});


// =======================================================
// MANAGEMENT DELEGASI EVENT KLIK KARTU (OPTIMAL)
// =======================================================
function initGalleryInteractions() {
    // A. Interaksi Section Galeri Utama
    const galleryContainer = document.getElementById("galleryContainer");
    if (galleryContainer) {
        galleryContainer.addEventListener("click", function(event) {
            const item = event.target.closest(".gallery-item");
            if (!item) return;

            const data = JSON.parse(item.dataset.paintingInfo);
            if (event.target.classList.contains("btn-detail")) {
                openModal(data.imgSrc, data.title, data.artist, data.size, data.paintType, data.year, data.instagram, data.description);
                return;
            }
            handleMobileTap(item, galleryContainer);
        });
    }

    // B. Interaksi Section Karya Kami (Fitur Baru)
    const karyaContainer = document.getElementById("karyaContainer");
    if (karyaContainer) {
        karyaContainer.addEventListener("click", function(event) {
            const item = event.target.closest(".gallery-item");
            if (!item) return;

            const data = JSON.parse(item.dataset.orderInfo);
            if (event.target.classList.contains("btn-order")) {
                openOrderModal(data);
                return;
            }
            handleMobileTap(item, karyaContainer);
        });
    }
}

// Pembantu toggle efek hover kartu pada perangkat sentuh mobile
function handleMobileTap(item, container) {
    if (window.innerWidth <= 768) {
        const allItems = container.querySelectorAll(".gallery-item");
        allItems.forEach(otherItem => {
            if (otherItem !== item) otherItem.classList.remove("active");
        });
        item.classList.toggle("active");
    }
}