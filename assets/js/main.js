/**
 * Main JavaScript file for portfolio website
 * Handles navigation, mobile menu, and common functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initLastUpdated();
    initAccessibility();
    initAWSCommunityBuilder();
});

/**
 * Navigation functionality
 * Handles mobile menu toggle and active states
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (!navToggle || !navMenu) return;
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        const isOpen = navMenu.classList.contains('nav__menu--open');
        
        if (isOpen) {
            closeNavMenu();
        } else {
            openNavMenu();
        }
    });
    
    // Close menu when clicking nav links (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeNavMenu();
            }
        });
    });
    
    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('nav__menu--open')) {
            closeNavMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeNavMenu();
        }
    });
    
    // Keyboard navigation for mobile menu
    navToggle.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            navToggle.click();
        }
    });
    
    // Set active navigation state based on current page
    setActiveNavigation();
}

/**
 * Open mobile navigation menu
 */
function openNavMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const hamburger = document.querySelector('.nav__hamburger');
    
    navMenu.classList.add('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
    
    // Animate hamburger to X
    if (hamburger) {
        hamburger.style.transform = 'rotate(45deg)';
        hamburger.style.backgroundColor = 'transparent';
    }
    
    // Focus first menu item for accessibility
    const firstLink = navMenu.querySelector('.nav__link');
    if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
    }
}

/**
 * Close mobile navigation menu
 */
function closeNavMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    const hamburger = document.querySelector('.nav__hamburger');
    
    navMenu.classList.remove('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Reset hamburger animation
    if (hamburger) {
        hamburger.style.transform = 'rotate(0deg)';
        hamburger.style.backgroundColor = 'var(--color-gray-700)';
    }
}

/**
 * Set active navigation state based on current page
 */
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
        
        const linkHref = link.getAttribute('href');
        
        // Handle different cases for active state
        if (
            (currentPage === 'index.html' && linkHref === 'index.html') ||
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === '/' && linkHref === 'index.html') ||
            linkHref === currentPage
        ) {
            link.classList.add('nav__link--active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * Update last updated date in footer
 */
function initLastUpdated() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const currentDate = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long'
        };
        lastUpdatedElement.textContent = currentDate.toLocaleDateString('en-US', options);
    }
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Add skip link functionality
    addSkipLink();
    
    // Handle focus management
    initFocusManagement();
    
    // Add keyboard navigation helpers
    initKeyboardNavigation();
}

/**
 * Add skip link for keyboard users
 */
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content if it doesn't exist
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

/**
 * Initialize focus management
 */
function initFocusManagement() {
    // Ensure focus is visible for keyboard users
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

/**
 * Initialize keyboard navigation helpers
 */
function initKeyboardNavigation() {
    // Handle escape key to close mobile menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const navMenu = document.querySelector('.nav__menu');
            if (navMenu && navMenu.classList.contains('nav__menu--open')) {
                closeNavMenu();
                document.querySelector('.nav__toggle').focus();
            }
        }
    });
}

/**
 * Utility function to debounce function calls
 * Useful for resize and scroll events
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility function for smooth scrolling to elements
 */
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Initialize intersection observer for animations
 * Can be used for fade-in effects on scroll
 */
function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements with animation class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

/**
 * AWS Community Builder functionality
 */
function initAWSCommunityBuilder() {
    initAWSBadgeAnimation();
    initAWSTimelineAnimation();
    initAWSAchievements();
    initAWSCertificationRoadmap();
}

/**
 * Initialize AWS badge animation
 */
function initAWSBadgeAnimation() {
    const awsBadge = document.querySelector('.hero__badge');
    if (!awsBadge) return;
    
    // Add hover effect
    awsBadge.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
        this.style.transform = 'scale(1.1)';
    });
    
    awsBadge.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
        this.style.transform = 'scale(1)';
    });
    
    // Add click tracking
    awsBadge.addEventListener('click', function() {
        trackAWSEvent('badge_clicked');
        
        // Scroll to AWS section
        const awsSection = document.querySelector('.aws-community-builder');
        if (awsSection) {
            awsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

/**
 * Initialize AWS timeline animation
 */
function initAWSTimelineAnimation() {
    const timelineMilestones = document.querySelectorAll('.aws-journey__milestone');
    if (timelineMilestones.length === 0) return;
    
    // Intersection observer for timeline animation
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                        entry.target.style.transition = 'all 0.6s ease-out';
                    }, index * 200);
                }
            });
        }, observerOptions);
        
        timelineMilestones.forEach((milestone, index) => {
            milestone.style.opacity = '0';
            milestone.style.transform = 'translateX(-50px)';
            observer.observe(milestone);
        });
    }
}

