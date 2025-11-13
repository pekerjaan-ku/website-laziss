/* ===========================
   KHOIRO UMMAH - MAIN JAVASCRIPT
   Optimized for Performance
   =========================== */

(function() {
    'use strict';

    // ===== INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        // Hide loading screen
        hideLoadingScreen();
        
        // Initialize features
        initSmoothScrolling();
        initNavbarScrollEffect();
        initContactForm();
        initBackToTop();
        initCounterAnimation();
        initNavbarActive();
        initLazyLoading();
        initHeroParticles();
    }

    // ===== LOADING SCREEN =====
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Wait for critical images to load
        const criticalImages = document.querySelectorAll('img[loading="eager"]');
        const imagePromises = Array.from(criticalImages).map(img => {
            if (img.complete) {
                return Promise.resolve();
            }
            return new Promise(resolve => {
                img.addEventListener('load', resolve);
                img.addEventListener('error', resolve);
            });
        });

        Promise.all(imagePromises).then(() => {
            setTimeout(() => {
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
            }, 300);
        });

        // Fallback timeout
        setTimeout(() => {
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 2000);
    }

    // ===== SMOOTH SCROLLING =====
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                            toggle: false
                        });
                        bsCollapse.hide();
                    }
                }
            });
        });
    }

    // ===== NAVBAR SCROLL EFFECT =====
    function initNavbarScrollEffect() {
        const navbar = document.getElementById('main-nav');
        let lastScroll = 0;
        let ticking = false;

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleNavbarScroll(navbar, lastScroll);
                    lastScroll = window.pageYOffset;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    function handleNavbarScroll(navbar, lastScroll) {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    }

    // ===== NAVBAR ACTIVE STATE =====
    function initNavbarActive() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        function updateActiveSection() {
            const scrollY = window.pageYOffset;

            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ===== CONTACT FORM =====
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Mohon lengkapi semua field!', 'warning');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Format email tidak valid!', 'warning');
                return;
            }

            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
            submitButton.disabled = true;

            setTimeout(() => {
                showNotification('Terima kasih! Pesan Anda telah terkirim. Tim kami akan segera menghubungi Anda.', 'success');
                contactForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 1500);
        });

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value;

                if (email) {
                    showNotification('Terima kasih! Anda telah berlangganan newsletter kami.', 'success');
                    emailInput.value = '';
                }
            });
        }
    }

    // ===== NOTIFICATION =====
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `custom-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .custom-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 16px 24px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.16);
                z-index: 9999;
                animation: slideIn 0.3s ease-out;
            }
            .notification-success {
                border-left: 4px solid #10b981;
            }
            .notification-warning {
                border-left: 4px solid #f59e0b;
            }
            .notification-content {
                display: flex;
                align-items: center;
                font-size: 0.95rem;
                font-weight: 500;
                color: #1a1a1a;
            }
            .notification-success i {
                color: #10b981;
            }
            .notification-warning i {
                color: #f59e0b;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Add to body
        document.body.appendChild(notification);

        // Remove after delay
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // ===== BACK TO TOP =====
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    if (window.pageYOffset > 300) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===== COUNTER ANIMATION =====
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    animateCounter(counter);
                    counterObserver.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString('id-ID');
                requestAnimationFrame(updateCounter);
            } else {
                // Add suffix for percentage
                if (counter.parentElement.querySelector('.stat-label').textContent.includes('Kepuasan')) {
                    counter.textContent = target + '%';
                } else {
                    counter.textContent = target.toLocaleString('id-ID') + '+';
                }
            }
        };

        updateCounter();
    }

    // ===== LAZY LOADING =====
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ===== HERO PARTICLES (Lightweight) =====
    function initHeroParticles() {
        const particlesContainer = document.getElementById('hero-particles');
        if (!particlesContainer) return;

        // Only create particles on desktop
        if (window.innerWidth < 768) return;

        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            createParticle(particlesContainer);
        }
    }

    function createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${left}%;
            bottom: -10px;
            animation: floatUp ${duration}s ${delay}s infinite;
        `;
        
        container.appendChild(particle);

        // Add animation keyframes
        if (!document.getElementById('particle-animation')) {
            const style = document.createElement('style');
            style.id = 'particle-animation';
            style.textContent = `
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) translateX(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Debounce function
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

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Reinitialize particles on desktop only
            const particlesContainer = document.getElementById('hero-particles');
            if (particlesContainer && window.innerWidth >= 768) {
                particlesContainer.innerHTML = '';
                initHeroParticles();
            } else if (particlesContainer) {
                particlesContainer.innerHTML = '';
            }
        }, 250);
    });

    // ===== ACCESSIBILITY =====
    
    // Focus visible for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // Add focus styles
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-nav *:focus {
            outline: 2px solid #2a5298 !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(style);

    // ===== PRELOAD CRITICAL RESOURCES =====
    function preloadCriticalResources() {
        const criticalImages = [
            'assets/images/logo.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    preloadCriticalResources();

    // ===== SERVICE WORKER (Optional - for PWA) =====
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            // Uncomment to enable service worker
            // navigator.serviceWorker.register('/sw.js')
            //     .then(reg => console.log('Service Worker registered'))
            //     .catch(err => console.log('Service Worker registration failed'));
        });
    }

    // ===== CONSOLE MESSAGE =====
    console.log('%c🌟 Khoiro Ummah - Lembaga Amil Zakat, Wakaf & Shodaqoh 🌟', 
        'color: #1e3c72; font-size: 16px; font-weight: bold; padding: 10px;');
    console.log('%cMenebar Kebaikan, Menyentuh Hati', 
        'color: #2a5298; font-size: 12px; font-style: italic;');

})();

// ===== GALLERY LIGHTBOX (Simple Implementation) =====
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            showLightbox(imgSrc);
        });
    });
});

function showLightbox(imgSrc) {
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imgSrc}" alt="Gallery Image">
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        }
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .lightbox-content img {
            max-width: 100%;
            max-height: 90vh;
            object-fit: contain;
            border-radius: 8px;
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 40px;
            font-weight: 300;
            cursor: pointer;
            transition: 0.3s;
        }
        .lightbox-close:hover {
            color: #00d4ff;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(lightbox);

    // Close lightbox
    lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
        closeLightbox(lightbox);
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox(lightbox);
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
        }
    });
}

function closeLightbox(lightbox) {
    lightbox.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        lightbox.remove();
    }, 300);
}

// Add fadeOut animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(fadeOutStyle);
