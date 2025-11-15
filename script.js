// OPTIMIZED & SECURE JAVASCRIPT
// Performance, Security & Accessibility Enhanced
// ========================================

// Configuration
const CONFIG = {
    DEBUG: false, // Set to false in production
    TESTIMONIAL_AUTOPLAY_DELAY: 5000,
    TESTIMONIAL_RESUME_DELAY: 10000,
    FORM_SUBMIT_COOLDOWN: 5000
};

// DOM Cache - Query once, use many times
const DOM = {
    loadingScreen: null,
    progressFill: null,
    loadingStatus: null,
    navToggle: null,
    navMenu: null,
    navHeader: null,
    backToTop: null,
    contactForm: null,
    projectsGrid: null
};

// Form submission tracker for rate limiting
const formSubmitTracker = {
    lastSubmit: 0,
    minDelay: CONFIG.FORM_SUBMIT_COOLDOWN
};

// Utility Functions
const Utils = {
    log: (...args) => {
        if (CONFIG.DEBUG) console.log(...args);
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    sanitizeHTML: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    createElementSafe: (tag, className, textContent) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (textContent) el.textContent = textContent;
        return el;
    }
};

// ========================================
// LOADING SCREEN
// ========================================
function initializeLoadingScreen() {
    DOM.loadingScreen = document.getElementById('loadingScreen');
    DOM.progressFill = document.getElementById('progressFill');
    DOM.loadingStatus = document.getElementById('loadingStatus');
    
    if (!DOM.loadingScreen || !DOM.progressFill || !DOM.loadingStatus) return;
    
    const loadingSteps = [
        { progress: 20, text: 'Loading Resources...' },
        { progress: 40, text: 'Preparing Interface...' },
        { progress: 60, text: 'Initializing Experience...' },
        { progress: 80, text: 'Finalizing Setup...' },
        { progress: 100, text: 'Welcome to NeksusTeam!' }
    ];
    
    let currentStep = 0;
    
    function updateProgress() {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            DOM.progressFill.style.width = step.progress + '%';
            DOM.loadingStatus.textContent = step.text;
            currentStep++;
            
            if (currentStep < loadingSteps.length) {
                setTimeout(updateProgress, 400 + Math.random() * 300);
            } else {
                setTimeout(hideLoadingScreen, 500);
            }
        }
    }
    
    function hideLoadingScreen() {
        DOM.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            DOM.loadingScreen.style.display = 'none';
            // Stop all animations in loading screen to free resources
            DOM.loadingScreen.querySelectorAll('*').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        }, 500);
    }
    
    setTimeout(updateProgress, 300);
}

