/**
 * MAESTRO Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initNavigation();
    initTabs();
    initTestimonialSlider();
    initAIAnimation();
    initCookieBanner();
    initChatWidget();
    initExitIntent();
    initScrollAnimations();
    handleFormSubmissions();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a nav link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Header scroll effect
        const header = document.querySelector('header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }
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
    const testimonials = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.testimonial-nav .prev-btn');
    const nextBtn = document.querySelector('.testimonial-nav .next-btn');
    
    if (testimonials.length && dotsContainer) {
        let currentSlide = 0;
        let slideInterval;
        
        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');
        
        // Show only the current slide
        function showSlide(index) {
            testimonials.forEach((slide, i) => {
                if (i === index) {
                    slide.style.display = 'block';
                } else {
                    slide.style.display = 'none';
                }
            });
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // Initialize first slide
        showSlide(0);
        
        // Handle slide navigation
        function goToSlide(index) {
            currentSlide = index;
            if (currentSlide < 0) currentSlide = testimonials.length - 1;
            if (currentSlide >= testimonials.length) currentSlide = 0;
            showSlide(currentSlide);
            resetSlideInterval();
        }
        
        // Set up auto-sliding
        function startSlideInterval() {
            slideInterval = setInterval(() => {
                goToSlide(currentSlide + 1);
            }, 5000);
        }
        
        function resetSlideInterval() {
            clearInterval(slideInterval);
            startSlideInterval();
        }
        
        // Add event listeners to navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
        }
        
        // Start auto-sliding
        startSlideInterval();
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
        const colors = ['#6c63ff', '#00d9c5', '#ffffff'];
        
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
 * Cookie Consent Banner
 */
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const customizeBtn = document.getElementById('customize-cookies');
    
    if (cookieBanner && acceptBtn) {
        // Check if user has already accepted cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            // Show banner after a short delay
            setTimeout(() => {
                cookieBanner.style.display = 'flex';
            }, 2000);
            
            // Handle accept button
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieBanner.style.display = 'none';
            });
            
            // Handle customize button (placeholder functionality)
            if (customizeBtn) {
                customizeBtn.addEventListener('click', () => {
                    // In a real implementation, this would show cookie preferences
                    alert('Cookie preferences would be shown here in a production environment.');
                    localStorage.setItem('cookiesAccepted', 'true');
                    cookieBanner.style.display = 'none';
                });
            }
        }
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
    const exitPopup = document.getElementById('exit-popup');
    const closePopup = document.querySelector('.close-popup');
    const whitePaperForm = document.getElementById('whitepaper-form');
    
    if (exitPopup && closePopup) {
        let showOnce = false;
        
        // Check if popup has been shown in this session
        if (!sessionStorage.getItem('exitPopupShown')) {
            // Mouse leave detection
            document.addEventListener('mouseleave', (e) => {
                if (e.clientY < 5 && !showOnce) {
                    exitPopup.classList.add('active');
                    showOnce = true;
                    sessionStorage.setItem('exitPopupShown', 'true');
                }
            });
            
            // Close button
            closePopup.addEventListener('click', () => {
                exitPopup.classList.remove('active');
            });
            
            // Close when clicking outside
            exitPopup.addEventListener('click', (e) => {
                if (e.target === exitPopup) {
                    exitPopup.classList.remove('active');
                }
            });
            
            // Form submission
            if (whitePaperForm) {
                whitePaperForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = document.getElementById('popup-email').value;
                    
                    // In a real app, this would submit to a server
                    alert(`Thank you! The whitepaper would be sent to ${email} in a production environment.`);
                    
                    exitPopup.classList.remove('active');
                });
            }
        }
    }
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.challenge-card, .benefit-card, .pricing-card, .architecture-column');
    
    if (elements.length) {
        // Create an observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe each element
        elements.forEach(element => {
            observer.observe(element);
        });
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