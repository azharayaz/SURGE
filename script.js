document.addEventListener('DOMContentLoaded', () => {

    const slides = document.querySelectorAll('.slide');
    const next = document.querySelector('.next');
    const prev = document.querySelector('.prev');
    const drinkName = document.querySelector('.drink-name');
    const tagline = document.querySelector('.tagline');
    const description = document.querySelector('.description');
    const caffeine = document.querySelector('.stats .stat:nth-child(1) .value');
    const calories = document.querySelector('.stats .stat:nth-child(2) .value');
    const flavor = document.querySelector('.stats .stat:nth-child(3) .value');
    const progressBarSpan = document.querySelector('.progress-bar span');
    let currentSlide = 0;
    let autoSlideInterval;

    const drinks = [
        {
            name: 'VOILT',
            tagline: 'ELECTRIFY YOUR LIMITS',
            description: 'Feel the jolt of pure electric energy. VOLT delivers a surge of power with a citrus-charged flavor that hits like lightning.',
            caffeine: '300MG',
            calories: '10',
            flavor: 'ELECTRIC CITRUS',
            background: '#00ff00',       
         },
        {
            name: 'SURGE',
            tagline: 'UNLEASH THE POWER',
            description: 'Dive into a tropical storm of flavor. SURGE combines exotic fruits with a massive energy boost.',
            caffeine: '250MG',
            calories: '15',
            flavor: 'TROPICAL FURY',
            background: '#ff0040',
        },
        {
            name: 'BLAZE',
            tagline: 'IGNITE YOUR SENSES',
            description: 'Set your world on fire with BLAZE. A fiery fusion of spicy ginger and sweet mango.',
            caffeine: '280MG',
            calories: '12',
            flavor: 'MANGO GINGER',
            background: '#ff4500',
        },
        {
            name: 'FROST',
            tagline: 'COOL, CRISP, REFRESHING',
            description: 'Experience the chill of victory with FROST. An icy blast of arctic berry flavor.',
            caffeine: '220MG',
            calories: '5',
            flavor: 'ARCTIC BERRY',
            background: '#00bfff',
        },
        {
            name: 'VENOM',
            tagline: 'STRIKE WITHOUT WARNING',
            description: 'Deadly focus meets raw power. VENOM injects pure adrenaline with a dark grape punch that hits fast and hard.',
            caffeine: '350MG',
            calories: '8',
            flavor: 'DARK GRAPE',
            background: '#9b30ff',
        },
        {
            name: 'NOVA',
            tagline: 'EXPLODE INTO ACTION',
            description: 'A supernova of energy in every sip. NOVA fuses golden passionfruit with a blinding burst of unstoppable power.',
            caffeine: '270MG',
            calories: '10',
            flavor: 'GOLDEN PASSIONFRUIT',
            background: '#ffd700',
        },
        {
            name: 'TITAN',
            tagline: 'BUILT DIFFERENT',
            description: 'Strength beyond limits. TITAN delivers a colossal hit of raw energy with a bold blood orange kick that fuels the unstoppable.',
            caffeine: '320MG',
            calories: '12',
            flavor: 'BLOOD ORANGE',
            background: '#00d26a',
        },
        {
            name: 'PHANTOM',
            tagline: 'MOVE IN SILENCE',
            description: 'Invisible power, undeniable results. PHANTOM gives you stealth-mode focus with a smooth midnight mint finish.',
            caffeine: '240MG',
            calories: '5',
            flavor: 'MIDNIGHT MINT',
            background: '#e0e0e0',
        }
    ];

    /* =========================
       UPDATE CONTENT + BACKGROUND
    ========================== */
    function updateContent(slideIndex) {
        const drink = drinks[slideIndex];

        drinkName.textContent = drink.name;
        tagline.textContent = drink.tagline;
        description.textContent = drink.description;
        caffeine.textContent = drink.caffeine;
        calories.textContent = drink.calories;
        flavor.textContent = drink.flavor;

        drinkName.style.color = drink.background;
        drinkName.style.textShadow = `0 0 20px ${drink.background}, 0 0 40px ${drink.background}`;

        const current = String(slideIndex + 1).padStart(2, '0');
        const total = String(slides.length).padStart(2, '0');
        progressBarSpan.textContent = `${current} / ${total}`;
        const progress = ((slideIndex + 1) / slides.length) * 100;
        document.querySelector('.bar').style.setProperty('--progress', progress + "%");

        document.body.style.transition = "background-image 1s ease-in-out";
        document.body.style.backgroundImage = drink.backgroundImage;
    }

    /* =========================
       SHOW SLIDE + ANIMATIONS
    ========================== */
    function showSlide(slideIndex) {
        const activeSlide = document.querySelector('.slide.active');
        const newSlide = slides[slideIndex];

        if (activeSlide) {
            activeSlide.classList.remove('active');
        }

        newSlide.classList.add('active');

        updateContent(slideIndex);

        // ===== TEXT ANIMATIONS =====
        const textElements = [drinkName, tagline, description];
        textElements.forEach(el => el.style.animation = 'none');
        void drinkName.offsetWidth; // single reflow for all

        switch(slideIndex) {
            case 0: // VOLT
                drinkName.style.animation = 'fadeSlideLeft 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                tagline.style.animation = 'fadeSlideTop 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s';
                description.style.animation = 'fadeSlideBottom 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s';
                break;
            case 1: // SURGE
                drinkName.style.animation = 'fadeSlideRight 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                tagline.style.animation = 'fadeSlideLeft 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s';
                description.style.animation = 'fadeSlideTop 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s';
                break;
            case 2: // BLAZE
                drinkName.style.animation = 'fadeSlideTop 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                tagline.style.animation = 'fadeSlideBottom 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s';
                description.style.animation = 'fadeSlideLeft 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s';
                break;
            case 3: // FROST
                drinkName.style.animation = 'fadeSlideBottom 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                tagline.style.animation = 'fadeSlideRight 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s';
                description.style.animation = 'fadeSlideLeft 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s';
                break;
            case 4: // VENOM
                drinkName.style.animation = 'fadeSlideRight 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                tagline.style.animation = 'fadeSlideBottom 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s';
                description.style.animation = 'fadeSlideTop 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s';
                break;
            case 5: // NOVA
                drinkName.style.animation = 'fadeSlideTop 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                tagline.style.animation = 'fadeSlideLeft 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s';
                description.style.animation = 'fadeSlideRight 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s';
                break;
            case 6: // TITAN
                drinkName.style.animation = 'fadeSlideLeft 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                tagline.style.animation = 'fadeSlideTop 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s';
                description.style.animation = 'fadeSlideBottom 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s';
                break;
            case 7: // PHANTOM
                drinkName.style.animation = 'fadeSlideBottom 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                tagline.style.animation = 'fadeSlideTop 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.2s';
                description.style.animation = 'fadeSlideRight 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards 0.4s';
                break;
        }

        // ===== IMAGE FLOAT GLOW =====
        const img = newSlide.querySelector('img');
        img.style.animation = 'floatDrink 3s ease-in-out infinite';
        img.style.filter = `drop-shadow(0 0 25px ${drinks[slideIndex].background})`;

    }

    /* =========================
       AUTO SLIDE
    ========================== */
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlideFunc() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    /* =========================
       EVENT LISTENERS
    ========================== */
    next.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
    });

    prev.addEventListener('click', () => {
        prevSlideFunc();
        resetAutoSlide();
    });

    /* =========================
       INIT
    ========================== */
    slides.forEach(slide => slide.classList.remove('active'));
    slides[0].classList.add('active');
    updateContent(0);
    startAutoSlide();

    /* =========================
       NETWORK PARTICLES BACKGROUND
    ========================== */
    const canvas = document.getElementById('particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particleColor = drinks[0].background;
        let targetColor = drinks[0].background;
        const nodes = [];
        const NODE_COUNT = 50;
        const CONNECT_DIST = 150;
        let mouse = { x: -1000, y: -1000 };
        let excludeZone = null;

        function hexToRgb(hex) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        }
        function rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
        }
        function lerpColor(current, target, speed) {
            const c = hexToRgb(current);
            const t = hexToRgb(target);
            c.r += (t.r - c.r) * speed;
            c.g += (t.g - c.g) * speed;
            c.b += (t.b - c.b) * speed;
            return rgbToHex(c.r, c.g, c.b);
        }

        const imageContent = document.querySelector('.image-content');
        function updateExcludeZone() {
            if (imageContent) {
                const r = imageContent.getBoundingClientRect();
                const pad = 30;
                excludeZone = { x: r.left - pad, y: r.top - pad, w: r.width + pad * 2, h: r.height + pad * 2 };
            }
        }

        function isInExcludeZone(x, y) {
            if (!excludeZone) return false;
            return x > excludeZone.x && x < excludeZone.x + excludeZone.w &&
                   y > excludeZone.y && y < excludeZone.y + excludeZone.h;
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            updateExcludeZone();
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        // Throttled --main-color updater (every 5 frames instead of every frame)
        let frameCount = 0;
        let lastAppliedMainColor = '';

        // Expose color updater for slide changes
        let targetMainColor = drinks[0].background;
        let currentMainColor = drinks[0].background;
        const originalUpdateContent = updateContent;
        updateContent = function(slideIndex) {
            originalUpdateContent(slideIndex);
            targetColor = drinks[slideIndex].background;
            targetMainColor = drinks[slideIndex].background;
        };

        class Node {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.baseSpeedX = (Math.random() - 0.5) * 0.4;
                this.baseSpeedY = (Math.random() - 0.5) * 0.4;
                this.speedX = this.baseSpeedX;
                this.speedY = this.baseSpeedY;
                this.opacity = Math.random() * 0.6 + 0.2;
            }
            update() {
                // Subtle mouse repulsion
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const force = (120 - dist) / 120 * 0.8;
                    this.speedX = this.baseSpeedX + (dx / dist) * force;
                    this.speedY = this.baseSpeedY + (dy / dist) * force;
                } else {
                    this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
                    this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
                }

                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < -20) this.x = canvas.width + 20;
                if (this.x > canvas.width + 20) this.x = -20;
                if (this.y < -20) this.y = canvas.height + 20;
                if (this.y > canvas.height + 20) this.y = -20;
            }
        }

        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push(new Node());
        }

        function drawConnections() {
            ctx.strokeStyle = particleColor;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < nodes.length; i++) {
                const ni = nodes[i];
                if (isInExcludeZone(ni.x, ni.y)) continue;
                for (let j = i + 1; j < nodes.length; j++) {
                    const nj = nodes[j];
                    const dx = ni.x - nj.x;
                    const dy = ni.y - nj.y;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < CONNECT_DIST * CONNECT_DIST) {
                        if (isInExcludeZone(nj.x, nj.y)) continue;
                        const dist = Math.sqrt(distSq);
                        ctx.globalAlpha = (1 - dist / CONNECT_DIST) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(ni.x, ni.y);
                        ctx.lineTo(nj.x, nj.y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
        }

        function animate() {
            particleColor = lerpColor(particleColor, targetColor, 0.12);
            currentMainColor = lerpColor(currentMainColor, targetMainColor, 0.12);

            // Only update CSS variable every 5 frames to avoid constant style recalc
            frameCount++;
            if (frameCount % 5 === 0 && lastAppliedMainColor !== currentMainColor) {
                document.documentElement.style.setProperty('--main-color', currentMainColor);
                lastAppliedMainColor = currentMainColor;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            nodes.forEach(n => n.update());
            drawConnections();

            ctx.fillStyle = particleColor;
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                if (isInExcludeZone(n.x, n.y)) continue;
                ctx.globalAlpha = n.opacity;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            requestAnimationFrame(animate);
        }
        animate();
    }
});