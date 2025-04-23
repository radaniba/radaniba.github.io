/**
 * MAESTRO Landing Page JavaScript
 */

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    // Fix SVG rendering in older browsers
    fixSvgRendering();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize tab functionality
    initTabNavigation();
    
    // Initialize testimonial slider
    initTestimonialSlider();
    
    // Initialize AI animation
    initAIAnimation();
    
    // Initialize chat widget
    initChatWidget();
    
    // Initialize exit intent popup
    initExitIntent();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize counters
    initCounters();
    
    // Initialize form handling
    handleFormSubmissions();
    
    // Initialize cookie consent
    initCookieConsent();
    
    // Initialize booking iframe
    initBookingIframe();
});

/**
 * Fix SVG rendering issues on GitHub Pages
 */
function fixSvgRendering() {
    // Find all SVG elements that might have rendering issues
    const svgElements = document.querySelectorAll('img[src$=".svg"]');
    
    svgElements.forEach(svg => {
        // Get the current src
        const currentSrc = svg.getAttribute('src');
        
        // Only make sure SVGs are visible without modifying the source
        if (currentSrc && currentSrc.endsWith('.svg')) {
            // Make sure SVGs are visible
            svg.style.visibility = 'visible';
            
            // Add fallback for browsers that don't support SVG
            const fallbackPng = currentSrc.replace('.svg', '.png');
            svg.setAttribute('onerror', `this.onerror=null; this.src='${fallbackPng}'`);
        }
    });
    
    // Specifically target challenge icons in pain points section
    const challengeIcons = document.querySelectorAll('.challenge-icon img');
    challengeIcons.forEach(icon => {
        const src = icon.getAttribute('src');
        if (src && src.endsWith('.svg')) {
            // Ensure proper display
            icon.style.width = '32px'; 
            icon.style.height = '32px';
            icon.style.display = 'block';
            
            // Add fallback
            const fallbackPng = src.replace('.svg', '.png');
            icon.setAttribute('onerror', `this.onerror=null; this.src='${fallbackPng}'`);
        }
    });
}

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('nav ul') && !e.target.closest('.hamburger') && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Handle header background change on scroll
        window.addEventListener('scroll', function() {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Close mobile menu when clicking on a nav link that points to a section
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const menuToggle = document.querySelector('.menu-toggle');
                    
                    if (navMenu && navMenu.classList.contains('show')) {
                        menuToggle.classList.remove('active');
                        navMenu.classList.remove('show');
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Scroll to target with smooth behavior
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const slider = document.querySelector('.testimonial-slider');
    
    if (slides.length && dotsContainer) {
        let currentSlide = 0;
        let autoSlideInterval;
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Create navigation dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });
        
        // Add swipe functionality
        if (slider) {
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});
            
            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                resetAutoSlide();
            }, {passive: true});
        }
        
        function handleSwipe() {
            const threshold = 50; // Minimum swipe distance
            if (touchStartX - touchEndX > threshold) {
                // Swipe left (next)
                goToNextSlide();
            } else if (touchEndX - touchStartX > threshold) {
                // Swipe right (previous)
                goToPrevSlide();
            }
        }
        
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToPrevSlide();
                resetAutoSlide();
            });
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToNextSlide();
                resetAutoSlide();
            });
        }
        
        function goToNextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }
        
        function goToPrevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        }
        
        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }
        
        function updateSlider() {
            // Update slides
            slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev', 'next');
                
                // Add appropriate class based on position
                if (index === currentSlide) {
                    slide.classList.add('active');
                    slide.style.transform = 'translateX(0)';
                    slide.style.opacity = '1';
                    slide.style.zIndex = '2';
                } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                    slide.classList.add('prev');
                    slide.style.transform = 'translateX(-100%)';
                    slide.style.opacity = '0.5';
                    slide.style.zIndex = '1';
                } else if (index === (currentSlide + 1) % slides.length) {
                    slide.classList.add('next');
                    slide.style.transform = 'translateX(100%)';
                    slide.style.opacity = '0.5';
                    slide.style.zIndex = '1';
                } else {
                    slide.style.transform = 'translateX(100%)';
                    slide.style.opacity = '0';
                    slide.style.zIndex = '0';
                }
            });
            
            // Update dots
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(() => {
                goToNextSlide();
            }, 5000); // Change slide every 5 seconds
        }
        
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        // Initialize
        updateSlider();
        startAutoSlide();
        
        // Pause auto-sliding when user hovers over slider
        if (slider) {
            slider.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            slider.addEventListener('mouseleave', () => {
                startAutoSlide();
            });
        }
    }
}