/**
 * Initialize AWS achievements
 */
function initAWSAchievements() {
    const achievements = document.querySelectorAll('.aws-achievement');
    if (achievements.length === 0) return;
    
    achievements.forEach(achievement => {
        achievement.addEventListener('click', function() {
            const title = this.querySelector('.aws-achievement__title')?.textContent;
            trackAWSEvent('achievement_clicked', { achievement: title });
        });
    });
    
    // Staggered animation on scroll
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('aws-achievement--visible');
                    }, index * 150);
                }
            });
        }, { threshold: 0.2 });
        
        achievements.forEach(achievement => {
            observer.observe(achievement);
        });
    }
}

/**
 * Initialize AWS certification roadmap
 */
function initAWSCertificationRoadmap() {
    const roadmapButton = document.querySelector('a[href="certification-roadmap.html"]');
    if (!roadmapButton) return;
    
    roadmapButton.addEventListener('click', function(event) {
        trackAWSEvent('certification_roadmap_clicked');
        
        // Check if the page exists, if not show a modal or message
        if (!pageExists('certification-roadmap.html')) {
            event.preventDefault();
            showAWSRoadmapModal();
        }
    });
}

/**
 * Show AWS certification roadmap modal
 */
function showAWSRoadmapModal() {
    const modal = createModal({
        title: 'AWS Certification Roadmap',
        content: `
            <div class="aws-roadmap-modal">
                <h3>My AWS Learning Journey</h3>
                <div class="roadmap-steps">
                    <div class="roadmap-step">
                        <div class="step-icon">✅</div>
                        <div class="step-content">
                            <h4>AWS Cloud Practitioner</h4>
                            <p>Foundation level certification - Completed</p>
                        </div>
                    </div>
                    <div class="roadmap-step">
                        <div class="step-icon">🎯</div>
                        <div class="step-content">
                            <h4>AWS Solutions Architect Associate</h4>
                            <p>Currently preparing - Target: Q2 2025</p>
                        </div>
                    </div>
                    <div class="roadmap-step">
                        <div class="step-icon">📋</div>
                        <div class="step-content">
                            <h4>AWS DevOps Engineer Professional</h4>
                            <p>Planned for Q4 2025</p>
                        </div>
                    </div>
                </div>
                <p><strong>Want to learn together?</strong> Feel free to reach out and we can share resources and study tips!</p>
            </div>
        `,
        className: 'aws-roadmap-modal'
    });
    
    trackAWSEvent('roadmap_modal_shown');
}

/**
 * Create a modal dialog
 */
function createModal({ title, content, className = '' }) {
    const modal = document.createElement('div');
    modal.className = `modal ${className}`;
    modal.innerHTML = `
        <div class="modal__backdrop"></div>
        <div class="modal__content">
            <div class="modal__header">
                <h2 class="modal__title">${title}</h2>
                <button class="modal__close" aria-label="Close modal">&times;</button>
            </div>
            <div class="modal__body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal__close');
    const backdrop = modal.querySelector('.modal__backdrop');
    
    function closeModal() {
        modal.remove();
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Escape key to close
    document.addEventListener('keydown', function escapeHandler(event) {
        if (event.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Focus management
    setTimeout(() => {
        closeBtn.focus();
    }, 100);
    
    return modal;
}

/**
 * Check if a page exists
 */
function pageExists(url) {
    // Simple check - in a real implementation, you might want to do an actual HTTP request
    return false; // Assuming certification roadmap page doesn't exist yet
}

/**
 * Track AWS-related events
 */
function trackAWSEvent(eventName, data = {}) {
    // Integration with analytics services
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'aws_community_builder': true,
            ...data
        });
    }
    
    console.log(`AWS CB event: ${eventName}`, data);
}

/**
 * Initialize AWS badge counter animation
 */
function initAWSBadgeCounter() {
    const badge = document.querySelector('.hero__badge');
    if (!badge) return;
    
    let clickCount = 0;
    badge.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 5) {
            // Easter egg after 5 clicks
            showAWSEasterEgg();
        }
    });
}

/**
 * Show AWS easter egg
 */
function showAWSEasterEgg() {
    const easterEgg = document.createElement('div');
    easterEgg.className = 'aws-easter-egg';
    easterEgg.innerHTML = `
        <div class="easter-egg-content">
            <h3>🎉 AWS Enthusiast Detected!</h3>
            <p>Thanks for exploring! Here's a fun fact:</p>
            <blockquote>
                "AWS has over 200 fully featured services, and new ones are added regularly. 
                The AWS Community Builder program recognizes technical experts who are passionate 
                about sharing knowledge and building the AWS community."
            </blockquote>
            <button class="easter-egg-close">Close</button>
        </div>
    `;
    
    easterEgg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
    `;
    
    const content = easterEgg.querySelector('.easter-egg-content');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(easterEgg);
    
    easterEgg.querySelector('.easter-egg-close').addEventListener('click', () => {
        easterEgg.remove();
    });
    
    trackAWSEvent('easter_egg_shown');
    
    setTimeout(() => {
        if (easterEgg.parentNode) {
            easterEgg.remove();
        }
    }, 10000);
}

