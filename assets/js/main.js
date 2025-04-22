/**
 * MAESTRO Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    fixSvgRendering();
    initNavigation();
    initTabs();
    initTestimonialSlider();
    initAIAnimation();
    initChatWidget();
    initExitIntent();
    initScrollAnimations();
    handleFormSubmissions();
    initSmoothScroll();
    initTabNavigation();
    initCookieConsent();
    initCounters();
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
        
        // Force browser to reload the SVG by adding a cache-busting parameter
        if (currentSrc && currentSrc.endsWith('.svg')) {
            svg.setAttribute('src', currentSrc + '?v=' + new Date().getTime());
            
            // Set proper MIME type to help browsers render correctly
            svg.setAttribute('type', 'image/svg+xml');
            
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
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('show');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-menu') && !e.target.closest('.menu-toggle') && navMenu.classList.contains('show')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('show');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Handle resize events
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992 && navMenu.classList.contains('show')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('show');
                document.body.classList.remove('menu-open');
            }
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
 * Feature Tabs
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabButtons.length && tabPanes.length) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding tab pane
                const tabId = button.getAttribute('data-tab');
                const targetPane = document.getElementById(tabId + '-tab');
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slides.length && dotsContainer) {
        let currentSlide = 0;
        
        // Create navigation dots
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
        
        // Previous button
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateSlider();
            });
        }
        
        // Next button
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlider();
            });
        }
        
        // Go to specific slide
        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
        }
        
        // Update slider display
        function updateSlider() {
            // Hide all slides
            slides.forEach(slide => {
                slide.style.display = 'none';
            });
            
            // Show current slide
            slides[currentSlide].style.display = 'block';
            
            // Update dots
            document.querySelectorAll('.testimonial-dots .dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        // Auto-advance the slider
        let autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, 5000);
        
        // Pause auto-advance on hover
        const sliderContainer = document.querySelector('.testimonial-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlide);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                autoSlide = setInterval(() => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    updateSlider();
                }, 5000);
            });
        }
    }
}

/**
 * AI Animation in Hero Section
 */
function initAIAnimation() {
    const aiContainer = document.querySelector('.ai-animation');
    if (aiContainer) {
        // Create canvas element
        const canvas = document.createElement('canvas');
        aiContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        function resizeCanvas() {
            canvas.width = aiContainer.clientWidth;
            canvas.height = aiContainer.clientHeight;
        }
        
        // Call once to initialize
        resizeCanvas();
        
        // Listen for window resize
        window.addEventListener('resize', resizeCanvas);
        
        // Particle properties
        const particles = [];
        const particleCount = 100;
        const connectionDistance = 100;
        const colors = ['#d81c1c', '#a41616', '#ffffff'];
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1 - 0.5,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        
        // Animation function
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                // Move particle
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.speedX *= -1;
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.speedY *= -1;
                }
                
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                
                // Connect particles if they're close enough
                particles.forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectionDistance * 0.8})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
        }
        
        // Start animation
        animate();
    }
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
 * Cookie consent banner
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
                });
            }
            
            // Reject button handler
            const rejectButton = cookieBanner.querySelector('.reject-cookies');
            
            if (rejectButton) {
                rejectButton.addEventListener('click', function() {
                    localStorage.setItem('cookieConsent', 'rejected');
                    cookieBanner.classList.remove('show');
                });
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
    const counterElements = document.querySelectorAll('.counter');
    
    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe the first counter element
        counterObserver.observe(counterElements[0]);
    }
} 