/**
 * AI Animation in Hero Section
 */
function initAIAnimation() {
    const container = document.querySelector('.ai-animation');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';
    
    // Create a canvas for better performance
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Parameters
    const particles = [];
    const connections = [];
    const particleCount = 40;
    const connectionDistance = 100;
    const nodeSize = 3;
    
    // Create particles (neural nodes)
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: nodeSize + Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            hue: 220 + Math.random() * 40, // Blue to purple range
            active: Math.random() > 0.7  // Some nodes start active
        });
    }
    
    // Create data packets for animation
    const dataPackets = [];
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw connections first (behind particles)
        ctx.lineWidth = 0.5;
        connections.length = 0; // Reset connections
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    connections.push({
                        from: particles[i],
                        to: particles[j],
                        opacity: 1 - (distance / connectionDistance)
                    });
                    
                    // Draw connection
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    const opacity = 0.2 * (1 - (distance / connectionDistance));
                    ctx.strokeStyle = `rgba(120, 170, 255, ${opacity})`;
                    ctx.stroke();
                }
            }
        }
        
        // Create new data packets randomly
        if (Math.random() > 0.97 && connections.length > 0) {
            const connection = connections[Math.floor(Math.random() * connections.length)];
            if (connection) {
                dataPackets.push({
                    x: connection.from.x,
                    y: connection.from.y,
                    targetX: connection.to.x,
                    targetY: connection.to.y,
                    progress: 0,
                    speed: 0.02 + Math.random() * 0.03
                });
            }
        }
        
        // Update and draw data packets
        for (let i = dataPackets.length - 1; i >= 0; i--) {
            const packet = dataPackets[i];
            packet.progress += packet.speed;
            
            if (packet.progress >= 1) {
                // Remove completed packets
                dataPackets.splice(i, 1);
                
                // Activate the target node
                for (let j = 0; j < particles.length; j++) {
                    if (particles[j].x === packet.targetX && particles[j].y === packet.targetY) {
                        particles[j].active = true;
                        setTimeout(() => {
                            particles[j].active = Math.random() > 0.5;
                        }, 1000 + Math.random() * 2000);
                    }
                }
                continue;
            }
            
            // Calculate current position
            const x = packet.x + (packet.targetX - packet.x) * packet.progress;
            const y = packet.y + (packet.targetY - packet.y) * packet.progress;
            
            // Draw data packet
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        }
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Update position with boundaries
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            
            // Different style for active nodes
            if (p.active) {
                // Glowing effect for active nodes
                const gradient = ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, p.size * 2
                );
                gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 1)`);
                gradient.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`);
                
                ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, 1)`;
                ctx.fill();
                
                // Draw glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            } else {
                ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, 0.6)`;
                ctx.fill();
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle resize
    function handleResize() {
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        // Redistribute particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].x = Math.random() * canvas.width;
            particles[i].y = Math.random() * canvas.height;
        }
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Start animation
    animate();
}

/**
 * Live Chat Widget
 */
function initChatWidget() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatContainer = document.querySelector('.chat-container');
    const chatIcon = document.querySelector('.chat-icon');
    const closeIcon = document.querySelector('.close-icon');
    const chatInput = document.querySelector('.chat-input input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (chatToggle && chatContainer) {
        // Toggle chat window
        chatToggle.addEventListener('click', () => {
            chatContainer.classList.toggle('hidden');
            chatIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
        
        // Send message function
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                const userMessageEl = document.createElement('div');
                userMessageEl.classList.add('message', 'user-message');
                userMessageEl.innerHTML = `<p>${message}</p>`;
                chatMessages.appendChild(userMessageEl);
                
                // Clear input
                chatInput.value = '';
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate response (in a real app, this would call an API)
                setTimeout(() => {
                    const botMessageEl = document.createElement('div');
                    botMessageEl.classList.add('message', 'system-message');
                    botMessageEl.innerHTML = `<p>Thanks for your message! This is a demo chat widget. In a production environment, this would connect to a live chat system.</p>`;
                    chatMessages.appendChild(botMessageEl);
                    
                    // Scroll to bottom again
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        }
        
        // Send message on button click
        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }
        
        // Send message on Enter key
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
}

/**
 * Exit Intent Popup
 */
function initExitIntent() {
    const exitPopup = document.querySelector('.exit-popup');
    
    if (exitPopup) {
        // Check if popup was already shown in this session
        if (!sessionStorage.getItem('exitPopupShown')) {
            // Set listener for exit intent
            document.addEventListener('mouseleave', handleExitIntent);
            
            // Close button handler
            const closeButton = exitPopup.querySelector('.close-popup');
            
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    exitPopup.classList.remove('show');
                    // Prevent showing again in this session
                    sessionStorage.setItem('exitPopupShown', 'true');
                });
            }
        }
    }
}