// Export functions for use in other modules
window.PortfolioApp = {
    openNavMenu,
    closeNavMenu,
    setActiveNavigation,
    smoothScrollTo,
    debounce,
    initAWSCommunityBuilder,
    trackAWSEvent
};

/**
 * Footer component functionality
 */

/**
 * Initialize footer functionality
 */
function initFooter() {
    initBackToTopButton();
    initNewsletterForm();
    initFooterAnimations();
    initFooterAnalytics();
}

/**
 * Initialize back to top button
 */
function initBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTopButton() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const showThreshold = 300; // Show after scrolling 300px
        
        if (scrollTop > showThreshold) {
            backToTopButton.classList.add('footer__back-to-top--visible');
        } else {
            backToTopButton.classList.remove('footer__back-to-top--visible');
        }
    }
    
    // Throttled scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(toggleBackToTopButton, 10);
    });
    
    // Click handler for smooth scroll to top
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Track usage
        trackFooterEvent('back_to_top_clicked');
        
        // Focus management for accessibility
        setTimeout(() => {
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.focus();
            } else {
                document.body.focus();
            }
        }, 500);
    });
    
    // Keyboard support
    backToTopButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            backToTopButton.click();
        }
    });
    
    // Initial check
    toggleBackToTopButton();
}

/**
 * Initialize newsletter form
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;
    
    const emailInput = newsletterForm.querySelector('.footer__newsletter-input');
    const submitButton = newsletterForm.querySelector('.footer__newsletter-btn');
    
    // Form submission handler
    newsletterForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Basic email validation
        if (!isValidEmail(email)) {
            showNewsletterMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Set loading state
        setNewsletterLoading(true);
        
        try {
            // Simulate newsletter subscription (replace with actual service)
            await simulateNewsletterSubscription(email);
            
            showNewsletterMessage('Thank you for subscribing!', 'success');
            emailInput.value = '';
            trackFooterEvent('newsletter_subscribed', { email: email });
            
        } catch (error) {
            showNewsletterMessage('Something went wrong. Please try again.', 'error');
            trackFooterEvent('newsletter_error', { error: error.message });
        } finally {
            setNewsletterLoading(false);
        }
    });
    
    // Real-time email validation
    emailInput.addEventListener('input', function() {
        const email = emailInput.value.trim();
        if (email && !isValidEmail(email)) {
            emailInput.classList.add('footer__newsletter-input--error');
        } else {
            emailInput.classList.remove('footer__newsletter-input--error');
        }
    });
}

/**
 * Validate email address
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Simulate newsletter subscription
 */
function simulateNewsletterSubscription(email) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 1500);
    });
}

/**
 * Set newsletter loading state
 */
function setNewsletterLoading(isLoading) {
    const submitButton = document.querySelector('.footer__newsletter-btn');
    const emailInput = document.querySelector('.footer__newsletter-input');
    
    if (isLoading) {
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;
        emailInput.disabled = true;
    } else {
        submitButton.textContent = 'Subscribe';
        submitButton.disabled = false;
        emailInput.disabled = false;
    }
}

/**
 * Show newsletter message
 */
function showNewsletterMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.footer__newsletter-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `footer__newsletter-message footer__newsletter-message--${type}`;
    messageElement.textContent = message;
    
    const newsletterForm = document.getElementById('newsletter-form');
    newsletterForm.appendChild(messageElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

/**
 * Initialize footer animations
 */
function initFooterAnimations() {
    // Intersection observer for footer sections
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('footer__section--visible');
                }
            });
        }, observerOptions);
        
        // Observe footer sections
        document.querySelectorAll('.footer__section').forEach(section => {
            observer.observe(section);
        });
    }
}

/**
 * Initialize footer analytics
 */
function initFooterAnalytics() {
    // Track footer link clicks
    const footerLinks = document.querySelectorAll('.footer__nav-link, .footer__link, .footer__social-link');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function() {
            const linkText = link.textContent.trim();
            const linkType = link.classList.contains('footer__social-link') ? 'social' : 'navigation';
            
            trackFooterEvent('footer_link_clicked', {
                link_text: linkText,
                link_type: linkType,
                link_url: link.href
            });
        });
    });
    
    // Track footer visibility
    if ('IntersectionObserver' in window) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackFooterEvent('footer_viewed');
                    footerObserver.unobserve(entry.target); // Only track once
                }
            });
        }, { threshold: 0.5 });
        
        const footer = document.querySelector('.footer');
        if (footer) {
            footerObserver.observe(footer);
        }
    }
}

/**
 * Track footer events
 */
function trackFooterEvent(eventName, data = {}) {
    // Integration with analytics services
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'footer_interaction': true,
            ...data
        });
    }
    
    console.log(`Footer event: ${eventName}`, data);
}

/**
 * Initialize enhanced footer functionality
 */
function initEnhancedFooter() {
    initFooter();
    
    // Add footer keyboard shortcuts
    addFooterKeyboardShortcuts();
    
    // Initialize footer health check
    initFooterHealthCheck();
    
    // Add footer accessibility enhancements
    enhanceFooterAccessibility();
}

/**
 * Add footer keyboard shortcuts
 */
function addFooterKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Only activate when not in form fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Ctrl/Cmd + Home to scroll to top
        if ((event.ctrlKey || event.metaKey) && event.key === 'Home') {
            event.preventDefault();
            const backToTopButton = document.getElementById('back-to-top');
            if (backToTopButton) {
                backToTopButton.click();
            }
        }
        
        // Ctrl/Cmd + End to scroll to footer
        if ((event.ctrlKey || event.metaKey) && event.key === 'End') {
            event.preventDefault();
            const footer = document.querySelector('.footer');
            if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
                trackFooterEvent('keyboard_scroll_to_footer');
            }
        }
    });
}

/**
 * Initialize footer health check
 */
function initFooterHealthCheck() {
    const socialLinks = document.querySelectorAll('.footer__social-link');
    let placeholderCount = 0;
    
    socialLinks.forEach(link => {
        if (link.href.includes('example.com') || link.href === '#') {
            placeholderCount++;
            link.classList.add('footer__social-link--placeholder');
        }
    });
    
    if (placeholderCount > 0) {
        console.warn(`${placeholderCount} placeholder social links found in footer. Please update with actual URLs.`);
    }
}

/**
 * Enhance footer accessibility
 */
function enhanceFooterAccessibility() {
    // Add landmark role if not present
    const footer = document.querySelector('.footer');
    if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
    
    // Enhance newsletter form accessibility
    const newsletterInput = document.querySelector('.footer__newsletter-input');
    if (newsletterInput) {
        newsletterInput.setAttribute('autocomplete', 'email');
        newsletterInput.setAttribute('spellcheck', 'false');
    }
    
    // Add skip link to footer
    addFooterSkipLink();
}

/**
 * Add skip link to footer
 */
function addFooterSkipLink() {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    const skipToFooter = document.createElement('a');
    skipToFooter.href = '#footer';
    skipToFooter.textContent = 'Skip to footer';
    skipToFooter.className = 'skip-link skip-link--footer';
    skipToFooter.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipToFooter.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipToFooter.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipToFooter, footer);
    footer.id = 'footer';
}

// Initialize enhanced footer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initEnhancedFooter();
});

// Update exports
window.PortfolioApp = {
    ...window.PortfolioApp,
    initEnhancedFooter,
    trackFooterEvent
};