// ========================================
// NAVIGATION
// ========================================
function initializeNavigation() {
    DOM.navToggle = document.getElementById('navToggle');
    DOM.navMenu = document.getElementById('navMenu');
    DOM.navHeader = document.querySelector('.nav-header');
    
    if (DOM.navToggle && DOM.navMenu) {
        DOM.navToggle.addEventListener('click', function() {
            const isExpanded = DOM.navMenu.classList.toggle('active');
            DOM.navToggle.classList.toggle('active');
            DOM.navToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            if (DOM.navMenu.classList.contains('active')) {
                DOM.navMenu.classList.remove('active');
                DOM.navToggle.classList.remove('active');
                DOM.navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// ========================================
// OPTIMIZED SCROLL HANDLERS
// ========================================
function initializeScrollHandlers() {
    if (!DOM.navHeader) DOM.navHeader = document.querySelector('.nav-header');
    if (!DOM.backToTop) DOM.backToTop = document.getElementById('backToTop');
    
    const optimizedScrollHandler = Utils.debounce(() => {
        const scrollY = window.scrollY;
        
        // Navigation background
        if (DOM.navHeader) {
            if (scrollY > 50) {
                DOM.navHeader.classList.add('scrolled');
            } else {
                DOM.navHeader.classList.remove('scrolled');
            }
        }
        
        // Back to top visibility
        if (DOM.backToTop) {
            if (scrollY > 300) {
                DOM.backToTop.classList.add('visible');
            } else {
                DOM.backToTop.classList.remove('visible');
            }
        }
    }, 16); // ~60fps
    
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
}

// ========================================
// BACK TO TOP BUTTON
// ========================================
function initializeBackToTop() {
    DOM.backToTop = document.getElementById('backToTop');
    
    if (!DOM.backToTop) return;
    
    DOM.backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// PROJECT FILTERS
// ========================================
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects with animation
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    card.classList.remove('hidden');
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('animate-in');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ========================================
// SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
// ========================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add staggered animation for grid items
                const animateChildren = (selector, delay) => {
                    const items = entry.target.querySelectorAll(selector);
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate-in');
                        }, index * delay);
                    });
                };
                
                if (entry.target.classList.contains('services-grid')) {
                    animateChildren('.service-card', 300);
                }
                
                if (entry.target.classList.contains('features-grid')) {
                    animateChildren('.feature-item', 150);
                }
                
                if (entry.target.classList.contains('projects-grid')) {
                    animateChildren('.project-card:not(.hidden)', 100);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll([
        '.services-grid',
        '.features-grid',
        '.projects-grid',
        '.about-text',
        '.about-stats',
        '.contact-info',
        '.contact-form-container',
        '.faq-item'
    ].join(', '));
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// TESTIMONIALS SLIDER - CLASS-BASED APPROACH
// ========================================
class TestimonialSlider {
    constructor() {
        this.currentIndex = 0;
        this.interval = null;
        this.autoplayDelay = CONFIG.TESTIMONIAL_AUTOPLAY_DELAY;
        this.testimonials = [];
        this.dots = [];
        this.section = null;
    }
    
    init() {
        this.testimonials = document.querySelectorAll('.testimonial-item');
        this.dots = document.querySelectorAll('.dot');
        this.section = document.querySelector('.testimonials-section');
        
        if (this.testimonials.length === 0) {
            Utils.log('No testimonials found');
            return;
        }
        
        Utils.log('Initializing testimonials:', this.testimonials.length);
        
        this.setupEventListeners();
        this.show(0);
        
        // Start autoplay after short delay
        setTimeout(() => this.startAutoplay(), 500);
    }
    
    show(index) {
        if (index < 0 || index >= this.testimonials.length) return;
        
        // Hide all
        this.testimonials.forEach(t => t.classList.remove('active'));
        this.dots.forEach(d => d.classList.remove('active'));
        
        // Show current
        this.testimonials[index].classList.add('active');
        if (this.dots[index]) this.dots[index].classList.add('active');
        
        this.currentIndex = index;
    }
    
    next() {
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.show(nextIndex);
    }
    
    prev() {
        const prevIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.show(prevIndex);
    }
    
    startAutoplay() {
        this.stopAutoplay();
        this.interval = setInterval(() => this.next(), this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    setupEventListeners() {
        // Next/Prev buttons
        const nextBtn = document.querySelector('.testimonial-next');
        const prevBtn = document.querySelector('.testimonial-prev');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.stopAutoplay();
                this.next();
                setTimeout(() => this.startAutoplay(), CONFIG.TESTIMONIAL_RESUME_DELAY);
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.stopAutoplay();
                this.prev();
                setTimeout(() => this.startAutoplay(), CONFIG.TESTIMONIAL_RESUME_DELAY);
            });
        }
        
        // Dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoplay();
                this.show(index);
                setTimeout(() => this.startAutoplay(), CONFIG.TESTIMONIAL_RESUME_DELAY);
            });
        });
        
        // Pause on hover
        if (this.section) {
            this.section.addEventListener('mouseenter', () => this.stopAutoplay());
            this.section.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Page Visibility API - Handle browser tab switching
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                Utils.log('Tab visible - resuming');
                this.next();
                this.startAutoplay();
            } else {
                Utils.log('Tab hidden - pausing');
                this.stopAutoplay();
            }
        });
    }
}

let testimonialSlider;

function initializeTestimonials() {
    testimonialSlider = new TestimonialSlider();
    testimonialSlider.init();
}

// ========================================
// FAQ ACCORDION
// ========================================
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    Utils.log('Initializing', faqItems.length, 'FAQs');
    
    // Force close all FAQs on init
    faqItems.forEach((item) => {
        item.classList.remove('active');
        const question = item.querySelector('.faq-question');
        if (question) question.setAttribute('aria-expanded', 'false');
    });
    
    // Add click and keyboard events
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        
        const toggleFAQ = () => {
            const isCurrentlyActive = item.classList.contains('active');
            
            // Close all FAQs
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherQuestion = otherItem.querySelector('.faq-question');
                if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
            });
            
            // If wasn't active, open it
            if (!isCurrentlyActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        };
        
        // Click event
        question.addEventListener('click', toggleFAQ);
        
        // Keyboard accessibility
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ();
            }
        });
    });
    
    Utils.log('FAQ initialization complete');
}

// ========================================
// MODAL SYSTEM - SECURE & ACCESSIBLE
// ========================================
const ModalSystem = {
    activeModal: null,
    
    init() {
        // Use event delegation for modal triggers
        document.addEventListener('click', (e) => {
            const modalTrigger = e.target.closest('[data-modal]');
            if (modalTrigger) {
                e.preventDefault();
                const modalType = modalTrigger.dataset.modal;
                this.open(modalType);
            }
            
            const closeButton = e.target.closest('[data-close]');
            if (closeButton) {
                const modalType = closeButton.dataset.close;
                this.close(modalType);
            }
            
            // Close when clicking outside
            if (e.target.classList.contains('modal')) {
                this.close();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close();
            }
        });
    },
    
    open(type) {
        const modalId = type + 'Modal';
        const modal = document.getElementById(modalId);
        
        if (modal) {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            this.activeModal = modal;
            
            // Focus first focusable element
            const focusable = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex=\\"-1\\"])'
            );
            if (focusable.length > 0) {
                focusable[0].focus();
            }
        }
    },
    
    close(type) {
        let modal;
        if (type) {
            const modalId = type + 'Modal';
            modal = document.getElementById(modalId);
        } else {
            modal = this.activeModal;
        }
        
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
            this.activeModal = null;
        }
    }
};

