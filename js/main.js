// ========== MAGIC HAND PHYSIOTHERAPY CENTER - MAIN JS ==========

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initTestimonialCarousel();
    initFaqAccordion();
    initContactForm();
    initCookieConsent();
    initBackToTop();
    initLightbox();
    initSmoothScroll();
    initCountUp();
    initOpenClosedStatus();
    initGalleryFilters();
    initBodyMap();
});

// ========== STICKY NAVBAR ==========
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ========== MOBILE MENU ==========
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.getElementById('mobileOverlay');
    if (!hamburger || !navLinks) return;

    const toggle = () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggle);
    if (overlay) overlay.addEventListener('click', toggle);

    navLinks.querySelectorAll('a:not(.btn)').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) toggle();
        });
    });
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#' || id === '#main') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                const offset = document.querySelector('.navbar')?.offsetHeight || 72;
                window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
            }
        });
    });
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const els = document.querySelectorAll('.animate-on-scroll');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('animated'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
}

// ========== COUNT UP ANIMATION ==========
function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const suffix = el.dataset.suffix || '';
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target) + suffix;
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(c => observer.observe(c));
}

// ========== TESTIMONIAL CAROUSEL ==========
function initTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    if (!track || cards.length === 0) return;

    let current = 0;
    let autoPlayInterval;

    function goTo(index) {
        current = ((index % cards.length) + cards.length) % cards.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAutoPlay(); }));

    function startAutoPlay() { autoPlayInterval = setInterval(next, 6000); }
    function resetAutoPlay() { clearInterval(autoPlayInterval); startAutoPlay(); }
    startAutoPlay();
}

// ========== FAQ ACCORDION ==========
function initFaqAccordion() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));

            // Open clicked if it was closed
            if (!isActive) item.classList.add('active');
        });
    });
}

// ========== CONTACT FORM ==========
function initContactForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        // Clear previous errors
        form.querySelectorAll('.form-error').forEach(err => err.style.display = 'none');
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (field.type === 'checkbox' && !field.checked) {
                valid = false;
                showError(field, 'Ez a mező kötelező');
            } else if (!field.value.trim()) {
                valid = false;
                field.classList.add('error');
                showError(field, 'Ez a mező kötelező');
            }
        });

        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
            valid = false;
            emailField.classList.add('error');
            showError(emailField, 'Érvénytelen e-mail cím');
        }

        // Phone validation
        const phoneField = form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value && !/^[\+]?[\d\s\-\(\)]{7,}$/.test(phoneField.value)) {
            valid = false;
            phoneField.classList.add('error');
            showError(phoneField, 'Érvénytelen telefonszám');
        }

        if (valid) {
            form.style.display = 'none';
            const success = document.querySelector('.form-success');
            if (success) success.classList.add('show');
        }
    });

    function showError(field, message) {
        const group = field.closest('.form-group') || field.closest('.form-checkbox');
        if (!group) return;
        const errorMsg = group.querySelector('.form-error');
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.style.display = 'block';
        }
    }
}

// ========== COOKIE CONSENT ==========
function initCookieConsent() {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;
    if (localStorage.getItem('cookieConsent')) return;

    setTimeout(() => banner.classList.add('show'), 1500);

    banner.querySelector('.cookie-accept')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.remove('show');
    });

    banner.querySelector('.cookie-decline')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        banner.classList.remove('show');
    });
}

// ========== BACK TO TOP ==========
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== LIGHTBOX ==========
function initLightbox() {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let items = [];
    let currentIndex = 0;

    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        items.push(item.querySelector('img')?.src || '');
        item.addEventListener('click', () => {
            currentIndex = i;
            openLightbox(items[currentIndex]);
        });
    });

    function openLightbox(src) {
        img.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    if (prevBtn) prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        img.src = items[currentIndex];
    });

    if (nextBtn) nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % items.length;
        img.src = items[currentIndex];
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
}

// ========== OPEN/CLOSED STATUS ==========
function initOpenClosedStatus() {
    const statusEl = document.querySelector('.hours-status');
    if (!statusEl) return;

    const hours = {
        1: [8, 20],  // Monday
        2: [8, 20],  // Tuesday
        3: [8, 20],  // Wednesday
        4: [8, 20],  // Thursday
        5: [8, 18],  // Friday
        6: [9, 14],  // Saturday
        0: null      // Sunday - closed
    };

    function update() {
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const schedule = hours[day];
        const isOpen = schedule && hour >= schedule[0] && hour < schedule[1];

        statusEl.classList.toggle('open', isOpen);
        statusEl.classList.toggle('closed', !isOpen);
        statusEl.innerHTML = `<span class="hours-dot"></span> ${isOpen ? 'Jelenleg NYITVA' : 'Jelenleg ZÁRVA'}`;
    }

    update();
    setInterval(update, 60000);
}

// ========== GALLERY FILTERS ==========
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            items.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ========== BODY MAP ==========
function initBodyMap() {
    const buttons = document.querySelectorAll('.body-map-btn');
    const details = document.querySelectorAll('.condition-detail');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const region = btn.dataset.region;
            buttons.forEach(b => b.classList.toggle('active', b === btn));

            details.forEach(detail => {
                if (region === 'all' || detail.dataset.region === region) {
                    detail.style.display = '';
                } else {
                    detail.style.display = 'none';
                }
            });

            // Scroll to conditions
            const conditionsList = document.querySelector('.conditions-list');
            if (conditionsList) {
                const offset = document.querySelector('.navbar')?.offsetHeight || 72;
                window.scrollTo({ top: conditionsList.offsetTop - offset - 20, behavior: 'smooth' });
            }
        });
    });
}
