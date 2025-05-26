// hero-animation.js
document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const animationContainer = document.getElementById('animation-container');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Make canvas fill the container and position it absolutely
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1'; // Lower z-index to stay behind content
    animationContainer.appendChild(canvas);
    
    // Responsive canvas
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Parameters
    const params = {
        particleCount: 150,
        particleMinSize: 1,
        particleMaxSize: 3,
        connectionDistance: 150,
        connectionWidth: 0.6,
        speed: 0.3,
        baseHue: 210, // Blue base color
        hueRange: 30,
        pulseSpeed: 0.01,
        pulseSize: 1.2,
        mouseRadius: 200,
        mouseStrength: 0.2
    };
    
    // Mouse position tracking
    let mouse = {
        x: null,
        y: null,
        active: false
    };
    
    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.x;
        mouse.y = e.y;
        mouse.active = true;
    });
    
    canvas.addEventListener('mouseleave', function() {
        mouse.active = false;
    });
    
    // Particles array
    let particles = [];
    
    // Pulse animation state
    let pulse = 0;
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * (params.particleMaxSize - params.particleMinSize) + params.particleMinSize;
            this.baseSize = this.size;
            this.velocity = {
                x: (Math.random() - 0.5) * params.speed,
                y: (Math.random() - 0.5) * params.speed
            };
            this.hue = params.baseHue + Math.random() * params.hueRange - params.hueRange / 2;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        // Update particle position
        update() {
            // Apply mouse influence if active
            if (mouse.active) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < params.mouseRadius) {
                    const strength = (params.mouseRadius - distance) / params.mouseRadius * params.mouseStrength;
                    this.velocity.x += dx * strength * 0.01;
                    this.velocity.y += dy * strength * 0.01;
                }
            }
            
            // Update position
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            
            // Apply pulse effect
            this.size = this.baseSize * (1 + Math.sin(pulse) * 0.2);
            
            // Boundary check
            if (this.x < 0 || this.x > canvas.width) this.velocity.x *= -1;
            if (this.y < 0 || this.y > canvas.height) this.velocity.y *= -1;
            
            // Dampen velocity gradually
            this.velocity.x *= 0.99;
            this.velocity.y *= 0.99;
        }
        
        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Initialize particles
    function init() {
        particles = [];
        for (let i = 0; i < params.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Draw connections between particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < params.connectionDistance) {
                    const opacity = (params.connectionDistance - distance) / params.connectionDistance;
                    ctx.strokeStyle = `rgba(120, 180, 255, ${opacity * 0.3})`;
                    ctx.lineWidth = params.connectionWidth;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Add AI-related visual elements
    function drawAIElements() {
        const gridSize = Math.floor(canvas.width / 12);
        
        // ==== ライン強調設定 ====
        ctx.strokeStyle = 'rgba(30, 144, 255, 0.15)'; // 透明度 0.1 → 0.3 に強化
        ctx.lineWidth = 1.2; // 太さも少しUP
    
        // Horizontal lines
        for (let y = gridSize; y < canvas.height; y += gridSize) {
            // if (Math.random() > 0.7) continue; ← これ消す
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    
        // Vertical lines
        for (let x = gridSize; x < canvas.width; x += gridSize) {
            // if (Math.random() > 0.7) continue; ← これも消す
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }
    
    
    // Add floating AI-themed icons
    const aiSymbols = [];
    function initAISymbols() {
        const symbolCount = 5;
        for (let i = 0; i < symbolCount; i++) {
            aiSymbols.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 30 + Math.random() * 20,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: 0.1 + Math.random() * 0.1,
                symbol: Math.floor(Math.random() * 4) // 4 different symbol types
            });
        }
    }
    
    function drawAISymbols() {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        
        aiSymbols.forEach(symbol => {
            ctx.save();
            ctx.translate(symbol.x, symbol.y);
            ctx.globalAlpha = symbol.opacity;
            
            switch(symbol.symbol) {
                case 0: // Neural network node
                    ctx.beginPath();
                    ctx.arc(0, 0, symbol.size / 2, 0, Math.PI * 2);
                    ctx.stroke();
                    
                    // Connection lines
                    for (let i = 0; i < 5; i++) {
                        const angle = Math.PI * 2 * (i / 5);
                        ctx.beginPath();
                        ctx.moveTo(0, 0);
                        ctx.lineTo(Math.cos(angle) * symbol.size, Math.sin(angle) * symbol.size);
                        ctx.stroke();
                    }
                    break;
                    
                case 1: // Binary code
                    for (let i = -3; i <= 3; i++) {
                        const digit = Math.random() > 0.5 ? '1' : '0';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.font = `${symbol.size/3}px monospace`;
                        ctx.fillText(digit, 0, i * (symbol.size/3));
                    }
                    break;
                    
                case 2: // CPU grid
                    ctx.strokeRect(-symbol.size/2, -symbol.size/2, symbol.size, symbol.size);
                    
                    // Internal grid
                    const gridSize = symbol.size / 4;
                    for (let x = -symbol.size/2; x <= symbol.size/2; x += gridSize) {
                        ctx.beginPath();
                        ctx.moveTo(x, -symbol.size/2);
                        ctx.lineTo(x, symbol.size/2);
                        ctx.stroke();
                    }
                    
                    for (let y = -symbol.size/2; y <= symbol.size/2; y += gridSize) {
                        ctx.beginPath();
                        ctx.moveTo(-symbol.size/2, y);
                        ctx.lineTo(symbol.size/2, y);
                        ctx.stroke();
                    }
                    break;
                    
                case 3: // AI abstractness
                    ctx.beginPath();
                    ctx.moveTo(-symbol.size/2, -symbol.size/2);
                    ctx.lineTo(symbol.size/2, symbol.size/2);
                    ctx.moveTo(symbol.size/2, -symbol.size/2);
                    ctx.lineTo(-symbol.size/2, symbol.size/2);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.arc(0, 0, symbol.size/2, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
            }
            
            ctx.restore();
            
            // Update position
            symbol.x += symbol.vx;
            symbol.y += symbol.vy;
            
            // Boundary check with wrapping
            if (symbol.x < -symbol.size) symbol.x = canvas.width + symbol.size;
            if (symbol.x > canvas.width + symbol.size) symbol.x = -symbol.size;
            if (symbol.y < -symbol.size) symbol.y = canvas.height + symbol.size;
            if (symbol.y > canvas.height + symbol.size) symbol.y = -symbol.size;
        });
    }
    
    // Add a futuristic scanning effect
    let scanLine = -100;
    function drawScanEffect() {
        const scanHeight = 200;
        const gradient = ctx.createLinearGradient(0, scanLine, 0, scanLine + scanHeight);
        gradient.addColorStop(0, 'rgba(30, 144, 255, 0)');
        gradient.addColorStop(0.5, 'rgba(30, 144, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(30, 144, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanLine, canvas.width, scanHeight);
        
        // Move scan line down
        scanLine += 1;
        if (scanLine > canvas.height) {
            scanLine = -scanHeight;
        }
    }
    
    // Draw a subtle vignette effect
    function drawVignette() {
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 1.5
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Clear canvas with a semi-transparent black to create trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update pulse state
        pulse += params.pulseSpeed;
        
        // Draw AI-themed background elements
        drawAIElements();
        
        // Draw scan effect
        drawScanEffect();
        
        // Draw connections between particles
        drawConnections();
        
        // Update and draw each particle
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw AI symbols
        drawAISymbols();
        
        // Draw vignette
        drawVignette();
    }
    
    // Add scroll indicator
    function addScrollIndicator() {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        
        const scrollArrow = document.createElement('div');
        scrollArrow.className = 'scroll-arrow';
        scrollArrow.innerHTML = '↓';
        
        const scrollText = document.createElement('div');
        scrollText.className = 'scroll-text';
        scrollText.textContent = 'スクロール';
        
        scrollIndicator.appendChild(scrollArrow);
        scrollIndicator.appendChild(scrollText);
        document.querySelector('.hero-section').appendChild(scrollIndicator);
        
        // Smooth scroll to services section on click
        scrollIndicator.addEventListener('click', () => {
            const servicesSection = document.getElementById('services');
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Initialize everything
    init();
    initAISymbols();
    addScrollIndicator();
    animate();
    
    // Add loader effect
    function showContent() {
        const heroContent = document.querySelector('.hero-content');
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }
    
    // Simulate loading time for animation to initialize
    setTimeout(showContent, 500);
});