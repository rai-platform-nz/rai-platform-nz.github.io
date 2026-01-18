
// Event Delegation for Mobile Navigation and Lightbox
// Avoids querying elements on load to prevent forced reflows

document.addEventListener('click', (e) => {
    // 1. Mobile Navigation Toggle
    const toggle = e.target.closest('.nav-toggle');
    if (toggle) {
        const navMenu = document.querySelector('nav ul'); // Query only when interaction happens
        if (navMenu) {
            navMenu.classList.toggle('active');
            toggle.classList.toggle('active');
        }
        return;
    }

    // 2. Lightbox Trigger
    const trigger = e.target.closest('.lightbox-trigger');
    if (trigger) {
        e.preventDefault();
        const lightboxModal = document.getElementById('lightbox-modal');
        const lightboxImg = document.getElementById('lightbox-image');
        if (lightboxModal && lightboxImg) {
            lightboxImg.src = trigger.getAttribute('href');
            lightboxModal.classList.add('active');
        }
        return;
    }

    // 3. Lightbox Close Button
    const closeBtn = e.target.closest('.lightbox-close');
    if (closeBtn) {
        const lightboxModal = document.getElementById('lightbox-modal');
        if (lightboxModal) lightboxModal.classList.remove('active');
        return;
    }

    // 4. Lightbox Background Click
    const modal = e.target.closest('.lightbox-modal');
    // If we clicked the modal container itself (the background), and not an inner element (unless it bubbles up?)
    // Actually, e.target should be the modal div if we clicked the background.
    if (e.target.classList && e.target.classList.contains('lightbox-modal')) {
        e.target.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lightboxModal = document.getElementById('lightbox-modal');
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            lightboxModal.classList.remove('active');
        }
    }
});
