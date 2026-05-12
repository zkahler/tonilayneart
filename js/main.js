'use strict';

/* ── NAVBAR: scroll effect + scrollspy ── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}

function updateScrollSpy() {
    const sections = ['portfolio', 'about', 'shop', 'contact'];
    const scrollMid = window.scrollY + window.innerHeight / 3;

    let current = '';
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollMid) current = id;
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', href === current);
    });
}

window.addEventListener('scroll', () => {
    updateNavbar();
    updateScrollSpy();
}, { passive: true });

updateNavbar();


/* ── MOBILE NAV ── */
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    const open = navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksEl.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
        navLinksEl.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});


/* ── GALLERY FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
            const match = filter === 'all' || item.dataset.category === filter;
            item.classList.toggle('hidden', !match);
        });
    });
});


/* ── LIGHTBOX ── */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle   = document.getElementById('lightboxTitle');
const lightboxDetails = document.getElementById('lightboxDetails');

function openLightbox(item) {
    const img = item.querySelector('.gallery-img');
    lightboxImg.src = img.src;
    lightboxImg.alt = item.dataset.title || '';
    lightboxTitle.textContent   = item.dataset.title || '';
    lightboxDetails.textContent = [item.dataset.medium, item.dataset.size]
        .filter(Boolean).join('  ·  ');

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('lightboxContent').focus?.();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(item);
        }
    });
});

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);

lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});


/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));


/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', e => {
    e.preventDefault();

    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('loading');
    formNote.textContent = '';

    // Simulate async send (replace with real endpoint when ready)
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent';
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');
        formNote.textContent = 'Thank you — I\'ll be in touch soon.';
        contactForm.reset();

        setTimeout(() => {
            submitBtn.textContent = 'Send Message';
            submitBtn.classList.remove('success');
            formNote.textContent = '';
        }, 5000);
    }, 1200);
});


/* ── SHOP BUTTONS → CONTACT ── */
document.querySelectorAll('.btn-inquire').forEach(btn => {
    btn.addEventListener('click', () => {
        const contact = document.getElementById('contact');
        contact.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
            const select = document.getElementById('fsubject');
            const card   = btn.closest('.shop-card');
            const title  = card?.querySelector('h3')?.textContent || '';

            if (btn.textContent.trim() === 'Order') {
                select.value = 'print';
            } else {
                select.value = 'purchase';
            }

            const msgField = document.getElementById('fmessage');
            if (title && !msgField.value) {
                msgField.value = `I'm interested in "${title}". `;
                msgField.focus();
                const len = msgField.value.length;
                msgField.setSelectionRange(len, len);
            }
        }, 700);
    });
});