/**
 * Handle exit intent detection
 */
function handleExitIntent(e) {
    // Only trigger when cursor moves out through the top of the page
    if (e.clientY < 5) {
        // Remove the event listener
        document.removeEventListener('mouseleave', handleExitIntent);
        
        // Show the popup
        const exitPopup = document.querySelector('.exit-popup');
        
        if (exitPopup) {
            exitPopup.classList.add('show');
        }
    }
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Stop observing after animation is triggered
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px' // Trigger slightly before element comes into view
        });
        
        animatedElements.forEach(element => {
            // Add initial state class based on animation type
            if (element.classList.contains('fade-in')) {
                element.style.opacity = '0';
                element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            } else if (element.classList.contains('slide-in')) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(50px)';
                element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            } else if (element.classList.contains('scale-in')) {
                element.style.opacity = '0';
                element.style.transform = 'scale(0.9)';
                element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            }
            
            animationObserver.observe(element);
        });
        
        // Add styles for visible state
        const style = document.createElement('style');
        style.textContent = `
            .fade-in.visible, .slide-in.visible, .scale-in.visible {
                opacity: 1;
                transform: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Parallax effect for background elements
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const speed = element.getAttribute('data-speed') || 0.5;
            
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
}

/**
 * Tab navigation
 */
function initTabNavigation() {
    const tabContainers = document.querySelectorAll('.tab-container');
    
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabPanels = container.querySelectorAll('.tab-panel');
        
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                tabPanels[index].classList.add('active');
            });
        });
    });
}

/**
 * Cookie consent banner with Google Analytics integration
 */
function initCookieConsent() {
    const cookieBanner = document.querySelector('.cookie-banner');
    
    if (cookieBanner) {
        // Check if consent was already given
        if (!localStorage.getItem('cookieConsent')) {
            // Show the banner after a short delay
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 2000);
            
            // Accept button handler
            const acceptButton = cookieBanner.querySelector('.accept-cookies');
            
            if (acceptButton) {
                acceptButton.addEventListener('click', function() {
                    localStorage.setItem('cookieConsent', 'accepted');
                    cookieBanner.classList.remove('show');
                    
                    // Enable Google Analytics if available
                    if (typeof gtag === 'function') {
                        // Update GA consent
                        gtag('consent', 'update', {
                            'analytics_storage': 'granted'
                        });
                    }
                });
            }
            
            // Reject button handler
            const rejectButton = cookieBanner.querySelector('.reject-cookies');
            
            if (rejectButton) {
                rejectButton.addEventListener('click', function() {
                    localStorage.setItem('cookieConsent', 'rejected');
                    cookieBanner.classList.remove('show');
                    
                    // Disable Google Analytics if available
                    if (typeof gtag === 'function') {
                        // Update GA consent
                        gtag('consent', 'update', {
                            'analytics_storage': 'denied'
                        });
                    }
                });
            }
            
            // Settings button handler
            const settingsButton = cookieBanner.querySelector('.cookie-settings');
            
            if (settingsButton) {
                settingsButton.addEventListener('click', function() {
                    // Show cookie settings panel
                    const settingsPanel = document.querySelector('.cookie-settings-panel');
                    if (settingsPanel) {
                        settingsPanel.classList.add('show');
                    }
                });
            }
            
            // Save settings button handler
            const saveSettingsButton = document.querySelector('.save-cookie-settings');
            
            if (saveSettingsButton) {
                saveSettingsButton.addEventListener('click', function() {
                    // Get selected preferences
                    const analyticsConsent = document.getElementById('analytics-consent').checked;
                    const functionalConsent = document.getElementById('functional-consent').checked;
                    
                    // Save preferences
                    localStorage.setItem('cookieConsent', 'custom');
                    localStorage.setItem('analyticsConsent', analyticsConsent);
                    localStorage.setItem('functionalConsent', functionalConsent);
                    
                    // Update Google Analytics consent
                    if (typeof gtag === 'function') {
                        gtag('consent', 'update', {
                            'analytics_storage': analyticsConsent ? 'granted' : 'denied'
                        });
                    }
                    
                    // Hide panels
                    document.querySelector('.cookie-settings-panel').classList.remove('show');
                    cookieBanner.classList.remove('show');
                });
            }
            
            // Close settings panel button
            const closeSettingsButton = document.querySelector('.close-cookie-settings');
            
            if (closeSettingsButton) {
                closeSettingsButton.addEventListener('click', function() {
                    const settingsPanel = document.querySelector('.cookie-settings-panel');
                    if (settingsPanel) {
                        settingsPanel.classList.remove('show');
                    }
                });
            }
        } else {
            // Apply stored preferences on page load
            const consentType = localStorage.getItem('cookieConsent');
            
            if (consentType === 'accepted') {
                // Enable all cookies
                if (typeof gtag === 'function') {
                    gtag('consent', 'update', { 'analytics_storage': 'granted' });
                }
            } else if (consentType === 'custom') {
                // Apply custom settings
                const analyticsConsent = localStorage.getItem('analyticsConsent') === 'true';
                
                if (typeof gtag === 'function') {
                    gtag('consent', 'update', { 
                        'analytics_storage': analyticsConsent ? 'granted' : 'denied'
                    });
                }
            } else if (consentType === 'rejected') {
                // Disable all cookies
                if (typeof gtag === 'function') {
                    gtag('consent', 'update', { 'analytics_storage': 'denied' });
                }
            }
        }
    }
}

/**
 * Form Handling
 */
function handleFormSubmissions() {
    const demoForm = document.getElementById('demo-form');
    
    if (demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(demoForm);
            const data = Object.fromEntries(formData.entries());
            
            // In a real app, this would submit to a server
            console.log('Form Data:', data);
            alert('Thank you for your interest! Your demo request has been received. This is a demo form - in a production environment, this would be sent to our sales team.');
            
            // Clear form
            demoForm.reset();
        });
    }
}

/**
 * Utility Functions
 */

// Debounce function to limit how often a function can be called
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Animate counter elements
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = parseInt(counter.getAttribute('data-duration') || 2000);
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Initialize counters when they come into view
function initCounters() {
    // Check if we have any counter elements
    const counterElements = document.querySelectorAll('.counter');
    
    if (counterElements.length > 0) {
        // Create the IntersectionObserver
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start animation when element is in view
                    animateCounters();
                    
                    // Stop observing after triggering
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe each counter element
        counterElements.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
}

/**
 * Handle iframe sizing for booking calendar
 */
function initBookingIframe() {
    const bookingIframe = document.getElementById('cfEventTypejyXnke');
    
    if (bookingIframe) {
        // Force iframe to take full container width
        function resizeIframe() {
            const wrapper = bookingIframe.closest('.iframe-wrapper');
            if (wrapper) {
                const wrapperWidth = wrapper.offsetWidth;
                bookingIframe.style.width = `${wrapperWidth}px`;
                
                // Ensure background stays white
                bookingIframe.style.backgroundColor = '#fff';
                wrapper.style.backgroundColor = '#fff';
                
                // Dispatch resize event to trigger iframeResizer
                window.dispatchEvent(new Event('resize'));
            }
        }
        
        // Initialize on load and when window resizes
        window.addEventListener('load', resizeIframe);
        window.addEventListener('resize', debounce(resizeIframe, 100));
        
        // Try to force resize after a short delay to ensure calendar is loaded
        setTimeout(resizeIframe, 500);
        setTimeout(resizeIframe, 1500);
        setTimeout(resizeIframe, 3000);
    }
}

// Add on window load for elements that need full page load
window.addEventListener('load', () => {
    // Rerun counters animation after page is fully loaded
    animateCounters();
    
    // Force iframe resize once more
    if (typeof initBookingIframe === 'function') {
        initBookingIframe();
    }
}); 