// ========================================
// CONTACT FORM - SECURE & VALIDATED
// ========================================
function initializeContactForm() {
    DOM.contactForm = document.getElementById('contactForm');
    
    if (!DOM.contactForm) return;
    
    // Add honeypot field for spam protection
    addHoneypotField();
    
    // Real-time validation
    const inputs = DOM.contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    DOM.contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Honeypot check - if filled, it's a bot
        const honeypot = this.querySelector('input[name="website"]');
        if (honeypot && honeypot.value) {
            Utils.log('Bot detected via honeypot');
            showNotification('Message sent successfully!', 'success'); // Fake success
            this.reset();
            return;
        }
        
        if (validateForm()) {
            const formData = new FormData(this);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                if (key !== 'website') { // Skip honeypot field
                    formObject[key] = Utils.sanitizeHTML(value.trim());
                }
            }
            
            submitContactForm(formObject);
        }
    });
}

function addHoneypotField() {
    const honeypot = Utils.createElementSafe('input', 'hp-field');
    honeypot.type = 'text';
    honeypot.name = 'website'; // Common field name bots might fill
    honeypot.style.cssText = `
        position: absolute;
        left: -9999px;
        opacity: 0;
        height: 0;
        width: 0;
    `;
    honeypot.autocomplete = 'off';
    honeypot.tabIndex = -1;
    DOM.contactForm.appendChild(honeypot);
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    clearFieldError(field);
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Name validation (if you have a name field)
    if (field.type === 'text' && field.name === 'name' && value) {
        if (value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        }
        if (/[0-9]/.test(value)) {
            isValid = false;
            errorMessage = 'Name should not contain numbers';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function validateForm() {
    const requiredFields = DOM.contactForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = Utils.createElementSafe('span', 'field-error');
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: block;
        `;
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function submitContactForm(formData) {
    const now = Date.now();
    
    // Rate limiting
    if (now - formSubmitTracker.lastSubmit < formSubmitTracker.minDelay) {
        showNotification('Please wait before submitting again', 'error');
        return;
    }
    
    formSubmitTracker.lastSubmit = now;
    
    const submitButton = DOM.contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    const spinner = Utils.createElementSafe('i', 'fas fa-spinner fa-spin');
    submitButton.innerHTML = '';
    submitButton.appendChild(spinner);
    submitButton.appendChild(document.createTextNode(' Sending...'));
    submitButton.disabled = true;
    submitButton.style.opacity = '0.7';
    
    // Send to Formspree - REPLACE 'your-form-id' WITH YOUR ACTUAL FORMSPREE ID
    fetch('https://formspree.io/f/mnnzdegq', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            // Success
            DOM.contactForm.reset();
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        Utils.log('Form submission error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    })
    .finally(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        document.querySelectorAll('.field-error').forEach(error => error.remove());
    });
}

// ========================================
// NOTIFICATION SYSTEM - SECURE
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification
    const notification = Utils.createElementSafe('div', `notification notification-${type}`);
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    
    const iconSpan = Utils.createElementSafe('span', 'notification-icon', icon);
    const messageSpan = Utils.createElementSafe('span', 'notification-message', message);
    const closeBtn = Utils.createElementSafe('button', 'notification-close', '×');
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.addEventListener('click', () => notification.remove());
    
    notification.appendChild(iconSpan);
    notification.appendChild(messageSpan);
    notification.appendChild(closeBtn);
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1100;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        border-left: 4px solid rgba(255, 255, 255, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ========================================
// ANIMATIONS
// ========================================
function initializeAnimations() {
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.service-card, .project-card, .feature-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ========================================
// DYNAMIC CSS ANIMATIONS
// ========================================
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification {
            transition: all 0.3s ease-out;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            margin: 0;
            line-height: 1;
            opacity: 0.8;
            transition: opacity 0.2s ease-out;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
        
        .notification-icon {
            font-size: 1.1rem;
        }
        
        .notification-message {
            flex: 1;
            font-weight: 500;
        }
        
        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: #983e97;
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 100;
        }
        
        .skip-link:focus {
            top: 0;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// CACHE DOM ELEMENTS
// ========================================
function cacheDOMElements() {
    DOM.navHeader = document.querySelector('.nav-header');
    DOM.backToTop = document.getElementById('backToTop');
    DOM.contactForm = document.getElementById('contactForm');
    DOM.projectsGrid = document.getElementById('projectsGrid');
}

// ========================================
// MAIN INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    Utils.log('NeksusTeam website initializing...');
    
    // Cache DOM elements first
    cacheDOMElements();
    
    // Initialize all features
    initializeLoadingScreen();
    initializeNavigation();
    initializeScrollHandlers();
    initializeAnimations();
    initializeContactForm();
    initializeProjectFilters();
    initializeScrollAnimations();
    initializeBackToTop();
    initializeFAQ();
    initializeTestimonials();
    ModalSystem.init();
    injectAnimationStyles();
    
    Utils.log('✅ NeksusTeam website initialized successfully!');
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        Utils.log('Page hidden - pausing animations');
    } else {
        Utils.log('Page visible - resuming animations');
    }
});
