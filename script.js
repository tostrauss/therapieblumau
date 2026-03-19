// Font Resizing Logic
let currentZoom = 1;
const root = document.documentElement;

function adjustFontSize(direction) {
    if (direction === 0) {
        currentZoom = 1;
    } else {
        currentZoom += direction * 0.1;
        // Limit zoom levels
        currentZoom = Math.max(0.9, Math.min(1.5, currentZoom));
    }
    root.style.setProperty('--font-scale', currentZoom);
}

// High Contrast Toggle
function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    const btn = document.getElementById('contrastBtn');
    if (document.body.classList.contains('high-contrast')) {
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = '⚫ Normal';
    } else {
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = '👁 Kontrast';
    }
}

// Mobile Menu Toggle
const menuBtn = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.main-nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    const isExpanded = nav.classList.contains('active');
    menuBtn.setAttribute('aria-expanded', isExpanded);
});

// Close mobile menu when clicking a link
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
    });
});