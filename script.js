// =======================================================
// MANAGEMENT MODAL DETAIL GALERI UTAMA
// =======================================================
function openModal(imgSrc, title, artist, size, paint, year, instagram, desc) {
    const modalImg = document.getElementById("modalImage");
    modalImg.style.visibility = "hidden";
    modalImg.src = imgSrc;
    modalImg.onload = function () { modalImg.style.visibility = "visible"; };

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

    const images = data.images && data.images.length > 0 ? data.images : [data.imgSrc];
    totalSlides = images.length;
    currentSlideIndex = 0;

    images.forEach((src, idx) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${data.title} Sample ${idx + 1}`;
        img.classList.add("carousel-slide-img");
        slidesContainer.appendChild(img);

        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (idx === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });

    updateCarouselView();

    // --- FITUR BARU: GENERATE PESAN WHATSAPP OTOMATIS ---
    const waBtn = document.getElementById("waOrderBtn");
    if (waBtn) {
        // Menyusun kalimat default. Tanda bintang (*) digunakan agar teks tebal (bold) di WhatsApp.
        const defaultMessage = `Halo Golden Lee, saya tertarik untuk berkonsultasi dan memesan jasa layanan seni: *${data.title}*. Boleh minta informasi lebih lanjut mengenai detail harga dan proses pengerjaannya?`;

        // encodeURIComponent digunakan agar spasi dan karakter khusus aman dikirim lewat URL
        waBtn.href = `https://wa.me/6289524068996?text=${encodeURIComponent(defaultMessage)}`;
    }

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
    if (slidesContainer) {
        slidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    const dots = document.querySelectorAll("#carouselDots .dot");
    dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === currentSlideIndex);
    });
}

// =======================================================
// GLOBAL EVENT LISTENERS (Menutup Modal)
// =======================================================
window.addEventListener('click', function (event) {
    if (event.target === document.getElementById("paintingModal")) closeModal();
    if (event.target === document.getElementById("orderModal")) closeOrderModal();
});

document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        closeModal();
        closeOrderModal();
    }
});

// Tutup melalui tombol 'X'
document.getElementById("closeGalleryBtn")?.addEventListener("click", closeModal);
document.getElementById("closeOrderBtn")?.addEventListener("click", closeOrderModal);

// Kontrol Carousel
document.getElementById("nextArrow")?.addEventListener("click", nextSlide);
document.getElementById("prevArrow")?.addEventListener("click", prevSlide);

// =======================================================
// PROSES RENDER ASINKRONUS DATA JSON (Promise.allSettled)
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("galleryContainer");
    const karyaContainer = document.getElementById("karyaContainer");
    const dokumentasiContainer = document.getElementById("dokumentasiContainer");

    const fetchPromises = [];

    // 1. KARYA KAMI
    if (karyaContainer) {
        const fetchKarya = fetch("karya.json")
            .then(res => res.json())
            .then(data => {
                const fragment = document.createDocumentFragment();
                data.forEach(item => {
                    const el = document.createElement("div");
                    el.classList.add("gallery-item");
                    el.dataset.orderInfo = JSON.stringify(item);
                    el.innerHTML = `
                        <div class="gallery-img-wrapper">
                            <img src="${item.imgSrc}" alt="${item.title}" loading="lazy">
                        </div>
                        <div class="painting-title">${item.title}</div>
                        <button class="btn-detail btn-order">Order Sekarang</button>
                    `;
                    fragment.appendChild(el);
                });
                karyaContainer.appendChild(fragment);
            });
        fetchPromises.push(fetchKarya);
    }

    // 2. GALERI UTAMA
    if (galleryContainer) {
        const fetchGallery = fetch("galeri.json")
            .then(res => res.json())
            .then(data => {
                const fragment = document.createDocumentFragment();
                data.forEach(item => {
                    const el = document.createElement("div");
                    el.classList.add("gallery-item");
                    el.dataset.paintingInfo = JSON.stringify(item);
                    el.innerHTML = `
                        <div class="gallery-img-wrapper">
                            <img src="${item.imgSrc}" alt="${item.title}" loading="lazy">
                        </div>
                        <div class="painting-title">
                            ${item.title}
                            <span class="artist-name">${item.artist}</span>
                        </div>
                        <button class="btn-detail">Lihat Detail</button>
                    `;
                    fragment.appendChild(el);
                });
                galleryContainer.appendChild(fragment);
            });
        fetchPromises.push(fetchGallery);
    }

    // 3. DOKUMENTASI KEGIATAN
    if (dokumentasiContainer) {
        const fetchDokumentasi = fetch("dokumentasi.json")
            .then(res => res.json())
            .then(data => {
                const fragment = document.createDocumentFragment();
                data.forEach(item => {
                    const el = document.createElement("div");
                    el.classList.add("gallery-item");
                    if (item.type === "video") {
                        el.innerHTML = `
                            <div class="gallery-img-wrapper">
                                <video controls preload="none" poster="${item.poster}">
                                    <source src="${item.src}" type="video/webm">
                                </video>
                            </div>
                            <div class="painting-title"><span class="artist-name">${item.title}</span></div>
                        `;
                    } else {
                        el.innerHTML = `
                            <div class="gallery-img-wrapper">
                                <img src="${item.src}" alt="${item.title}" loading="lazy">
                            </div>
                            <div class="painting-title"><span class="artist-name">${item.title}</span></div>
                        `;
                    }
                    fragment.appendChild(el);
                });
                dokumentasiContainer.appendChild(fragment);
            });
        fetchPromises.push(fetchDokumentasi);
    }

    // Gunakan allSettled agar jika satu JSON gagal, yang lain tetap jalan
    Promise.allSettled(fetchPromises).then(() => {
        initGalleryInteractions();
    });
});

// =======================================================
// MANAGEMENT DELEGASI EVENT KLIK KARTU
// =======================================================
function initGalleryInteractions() {
    const galleryContainer = document.getElementById("galleryContainer");
    if (galleryContainer) {
        galleryContainer.addEventListener("click", function (event) {
            const item = event.target.closest(".gallery-item");
            if (!item) return;

            if (event.target.classList.contains("btn-detail")) {
                const data = JSON.parse(item.dataset.paintingInfo);
                openModal(data.imgSrc, data.title, data.artist, data.size, data.paintType, data.year, data.instagram, data.description);
                return;
            }
            handleMobileTap(item, galleryContainer);
        });
    }

    const karyaContainer = document.getElementById("karyaContainer");
    if (karyaContainer) {
        karyaContainer.addEventListener("click", function (event) {
            const item = event.target.closest(".gallery-item");
            if (!item) return;

            if (event.target.classList.contains("btn-order")) {
                const data = JSON.parse(item.dataset.orderInfo);
                openOrderModal(data);
                return;
            }
            handleMobileTap(item, karyaContainer);
        });
    }
}

function handleMobileTap(item, container) {
    if (window.innerWidth <= 768) {
        const allItems = container.querySelectorAll(".gallery-item");
        allItems.forEach(otherItem => {
            if (otherItem !== item) otherItem.classList.remove("active");
        });
        item.classList.toggle("active");
    }
}

// Menutup hover kartu saat klik di luar
window.addEventListener('click', function (event) {
    if (!event.target.closest('.gallery-grid') && window.innerWidth <= 768) {
        document.querySelectorAll(".gallery-item.active").forEach(item => {
            item.classList.remove('active');
        });
    }
});

