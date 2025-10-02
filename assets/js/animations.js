// Minimal Animation Controller
document.addEventListener('DOMContentLoaded', function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    // Add scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    });
    
    // Observe elements
    document.querySelectorAll('.hero__content, .about__highlight, .project-card').forEach(el => {
        observer.observe(el);
    });
    
    // Add hover effects
    document.querySelectorAll('.btn, .project-card').forEach(el => {
        el.classList.add('hover-lift');
    });
});