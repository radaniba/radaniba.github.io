/**
 * MAESTRO Landing Page JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    fixSvgRendering();
    initNavigation();
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
    const aiContainer = document.querySelector('.ai-animation');
    if (aiContainer) {
        // Clear any existing content
        aiContainer.innerHTML = '';
        
        // Directly embed the SVG content to ensure animations work
        aiContainer.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            <!-- Definitions -->
            <defs>
                <!-- Gradients for nodes -->
                <linearGradient id="nodeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#4A6ADA" stop-opacity="0.9"/>
                    <stop offset="100%" stop-color="#2C53C5" stop-opacity="0.9"/>
                </linearGradient>
                
                <linearGradient id="nodeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FF416C" stop-opacity="0.9"/>
                    <stop offset="100%" stop-color="#FF4B2B" stop-opacity="0.9"/>
                </linearGradient>
                
                <linearGradient id="nodeGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0BAB64" stop-opacity="0.9"/>
                    <stop offset="100%" stop-color="#3BB78F" stop-opacity="0.9"/>
                </linearGradient>
                
                <linearGradient id="nodeGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#8E54E9" stop-opacity="0.9"/>
                    <stop offset="100%" stop-color="#4A6ADA" stop-opacity="0.9"/>
                </linearGradient>
                
                <linearGradient id="nodeGradient5" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FF9500" stop-opacity="0.9"/>
                    <stop offset="100%" stop-color="#FF5E3A" stop-opacity="0.9"/>
                </linearGradient>
                
                <linearGradient id="nodeGradient6" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#00C9FF" stop-opacity="0.9"/>
                    <stop offset="100%" stop-color="#0082FF" stop-opacity="0.9"/>
                </linearGradient>
                
                <!-- Filter for node glow -->
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.2" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                
                <!-- Filter for data packet glow -->
                <filter id="packetGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.5" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Background -->
            <rect x="0" y="0" width="800" height="600" fill="none" />
            
            <!-- Concept Nodes -->
            <g id="concept-nodes">
                <!-- Patient Node -->
                <g transform="translate(240, 200)">
                    <circle r="40" fill="url(#nodeGradient1)" filter="url(#nodeGlow)">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="6s" repeatCount="indefinite" />
                        <animate attributeName="r" values="40;43;40" dur="6s" repeatCount="indefinite" />
                    </circle>
                    <text text-anchor="middle" dy="5" fill="white" font-family="'Segoe UI', Arial, sans-serif" font-size="14">Patient</text>
                </g>
                
                <!-- Record Node -->
                <g transform="translate(430, 150)">
                    <circle r="40" fill="url(#nodeGradient2)" filter="url(#nodeGlow)">
                        <animate attributeName="opacity" values="0.7;0.9;0.7" dur="7s" repeatCount="indefinite" />
                        <animate attributeName="r" values="40;44;40" dur="7s" repeatCount="indefinite" />
                    </circle>
                    <text text-anchor="middle" dy="5" fill="white" font-family="'Segoe UI', Arial, sans-serif" font-size="14">Record</text>
                </g>
                
                <!-- Visit Node -->
                <g transform="translate(590, 230)">
                    <circle r="40" fill="url(#nodeGradient3)" filter="url(#nodeGlow)">
                        <animate attributeName="opacity" values="0.75;0.95;0.75" dur="8s" repeatCount="indefinite" />
                        <animate attributeName="r" values="40;42;40" dur="8s" repeatCount="indefinite" />
                    </circle>
                    <text text-anchor="middle" dy="5" fill="white" font-family="'Segoe UI', Arial, sans-serif" font-size="14">Visit</text>
                </g>
                
                <!-- Timeline Node -->
                <g transform="translate(500, 350)">
                    <circle r="40" fill="url(#nodeGradient4)" filter="url(#nodeGlow)">
                        <animate attributeName="opacity" values="0.8;1;0.8" dur="6.5s" repeatCount="indefinite" />
                        <animate attributeName="r" values="40;45;40" dur="6.5s" repeatCount="indefinite" />
                    </circle>
                    <text text-anchor="middle" dy="5" fill="white" font-family="'Segoe UI', Arial, sans-serif" font-size="14">Timeline</text>
                </g>
                
                <!-- Compliance Node -->
                <g transform="translate(320, 400)">
                    <circle r="40" fill="url(#nodeGradient5)" filter="url(#nodeGlow)">
                        <animate attributeName="opacity" values="0.7;0.9;0.7" dur="7.5s" repeatCount="indefinite" />
                        <animate attributeName="r" values="40;43;40" dur="7.5s" repeatCount="indefinite" />
                    </circle>
                    <text text-anchor="middle" dy="5" fill="white" font-family="'Segoe UI', Arial, sans-serif" font-size="14">Compliance</text>
                </g>
                
                <!-- Audit Node -->
                <g transform="translate(180, 300)">
                    <circle r="40" fill="url(#nodeGradient6)" filter="url(#nodeGlow)">
                        <animate attributeName="opacity" values="0.75;0.95;0.75" dur="5.5s" repeatCount="indefinite" />
                        <animate attributeName="r" values="40;44;40" dur="5.5s" repeatCount="indefinite" />
                    </circle>
                    <text text-anchor="middle" dy="5" fill="white" font-family="'Segoe UI', Arial, sans-serif" font-size="14">Audit</text>
                </g>
            </g>
            
            <!-- Connections -->
            <g id="concept-connections">
                <!-- Patient to Record -->
                <line x1="240" y1="200" x2="430" y2="150" stroke="#ffffff" stroke-width="2" opacity="0">
                    <animate
                        id="p2r-appear"
                        attributeName="opacity"
                        from="0"
                        to="0.6"
                        dur="1.5s"
                        begin="0s;p2r-disappear.end+2s"
                        fill="freeze"
                    />
                    <animate
                        id="p2r-disappear"
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        begin="p2r-appear.end+3s"
                        fill="freeze"
                    />
                </line>
                
                <!-- Record to Visit -->
                <line x1="430" y1="150" x2="590" y2="230" stroke="#ffffff" stroke-width="2" opacity="0">
                    <animate
                        id="r2v-appear"
                        attributeName="opacity"
                        from="0"
                        to="0.6"
                        dur="1.5s"
                        begin="p2r-appear.end+0.5s"
                        fill="freeze"
                    />
                    <animate
                        id="r2v-disappear"
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        begin="p2r-disappear.begin+0.5s"
                        fill="freeze"
                    />
                </line>
                
                <!-- Visit to Timeline -->
                <line x1="590" y1="230" x2="500" y2="350" stroke="#ffffff" stroke-width="2" opacity="0">
                    <animate
                        id="v2t-appear"
                        attributeName="opacity"
                        from="0"
                        to="0.6"
                        dur="1.5s"
                        begin="r2v-appear.end+0.5s"
                        fill="freeze"
                    />
                    <animate
                        id="v2t-disappear"
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        begin="r2v-disappear.begin+0.5s"
                        fill="freeze"
                    />
                </line>
                
                <!-- Timeline to Compliance -->
                <line x1="500" y1="350" x2="320" y2="400" stroke="#ffffff" stroke-width="2" opacity="0">
                    <animate
                        id="t2c-appear"
                        attributeName="opacity"
                        from="0"
                        to="0.6"
                        dur="1.5s"
                        begin="v2t-appear.end+0.5s"
                        fill="freeze"
                    />
                    <animate
                        id="t2c-disappear"
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        begin="v2t-disappear.begin+0.5s"
                        fill="freeze"
                    />
                </line>
                
                <!-- Compliance to Audit -->
                <line x1="320" y1="400" x2="180" y2="300" stroke="#ffffff" stroke-width="2" opacity="0">
                    <animate
                        id="c2a-appear"
                        attributeName="opacity"
                        from="0"
                        to="0.6"
                        dur="1.5s"
                        begin="t2c-appear.end+0.5s"
                        fill="freeze"
                    />
                    <animate
                        id="c2a-disappear"
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        begin="t2c-disappear.begin+0.5s"
                        fill="freeze"
                    />
                </line>
                
                <!-- Audit to Patient -->
                <line x1="180" y1="300" x2="240" y2="200" stroke="#ffffff" stroke-width="2" opacity="0">
                    <animate
                        id="a2p-appear"
                        attributeName="opacity"
                        from="0"
                        to="0.6"
                        dur="1.5s"
                        begin="c2a-appear.end+0.5s"
                        fill="freeze"
                    />
                    <animate
                        id="a2p-disappear"
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        begin="c2a-disappear.begin+0.5s"
                        fill="freeze"
                    />
                </line>
                
                <!-- Alternative connections showing different data flows -->
                
                <!-- Patient to Timeline -->
                <line x1="240" y1="200" x2="500" y2="350" stroke="#ffffff" stroke-width="2" opacity="0">
                    <animate
                        id="p2t-appear"
                        attributeName="opacity"
                        from="0"
                        to="0.6"
                        dur="1.5s"
                        begin="a2p-disappear.end+2s"
                        fill="freeze"
                    />
                    <animate
                        id="p2t-disappear"
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        begin="p2t-appear.end+3s"
                        fill="freeze"
                    />
                </line>
                
                <!-- Record to Compliance -->
                <line x1="430" y1="150" x2="320" y2="400" stroke="#ffffff" stroke-width="2" opacity="0">
                    <animate
                        id="r2c-appear"
                        attributeName="opacity"
                        from="0"
                        to="0.6"
                        dur="1.5s"
                        begin="p2t-appear.end+0.5s"
                        fill="freeze"
                    />
                    <animate
                        id="r2c-disappear"
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        begin="p2t-disappear.begin+0.5s"
                        fill="freeze"
                    />
                </line>
                
                <!-- Visit to Audit -->
                <line x1="590" y1="230" x2="180" y2="300" stroke="#ffffff" stroke-width="2" opacity="0">
                    <animate
                        id="v2a-appear"
                        attributeName="opacity"
                        from="0"
                        to="0.6"
                        dur="1.5s"
                        begin="r2c-appear.end+0.5s"
                        fill="freeze"
                    />
                    <animate
                        id="v2a-disappear"
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        begin="r2c-disappear.begin+0.5s"
                        fill="freeze"
                    />
                </line>
            </g>
            
            <!-- Data packets moving along connections -->
            <g id="data-packets">
                <!-- Patient to Record -->
                <circle cx="0" cy="0" r="4" fill="#ffffff" filter="url(#packetGlow)">
                    <animate attributeName="opacity" values="0;1;0" dur="5s" begin="1s" repeatCount="indefinite" />
                    <animateMotion 
                        path="M240,200 L430,150" 
                        dur="2s" 
                        begin="p2r-appear.begin+0.5s" 
                        repeatCount="2"
                    />
                </circle>
                
                <!-- Record to Visit -->
                <circle cx="0" cy="0" r="4" fill="#ffffff" filter="url(#packetGlow)">
                    <animate attributeName="opacity" values="0;1;0" dur="5s" begin="2s" repeatCount="indefinite" />
                    <animateMotion 
                        path="M430,150 L590,230" 
                        dur="2s" 
                        begin="r2v-appear.begin+0.5s" 
                        repeatCount="2"
                    />
                </circle>
                
                <!-- Visit to Timeline -->
                <circle cx="0" cy="0" r="4" fill="#ffffff" filter="url(#packetGlow)">
                    <animate attributeName="opacity" values="0;1;0" dur="5s" begin="3s" repeatCount="indefinite" />
                    <animateMotion 
                        path="M590,230 L500,350" 
                        dur="2s" 
                        begin="v2t-appear.begin+0.5s" 
                        repeatCount="2"
                    />
                </circle>
                
                <!-- Timeline to Compliance -->
                <circle cx="0" cy="0" r="4" fill="#ffffff" filter="url(#packetGlow)">
                    <animate attributeName="opacity" values="0;1;0" dur="5s" begin="4s" repeatCount="indefinite" />
                    <animateMotion 
                        path="M500,350 L320,400" 
                        dur="2s" 
                        begin="t2c-appear.begin+0.5s" 
                        repeatCount="2"
                    />
                </circle>
                
                <!-- Compliance to Audit -->
                <circle cx="0" cy="0" r="4" fill="#ffffff" filter="url(#packetGlow)">
                    <animate attributeName="opacity" values="0;1;0" dur="5s" begin="5s" repeatCount="indefinite" />
                    <animateMotion 
                        path="M320,400 L180,300" 
                        dur="2s" 
                        begin="c2a-appear.begin+0.5s" 
                        repeatCount="2"
                    />
                </circle>
                
                <!-- Audit to Patient -->
                <circle cx="0" cy="0" r="4" fill="#ffffff" filter="url(#packetGlow)">
                    <animate attributeName="opacity" values="0;1;0" dur="5s" begin="6s" repeatCount="indefinite" />
                    <animateMotion 
                        path="M180,300 L240,200" 
                        dur="2s" 
                        begin="a2p-appear.begin+0.5s" 
                        repeatCount="2"
                    />
                </circle>
                
                <!-- Second sequence -->
                <!-- Patient to Timeline -->
                <circle cx="0" cy="0" r="4" fill="#ffffff" filter="url(#packetGlow)">
                    <animate attributeName="opacity" values="0;1;0" dur="5s" begin="15s" repeatCount="indefinite" />
                    <animateMotion 
                        path="M240,200 L500,350" 
                        dur="2s" 
                        begin="p2t-appear.begin+0.5s" 
                        repeatCount="2"
                    />
                </circle>
                
                <!-- Record to Compliance -->
                <circle cx="0" cy="0" r="4" fill="#ffffff" filter="url(#packetGlow)">
                    <animate attributeName="opacity" values="0;1;0" dur="5s" begin="16s" repeatCount="indefinite" />
                    <animateMotion 
                        path="M430,150 L320,400" 
                        dur="2s" 
                        begin="r2c-appear.begin+0.5s" 
                        repeatCount="2"
                    />
                </circle>
                
                <!-- Visit to Audit -->
                <circle cx="0" cy="0" r="4" fill="#ffffff" filter="url(#packetGlow)">
                    <animate attributeName="opacity" values="0;1;0" dur="5s" begin="17s" repeatCount="indefinite" />
                    <animateMotion 
                        path="M590,230 L180,300" 
                        dur="2s" 
                        begin="v2a-appear.begin+0.5s" 
                        repeatCount="2"
                    />
                </circle>
            </g>
        </svg>
        `;
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

// Comment out the duplicate tab functionality at the bottom of the file
/*
// Tab functionality for features section
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    function activateTab(tabId) {
        // Hide all tab panes
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
        });
        
        // Deactivate all buttons
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Activate the selected tab and button
        const selectedTab = document.getElementById(tabId);
        const selectedButton = document.querySelector(`[data-target="${tabId}"]`);
        
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
    }
    
    // Add click event listeners to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            activateTab(target);
        });
    });
    
    // Activate the first tab by default
    if (tabButtons.length > 0) {
        const firstTabTarget = tabButtons[0].getAttribute('data-target');
        activateTab(firstTabTarget);
    }
}); 
*/ 